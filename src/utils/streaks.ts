import { EmotionEntry, Mood } from '@/types';

export interface StreakData {
  currentCheckInStreak: number;
  longestCheckInStreak: number;
  currentCalmStreak: number;
  longestCalmStreak: number;
  currentRecoveryStreak: number;
  totalCheckIns: number;
  lastCheckInDate: string | null;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  achievedDate?: number;
  progress?: number;
  total?: number;
}

const CALM_MOODS: Mood[] = ['calm', 'neutral'];
const CHALLENGING_MOODS: Mood[] = ['anxious', 'sad', 'frustrated'];

export function calculateStreaks(entries: EmotionEntry[]): StreakData {
  if (entries.length === 0) {
    return {
      currentCheckInStreak: 0,
      longestCheckInStreak: 0,
      currentCalmStreak: 0,
      longestCalmStreak: 0,
      currentRecoveryStreak: 0,
      totalCheckIns: 0,
      lastCheckInDate: null,
    };
  }

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  const today = new Date().toISOString().split('T')[0];
  const lastEntry = sortedEntries[0];
  const lastCheckInDate = lastEntry.date;

  // Calculate daily check-in streak
  let currentCheckInStreak = 0;
  let longestCheckInStreak = 0;
  let tempStreak = 0;
  
  const uniqueDates = Array.from(new Set(entries.map(e => e.date))).sort().reverse();
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];

    if (uniqueDates[i] === expectedDateStr) {
      currentCheckInStreak++;
      tempStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak in history
  tempStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const dayDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      tempStreak++;
      longestCheckInStreak = Math.max(longestCheckInStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  longestCheckInStreak = Math.max(longestCheckInStreak, currentCheckInStreak);

  // Calculate calm mood streak (consecutive calm/neutral entries)
  let currentCalmStreak = 0;
  let longestCalmStreak = 0;
  let tempCalmStreak = 0;

  for (let i = 0; i < sortedEntries.length; i++) {
    if (CALM_MOODS.includes(sortedEntries[i].mood)) {
      if (i === 0 || CALM_MOODS.includes(sortedEntries[i - 1]?.mood)) {
        currentCalmStreak++;
      }
      tempCalmStreak++;
      longestCalmStreak = Math.max(longestCalmStreak, tempCalmStreak);
    } else {
      if (i === 0) currentCalmStreak = 0;
      tempCalmStreak = 0;
    }
  }

  // Calculate recovery streak (bouncing back from challenging moods)
  let currentRecoveryStreak = 0;
  for (let i = 1; i < Math.min(sortedEntries.length, 5); i++) {
    const prev = sortedEntries[i - 1];
    const curr = sortedEntries[i];
    
    if (CHALLENGING_MOODS.includes(curr.mood) && CALM_MOODS.includes(prev.mood)) {
      currentRecoveryStreak++;
    }
  }

  return {
    currentCheckInStreak,
    longestCheckInStreak,
    currentCalmStreak,
    longestCalmStreak,
    currentRecoveryStreak,
    totalCheckIns: entries.length,
    lastCheckInDate,
  };
}

export function generateMilestones(entries: EmotionEntry[], streaks: StreakData): Milestone[] {
  const milestones: Milestone[] = [];

  // First check-in
  milestones.push({
    id: 'first-checkin',
    title: 'First Step',
    description: 'You started showing up for yourself',
    icon: '🌱',
    achieved: entries.length >= 1,
    achievedDate: entries[0]?.timestamp,
  });

  // 7 days of check-ins
  milestones.push({
    id: '7-checkins',
    title: '7 Days of Awareness',
    description: 'A full week of emotional presence',
    icon: '📅',
    achieved: streaks.totalCheckIns >= 7,
    progress: Math.min(streaks.totalCheckIns, 7),
    total: 7,
  });

  // 30 check-ins
  milestones.push({
    id: '30-checkins',
    title: 'Building Momentum',
    description: '30 times you chose self-awareness',
    icon: '🎯',
    achieved: streaks.totalCheckIns >= 30,
    progress: Math.min(streaks.totalCheckIns, 30),
    total: 30,
  });

  // First trigger identified
  const hasIdentifiedTrigger = entries.some(e => e.trigger && e.trigger !== 'unknown');
  milestones.push({
    id: 'first-trigger',
    title: 'Pattern Recognition',
    description: 'You identified what triggers your emotions',
    icon: '🔍',
    achieved: hasIdentifiedTrigger,
  });

  // 7-day streak
  milestones.push({
    id: '7-day-streak',
    title: '7-Day Streak',
    description: 'You showed up every day for a week',
    icon: '🔥',
    achieved: streaks.currentCheckInStreak >= 7 || streaks.longestCheckInStreak >= 7,
  });

  // Calm streak
  milestones.push({
    id: 'calm-streak',
    title: 'Finding Peace',
    description: '5 consecutive calm moments',
    icon: '🌊',
    achieved: streaks.longestCalmStreak >= 5,
    progress: Math.min(streaks.currentCalmStreak, 5),
    total: 5,
  });

  // Recovery recognition
  milestones.push({
    id: 'recovery',
    title: 'Resilient Recovery',
    description: 'You bounced back from difficult moments',
    icon: '💪',
    achieved: streaks.currentRecoveryStreak >= 2,
  });

  // First journal entry
  const hasJournalEntry = entries.some(e => e.notes && e.notes.trim().length > 0);
  milestones.push({
    id: 'first-journal',
    title: 'Deeper Reflection',
    description: 'You wrote your first journal entry',
    icon: '✍️',
    achieved: hasJournalEntry,
  });

  return milestones.sort((a, b) => {
    if (a.achieved && !b.achieved) return -1;
    if (!a.achieved && b.achieved) return 1;
    return 0;
  });
}

export function getStreakMessage(streaks: StreakData): string {
  if (streaks.currentCheckInStreak === 0) {
    return "You can start a new streak anytime. Every check-in counts.";
  }

  if (streaks.currentCheckInStreak === 1) {
    return "You're here today. That's what matters.";
  }

  if (streaks.currentCheckInStreak < 7) {
    return `${streaks.currentCheckInStreak} days of showing up. You're building something real.`;
  }

  if (streaks.currentCheckInStreak < 30) {
    return `${streaks.currentCheckInStreak}-day streak! You're proving consistency to yourself.`;
  }

  return `${streaks.currentCheckInStreak} days straight. This is who you're becoming.`;
}

export function getCalmStreakMessage(streaks: StreakData): string {
  if (streaks.currentCalmStreak === 0) {
    return "";
  }

  if (streaks.currentCalmStreak === 1) {
    return "Finding calm right now.";
  }

  if (streaks.currentCalmStreak < 5) {
    return `${streaks.currentCalmStreak} calm moments in a row. You're creating peace.`;
  }

  return `${streaks.currentCalmStreak} consecutive peaceful check-ins. This is your baseline rising.`;
}
