import React from 'react';
import { Insight, Mood } from '@/types';
import { getInsightColor } from '@/utils/insights';

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const colorMap: Record<string, string> = {
    pattern: 'from-orange-100 to-amber-50',
    trigger: 'from-rose-100 to-orange-50',
    frequency: 'from-amber-100 to-orange-50',
    timing: 'from-rose-100 to-pink-50',
  };
  const borderColorMap: Record<string, string> = {
    pattern: 'border-orange-200',
    trigger: 'border-rose-200',
    frequency: 'border-amber-200',
    timing: 'border-rose-200',
  };
  const iconColorMap: Record<string, string> = {
    pattern: 'text-orange-700',
    trigger: 'text-rose-700',
    frequency: 'text-amber-700',
    timing: 'text-rose-700',
  };

  const colorClass = colorMap[insight.type] || 'from-orange-50 to-amber-50';
  const borderClass = borderColorMap[insight.type] || 'border-orange-200';
  const iconClass = iconColorMap[insight.type] || 'text-orange-700';

  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border ${borderClass}`}>
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <svg className={`w-5 h-5 ${iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-orange-950 mb-1 text-sm">{insight.title}</h3>
          <p className="text-orange-900/80 text-xs leading-relaxed">{insight.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 bg-orange-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full"
                style={{ width: `${Math.round(insight.confidence * 100)}%` }}
              />
            </div>
            <span className="text-xs text-orange-800 font-medium">{Math.round(insight.confidence * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
