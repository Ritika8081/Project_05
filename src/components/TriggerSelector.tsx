import React from 'react';
import { TriggerOption } from '@/types';

interface TriggerSelectorProps {
  selectedTrigger: string | null;
  onChange: (trigger: string | null) => void;
}

const triggerOptions: TriggerOption[] = [
  { value: 'delayed_reply', label: 'Delayed reply' },
  { value: 'argument', label: 'Argument' },
  { value: 'ignored', label: 'Felt ignored' },
  { value: 'overthinking', label: 'Overthinking' },
  { value: 'unknown', label: 'Unknown' },
];

export default function TriggerSelector({ selectedTrigger, onChange }: TriggerSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm sm:text-base font-semibold text-orange-900 mb-2 sm:mb-3">What triggered it? (optional)</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {triggerOptions.map((trigger) => (
          <button
            key={trigger.value}
            onClick={() => onChange(selectedTrigger === trigger.value ? null : trigger.value)}
            className={`
              text-center sm:text-left py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl
              transition-all duration-300 ease-out
              font-medium text-xs sm:text-sm
              active:scale-95
              ${
                selectedTrigger === trigger.value
                  ? 'bg-gradient-to-r from-amber-300 to-orange-300 text-orange-950 ring-2 ring-amber-500 shadow-md'
                  : 'bg-gradient-to-r from-orange-100 to-amber-50 text-orange-900 hover:from-orange-150 hover:to-amber-100 ring-1 ring-orange-200'
              }
            `}
          >
            {trigger.label}
          </button>
        ))}
      </div>
    </div>
  );
}
