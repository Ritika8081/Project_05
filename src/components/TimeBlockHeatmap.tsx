import React from 'react';
import { EmotionEntry, Mood, TimeOfDay } from '@/types';

interface TimeBlockHeatmapProps {
  entries: EmotionEntry[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_BLOCKS: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

const MOOD_SCORES: Record<Mood, number> = {
  calm: 5,
  neutral: 3,
  anxious: 1,
  sad: 1,
  frustrated: 1,
};

export default function TimeBlockHeatmap({ entries }: TimeBlockHeatmapProps) {
  // Build data structure: [dayOfWeek][timeBlock] = avg mood score
  const heatmapData: Record<number, Record<TimeOfDay, number>> = {};
  const countsData: Record<number, Record<TimeOfDay, number>> = {};

  // Initialize
  for (let day = 0; day < 7; day++) {
    heatmapData[day] = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };
    countsData[day] = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };
  }

  // Aggregate entries
  entries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const dayOfWeek = date.getDay();
    const timeBlock = entry.timeOfDay;
    const score = MOOD_SCORES[entry.mood];

    heatmapData[dayOfWeek][timeBlock] += score;
    countsData[dayOfWeek][timeBlock]++;
  });

  // Calculate averages
  for (let day = 0; day < 7; day++) {
    TIME_BLOCKS.forEach(block => {
      const count = countsData[day][block];
      if (count > 0) {
        heatmapData[day][block] = heatmapData[day][block] / count;
      }
    });
  }

  const getBlockColor = (avgScore: number, count: number): string => {
    if (count === 0) return 'bg-gray-50 border-gray-200';
    
    // Higher score = calmer = greener
    // Lower score = more challenging = warmer colors
    if (avgScore >= 4.5) return 'bg-gradient-to-br from-green-300 to-emerald-200 border-green-400';
    if (avgScore >= 3.5) return 'bg-gradient-to-br from-green-200 to-emerald-100 border-green-300';
    if (avgScore >= 2.5) return 'bg-gradient-to-br from-yellow-200 to-amber-100 border-yellow-300';
    if (avgScore >= 1.5) return 'bg-gradient-to-br from-orange-200 to-amber-200 border-orange-300';
    return 'bg-gradient-to-br from-red-200 to-rose-200 border-red-300';
  };

  const getIntensityLabel = (avgScore: number): string => {
    if (avgScore >= 4.5) return 'Very Calm';
    if (avgScore >= 3.5) return 'Calm';
    if (avgScore >= 2.5) return 'Mixed';
    if (avgScore >= 1.5) return 'Challenging';
    return 'Intense';
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-1 sm:gap-2 min-w-[320px]">
          {/* Header row */}
          <div className="text-[10px] sm:text-xs font-semibold text-orange-900 p-1 sm:p-2" />
          {DAYS.map(day => (
            <div
              key={day}
              className="text-[10px] sm:text-xs font-semibold text-orange-900 text-center p-1 sm:p-2"
            >
              {day}
            </div>
          ))}

          {/* Time block rows */}
          {TIME_BLOCKS.map(timeBlock => (
            <React.Fragment key={timeBlock}>
              <div className="text-[10px] sm:text-xs font-semibold text-orange-900 p-1 sm:p-2 flex items-center">
                {TIME_LABELS[timeBlock]}
              </div>
              {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                const avgScore = heatmapData[dayIndex][timeBlock];
                const count = countsData[dayIndex][timeBlock];
                const colorClass = getBlockColor(avgScore, count);

                return (
                  <div
                    key={`${dayIndex}-${timeBlock}`}
                    className={`relative rounded-lg sm:rounded-xl border-2 aspect-square flex items-center justify-center transition-all hover:scale-105 cursor-pointer group ${colorClass}`}
                    title={count > 0 ? `${getIntensityLabel(avgScore)} (${count} ${count === 1 ? 'entry' : 'entries'})` : 'No data'}
                  >
                    {count > 0 ? (
                      <div className="text-center">
                        <div className="text-[10px] sm:text-xs font-bold text-gray-800">
                          {count}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-300 text-xs">-</div>
                    )}
                    
                    {/* Tooltip on hover */}
                    {count > 0 && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {getIntensityLabel(avgScore)}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
        <h3 className="font-semibold text-orange-900 mb-2 sm:mb-3 text-xs sm:text-sm">Mood Intensity</h3>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-green-300 to-emerald-200 rounded border-2 border-green-400" />
            <span className="text-[10px] sm:text-xs text-orange-800">Very Calm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-green-200 to-emerald-100 rounded border-2 border-green-300" />
            <span className="text-[10px] sm:text-xs text-orange-800">Calm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-200 to-amber-100 rounded border-2 border-yellow-300" />
            <span className="text-[10px] sm:text-xs text-orange-800">Mixed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-orange-200 to-amber-200 rounded border-2 border-orange-300" />
            <span className="text-[10px] sm:text-xs text-orange-800">Challenging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-red-200 to-rose-200 rounded border-2 border-red-300" />
            <span className="text-[10px] sm:text-xs text-orange-800">Intense</span>
          </div>
        </div>
        <p className="text-[10px] sm:text-xs text-orange-700 mt-2 sm:mt-3">
          💡 Number shows how many check-ins. Color shows average emotional intensity.
        </p>
      </div>
    </div>
  );
}
