import React, { useState } from 'react';
import { 
  Activity, 
  UserCheck, 
  Bus, 
  BookOpen, 
  DollarSign, 
  Wrench, 
  ShieldCheck, 
  GraduationCap, 
  Filter, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { SchoolActivityEvent, AppSection } from '../../types';

interface LiveActivityTimelineProps {
  events: SchoolActivityEvent[];
  onNavigate: (section: AppSection) => void;
  onOpenAuditLog?: () => void;
}

export const LiveActivityTimeline: React.FC<LiveActivityTimelineProps> = ({
  events,
  onNavigate,
  onOpenAuditLog,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['All', 'Attendance', 'Transport', 'Library', 'Finance', 'Maintenance', 'Academics', 'Safety'];

  const filteredEvents = selectedFilter === 'All' 
    ? events 
    : events.filter(e => e.category.toLowerCase() === selectedFilter.toLowerCase());

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'attendance':
        return <UserCheck className="w-3.5 h-3.5 text-blue-500" />;
      case 'transport':
        return <Bus className="w-3.5 h-3.5 text-amber-500" />;
      case 'library':
        return <BookOpen className="w-3.5 h-3.5 text-purple-500" />;
      case 'finance':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-500" />;
      case 'maintenance':
        return <Wrench className="w-3.5 h-3.5 text-rose-500" />;
      case 'academics':
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />;
      case 'safety':
        return <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'attendance':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/50';
      case 'transport':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/50';
      case 'library':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/50';
      case 'finance':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/50';
      case 'maintenance':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/50';
      case 'safety':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200/50';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live School Activity Timeline</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Consolidated real-time operational log</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated live • {events.length} events today</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedFilter === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Chronological Timeline */}
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 mt-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
              className="relative group cursor-pointer"
            >
              {/* Timeline Bullet Node */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:border-blue-500 group-hover:scale-110 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 group-hover:bg-blue-600" />
              </div>

              {/* Event Content Box */}
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 font-mono">
                      {event.time}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(event.category)}`}>
                      {getCategoryIcon(event.category)}
                      <span>{event.category}</span>
                    </span>
                  </div>
                  {event.relatedEntityId && (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-800">
                      {event.relatedEntityId}
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1">
                  {event.description}
                </div>

                {event.detail && (
                  <div className={`text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed ${expandedId === event.id ? 'block' : 'line-clamp-1'}`}>
                    {event.detail}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-400">
              No activity records found under this filter for today.
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Showing <strong>{filteredEvents.length}</strong> logged transactions
        </span>
        <button
          onClick={() => onOpenAuditLog ? onOpenAuditLog() : onNavigate('audit_log')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <span>View All Activity & Audit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
