import React from 'react';
import { 
  TrendingUp, 
  Award, 
  CheckCircle, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import { 
  MONTHLY_ACADEMIC_TRENDS, 
  ACADEMIC_SCORE_DISTRIBUTION,
  ACADEMIC_HEADER_STATS
} from '../../data/academicData';

interface AcademicPerformanceOverviewProps {
  onSelectSubject?: (subjectId: string) => void;
  onNavigateTab: (tabKey: string) => void;
}

export const AcademicPerformanceOverview: React.FC<AcademicPerformanceOverviewProps> = ({
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner KPI summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall School Average</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Target: 80%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {ACADEMIC_HEADER_STATS.averageAcademicScore}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +1.4% this term
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${ACADEMIC_HEADER_STATS.averageAcademicScore}%` }} 
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Minimum Pass: 40%</span>
            <span>Academy Distinction: 85%</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Pass Rate</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              CBSE Benchmark
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {ACADEMIC_HEADER_STATS.passPercentage}%
            </span>
            <span className="text-xs font-medium text-slate-500">213 of 219 students</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${ACADEMIC_HEADER_STATS.passPercentage}%` }} 
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Target: 98.0%</span>
            <span>Retention: 99.4%</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Performing Wing</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">Grade 12 (84.6%)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Highest distinction concentration (38.4%) across Science and Commerce streams.
          </p>
          <button
            id="overview-inspect-classes-btn"
            onClick={() => onNavigateTab('classes')}
            className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Class Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: Monthly Academic Trend & Score Distribution (Clean 2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Academic Trend */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Monthly Academic Trend
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Average score growth across 2026 session</p>
              </div>
            </div>

            <div className="space-y-3">
              {MONTHLY_ACADEMIC_TRENDS.map((m) => (
                <div key={m.month} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 font-bold text-slate-700 dark:text-slate-300">{m.month}</span>
                    <div className="w-24 sm:w-36 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full" 
                        style={{ width: `${m.average}%` }} 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 dark:text-white">{m.average}%</span>
                    <span className="text-[11px] text-slate-500">HW: {m.homeworkCompletion}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>Continuous upward trend observed from April (76.2%) to September (81.4%) after introducing smart digital homework tracking.</span>
          </div>
        </div>

        {/* Score & Grade Bracket Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-purple-600" />
              Score & Grade Bracket Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Distribution of 219 Class 10 students based on latest cumulative scores
            </p>

            <div className="space-y-3.5">
              {ACADEMIC_SCORE_DISTRIBUTION.map((item) => (
                <div key={item.range} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.range}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.percentage}% ({item.count} students)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Students needing targeted intervention:</span>
            <button
              id="overview-view-attention-btn"
              onClick={() => onNavigateTab('attention')}
              className="font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              150 Students (&lt;60%) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
