import React from 'react';
import { 
  Wrench, 
  Plus, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User 
} from 'lucide-react';
import { MaintenanceIssue, AppSection } from '../../types';

interface MaintenancePanelProps {
  issues: MaintenanceIssue[];
  onNavigate: (section: AppSection) => void;
  onOpenReportIssue: () => void;
}

export const MaintenancePanel: React.FC<MaintenancePanelProps> = ({
  issues,
  onNavigate,
  onOpenReportIssue,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Campus Facility & Maintenance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Equipment servicing & breakdown tickets</p>
            </div>
          </div>

          <button
            onClick={onOpenReportIssue}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bold text-xs transition-colors border border-rose-200/60 dark:border-rose-800/50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Issue</span>
          </button>
        </div>

        {/* 4 Status Counters */}
        <div className="grid grid-cols-4 gap-2 my-3 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Open</span>
            <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">12</div>
          </div>
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40">
            <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold uppercase">Critical</span>
            <div className="text-base font-extrabold text-rose-700 dark:text-rose-300 mt-0.5">1</div>
          </div>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
            <span className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold uppercase">In Progress</span>
            <div className="text-base font-extrabold text-blue-700 dark:text-blue-300 mt-0.5">5</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">Completed</span>
            <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">8</div>
          </div>
        </div>

        {/* Active Issues List */}
        <div className="space-y-2 mt-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {issues.map((issue) => (
            <div 
              key={issue.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{issue.room}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-700 dark:text-slate-300">{issue.equipment}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {issue.assignedTechnician || 'Unassigned'}
                  </span>
                  {issue.estimatedFixTime && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {issue.estimatedFixTime}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  issue.priority === 'Critical'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : issue.priority === 'High'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {issue.priority}
                </span>
                <div className="text-[10px] font-semibold text-slate-500 mt-0.5">{issue.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Average resolution SLA: <strong>1.4 hrs</strong>
        </span>
        <button
          onClick={() => onNavigate('maintenance')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <span>View Maintenance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
