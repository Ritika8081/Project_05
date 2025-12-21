import { EmotionEntry, Mood, TimeOfDay } from '@/types';

export interface WeeklySummary {
  dominantMood: {
    mood: Mood;
    percentage: number;
  };
  peakDays: {
    day: string;
    mood: Mood;
    timeOfDay: TimeOfDay;
  }[];
  calmPeriods: {
    timeOfDay: TimeOfDay;
    percentage: number;
  }[];
  recoveryNote: string;
  growthNote: string;
  trendDirection: 'improving' | 'stable' | 'challenging';
}

const MOOD_SCORES: Record<Mood, number> = {
  calm: 5,
  neutral: 3,
  anxious: 1,
  sad: 1,
  frustrated: 1,
};

const MOOD_LABELS: Record<Mood, string> = {
  calm: 'calm',
  neutral: 'neutral',
  anxious: 'anxious',
  sad: 'sad',
  frustrated: 'frustrated',
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function generateWeeklySummary(entries: EmotionEntry[]): WeeklySummary | null {
  if (entries.length < 3) return null;

  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

  // Filter entries for this week and last week
  const thisWeek = entries.filter(e => e.timestamp >= oneWeekAgo);
  const lastWeek = entries.filter(e => e.timestamp >= twoWeeksAgo && e.timestamp < oneWeekAgo);

  if (thisWeek.length < 3) return null;

  // Calculate dominant mood
  const moodCounts: Record<Mood, number> = {
    calm: 0,
    neutral: 0,
    anxious: 0,
    sad: 0,
    frustrated: 0,
  };

  thisWeek.forEach(entry => {
    moodCounts[entry.mood]++;
  });

  const dominantMoodEntry = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  const dominantMood = {
    mood: dominantMoodEntry[0] as Mood,
    percentage: Math.round((dominantMoodEntry[1] / thisWeek.length) * 100),
  };

  // Find peak days (days with most challenging emotions)
  const dayMoodMap: Record<string, { moods: Mood[]; times: TimeOfDay[] }> = {};
  
  thisWeek.forEach(entry => {
    const date = new Date(entry.timestamp);
    const dayName = DAY_NAMES[date.getDay()];
    
    if (!dayMoodMap[dayName]) {
      dayMoodMap[dayName] = { moods: [], times: [] };
    }
    
    dayMoodMap[dayName].moods.push(entry.mood);
    dayMoodMap[dayName].times.push(entry.timeOfDay);
  });

  const peakDays = Object.entries(dayMoodMap)
    .map(([day, data]) => {
      const avgScore = data.moods.reduce((sum, mood) => sum + MOOD_SCORES[mood], 0) / data.moods.length;
      const dominantDayMood = data.moods.sort((a, b) => 
        data.moods.filter(m => m === b).length - data.moods.filter(m => m === a).length
      )[0];
      const dominantTime = data.times.sort((a, b) => 
        data.times.filter(t => t === b).length - data.times.filter(t => t === a).length
      )[0];
      
      return {
        day,
        mood: dominantDayMood,
        timeOfDay: dominantTime,
        score: avgScore,
      };
    })
    .filter(d => d.score < 3) // Only challenging days
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);

  // Find calm periods by time of day
  const timeOfDayMoods: Record<TimeOfDay, Mood[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };

  thisWeek.forEach(entry => {
    timeOfDayMoods[entry.timeOfDay].push(entry.mood);
  });

  const calmPeriods = Object.entries(timeOfDayMoods)
    .map(([time, moods]) => {
      const calmCount = moods.filter(m => m === 'calm' || m === 'neutral').length;
      return {
        timeOfDay: time as TimeOfDay,
        percentage: moods.length > 0 ? Math.round((calmCount / moods.length) * 100) : 0,
      };
    })
    .filter(p => p.percentage > 50)
    .sort((a, b) => b.percentage - a.percentage);

  // Calculate trend direction
  const thisWeekAvg = thisWeek.reduce((sum, e) => sum + MOOD_SCORES[e.mood], 0) / thisWeek.length;
  const lastWeekAvg = lastWeek.length > 0 
    ? lastWeek.reduce((sum, e) => sum + MOOD_SCORES[e.mood], 0) / lastWeek.length 
    : thisWeekAvg;

  let trendDirection: 'improving' | 'stable' | 'challenging';
  const diff = thisWeekAvg - lastWeekAvg;
  
  if (diff > 0.5) trendDirection = 'improving';
  else if (diff < -0.5) trendDirection = 'challenging';
  else trendDirection = 'stable';

  // Generate recovery note
  const recoveryNote = generateRecoveryNote(thisWeek);

  // Generate growth note
  const growthNote = generateGrowthNote(trendDirection, thisWeek.length, lastWeek.length);

  return {
    dominantMood,
    peakDays,
    calmPeriods,
    recoveryNote,
    growthNote,
    trendDirection,
  };
}

function generateRecoveryNote(entries: EmotionEntry[]): string {
  if (entries.length < 2) return '';

  // Look for patterns of recovery (going from negative to neutral/positive)
  let recoveryCount = 0;
  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1];
    const curr = entries[i];
    
    if (MOOD_SCORES[prev.mood] < 3 && MOOD_SCORES[curr.mood] >= 3) {
      recoveryCount++;
    }
  }

  if (recoveryCount === 0) {
    return "You're staying present with your feelings — that's strength.";
  }

  const recoveryRate = recoveryCount / Math.max(entries.length - 1, 1);
  
  if (recoveryRate > 0.4) {
    return "You recovered quickly from difficult moments — that's real growth.";
  } else if (recoveryRate > 0.2) {
    return "You're bouncing back at a steady pace.";
  } else {
    return "You're processing emotions in your own time — that's okay.";
  }
}

function generateGrowthNote(
  trend: 'improving' | 'stable' | 'challenging',
  thisWeekCount: number,
  lastWeekCount: number
): string {
  const consistencyNote = thisWeekCount >= 5 ? 'You showed up consistently this week. ' : '';

  if (trend === 'improving') {
    return `${consistencyNote}Your emotional baseline is lifting — that's meaningful progress.`;
  } else if (trend === 'stable') {
    return `${consistencyNote}You're maintaining steady ground. Stability is its own victory.`;
  } else {
    return `${consistencyNote}This week feels heavier. That's data, not defeat. You're still learning.`;
  }
}

export function generateWeeklySummaryText(summary: WeeklySummary): string {
  const lines: string[] = [];

  // Opening with dominant mood
  lines.push(
    `This week you felt ${MOOD_LABELS[summary.dominantMood.mood]} about ${summary.dominantMood.percentage}% of the time.`
  );

  // Calm periods
  if (summary.calmPeriods.length > 0) {
    const topPeriod = summary.calmPeriods[0];
    lines.push(
      `You found the most peace in the ${topPeriod.timeOfDay}s (${topPeriod.percentage}% calm).`
    );
  }

  // Peak days
  if (summary.peakDays.length > 0) {
    const daysList = summary.peakDays.map(p => `${p.day} ${p.timeOfDay}s`).join(' & ');
    lines.push(
      `Challenging moments peaked on ${daysList}.`
    );
  }

  // Recovery
  lines.push(summary.recoveryNote);

  // Growth
  lines.push(summary.growthNote);

  return lines.join(' ');
}
