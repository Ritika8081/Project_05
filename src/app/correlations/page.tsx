'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import MoodHeatmap from '@/components/MoodHeatmap';
import TimeBlockHeatmap from '@/components/TimeBlockHeatmap';
import { getAllEmotionEntries } from '@/utils/db';
import { buildHeatmapData, generateCorrelationInsights, calculateHotspots } from '@/utils/correlations';
import { migrateEntries } from '@/utils/migration';
import { EmotionEntry, HeatmapData } from '@/types';

export default function CorrelationsPage() {
  interface Hotspot {
    hour: number;
    day: string;
    mood: string;
    count: number;
    intensity: 'critical' | 'high' | 'medium' | 'low';
  }

  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let allEntries = await getAllEmotionEntries();
      
      // Migrate old entries that don't have time fields
      allEntries = migrateEntries(allEntries);
      setEntries(allEntries);

      if (allEntries.length >= 5) {
        const heatmap = buildHeatmapData(allEntries);
        setHeatmapData(heatmap);

        const correlationInsights = generateCorrelationInsights(allEntries);
        setInsights(correlationInsights);

        const hotspotData = calculateHotspots(allEntries);
        setHotspots(hotspotData);
      }
    } catch (error) {
      console.error('Error loading correlations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || loading) return null;

  const moodEmojis: Record<string, string> = {
    calm: '😊',
    neutral: '😐',
    anxious: '😟',
    sad: '😞',
    frustrated: '😠',
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <main className="flex-1 px-3 sm:px-4 md:px-6 py-3 sm:py-5 max-w-3xl md:max-w-5xl mx-auto w-full overflow-y-auto overflow-x-hidden pb-24 sm:pb-28">
        <div className="text-center mb-4 sm:mb-5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-1">
            Mood Patterns
          </h1>
          <p className="text-orange-800/70 text-xs sm:text-sm">When do you feel what?</p>
        </div>

        {entries.length < 5 ? (
          <div className="bg-gradient-to-br from-white/90 to-orange-50/80 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-orange-200/50 text-center">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📊</div>
            <h2 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">More Data Needed</h2>
            <p className="text-orange-800/70 text-xs sm:text-sm">
              Complete {5 - entries.length} more check-in{entries.length === 4 ? '' : 's'} to see your mood patterns by time and day.
            </p>
          </div>
        ) : (
          <>
            {insights.length > 0 && (
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                <h2 className="font-semibold text-orange-900 text-sm sm:text-base">💡 Your Patterns</h2>
                {insights.map((insight, index) => (
                  <div key={index} className="bg-gradient-to-r from-amber-100/60 to-orange-100/60 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-orange-200/50 shadow-sm">
                    <p className="text-orange-900 text-xs sm:text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            )}

            {hotspots.length > 0 && (
              <div className="bg-gradient-to-br from-white/90 to-orange-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-orange-200/50 mb-4 sm:mb-5">
                <h2 className="font-semibold text-orange-900 text-sm sm:text-base mb-2 sm:mb-3">🔥 Emotional Hotspots</h2>
                <div className="space-y-1.5 sm:space-y-2">
                  {hotspots.map((hotspot, index) => {
                    const timeRange =
                      hotspot.hour === 0
                        ? '12am'
                        : hotspot.hour < 12
                          ? `${hotspot.hour}am`
                          : hotspot.hour === 12
                            ? '12pm'
                            : `${hotspot.hour - 12}pm`;

                    const intensityLabel = {
                      critical: '🔴 Critical',
                      high: '🟠 High',
                      medium: '🟡 Medium',
                      low: '🟢 Low',
                    }[hotspot.intensity];

                    return (
                      <div key={index} className="flex items-center justify-between bg-white/60 p-2.5 sm:p-3 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-lg sm:text-xl">{moodEmojis[hotspot.mood]}</span>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-orange-900 capitalize">
                              {hotspot.mood} on {hotspot.day}s around {timeRange}
                            </p>
                            <p className="text-xs text-orange-700">{hotspot.count} times recorded</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold">{intensityLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Simplified Time Block Heatmap */}
            <div className="bg-gradient-to-br from-white/90 to-blue-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-blue-200/50 mb-4 sm:mb-5">
              <div className="mb-3 sm:mb-4">
                <h2 className="font-semibold text-blue-900 text-sm sm:text-base mb-1">🌅 Quick View: When Do You Feel What?</h2>
                <p className="text-xs text-blue-700">Simplified view by time of day</p>
              </div>
              <TimeBlockHeatmap entries={entries} />
            </div>

            {/* Detailed 24/7 Heatmap */}
            <div className="bg-gradient-to-br from-white/90 to-orange-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-orange-200/50 mb-4 sm:mb-5">
              <div className="mb-3 sm:mb-4">
                <h2 className="font-semibold text-orange-900 text-sm sm:text-base mb-1">📅 Detailed 24/7 Mood Heatmap</h2>
                <p className="text-xs text-orange-700">Hour-by-hour breakdown</p>
              </div>
              {heatmapData && <MoodHeatmap data={heatmapData} />}
            </div>

            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200/50">
              <h3 className="font-semibold text-orange-900 mb-2 text-xs sm:text-sm">📈 How to Read This</h3>
              <ul className="space-y-1 text-xs sm:text-xs text-orange-800/80">
                <li>• Each cell shows the dominant mood and frequency</li>
                <li>• Darker/warmer colors = more emotional intensity</li>
                <li>• Patterns help you understand when you need support</li>
                <li>• Use this awareness to plan your week better</li>
              </ul>
            </div>
          </>
        )}
      </main>
      <NavBar currentPath="/correlations" />
    </div>
  );
}
