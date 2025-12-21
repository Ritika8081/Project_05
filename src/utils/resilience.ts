import { EmotionEntry, Mood } from '@/types';
import { getAllEmotionEntries } from './db';

export interface ResilienceMetrics {
  averageRecoveryTimeMs: number;
  averageRecoveryTimeMinutes: string;
  fastestRecoveryMs: number;
  fastestRecoveryMinutes: string;
  resilienceStreak: number;
  weekOverWeekImprovement: number;
  recoverysByMood: { [key in Mood]?: number };
  totalRecoveriesDetected: number;
}

// Get this week's entries (Mon-Sun)
function getWeekStartDate(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysBack = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - daysBack);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

// Get last week's entries
function getLastWeekStartDate(): Date {
  const weekStart = getWeekStartDate();
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  return lastWeekStart;
}

export async function calculateResilienceMetrics(): Promise<ResilienceMetrics> {
  const allEntries = await getAllEmotionEntries();
  
  // Get entries with recovery data
  const recoveredEntries = allEntries.filter(
    (e) => e.recoveryDuration !== undefined && e.recoveryStartMood
  );
  
  const moodHierarchy: { [key: string]: number } = {
    calm: 1,
    neutral: 2,
    anxious: 3,
    sad: 4,
    frustrated: 5,
  };
  
  // Calculate recovery metrics
  let totalRecoveryTime = 0;
  let fastestRecovery = Infinity;
  const recoverysByMood: { [key in Mood]?: number } = {};
  
  for (const entry of recoveredEntries) {
    if (entry.recoveryDuration) {
      totalRecoveryTime += entry.recoveryDuration;
      fastestRecovery = Math.min(fastestRecovery, entry.recoveryDuration);
      
      const startMood = entry.recoveryStartMood as Mood;
      recoverysByMood[startMood] = (recoverysByMood[startMood] || 0) + 1;
    }
  }
  
  const averageRecoveryTimeMs =
    recoveredEntries.length > 0 ? totalRecoveryTime / recoveredEntries.length : 0;
  
  // Calculate resilience streak (consecutive days with at least one recovery)
  const today = new Date();
  let resilienceStreak = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const dayRecoveries = recoveredEntries.filter((e) => e.date === dateStr);
    if (dayRecoveries.length > 0) {
      resilienceStreak++;
    } else if (i > 0) {
      // Streak broken
      break;
    }
  }
  
  // Calculate week-over-week improvement
  const weekStart = getWeekStartDate();
  const lastWeekStart = getLastWeekStartDate();
  
  const thisWeekRecoveries = recoveredEntries.filter((e) => {
    const entryDate = new Date(e.timestamp);
    return entryDate >= weekStart;
  });
  
  const lastWeekRecoveries = recoveredEntries.filter((e) => {
    const entryDate = new Date(e.timestamp);
    return entryDate >= lastWeekStart && entryDate < weekStart;
  });
  
  let weekOverWeekImprovement = 0;
  if (lastWeekRecoveries.length > 0) {
    const thisWeekAverage =
      thisWeekRecoveries.length > 0
        ? thisWeekRecoveries.reduce((sum, e) => sum + (e.recoveryDuration || 0), 0) /
          thisWeekRecoveries.length
        : 0;
    
    const lastWeekAverage =
      lastWeekRecoveries.reduce((sum, e) => sum + (e.recoveryDuration || 0), 0) /
      lastWeekRecoveries.length;
    
    // Negative number means faster recovery (improvement)
    weekOverWeekImprovement = ((thisWeekAverage - lastWeekAverage) / lastWeekAverage) * 100;
  }
  
  return {
    averageRecoveryTimeMs,
    averageRecoveryTimeMinutes: formatMillisToMinutes(averageRecoveryTimeMs),
    fastestRecoveryMs: fastestRecovery === Infinity ? 0 : fastestRecovery,
    fastestRecoveryMinutes: formatMillisToMinutes(fastestRecovery === Infinity ? 0 : fastestRecovery),
    resilienceStreak,
    weekOverWeekImprovement,
    recoverysByMood,
    totalRecoveriesDetected: recoveredEntries.length,
  };
}

export function formatMillisToMinutes(ms: number): string {
  if (ms === 0) return '0m';
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function getResilienceInsight(metrics: ResilienceMetrics): string {
  if (metrics.totalRecoveriesDetected === 0) {
    return "You're building your resilience journey. Keep checking in with your emotions—each moment of awareness is progress.";
  }
  
  const improvement = metrics.weekOverWeekImprovement;
  
  if (improvement < -20) {
    return `Amazing resilience improvement! You're recovering ${Math.abs(improvement).toFixed(0)}% faster this week. You're getting stronger.`;
  } else if (improvement < 0) {
    return `Good progress: You're recovering slightly faster this week. Consistency builds resilience.`;
  } else if (improvement < 20) {
    return `You're maintaining your resilience level. Every recovery counts—celebrate the small wins.`;
  } else {
    return `Recovery is taking a bit longer this week. That's okay—tough weeks happen. Be gentle with yourself.`;
  }
}

export function getMoodRecoveryTips(mood: Mood): string {
  const tips: { [key in Mood]: string } = {
    calm: "You've found your calm center. This is your anchor—remember how you got here.",
    neutral: "Neutral is healthy. You're grounded and present in this moment.",
    anxious: "Anxiety is your mind's way of caring. Take a breath and remind yourself: you've recovered from tough feelings before.",
    sad: "Sadness deserves space. Let yourself feel it, then gently move forward when you're ready.",
    frustrated: "Frustration means you care about things. Channel it into action, or let it pass—both are valid.",
  };
  
  return tips[mood];
}
