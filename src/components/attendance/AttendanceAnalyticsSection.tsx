import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Percent, 
  ArrowUpRight, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  WEEKLY_ATTENDANCE_TREND, 
  MONTHLY_ATTENDANCE_TREND, 
  SMART_ATTENDANCE_CLASSES 
} from '../../data/attendanceData';

export const AttendanceAnalyticsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'classes' | 'monthly'>('weekly');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-5">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Attendance Analytics & Longitudinal Trends
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
              Live Trends
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical breakdown of attendance patterns across the 7-day rolling window, classes, and academic terms.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly (7 Days)
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'classes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class Comparison
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Trend
          </button>
        </div>
      </div>

      {/* 1. Weekly Attendance Trend (Last 7 Days) */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">7-Day Attendance Rate:</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                Average: 94.4%
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Attendance %
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-400"></span> 75% CBSE Minimum
              </span>
            </div>
          </div>

          {/* Fluid Responsive Chart Container */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60">
            <div className="h-56 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-1">
              {WEEKLY_ATTENDANCE_TREND.map((day, idx) => {
                const heightPct = Math.max(15, (day.rate - 70) * 3.2); // Scaling from 70-100%
                const isToday = day.date === 'Today';
                const isHovered = hoveredDay === idx;

                return (
                  <div
                    key={day.date}
                    onMouseEnter={() => setHoveredDay(idx)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[10px] sm:text-xs py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in duration-150 pointer-events-none">
                        <p className="font-bold">{day.dayName}, {day.date}: {day.rate}%</p>
                        <p className="text-slate-300 text-[9px]">{day.present} Present • {day.absent} Absent</p>
                      </div>
                    )}

                    {/* Bar value label */}
                    <span className="text-[11px] font-bold text-slate-700 mb-1.5">
                      {day.rate}%
                    </span>

                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-slate-200 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          isToday
                            ? 'bg-blue-600 group-hover:bg-blue-700'
                            : 'bg-blue-500/85 group-hover:bg-blue-600'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>

                    {/* X-axis labels */}
                    <div className="text-center mt-2">
                      <span className={`text-xs font-bold block ${isToday ? 'text-blue-600 font-extrabold' : 'text-slate-700'}`}>
                        {day.dayName}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[48px]">
                        {day.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Highest attendance recorded on <strong>Tuesday (95.8%)</strong>. Saturday reflected slightly elevated absences due to inter-school tournaments.</span>
          </div>
        </div>
      )}

      {/* 2. Class Comparison Chart */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-700">Comparative Rates Across 14 Classes (6-A to 12-B):</span>
            <span className="text-[11px] text-slate-500">Benchmark Goal: 92%</span>
          </div>

          <div className="space-y-2.5">
            {SMART_ATTENDANCE_CLASSES.map((cls) => {
              const isBelowGoal = cls.attendanceRate < 92;
              return (
                <div key={cls.className} className="flex items-center gap-3 text-xs">
                  {/* Class label */}
                  <span className="w-16 font-bold text-slate-800 shrink-0">
                    Class {cls.className}
                  </span>

                  {/* Horizontal bar track */}
                  <div className="flex-1 h-5 bg-slate-100 rounded-lg overflow-hidden relative flex items-center">
                    <div
                      className={`h-full rounded-lg transition-all duration-500 ${
                        cls.attendanceRate >= 95
                          ? 'bg-emerald-500'
                          : cls.attendanceRate >= 92
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${cls.attendanceRate}%` }}
                    />
                    {/* Benchmark vertical tick at 75% */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-400/80 z-10" 
                      style={{ left: '75%' }} 
                      title="75% CBSE Threshold"
                    />
                  </div>

                  {/* Rate readout */}
                  <div className="w-24 text-right shrink-0">
                    <span className={`font-bold ${
                      cls.attendanceRate >= 95
                        ? 'text-emerald-700'
                        : cls.attendanceRate >= 92
                        ? 'text-blue-700'
                        : 'text-amber-700'
                    }`}>
                      {cls.attendanceRate.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({cls.present}/{cls.totalStudents})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-2">
            The red vertical line indicates the 75% minimum academic attendance threshold.
          </p>
        </div>
      )}

      {/* 3. Monthly Attendance Trend */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Academic Year 2026-27 Monthly Overview:</span>
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
              Year-to-Date: 94.7%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MONTHLY_ATTENDANCE_TREND.map((month) => (
              <div 
                key={month.month}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-center space-y-1.5"
              >
                <span className="text-xs font-semibold text-slate-500">{month.month}</span>
                <p className="text-2xl font-extrabold text-slate-900">{month.rate}%</p>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${month.rate}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {month.workingDays} Academic Days
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
