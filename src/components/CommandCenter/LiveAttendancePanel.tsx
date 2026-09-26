import React, { useState } from 'react';
import { 
  UserCheck, 
  AlertTriangle, 
  ArrowRight, 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert 
} from 'lucide-react';
import { AppSection } from '../../types';

interface LiveAttendancePanelProps {
  onNavigate: (section: AppSection) => void;
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
  excusedCount?: number;
  totalStudents?: number;
}

export const LiveAttendancePanel: React.FC<LiveAttendancePanelProps> = ({
  onNavigate,
  presentCount = 0,
  absentCount = 0,
  lateCount = 0,
  excusedCount = 0,
  totalStudents = 0,
}) => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');

  const attendancePct = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : '0';

  // Mock chart bar datasets for toggles
  const weekData = [
    { label: 'Mon', rate: 93.4, present: 2322 },
    { label: 'Tue', rate: 94.1, present: 2339 },
    { label: 'Wed', rate: 92.8, present: 2307 },
    { label: 'Thu', rate: 93.9, present: 2334 },
    { label: 'Fri (Today)', rate: Number(attendancePct), present: presentCount },
  ];

  const monthData = [
    { label: 'Week 1', rate: 94.6, present: 2351 },
    { label: 'Week 2', rate: 93.8, present: 2332 },
    { label: 'Week 3', rate: 92.1, present: 2289 },
    { label: 'Week 4 (Current)', rate: 93.2, present: 2316 },
  ];

  const todayClassPills = [
    { grade: 'Grade 9', rate: 94.2, status: 'normal' },
    { grade: 'Grade 10', rate: 89.8, status: 'warning' },
    { grade: 'Grade 11', rate: 95.1, status: 'good' },
    { grade: 'Grade 12', rate: 93.5, status: 'normal' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header with Title & Timeframe Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Attendance Overview</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated gate sensors & teacher roll-call consolidated
            </p>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                timeframe === 'today'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                timeframe === 'week'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                timeframe === 'month'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Headcount Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Present
            </div>
            <div className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1">
              {presentCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400/80 font-medium">
              {attendancePct}% on campus
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400">
              <XCircle className="w-3.5 h-3.5" /> Absent
            </div>
            <div className="text-xl font-extrabold text-rose-900 dark:text-rose-200 mt-1">
              {absentCount}
            </div>
            <div className="text-[10px] text-rose-600 dark:text-rose-400/80 font-medium">
              Parent SMS sent
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" /> Late Arrived
            </div>
            <div className="text-xl font-extrabold text-amber-900 dark:text-amber-200 mt-1">
              {lateCount}
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400/80 font-medium">
              Turnstile pass issued
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> Excused
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-200 mt-1">
              {excusedCount}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Medical / Events
            </div>
          </div>
        </div>

        {/* Visual Chart Bars depending on timeframe */}
        <div className="my-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            <span>Trend Visualizer ({timeframe === 'today' ? 'By Grade Levels' : timeframe === 'week' ? 'Past 5 School Days' : '4-Week Average'})</span>
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Target: 95.0%
            </span>
          </div>

          {timeframe === 'today' && (
            <div className="space-y-2.5">
              {todayClassPills.map((item) => (
                <div key={item.grade} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{item.grade}</span>
                    <span className={`font-bold ${item.status === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                      {item.rate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${item.status === 'warning' ? 'bg-amber-500' : 'bg-blue-600'}`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {timeframe === 'week' && (
            <div className="grid grid-cols-5 gap-2 pt-2">
              {weekData.map((d) => (
                <div key={d.label} className="text-center space-y-1">
                  <div className="h-24 flex items-end justify-center bg-slate-100 dark:bg-slate-700/60 rounded-lg p-1">
                    <div 
                      className="w-full bg-blue-600 dark:bg-blue-500 rounded-md transition-all duration-300"
                      style={{ height: `${(d.rate - 85) * 6}%` }}
                      title={`${d.rate}%`}
                    />
                  </div>
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white">{d.rate}%</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{d.label}</div>
                </div>
              ))}
            </div>
          )}

          {timeframe === 'month' && (
            <div className="grid grid-cols-4 gap-2 pt-2">
              {monthData.map((d) => (
                <div key={d.label} className="text-center space-y-1">
                  <div className="h-24 flex items-end justify-center bg-slate-100 dark:bg-slate-700/60 rounded-lg p-1">
                    <div 
                      className="w-full bg-indigo-600 dark:bg-indigo-500 rounded-md transition-all duration-300"
                      style={{ height: `${(d.rate - 85) * 6}%` }}
                      title={`${d.rate}%`}
                    />
                  </div>
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white">{d.rate}%</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{d.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Intelligent Warning Alert */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Attention: </span>
            <span>10-B attendance has dropped <strong>4.2%</strong> this week. 5 students absent with suspected seasonal viral illness.</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Last verified roll call: <strong>08:30 AM</strong>
        </span>
        <button
          onClick={() => onNavigate('attendance')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <span>View Attendance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
