import React from 'react';
import { ContributorOption } from '@/types';

interface ContributorsSelectorProps {
  selectedContributor: string | null;
  onChange: (contributor: string | null) => void;
}

const contributorOptions: ContributorOption[] = [
  { value: 'break', label: 'Took a break' },
  { value: 'supported', label: 'Felt supported' },
  { value: 'normal', label: 'Things felt normal' },
  { value: 'none', label: 'Nothing specific' },
];

export default function ContributorsSelector({ selectedContributor, onChange }: ContributorsSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm sm:text-base font-semibold text-orange-900 mb-2 sm:mb-3">
        What contributed to this feeling? (optional)
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {contributorOptions.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange(selectedContributor === c.value ? null : c.value)}
            className={`
              text-left py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl
              transition-all duration-300 ease-out
              font-medium text-xs sm:text-sm
              active:scale-95
              ${
                selectedContributor === c.value
                  ? 'bg-gradient-to-r from-rose-300 to-orange-300 text-orange-950 ring-2 ring-rose-500 shadow-md'
                  : 'bg-gradient-to-r from-orange-100 to-rose-50 text-orange-900 hover:from-orange-150 hover:to-rose-100 ring-1 ring-orange-200'
              }
            `}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
