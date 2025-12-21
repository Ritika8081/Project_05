'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import InsightCard from '@/components/InsightCard';
import { getAllEmotionEntries } from '@/utils/db';
import { generateInsights } from '@/utils/insights';
import { generateWeeklySummary, generateWeeklySummaryText, WeeklySummary } from '@/utils/weeklySummary';
import { calculateStreaks, generateMilestones, getStreakMessage, getCalmStreakMessage, StreakData, Milestone } from '@/utils/streaks';
import { EmotionEntry, Insight } from '@/types';

export default function MirrorPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [streaks, setStreaks] = useState<StreakData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
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

      // Generate weekly summary
      if (allEntries.length >= 3) {
        const summary = generateWeeklySummary(allEntries);
        setWeeklySummary(summary);
      }

      // Calculate streaks and milestones
      if (allEntries.length > 0) {
        const streakData = calculateStreaks(allEntries);
        setStreaks(streakData);
        
        const achievedMilestones = generateMilestones(allEntries, streakData);
        setMilestones(achievedMilestones);
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
            {/* Weekly Summary */}
            {weeklySummary && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border border-purple-200/50 mb-4 sm:mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📊</span>
                  <h2 className="text-sm sm:text-base font-bold text-purple-900">This Week's Story</h2>
                </div>
                <p className="text-xs sm:text-sm text-purple-900 leading-relaxed">
                  {generateWeeklySummaryText(weeklySummary)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    weeklySummary.trendDirection === 'improving' 
                      ? 'bg-green-100 text-green-800' 
                      : weeklySummary.trendDirection === 'stable'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {weeklySummary.trendDirection === 'improving' && '📈 Improving'}
                    {weeklySummary.trendDirection === 'stable' && '➡️ Stable'}
                    {weeklySummary.trendDirection === 'challenging' && '💪 Processing'}
                  </div>
                </div>
              </div>
            )}

            {/* Streaks */}
            {streaks && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border border-orange-200/50 mb-4 sm:mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🔥</span>
                  <h2 className="text-sm sm:text-base font-bold text-orange-900">Your Momentum</h2>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs sm:text-sm font-semibold text-orange-900 mb-1">
                      {getStreakMessage(streaks)}
                    </p>
                    {streaks.currentCheckInStreak > 0 && (
                      <p className="text-xs text-orange-700">
                        {streaks.longestCheckInStreak > streaks.currentCheckInStreak && 
                          `Personal best: ${streaks.longestCheckInStreak} days`
                        }
                      </p>
                    )}
                  </div>
                  {streaks.currentCalmStreak > 0 && getCalmStreakMessage(streaks) && (
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-xs sm:text-sm font-semibold text-green-900">
                        {getCalmStreakMessage(streaks)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Milestones */}
            {milestones.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border border-blue-200/50 mb-4 sm:mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏆</span>
                  <h2 className="text-sm sm:text-base font-bold text-blue-900">Milestones</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {milestones.slice(0, 6).map(milestone => (
                    <div
                      key={milestone.id}
                      className={`rounded-lg p-2 sm:p-3 border-2 transition-all ${
                        milestone.achieved
                          ? 'bg-white border-blue-300 shadow-sm'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="text-xl sm:text-2xl mb-1 text-center">{milestone.icon}</div>
                      <p className="text-xs font-semibold text-center text-gray-900 leading-tight">
                        {milestone.title}
                      </p>
                      {!milestone.achieved && milestone.progress !== undefined && milestone.total && (
                        <div className="mt-1.5">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full transition-all"
                              style={{ width: `${(milestone.progress / milestone.total) * 100}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-600 text-center mt-0.5">
                            {milestone.progress}/{milestone.total}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
