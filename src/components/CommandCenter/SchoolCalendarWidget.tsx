import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { AppSection } from '../../types';
import { CALENDAR_HIGHLIGHT_DATES } from '../../data/initialData';

interface SchoolCalendarWidgetProps {
  onNavigate: (section: AppSection) => void;
}

export const SchoolCalendarWidget: React.FC<SchoolCalendarWidgetProps> = ({
  onNavigate,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(18);

  const daysInMonth = 30; // September has 30 days
  const startDayOffset = 1; // e.g. Starts on Tuesday

  const currentHighlight = CALENDAR_HIGHLIGHT_DATES.find(d => d.date === selectedDay);

  const daysGrid = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Calendar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">September 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setSelectedDay(Math.min(30, selectedDay + 1))}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day Name Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase py-2">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Empty offset days for start of month */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="h-7 w-7" />
          ))}

          {daysGrid.map((day) => {
            const highlight = CALENDAR_HIGHLIGHT_DATES.find(d => d.date === day);
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-7 w-7 mx-auto rounded-lg flex flex-col items-center justify-center font-semibold transition-all relative cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{day}</span>
                {highlight && !isSelected && (
                  <span className={`w-1 h-1 rounded-full ${highlight.color} -mt-0.5`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Exams
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Sports
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> PTMs
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Events
          </span>
        </div>

        {/* Selected Date Details Box */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>Sep {selectedDay}, 2026</span>
            {currentHighlight && (
              <span className={`text-[10px] px-2 py-0.5 rounded text-white font-bold ${currentHighlight.color}`}>
                {currentHighlight.type}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
            {currentHighlight ? currentHighlight.label : 'Regular instructional day. Normal timetable in session.'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">Term 1 Schedule</span>
        <button
          onClick={() => onNavigate('calendar')}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          <span>Open Full Calendar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
