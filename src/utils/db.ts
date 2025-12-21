import { EmotionEntry } from '@/types';
import { getTimeOfDay, getDayOfWeek } from './correlations';

const DB_NAME = 'emotional-mirror';
const DB_VERSION = 1;
const STORE_NAME = 'emotions';

let db: IDBDatabase | null = null;

export async function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

export async function saveEmotionEntry(entry: EmotionEntry): Promise<void> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.add(entry);

    request.onerror = () => {
      reject(new Error('Failed to save emotion entry'));
    };

    request.onsuccess = () => {
      resolve();
    };
  });
}

export async function getAllEmotionEntries(): Promise<EmotionEntry[]> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();

    request.onerror = () => {
      reject(new Error('Failed to retrieve emotion entries'));
    };

    request.onsuccess = () => {
      const results = request.result as EmotionEntry[];
      resolve(results.sort((a, b) => b.timestamp - a.timestamp));
    };
  });
}

export async function getTodayEntry(): Promise<EmotionEntry | null> {
  const entries = await getAllEmotionEntries();
  const today = new Date().toISOString().split('T')[0];
  return entries.find((entry) => entry.date === today) || null;
}

export async function getEntriesFromLastDays(days: number): Promise<EmotionEntry[]> {
  const allEntries = await getAllEmotionEntries();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffTimestamp = cutoffDate.getTime();

  return allEntries.filter((entry) => entry.timestamp >= cutoffTimestamp);
}

export async function clearAllEntries(): Promise<void> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.clear();

    request.onerror = () => {
      reject(new Error('Failed to clear entries'));
    };

    request.onsuccess = () => {
      resolve();
    };
  });
}
