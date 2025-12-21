'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import TimelineEntry from '@/components/TimelineEntry';
import { getAllEmotionEntries, clearAllEntries } from '@/utils/db';
import { EmotionEntry } from '@/types';

export default function TimelinePage() {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const allEntries = await getAllEmotionEntries();
      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure? This will delete all your check-in history. This action cannot be undone.')) {
      return;
    }

    try {
      await clearAllEntries();
      setEntries([]);
    } catch (error) {
      console.error('Error clearing entries:', error);
      alert('Failed to clear history');
    }
  };

  if (!mounted || loading) return null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <main className="flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-5 max-w-3xl md:max-w-4xl mx-auto w-full overflow-y-auto overflow-x-hidden pb-24 sm:pb-28">
        <div className="text-center mb-4 sm:mb-5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-900 mb-1">Your Timeline</h1>
          <p className="text-orange-800/70 text-xs sm:text-sm">See your emotional journey.</p>
        </div>

        {entries.length === 0 ? (
          <div className="bg-gradient-to-br from-white/90 to-orange-50/80 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-orange-200/50 text-center">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📝</div>
            <h2 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">No entries yet</h2>
            <p className="text-orange-800/70 text-xs sm:text-sm">Start with your first check-in.</p>
          </div>
        ) : (
          <>
            <div className="bg-white/90 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-orange-200/50 mb-4 sm:mb-5">
              <div className="space-y-2 sm:space-y-3">
                {entries.map((entry, index) => (
                  <TimelineEntry key={entry.id} entry={entry} index={index} total={entries.length} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="bg-orange-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-orange-200/50 text-center">
                <p className="text-xs sm:text-sm text-orange-900 font-medium">
                  <span className="font-bold">{entries.length}</span> check-in{entries.length !== 1 ? 's' : ''}
                </p>
              </div>

              <button
                onClick={handleClearHistory}
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-colors duration-300 text-xs sm:text-sm border border-red-300 active:scale-95"
              >
                Clear History
              </button>
            </div>
          </>
        )}
      </main>
      <NavBar currentPath="/timeline" />
    </div>
  );
}
