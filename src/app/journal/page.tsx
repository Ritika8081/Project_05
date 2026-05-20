'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { getAllEmotionEntries } from '@/utils/db';
import { EmotionEntry } from '@/types';

const moodEmojis: Record<string, string> = {
  calm: '😌',
  neutral: '😐',
  anxious: '😰',
  sad: '😢',
  frustrated: '😤',
};

export default function JournalPage() {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const allEntries = await getAllEmotionEntries();
      // Filter only entries with notes
      const entriesWithNotes = allEntries.filter(e => e.notes && e.notes.trim());
      setEntries(entriesWithNotes);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <main className="flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-5 max-w-3xl md:max-w-4xl mx-auto w-full overflow-y-auto overflow-x-hidden pb-24 sm:pb-28">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-900 mb-1">Your Journal</h1>
          <p className="text-orange-800/70 text-xs sm:text-sm">
            {entries.length === 0
              ? 'Start journaling with your check-ins to capture your thoughts.'
              : `${entries.length} journal ${entries.length === 1 ? 'entry' : 'entries'}`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-orange-800/60 text-xs sm:text-sm">Loading journal...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-lg sm:rounded-2xl p-5 sm:p-6 border border-orange-200/50 text-center">
            <p className="text-orange-800 text-xs sm:text-sm mb-3">
              📝 Your journal entries will appear here
            </p>
            <p className="text-orange-700/70 text-xs">
              When you complete a check-in, you can add a note to reflect on how you're feeling.
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg sm:text-xl flex-shrink-0">{moodEmojis[entry.mood]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-orange-900 capitalize text-xs sm:text-sm">
                        {entry.mood}
                      </p>
                      <p className="text-xs text-orange-700/70">
                        {formatDate(entry.date)}
                      </p>
                    </div>
                  </div>
                  {entry.trigger && (
                    <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-md flex-shrink-0">
                      {entry.trigger}
                    </span>
                  )}
                </div>

                <div className="bg-amber-50 rounded-lg p-2.5 sm:p-3 border border-amber-200">
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed whitespace-pre-wrap">
                    {entry.notes}
                  </p>
                </div>

                {entry.reflection && (
                  <div className="mt-2 sm:mt-3 bg-orange-50 rounded-lg p-2.5 sm:p-3 border border-orange-200">
                    <p className="text-xs font-semibold text-orange-900 mb-1">Reflection:</p>
                    <p className="text-xs sm:text-sm text-orange-900 leading-relaxed whitespace-pre-wrap">
                      {entry.reflection}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <NavBar currentPath="/journal" />
    </div>
  );
}
