'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import InsightCard from '@/components/InsightCard';
import { getAllEmotionEntries } from '@/utils/db';
import { generateInsights } from '@/utils/insights';
import { EmotionEntry, Insight } from '@/types';

export default function MirrorPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const allEntries = await getAllEmotionEntries();
      setEntries(allEntries);

      if (allEntries.length >= 5) {
        const generatedInsights = generateInsights(allEntries);
        setInsights(generatedInsights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || loading) return null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <main className="flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-5 max-w-3xl md:max-w-4xl mx-auto w-full overflow-y-auto overflow-x-hidden pb-24 sm:pb-28">
        <div className="text-center mb-4 sm:mb-5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-1">
            Emotional Mirror
          </h1>
          <p className="text-orange-800/70 text-xs sm:text-sm">Here's what your emotions are telling you.</p>
        </div>

        {entries.length < 5 ? (
          <div className="bg-gradient-to-br from-white/90 to-orange-50/80 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-orange-200/50 text-center">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">✨</div>
            <h2 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Building Your Profile</h2>
            <p className="text-orange-800/70 text-xs sm:text-sm mb-4">
              Complete {5 - entries.length} more check-in{entries.length === 4 ? '' : 's'} to unlock insights.
            </p>
            <div className="w-full bg-orange-200 rounded-full h-2 mt-4">
              <div
                className="bg-gradient-to-r from-orange-500 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(entries.length / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-orange-700 mt-2">{entries.length}/5 complete</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-rose-100/60 to-orange-100/60 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-rose-200/50 mb-4 sm:mb-5">
              <p className="text-orange-900 text-xs sm:text-sm text-center italic font-medium">
                "Awareness creates choice."
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
              {insights.length > 0 ? (
                insights.map((insight) => <InsightCard key={insight.id} insight={insight} />)
              ) : (
                <div className="bg-white/90 rounded-lg sm:rounded-xl p-4 sm:p-5 text-center border border-orange-200/50">
                  <p className="text-orange-800/70 text-xs sm:text-sm">Keep checking in to discover patterns.</p>
                </div>
              )}
            </div>

            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200/50">
              <h3 className="font-semibold text-orange-900 mb-2 text-xs sm:text-sm">💭 What does this mean?</h3>
              <p className="text-orange-800/70 text-xs leading-relaxed">
                These insights reflect patterns in your emotions. They're mirrors, not judgments—showing how you typically respond to situations.
              </p>
            </div>
          </>
        )}
      </main>
      <NavBar currentPath="/mirror" />
    </div>
  );
}
