import React from 'react';
import { 
  Megaphone, 
  Plus, 
  ArrowRight, 
  CheckCheck, 
  Clock, 
  Users, 
  AlertCircle 
} from 'lucide-react';
import { SchoolAnnouncement, AppSection } from '../../types';

interface AnnouncementsPanelProps {
  announcements: SchoolAnnouncement[];
  onNavigate: (section: AppSection) => void;
  onOpenCreateAnnouncement: () => void;
  onToggleRead: (id: string) => void;
}

export const AnnouncementsPanel: React.FC<AnnouncementsPanelProps> = ({
  announcements,
  onNavigate,
  onOpenCreateAnnouncement,
  onToggleRead,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Official Announcements</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Published to portal, app & digital boards</p>
            </div>
          </div>

          <button
            onClick={onOpenCreateAnnouncement}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-bold text-xs transition-colors border border-amber-200/60 dark:border-amber-800/50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Broadcast</span>
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-2.5 mt-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
          {announcements.map((ann) => (
            <div 
              key={ann.id}
              className={`p-3 rounded-xl border transition-all ${
                ann.read 
                  ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800' 
                  : 'bg-white dark:bg-slate-800/60 border-amber-200/70 dark:border-amber-900/40 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    ann.priority === 'High'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : ann.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {ann.priority} Priority
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {ann.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ann.time}
                  </span>
                  <button
                    onClick={() => onToggleRead(ann.id)}
                    title={ann.read ? 'Mark as Unread' : 'Mark as Read'}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      ann.read ? 'text-slate-400 hover:text-slate-600' : 'text-emerald-600 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                {ann.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {ann.content}
              </p>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Author: <strong className="font-semibold text-slate-700 dark:text-slate-300">{ann.author}</strong></span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>{ann.audience}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Showing {announcements.length} broadcasts
        </span>
        <button
          onClick={() => onNavigate('announcements')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <span>View All Announcements</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
