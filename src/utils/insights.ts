import { EmotionEntry, Insight, Mood, Trigger } from '@/types';

export function generateInsights(entries: EmotionEntry[]): Insight[] {
  if (entries.length < 5) {
    return [];
  }

  const insights: Insight[] = [];

  // Analyze mood frequency
  const moodFrequency = analyzeMoodFrequency(entries);
  const frequencyInsights = generateFrequencyInsights(moodFrequency);
  insights.push(...frequencyInsights);

  // Analyze mood-trigger co-occurrence
  const triggerInsights = generateTriggerInsights(entries);
  insights.push(...triggerInsights);

  // Analyze emotional patterns over time
  const patternInsights = generatePatternInsights(entries);
  insights.push(...patternInsights);

  // Analyze timing patterns
  const timingInsights = generateTimingInsights(entries);
  insights.push(...timingInsights);

  return insights.slice(0, 5); // Return top 5 insights
}

function analyzeMoodFrequency(entries: EmotionEntry[]): Map<Mood, number> {
  const frequency = new Map<Mood, number>();

  entries.forEach((entry) => {
    frequency.set(entry.mood, (frequency.get(entry.mood) || 0) + 1);
  });

  return frequency;
}

function generateFrequencyInsights(moodFrequency: Map<Mood, number>): Insight[] {
  const insights: Insight[] = [];
  const entries = moodFrequency.entries();

  for (const [mood, count] of entries) {
    const percentage = Math.round((count / Array.from(moodFrequency.values()).reduce((a, b) => a + b, 0)) * 100);

    if (percentage >= 40) {
      const insightMap: Record<Mood, { title: string; description: string }> = {
        calm: {
          title: 'You find moments of peace',
          description: `${percentage}% of your recent check-ins show calm moods. You're building capacity for inner stability.`,
        },
        neutral: {
          title: 'You experience steady baseline emotions',
          description: `${percentage}% of your entries are neutral. This suggests a balanced emotional foundation most days.`,
        },
        anxious: {
          title: 'Anxiety is a recurring visitor',
          description: `${percentage}% of your entries show anxious feelings. Noticing this pattern is the first step toward understanding your triggers.`,
        },
        sad: {
          title: "You're navigating periods of sadness",
          description: `${percentage}% of your check-ins reflect sadness. It's okay to feel this. What helps you move through it?`,
        },
        frustrated: {
          title: 'Frustration shows up frequently',
          description: `${percentage}% of your entries show frustration. This emotion often signals unmet expectations or boundaries.`,
        },
      };

      const insight = insightMap[mood];
      if (insight) {
        insights.push({
          id: `freq-${mood}`,
          title: insight.title,
          description: insight.description,
          type: 'frequency',
          confidence: percentage / 100,
        });
      }
    }
  }

  return insights;
}

function generateTriggerInsights(entries: EmotionEntry[]): Insight[] {
  const insights: Insight[] = [];
  const triggerMoodMap = new Map<string, Map<Mood, number>>();

  entries.forEach((entry) => {
    if (entry.trigger) {
      if (!triggerMoodMap.has(entry.trigger)) {
        triggerMoodMap.set(entry.trigger, new Map());
      }
      const moodMap = triggerMoodMap.get(entry.trigger)!;
      moodMap.set(entry.mood, (moodMap.get(entry.mood) || 0) + 1);
    }
  });

  triggerMoodMap.forEach((moodMap, trigger) => {
    let dominantMood: Mood | null = null;
    let maxCount = 0;

    moodMap.forEach((count, mood) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });

    const totalWithTrigger = Array.from(moodMap.values()).reduce((a, b) => a + b, 0);

    if (totalWithTrigger >= 3 && dominantMood) {
      const triggerMap: Record<string, string> = {
        delayed_reply: 'Delayed replies',
        argument: 'Arguments',
        ignored: 'Feeling ignored',
        overthinking: 'Overthinking',
        unknown: 'Unknown triggers',
      };

      const moodDescMap: Record<Mood, string> = {
        calm: 'calm',
        neutral: 'neutral',
        anxious: 'anxious',
        sad: 'sad',
        frustrated: 'frustrated',
      };

      const triggerLabel = triggerMap[trigger] || trigger;
      const moodLabel = moodDescMap[dominantMood];

      insights.push({
        id: `trigger-${trigger}`,
        title: `${triggerLabel} often trigger ${moodLabel} feelings`,
        description: `You've noticed a pattern: when ${triggerLabel.toLowerCase()}, you tend to feel ${moodLabel}. Understanding this connection gives you choices.`,
        type: 'trigger',
        confidence: totalWithTrigger / entries.length,
      });
    }
  });

  return insights;
}

function generatePatternInsights(entries: EmotionEntry[]): Insight[] {
  const insights: Insight[] = [];

  // Check for mood swings or escalation
  if (entries.length >= 5) {
    const recentEntries = entries.slice(0, 5);
    const moodSeverity: Record<Mood, number> = {
      calm: 1,
      neutral: 2,
      anxious: 3,
      frustrated: 4,
      sad: 3,
    };

    const severityProgression = recentEntries.map((e) => moodSeverity[e.mood]);
    const isEscalating = severityProgression.slice(0, -1).every((val, i) => val <= severityProgression[i + 1]);

    if (isEscalating && Math.max(...severityProgression) >= 3) {
      insights.push({
        id: 'pattern-escalation',
        title: 'Emotions may be building up',
        description:
          'There seems to be an emotional buildup in recent days. Taking a moment to reflect or rest might help reset your baseline.',
        type: 'pattern',
        confidence: 0.7,
      });
    }
  }

  // Check for withdrawal pattern
  const anxiousThenSad = checkWithdrawalPattern(entries);
  if (anxiousThenSad > 0) {
    insights.push({
      id: 'pattern-withdrawal',
      title: "You tend to withdraw when overwhelmed",
      description:
        "There's a pattern where anxiety shifts to withdrawal or sadness. This is a natural protection mechanism. Self-compassion is key here.",
      type: 'pattern',
      confidence: anxiousThenSad,
    });
  }

  return insights;
}

function checkWithdrawalPattern(entries: EmotionEntry[]): number {
  let count = 0;
  for (let i = 0; i < entries.length - 1; i++) {
    if (entries[i].mood === 'anxious' && (entries[i + 1].mood === 'sad' || entries[i + 1].mood === 'calm')) {
      count++;
    }
  }
  return Math.min(count / entries.length, 1);
}

function generateTimingInsights(entries: EmotionEntry[]): Insight[] {
  const insights: Insight[] = [];

  if (entries.length < 5) {
    return insights;
  }

  // Analyze time of day patterns
  const hourMap = new Map<number, Mood[]>();

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const hour = date.getHours();
    if (!hourMap.has(hour)) {
      hourMap.set(hour, []);
    }
    hourMap.get(hour)!.push(entry.mood);
  });

  // Find times with most intense moods
  for (const [hour, moods] of hourMap.entries()) {
    if (moods.length >= 2) {
      const hasIntenseMood = moods.some((m) => m === 'frustrated' || m === 'anxious' || m === 'sad');
      if (hasIntenseMood) {
        const hourLabel = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        const intensity = moods.filter((m) => m === 'frustrated' || m === 'anxious').length;

        if (intensity >= moods.length / 2) {
          insights.push({
            id: `timing-${hour}`,
            title: `Your ${hourLabel} often brings intensity`,
            description: `Strong emotions show up more frequently in the ${hourLabel}. What's happening then? Is it routine, relationships, or energy levels?`,
            type: 'timing',
            confidence: intensity / moods.length,
          });
        }
      }
    }
  }

  return insights.slice(0, 2); // Limit timing insights
}

export function getInsightColor(type: string): string {
  const colorMap: Record<string, string> = {
    pattern: 'from-purple-100 to-purple-50',
    trigger: 'from-blue-100 to-blue-50',
    frequency: 'from-rose-100 to-rose-50',
    timing: 'from-amber-100 to-amber-50',
  };
  return colorMap[type] || 'from-slate-100 to-slate-50';
}
