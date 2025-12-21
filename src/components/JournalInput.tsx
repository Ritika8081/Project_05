'use client';

import React, { useState } from 'react';
import { Mood } from '@/types';
import { getJournalPrompt } from '@/utils/reflections';

interface JournalInputProps {
  mood: Mood;
  onNoteChange: (note: string) => void;
  initialValue?: string;
}

export default function JournalInput({
  mood,
  onNoteChange,
  initialValue = '',
}: JournalInputProps) {
  const [content, setContent] = useState(initialValue);
  const maxChars = 500;
  const prompt = getJournalPrompt(mood);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, maxChars);
    setContent(text);
    onNoteChange(text);
  };

  return (
    <div className="mt-3 sm:mt-4 space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label htmlFor="journal-input" className="text-xs sm:text-sm font-semibold text-amber-900">
          ✍️ Optional note
        </label>
        <span className="text-xs text-amber-700">
          {content.length}/{maxChars}
        </span>
      </div>
      <textarea
        id="journal-input"
        value={content}
        onChange={handleChange}
        placeholder={prompt}
        rows={4}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-amber-200 bg-amber-50 text-amber-950 placeholder-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent resize-none text-sm sm:text-base"
      />
      <p className="text-xs text-amber-700">
        💭 Whatever you write is for your eyes only—stored locally.
      </p>
    </div>
  );
}
