import { EmotionEntry, TimeOfDay, DayOfWeek } from '@/types';

export function migrateEntry(entry: EmotionEntry): EmotionEntry {
  // If entry already has time fields, return as-is
  if (entry.hour !== undefined && entry.dayOfWeek && entry.timeOfDay) {
    return entry;
  }

  // Extract time from date string or timestamp
  const date = new Date(entry.timestamp);
  const hour = date.getHours();
  const dayNum = date.getDay();

  const DAYS_OF_WEEK: DayOfWeek[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const getTimeOfDay = (hour: number): TimeOfDay => {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  return {
    ...entry,
    hour: hour,
    dayOfWeek: DAYS_OF_WEEK[dayNum],
    timeOfDay: getTimeOfDay(hour),
  };
}

export function migrateEntries(entries: EmotionEntry[]): EmotionEntry[] {
  return entries.map(migrateEntry);
}
