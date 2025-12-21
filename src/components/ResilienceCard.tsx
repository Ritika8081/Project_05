'use client';

import { ResilienceMetrics } from '@/utils/resilience';
import { getResilienceInsight } from '@/utils/resilience';

interface ResilienceCardProps {
  metrics: ResilienceMetrics;
}

export function ResilienceCard({ metrics }: ResilienceCardProps) {
  const insight = getResilienceInsight(metrics);
  const improvementColor = metrics.weekOverWeekImprovement < 0 ? 'text-emerald-600' : 'text-amber-600';
  
  return (
    <div className="w-full max-w-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💪</span>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
          Emotional Resilience
        </h3>
      </div>
      
      <p className="text-sm sm:text-base text-slate-700 mb-6 leading-relaxed">{insight}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Recovery Speed */}
        <div className="bg-white/60 backdrop-blur rounded-lg p-3">
          <div className="text-xs text-slate-600 font-medium mb-1">Avg Recovery</div>
          <div className="text-lg sm:text-xl font-bold text-rose-600">
            {metrics.averageRecoveryTimeMinutes}
          </div>
        </div>
        
        {/* Fastest Recovery */}
        <div className="bg-white/60 backdrop-blur rounded-lg p-3">
          <div className="text-xs text-slate-600 font-medium mb-1">Fastest</div>
          <div className="text-lg sm:text-xl font-bold text-emerald-600">
            {metrics.fastestRecoveryMinutes}
          </div>
        </div>
        
        {/* Resilience Streak */}
        <div className="bg-white/60 backdrop-blur rounded-lg p-3">
          <div className="text-xs text-slate-600 font-medium mb-1">Day Streak</div>
          <div className="text-lg sm:text-xl font-bold text-amber-600">
            {metrics.resilienceStreak}
          </div>
        </div>
        
        {/* Total Recoveries */}
        <div className="bg-white/60 backdrop-blur rounded-lg p-3">
          <div className="text-xs text-slate-600 font-medium mb-1">Recoveries</div>
          <div className="text-lg sm:text-xl font-bold text-indigo-600">
            {metrics.totalRecoveriesDetected}
          </div>
        </div>
      </div>
      
      {metrics.weekOverWeekImprovement !== 0 && (
        <div className="mt-4 pt-4 border-t border-rose-200">
          <div className={`text-sm ${improvementColor} font-medium`}>
            {metrics.weekOverWeekImprovement < 0
              ? `📈 ${Math.abs(metrics.weekOverWeekImprovement).toFixed(1)}% faster recovery this week`
              : `📊 ${metrics.weekOverWeekImprovement.toFixed(1)}% slower—give yourself grace`}
          </div>
        </div>
      )}
      
      {metrics.totalRecoveriesDetected === 0 && (
        <div className="mt-4 pt-4 border-t border-rose-200">
          <p className="text-xs sm:text-sm text-slate-600">
            Recovery tracking begins when you log multiple emotions in a day. Each moment of awareness builds resilience.
          </p>
        </div>
      )}
    </div>
  );
}
