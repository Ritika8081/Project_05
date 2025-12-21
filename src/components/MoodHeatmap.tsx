import React from 'react';
import { HeatmapData, Mood } from '@/types';
import { getMoodColorIntensity } from '@/utils/correlations';

interface MoodHeatmapProps {
  data: HeatmapData;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MOODS: Mood[] = ['calm', 'neutral', 'anxious', 'sad', 'frustrated'];
const MOOD_COLORS: Record<Mood, string> = {
  calm: 'from-green-200 to-emerald-100',
  neutral: 'from-gray-200 to-slate-100',
  anxious: 'from-orange-300 to-amber-100',
  sad: 'from-purple-300 to-violet-100',
  frustrated: 'from-red-300 to-rose-100',
};

const MOOD_EMOJIS: Record<Mood, string> = {
  calm: '😊',
  neutral: '😐',
  anxious: '😟',
  sad: '😞',
  frustrated: '😠',
};

export default function MoodHeatmap({ data }: MoodHeatmapProps) {
  const getBackgroundColor = (intensity: number): string => {
    if (intensity === 0) return 'bg-gray-50';
    if (intensity < 0.2) return 'bg-gradient-to-br from-orange-50 to-amber-50';
    if (intensity < 0.4) return 'bg-gradient-to-br from-orange-100 to-amber-100';
    if (intensity < 0.6) return 'bg-gradient-to-br from-orange-200 to-amber-200';
    if (intensity < 0.8) return 'bg-gradient-to-br from-orange-300 to-amber-300';
    return 'bg-gradient-to-br from-orange-400 to-amber-400';
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-[10px] sm:text-xs">
        <thead>
          <tr>
            <th className="bg-orange-100 text-orange-900 font-semibold p-1.5 sm:p-2 border border-orange-200 w-14 sm:w-16">
              Time
            </th>
            {DAYS.map((day) => (
              <th
                key={day}
                className="bg-orange-100 text-orange-900 font-semibold p-1.5 sm:p-2 border border-orange-200 min-w-10 sm:min-w-12"
              >
                {day.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour) => (
            <tr key={hour}>
              <td className="bg-orange-50 text-orange-900 font-medium p-1.5 sm:p-2 border border-orange-200 text-center">
                {hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`}
              </td>
              {DAYS.map((day) => {
                const dayData = data[day]?.[hour];
                if (!dayData) return <td key={`${day}-${hour}`} className="bg-gray-50 border border-orange-200" />;

                const total = Object.values(dayData).reduce((a, b) => a + b, 0);
                if (total === 0) {
                  return (
                    <td key={`${day}-${hour}`} className="bg-gray-50 border border-orange-200 p-1">
                      <div className="h-10 sm:h-12 flex items-center justify-center text-gray-300">-</div>
                    </td>
                  );
                }

                // Find dominant mood
                const dominantMood = (Object.entries(dayData).sort((a, b) => b[1] - a[1])[0][0] as Mood) || 'neutral';
                const intensity = dayData[dominantMood] / total;

                return (
                  <td key={`${day}-${hour}`} className={`border border-orange-200 p-1`}>
                    <div className={`h-10 sm:h-12 flex items-center justify-center rounded font-semibold ${getBackgroundColor(intensity)}`}>
                      {total > 0 && (
                        <div className="text-center">
                          <div className="text-base sm:text-lg">{MOOD_EMOJIS[dominantMood]}</div>
                          <div className="text-orange-900 text-[10px] sm:text-xs font-bold">{total}</div>
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 sm:mt-6 bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
        <h3 className="font-semibold text-orange-900 mb-2 sm:mb-3 text-xs sm:text-sm">Color Intensity Guide</h3>
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-50 rounded border border-orange-200" />
            <span className="text-[10px] sm:text-xs text-orange-800">No data</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded border border-orange-200" />
            <span className="text-[10px] sm:text-xs text-orange-800">1-2 entries</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-300 to-amber-300 rounded border border-orange-200" />
            <span className="text-[10px] sm:text-xs text-orange-800">3-4 entries</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-400 to-amber-400 rounded border border-orange-200" />
            <span className="text-[10px] sm:text-xs text-orange-800">5+ entries</span>
          </div>
        </div>
      </div>
    </div>
  );
}
