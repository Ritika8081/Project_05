import { EmotionEntry, Mood, HeatmapData, TimeOfDay } from '@/types';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getDayOfWeek(date: Date): string {
  return DAYS_OF_WEEK[date.getDay()];
}

export function buildHeatmapData(entries: EmotionEntry[]): HeatmapData {
  const heatmap: HeatmapData = {};

  // Initialize heatmap
  DAYS_OF_WEEK.forEach((day) => {
    heatmap[day] = {};
    for (let hour = 0; hour < 24; hour++) {
      heatmap[day][hour] = {
        calm: 0,
        neutral: 0,
        anxious: 0,
        sad: 0,
        frustrated: 0,
      };
    }
  });

  // Populate with data
  entries.forEach((entry) => {
    const day = entry.dayOfWeek;
    const hour = entry.hour;
    if (heatmap[day] && heatmap[day][hour]) {
      heatmap[day][hour][entry.mood]++;
    }
  });

  return heatmap;
}

export function getMoodIntensity(mood: Mood): number {
  const intensityMap: Record<Mood, number> = {
    calm: 1,
    neutral: 2,
    anxious: 4,
    sad: 3,
    frustrated: 4,
  };
  return intensityMap[mood];
}

export function calculateHotspots(entries: EmotionEntry[]): Array<{
  day: string;
  hour: number;
  mood: Mood;
  count: number;
  intensity: 'low' | 'medium' | 'high' | 'critical';
}> {
  const hotspots: Map<string, number> = new Map();
  const moodMap: Map<string, Mood> = new Map();

  entries.forEach((entry) => {
    const key = `${entry.dayOfWeek}-${entry.hour}`;
    hotspots.set(key, (hotspots.get(key) || 0) + 1);
    
    if (!moodMap.has(key) || getMoodIntensity(entry.mood) > getMoodIntensity(moodMap.get(key)!)) {
      moodMap.set(key, entry.mood);
    }
  });

  return Array.from(hotspots.entries())
    .map(([key, count]) => {
      const [day, hourStr] = key.split('-');
      const hour = parseInt(hourStr);
      const mood = moodMap.get(key)!;
      
      let intensity: 'low' | 'medium' | 'high' | 'critical';
      if (count >= 5) intensity = 'critical';
      else if (count >= 4) intensity = 'high';
      else if (count >= 2) intensity = 'medium';
      else intensity = 'low';

      return { day, hour, mood, count, intensity };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function generateCorrelationInsights(entries: EmotionEntry[]): string[] {
  if (entries.length < 5) return [];

  const insights: string[] = [];

  // Analyze by time of day
  const timeOfDayMoods: Record<TimeOfDay, Record<Mood, number>> = {
    morning: { calm: 0, neutral: 0, anxious: 0, sad: 0, frustrated: 0 },
    afternoon: { calm: 0, neutral: 0, anxious: 0, sad: 0, frustrated: 0 },
    evening: { calm: 0, neutral: 0, anxious: 0, sad: 0, frustrated: 0 },
    night: { calm: 0, neutral: 0, anxious: 0, sad: 0, frustrated: 0 },
  };

  entries.forEach((entry) => {
    timeOfDayMoods[entry.timeOfDay][entry.mood]++;
  });

  // Find dominant moods by time
  Object.entries(timeOfDayMoods).forEach(([timeOfDay, moods]) => {
    const total = Object.values(moods).reduce((a, b) => a + b, 0);
    if (total === 0) return;

    const entries_arr = Object.entries(moods).sort((a, b) => b[1] - a[1]);
    const [dominantMood, count] = entries_arr[0];
    const percentage = Math.round((count / total) * 100);

    if (percentage >= 40) {
      const moodLabels: Record<string, string> = {
        calm: 'calm and centered',
        neutral: 'balanced',
        anxious: 'anxious',
        sad: 'withdrawn',
        frustrated: 'frustrated',
      };

      insights.push(
        `You feel ${moodLabels[dominantMood]} ${percentage}% of the time in the ${timeOfDay}.`
      );
    }
  });

  // Analyze by day of week
  const dayOfWeekMoods: Record<string, Record<Mood, number>> = {};
  DAYS_OF_WEEK.forEach((day) => {
    dayOfWeekMoods[day] = { calm: 0, neutral: 0, anxious: 0, sad: 0, frustrated: 0 };
  });

  entries.forEach((entry) => {
    dayOfWeekMoods[entry.dayOfWeek][entry.mood]++;
  });

  Object.entries(dayOfWeekMoods).forEach(([day, moods]) => {
    const total = Object.values(moods).reduce((a, b) => a + b, 0);
    if (total === 0) return;

    const entries_arr = Object.entries(moods).sort((a, b) => b[1] - a[1]);
    const [dominantMood, count] = entries_arr[0];
    const percentage = Math.round((count / total) * 100);

    if (percentage >= 45) {
      const moodLabels: Record<string, string> = {
        calm: 'calmer',
        neutral: 'more neutral',
        anxious: 'more anxious',
        sad: 'sadder',
        frustrated: 'more frustrated',
      };

      insights.push(`${day}s tend to be ${moodLabels[dominantMood]} for you (${percentage}%).`);
    }
  });

  // Weekday vs weekend
  const weekdayMoods: Record<Mood, number> = { calm: 0, neutral: 0, anxious: 0, sad: 0, frustrated: 0 };
  const weekendMoods: Record<Mood, number> = { calm: 0, neutral: 0, anxious: 0, sad: 0, frustrated: 0 };

  entries.forEach((entry) => {
    const isWeekend = entry.dayOfWeek === 'Saturday' || entry.dayOfWeek === 'Sunday';
    if (isWeekend) {
      weekendMoods[entry.mood]++;
    } else {
      weekdayMoods[entry.mood]++;
    }
  });

  const weekdayTotal = Object.values(weekdayMoods).reduce((a, b) => a + b, 0);
  const weekendTotal = Object.values(weekendMoods).reduce((a, b) => a + b, 0);

  if (weekdayTotal > 0 && weekendTotal > 0) {
    const weekdayCalm = weekdayMoods.calm / weekdayTotal;
    const weekendCalm = weekendMoods.calm / weekendTotal;

    if (weekendCalm > weekdayCalm * 1.3) {
      const diff = Math.round((weekendCalm - weekdayCalm) * 100);
      insights.push(`Weekends bring ${diff}% more calm vibes than weekdays.`);
    } else if (weekdayCalm > weekendCalm * 1.3) {
      const diff = Math.round((weekdayCalm - weekendCalm) * 100);
      insights.push(`You're ${diff}% calmer during the week than weekends.`);
    }
  }

  // Find most intense hour of day
  const hourMoods: Record<number, Mood[]> = {};
  for (let i = 0; i < 24; i++) {
    hourMoods[i] = [];
  }

  entries.forEach((entry) => {
    hourMoods[entry.hour].push(entry.mood);
  });

  let mostIntenseHour = -1;
  let maxIntensity = 0;

  Object.entries(hourMoods).forEach(([hour, moods]) => {
    if (moods.length === 0) return;
    const intensity = moods.reduce((sum, mood) => sum + getMoodIntensity(mood), 0) / moods.length;
    if (intensity > maxIntensity) {
      maxIntensity = intensity;
      mostIntenseHour = parseInt(hour);
    }
  });

  if (mostIntenseHour !== -1 && hourMoods[mostIntenseHour].length >= 2) {
    const timeRange = mostIntenseHour === 0 ? 'midnight' : mostIntenseHour < 12 ? `${mostIntenseHour}am` : `${mostIntenseHour - 12}pm`;
    insights.push(`Around ${timeRange}, your emotions tend to be most intense.`);
  }

  return insights.slice(0, 4);
}

export function getMoodForHour(heatmapData: HeatmapData, day: string, hour: number): Mood | null {
  if (!heatmapData[day] || !heatmapData[day][hour]) return null;

  const moods = heatmapData[day][hour];
  const entries = Object.entries(moods).sort((a, b) => b[1] - a[1]);

  if (entries[0][1] === 0) return null;

  return entries[0][0] as Mood;
}

export function getMoodColorIntensity(heatmapData: HeatmapData, day: string, hour: number, mood: Mood): number {
  if (!heatmapData[day] || !heatmapData[day][hour]) return 0;

  const total = Object.values(heatmapData[day][hour]).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;

  return heatmapData[day][hour][mood] / total;
}
