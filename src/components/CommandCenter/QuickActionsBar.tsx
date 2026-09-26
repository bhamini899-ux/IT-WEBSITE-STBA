import React from 'react';
import { 
  UserPlus, 
  GraduationCap, 
  UserCheck, 
  Megaphone, 
  BookOpen, 
  Bus, 
  CalendarPlus, 
  Wrench, 
  FileText, 
  Bot, 
  Play, 
  Sparkles 
} from 'lucide-react';

interface QuickActionsBarProps {
  onAddStudent: () => void;
  onAddTeacher: () => void;
  onMarkAttendance: () => void;
  onCreateAnnouncement: () => void;
  onIssueBook: () => void;
  onAddBus: () => void;
  onCreateEvent: () => void;
  onReportMaintenance: () => void;
  onGenerateReport: () => void;
  onOpenAIAssistant: () => void;
  onStartDemo: () => void;
  isDemoActive?: boolean;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onAddStudent,
  onAddTeacher,
  onMarkAttendance,
  onCreateAnnouncement,
  onIssueBook,
  onAddBus,
  onCreateEvent,
  onReportMaintenance,
  onGenerateReport,
  onOpenAIAssistant,
  onStartDemo,
  isDemoActive = false,
}) => {
  const actions = [
    {
      label: 'Add Student',
      icon: UserPlus,
      color: 'hover:border-blue-400 hover:bg-blue-50/70 text-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/40',
      action: onAddStudent,
    },
    {
      label: 'Add Teacher',
      icon: GraduationCap,
      color: 'hover:border-indigo-400 hover:bg-indigo-50/70 text-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-950/40',
      action: onAddTeacher,
    },
    {
      label: 'Mark Attendance',
      icon: UserCheck,
      color: 'hover:border-emerald-400 hover:bg-emerald-50/70 text-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950/40',
      action: onMarkAttendance,
    },
    {
      label: 'Post Notice',
      icon: Megaphone,
      color: 'hover:border-amber-400 hover:bg-amber-50/70 text-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/40',
      action: onCreateAnnouncement,
    },
    {
      label: 'Issue Book',
      icon: BookOpen,
      color: 'hover:border-purple-400 hover:bg-purple-50/70 text-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/40',
      action: onIssueBook,
    },
    {
      label: 'Add Bus',
      icon: Bus,
      color: 'hover:border-orange-400 hover:bg-orange-50/70 text-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/40',
      action: onAddBus,
    },
    {
      label: 'Create Event',
      icon: CalendarPlus,
      color: 'hover:border-teal-400 hover:bg-teal-50/70 text-teal-700 dark:text-teal-300 dark:hover:bg-teal-950/40',
      action: onCreateEvent,
    },
    {
      label: 'Report Repair',
      icon: Wrench,
      color: 'hover:border-rose-400 hover:bg-rose-50/70 text-rose-700 dark:text-rose-300 dark:hover:bg-rose-950/40',
      action: onReportMaintenance,
    },
    {
      label: 'Daily Report',
      icon: FileText,
      color: 'hover:border-slate-400 hover:bg-slate-100 text-slate-800 dark:text-slate-200 dark:hover:bg-slate-800',
      action: onGenerateReport,
    },
    {
      label: 'AI Copilot',
      icon: Bot,
      color: 'hover:border-indigo-500 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-200 dark:hover:bg-indigo-950/70',
      action: onOpenAIAssistant,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Executive Quick Actions</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              One-Click Dispatch
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Instantly execute operations, trigger simulations, or launch dialogues</p>
        </div>

        {/* Start Demo Simulation Button */}
        <button
          onClick={onStartDemo}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
            isDemoActive
              ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isDemoActive ? 'Demo Simulation Running' : 'Start Live Demo Simulation'}</span>
        </button>
      </div>

      {/* Grid of Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 mt-3.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={act.action}
              className={`p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-2xs ${act.color}`}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-2xs group-hover:scale-110 transition-transform mb-1.5">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold leading-tight line-clamp-1">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
