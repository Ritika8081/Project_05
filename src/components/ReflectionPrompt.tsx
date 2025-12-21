'use client';

import React from 'react';
import { Mood } from '@/types';
import { getReflectionPrompt } from '@/utils/reflections';

interface ReflectionPromptProps {
  mood: Mood;
}

export default function ReflectionPrompt({ mood }: ReflectionPromptProps) {
  const prompt = getReflectionPrompt(mood);

  return (
    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-amber-200 space-y-3 sm:space-y-4">
      {/* Reflective Question */}
      <div className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-100">
        <p className="text-xs sm:text-sm font-semibold text-amber-900 mb-2 sm:mb-3">
          Take a moment to reflect:
        </p>
        <ul className="space-y-1.5 sm:space-y-2">
          {prompt.questions.map((question, idx) => (
            <li key={idx} className="text-xs sm:text-sm text-amber-800 flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">•</span>
              <span>{question}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestion */}
      <div className="bg-amber-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-amber-200">
        <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide">
          💡 Gentle reminder
        </p>
        <p className="text-xs sm:text-sm text-amber-900 mt-1">{prompt.suggestion}</p>
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-rose-200 italic">
        <p className="text-xs sm:text-sm text-rose-900">{prompt.quote}</p>
      </div>
    </div>
  );
}
