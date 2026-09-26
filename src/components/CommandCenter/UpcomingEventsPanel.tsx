import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  ArrowRight,
  Trophy,
  BookOpen,
  FlaskConical,
  GraduationCap
} from 'lucide-react';
import { SchoolEvent, AppSection } from '../../types';

interface UpcomingEventsPanelProps {
  events: SchoolEvent[];
  onNavigate: (section: AppSection) => void;
  onOpenAddEvent: () => void;
}

export const UpcomingEventsPanel: React.FC<UpcomingEventsPanelProps> = ({
  events,
  onNavigate,
  onOpenAddEvent,
}) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Sports':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'Academic':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'Exhibition':
        return <FlaskConical className="w-4 h-4 text-emerald-500" />;
      case 'Workshop':
      default:
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming School Events</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Academic & campus calendar schedule</p>
            </div>
          </div>

          <button
            onClick={onOpenAddEvent}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-bold text-xs transition-colors border border-purple-200/60 dark:border-purple-800/50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Events Cards */}
        <div className="space-y-2.5 mt-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {events.map((evt) => (
            <div 
              key={evt.id}
              className="p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-xs border border-slate-200/60 dark:border-slate-600 shrink-0">
                    {getEventIcon(evt.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {evt.name}
                    </h4>
                    <span className="inline-block text-[10px] font-semibold text-purple-700 dark:text-purple-400 bg-purple-100/60 dark:bg-purple-950/50 px-2 py-0.5 rounded-md mt-0.5">
                      {evt.type}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {evt.date}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="flex items-center gap-1 truncate">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{evt.time}</span>
                </span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </span>
              </div>

              {evt.registeredCount !== undefined && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>Registered: <strong>{evt.registeredCount}</strong> participants</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Showing 4 upcoming campus fixtures
        </span>
        <button
          onClick={() => onNavigate('calendar')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <span>View Master Calendar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
