export type Mood = 'calm' | 'neutral' | 'anxious' | 'sad' | 'frustrated';
export type Trigger = 'delayed_reply' | 'argument' | 'ignored' | 'overthinking' | 'unknown';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type Contributor = 'break' | 'supported' | 'normal' | 'none';

export interface ContributorOption {
  value: Contributor;
  label: string;
}

export interface EmotionEntry {
  id: string;
  date: string;
  mood: Mood;
  trigger?: Trigger;
  timestamp: number;
  contributor?: Contributor;
  hour: number; // 0-23
  dayOfWeek: DayOfWeek;
  timeOfDay: TimeOfDay;
  notes?: string; // optional journal entry
  reflection?: string; // optional reflection response
  recoveryStartMood?: Mood; // what mood triggered this recovery?
  recoveryStartTime?: number; // when did the challenge start?
  recoveryDuration?: number; // milliseconds to recover
}

export interface MoodOption {
  value: Mood;
  emoji: string;
  label: string;
}

export interface TriggerOption {
  value: Trigger;
  label: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'pattern' | 'trigger' | 'frequency' | 'timing';
  confidence: number;
}

export interface MoodCorrelation {
  hour: number;
  dayOfWeek: DayOfWeek;
  mood: Mood;
  count: number;
  percentage: number;
}

export interface HeatmapData {
  [day: string]: {
    [hour: number]: {
      calm: number;
      neutral: number;
      anxious: number;
      sad: number;
      frustrated: number;
    };
  };
}
