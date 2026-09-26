import React from 'react';
import { X, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, MapPin, UserCheck } from 'lucide-react';
import { TimetableConflict, TimetableSlot } from '../../types';

interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: TimetableConflict | null;
  onAutoResolve: (conflict: TimetableConflict) => void;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  isOpen,
  onClose,
  conflict,
  onAutoResolve
}) => {
  if (!isOpen || !conflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/60 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-md bg-rose-200/80 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px] font-bold uppercase tracking-wider">
                {conflict.severity} Severity Alert
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                Timetable Conflict Detected
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Issue Description:</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              {conflict.description}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
            <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Intelligent Resolution:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {conflict.suggestedResolution}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Review Later
          </button>

          <button
            onClick={() => {
              onAutoResolve(conflict);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply AI Resolution</span>
          </button>
        </div>
      </div>
    </div>
  );
};
