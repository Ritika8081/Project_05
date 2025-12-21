import React from 'react';
import { MoodOption } from '@/types';

interface MoodSelectorProps {
  selectedMood: string | null;
  onChange: (mood: string) => void;
}

const moodOptions: MoodOption[] = [
  { value: 'calm', emoji: '😊', label: 'Calm' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'anxious', emoji: '😟', label: 'Anxious' },
  { value: 'sad', emoji: '😞', label: 'Sad' },
  { value: 'frustrated', emoji: '😠', label: 'Frustrated' },
];

export default function MoodSelector({ selectedMood, onChange }: MoodSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm sm:text-base font-semibold text-orange-900 mb-3 sm:mb-4">How do you feel?</label>
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5 md:gap-3">
        {moodOptions.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={`
              flex flex-col items-center justify-center py-3 sm:py-4 px-2 sm:px-3 rounded-lg sm:rounded-xl
              transition-all duration-300 ease-out text-xs sm:text-sm font-medium
              active:scale-95
              ${
                selectedMood === mood.value
                  ? 'bg-gradient-to-br from-orange-300 to-rose-300 ring-2 ring-orange-500 shadow-md scale-105 text-orange-950'
                  : 'bg-gradient-to-br from-orange-100 to-rose-50 hover:from-orange-150 hover:to-rose-100 ring-1 ring-orange-200 text-orange-900'
              }
            `}
          >
            <span className="text-3xl sm:text-4xl mb-0.5 sm:mb-1">{mood.emoji}</span>
            <span className="text-xs leading-tight">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
