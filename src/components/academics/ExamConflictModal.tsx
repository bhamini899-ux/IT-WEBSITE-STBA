import React from 'react';
import { X, AlertTriangle, CheckCircle2, Building, Clock, UserCheck } from 'lucide-react';
import { ExamConflictItem } from '../../types';

interface ExamConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: ExamConflictItem[];
  onResolve: (conflictId: string) => void;
  onReassignRoom: (conflictId: string) => void;
  onChangeTime: (conflictId: string) => void;
}

export const ExamConflictModal: React.FC<ExamConflictModalProps> = ({
  isOpen,
  onClose,
  conflicts,
  onResolve,
  onReassignRoom,
  onChangeTime
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Smart Examination Conflict Detection
              </h3>
              <p className="text-xs text-slate-500">
                Automated collision inspector for rooms, teachers and batches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflicts List */}
        <div className="mt-4 space-y-3.5">
          {conflicts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">All Examination Conflicts Resolved!</p>
              <p className="text-xs text-slate-500 mt-0.5">No room, faculty or timetable clashes detected across the schedule.</p>
            </div>
          ) : (
            conflicts.map((conf) => (
              <div
                key={conf.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        conf.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {conf.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {conf.examTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
                      ⚠ {conf.description}
                    </p>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
                      Suggested Fix: {conf.suggestedAction}
                    </p>
                  </div>
                </div>

                {/* Conflict Action Buttons */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end gap-2 text-xs">
                  {conf.type === 'room_clash' || conf.type === 'capacity_issue' ? (
                    <button
                      id={`btn-reassign-room-${conf.id}`}
                      onClick={() => onReassignRoom(conf.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>Reassign Room</span>
                    </button>
                  ) : (
                    <button
                      id={`btn-change-time-${conf.id}`}
                      onClick={() => onChangeTime(conf.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Change Time</span>
                    </button>
                  )}

                  <button
                    id={`btn-resolve-conflict-${conf.id}`}
                    onClick={() => onResolve(conf.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
