import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Teacher } from '../../types';

interface DeleteTeacherConfirmModalProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const DeleteTeacherConfirmModal: React.FC<DeleteTeacherConfirmModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !teacher) return null;

  return (
    <div 
      id="delete-teacher-confirm-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        id="delete-teacher-confirm-card"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete this teacher?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This teacher will be removed from the teacher directory.
              </p>

              {/* Teacher snippet preview */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                <img 
                  src={teacher.avatar} 
                  alt={teacher.name} 
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {teacher.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {teacher.designation} • {teacher.subjects?.[0] || 'Faculty'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="btn-cancel-delete-teacher"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              id="btn-confirm-delete-teacher"
              onClick={onConfirmDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
