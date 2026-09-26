import React from 'react';
import { X, Trash2, AlertTriangle, Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';
import { TimetableSlot } from '../../types';

interface DeleteSlotConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimetableSlot | null;
  onConfirmDelete: (slotId: string) => void;
}

export const DeleteSlotConfirmModal: React.FC<DeleteSlotConfirmModalProps> = ({
  isOpen,
  onClose,
  slot,
  onConfirmDelete
}) => {
  if (!isOpen || !slot) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-rose-50/70 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-md bg-rose-200/80 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px] font-bold uppercase tracking-wider">
                Action Required
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                Delete Timetable Slot
              </h3>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to permanently remove this period from the schedule? The slot will revert to an open/free period for the class and faculty.
          </p>

          {/* Slot Details Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-black">
                  Period {slot.periodNumber}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {slot.day}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {slot.timeRange}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Subject:</span>
                <span className="font-black text-slate-900 dark:text-white">{slot.subject}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Faculty:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{slot.teacherName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Class & Room:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Class {slot.className} • {slot.room}</span>
              </div>

              {slot.isSubstituted && (
                <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  Substituted by <strong className="font-bold">{slot.substituteTeacherName}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirmDelete(slot.id)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Slot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
