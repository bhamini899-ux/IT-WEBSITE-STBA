import React from 'react';
import { 
  CalendarClock, 
  Clock, 
  MapPin, 
  User, 
  ArrowRight, 
  Radio, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { TimetablePeriod, AppSection } from '../../types';

interface TimetablePanelProps {
  periods: TimetablePeriod[];
  onNavigate: (section: AppSection) => void;
  onOpenManageTimetable?: () => void;
}

export const TimetablePanel: React.FC<TimetablePanelProps> = ({
  periods,
  onNavigate,
  onOpenManageTimetable,
}) => {
  const ongoingPeriod = periods.find(p => p.status === 'Ongoing') || periods[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Class Timetable</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Period schedule & room allocation</p>
            </div>
          </div>

          {/* Countdown Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/50">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Next Period in <strong>18m</strong></span>
          </div>
        </div>

        {/* Current Active Spotlight Card */}
        {ongoingPeriod && (
          <div className="my-3.5 p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/70 dark:border-blue-900/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                <span>Period {ongoingPeriod.periodNumber} • Current Live Session</span>
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {ongoingPeriod.timeRange}
              </span>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {ongoingPeriod.subject} <span className="text-blue-600 dark:text-blue-400">({ongoingPeriod.className})</span>
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {ongoingPeriod.teacher}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {ongoingPeriod.room}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                  Active Now
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Periods List */}
        <div className="space-y-2 mt-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Next Scheduled Periods</p>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            {periods.slice(1).map((p) => (
              <div 
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-600 shrink-0">
                    {p.periodNumber}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {p.subject} <span className="text-slate-500 font-normal">({p.className})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{p.teacher}</span>
                      <span>•</span>
                      <span>{p.room}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">{p.timeRange}</div>
                  <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] mt-0.5">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={onOpenManageTimetable}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline-offset-2 hover:underline cursor-pointer"
        >
          Manage Timetable
        </button>
        <button
          onClick={() => onNavigate('timetable')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <span>View Full Timetable</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
