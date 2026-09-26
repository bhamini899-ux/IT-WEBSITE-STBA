import React from 'react';
import { 
  CheckSquare, 
  Square, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ListTodo, 
  ArrowUpRight 
} from 'lucide-react';
import { AdminReminder, AppSection } from '../../types';

interface RemindersWidgetProps {
  reminders: AdminReminder[];
  onToggleReminder: (id: string) => void;
  onNavigate: (section: AppSection) => void;
}

export const RemindersWidget: React.FC<RemindersWidgetProps> = ({
  reminders,
  onToggleReminder,
  onNavigate,
}) => {
  const pendingCount = reminders.filter(r => !r.completed).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Administrator Action Reminders</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Time-sensitive approvals & reviews</p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50">
            {pendingCount} Pending
          </span>
        </div>

        {/* Reminders List */}
        <div className="space-y-2 mt-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2.5 ${
                rem.completed
                  ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 opacity-60'
                  : 'bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-2.5 flex-1">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className="mt-0.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer shrink-0"
                >
                  {rem.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                <div className="flex-1">
                  <span className={`text-xs font-bold block ${rem.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {rem.title}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{rem.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {rem.dueTime}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate(rem.targetSection)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
                title="Open Related Section"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Auto-synced with administrative calendar</span>
        <button
          onClick={() => onNavigate('dashboard')}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Check All Items
        </button>
      </div>
    </div>
  );
};
