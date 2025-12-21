import { EmotionEntry, Mood } from '@/types';
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

// Get the most recent entry (allows unlimited check-ins)
export async function getMostRecentEntry(): Promise<EmotionEntry | null> {
  const entries = await getAllEmotionEntries();
  return entries.length > 0 ? entries[0] : null;
}

// Get today's entries (for showing today's emotion history)
export async function getTodaysEntries(): Promise<EmotionEntry[]> {
  const entries = await getAllEmotionEntries();
  const today = new Date().toISOString().split('T')[0];
  return entries.filter((entry) => entry.date === today).sort((a, b) => b.timestamp - a.timestamp);
}

// Prevent spam: check if last entry was less than 30 seconds ago
export async function canCreateNewEntry(): Promise<boolean> {
  const lastEntry = await getMostRecentEntry();
  if (!lastEntry) return true;
  
  const now = Date.now();
  const secondsSinceLastEntry = (now - lastEntry.timestamp) / 1000;
  return secondsSinceLastEntry >= 30;
}

// Calculate recovery time and detect recovery transitions
export async function detectRecovery(currentMood: Mood): Promise<{ recoveryStartMood?: Mood; recoveryStartTime?: number; recoveryDuration?: number }> {
  const todaysEntries = await getTodaysEntries();
  
  if (todaysEntries.length === 0) {
    return {};
  }
  
  // Look for the most recent entry with a "worse" mood
  const moodHierarchy: { [key: string]: number } = {
    calm: 1,
    neutral: 2,
    anxious: 3,
    sad: 4,
    frustrated: 5,
  };
  
  const currentMoodLevel = moodHierarchy[currentMood];
  
  // Find the last entry that had a worse mood
  for (let i = 0; i < todaysEntries.length; i++) {
    const entry = todaysEntries[i];
    const entryMoodLevel = moodHierarchy[entry.mood];
    
    if (entryMoodLevel > currentMoodLevel) {
      // Found a recovery! Calculate duration
      const recoveryDuration = entry.timestamp - todaysEntries[i].timestamp;
      return {
        recoveryStartMood: entry.mood,
        recoveryStartTime: entry.timestamp,
        recoveryDuration: recoveryDuration,
      };
    }
  }
  
  return {};
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
