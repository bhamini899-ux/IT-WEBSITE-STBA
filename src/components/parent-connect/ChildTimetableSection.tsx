import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  CheckCircle2,
  Coffee
} from 'lucide-react';
import { DayTimetable, ChildProfile } from '../../types/parentConnect';

interface ChildTimetableSectionProps {
  child: ChildProfile;
  weeklyTimetable: DayTimetable[];
}

export const ChildTimetableSection: React.FC<ChildTimetableSectionProps> = ({
  child,
  weeklyTimetable,
}) => {
  const [selectedDayName, setSelectedDayName] = useState<DayTimetable['day']>('Friday');

  const days: DayTimetable['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const activeDaySchedule = weeklyTimetable.find(d => d.day === selectedDayName) || weeklyTimetable[0];

  return (
    <div className="space-y-6">
      {/* Timetable Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Smart Academic Timetable
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Class {child.className}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official class period schedule, teacher assignments, and laboratory room allocations
          </p>
        </div>

        {/* Live Ongoing Period Tag */}
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <div className="text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
              Current Period
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              Period 5: Physics (Room 302)
            </span>
          </div>
        </div>
      </div>

      {/* Weekday Selector Tabs (Horizontal scroll on mobile) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {days.map((day) => {
          const isSelected = selectedDayName === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDayName(day)}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Periods Schedule Timeline / List */}
      <div className="space-y-3">
        {activeDaySchedule ? (
          activeDaySchedule.periods.map((period) => (
            <div
              key={period.periodNumber}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                period.isBreak
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50'
                  : period.isCurrent
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600 shadow-sm ring-1 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Period Number and Time Slot */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    period.isBreak
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                      : period.isCurrent
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}>
                    {period.isBreak ? <Coffee className="w-5 h-5" /> : `P${period.periodNumber}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {period.subject}
                      </h4>
                      {period.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white">
                          In Session
                        </span>
                      )}
                      {period.isBreak && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          Recess
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-medium">{period.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Faculty & Room Allocation */}
                {!period.isBreak && (
                  <div className="flex items-center flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">{period.teacher}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{period.room}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs bg-white dark:bg-slate-900 rounded-2xl border">
            No periods scheduled for this day.
          </div>
        )}
      </div>
    </div>
  );
};
