import React from 'react';
import { EmotionEntry } from '@/types';

interface TimelineEntryProps {
  entry: EmotionEntry;
  index: number;
  total: number;
}

const moodEmojis: Record<string, string> = {
  calm: '😊',
  neutral: '😐',
  anxious: '😟',
  sad: '😞',
  frustrated: '😠',
};

const triggerLabels: Record<string, string> = {
  delayed_reply: 'Delayed reply',
  argument: 'Argument',
  ignored: 'Felt ignored',
  overthinking: 'Overthinking',
  unknown: 'Unknown',
};

export default function TimelineEntry({ entry, index, total }: TimelineEntryProps) {
  const date = new Date(entry.date);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-rose-200 flex items-center justify-center shadow-sm border border-orange-300">
          <span className="text-xl">{moodEmojis[entry.mood]}</span>
        </div>
        {index < total - 1 && <div className="w-0.5 h-10 bg-gradient-to-b from-orange-300 to-orange-200 mt-1" />}
      </div>
      <div className="flex-1 pt-1 pb-2">
        <div className="bg-gradient-to-r from-white/90 to-orange-50/80 rounded-lg p-3 border border-orange-200/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-orange-900 capitalize text-sm">{entry.mood}</h3>
            <span className="text-xs font-medium text-orange-700">{formattedDate}</span>
          </div>
          {entry.trigger && (
            <p className="text-xs text-orange-800 bg-orange-100/60 inline-block px-2 py-1 rounded-full">
              {triggerLabels[entry.trigger] || entry.trigger}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
