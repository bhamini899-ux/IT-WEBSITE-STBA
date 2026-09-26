import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  Building,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { ACADEMIC_CALENDAR_EVENTS } from '../../data/academicData';
import { AcademicCalendarEvent } from '../../types';

export const AcademicCalendarView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<AcademicCalendarEvent | null>(null);

  const categories = [
    { key: 'all', label: 'All Events' },
    { key: 'Exam', label: 'Examinations' },
    { key: 'Unit Test', label: 'Unit Tests' },
    { key: 'Assignment', label: 'Assignment Deadlines' },
    { key: 'Parent Meeting', label: 'PTM' },
    { key: 'Results Publication', label: 'Results Publication' },
    { key: 'Academic Event', label: 'Academic Events' }
  ];

  const filteredEvents = ACADEMIC_CALENDAR_EVENTS.filter(e => 
    selectedCategory === 'all' || e.type === selectedCategory || e.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Academic Master Calendar — September 2026
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Session 2026-27
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official timeline for term assessments, submission windows, results publication and parent-teacher conferences.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => setSelectedEvent(evt)}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0 bg-blue-600" 
                  />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {evt.type || evt.category} • {evt.classes ? evt.classes.join(', ') : evt.classTarget}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {evt.date}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                {evt.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {evt.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{evt.time}</span>
              </div>
              {evt.venue && (
                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.venue}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Popover/Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {selectedEvent.type || selectedEvent.category} • {selectedEvent.classes ? selectedEvent.classes.join(', ') : selectedEvent.classTarget}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Scheduled Date:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedEvent.date}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Slot Timing:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedEvent.time}</strong>
                </div>
                {selectedEvent.venue && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Location / Venue:</span>
                    <strong className="text-slate-900 dark:text-white">{selectedEvent.venue}</strong>
                  </div>
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
