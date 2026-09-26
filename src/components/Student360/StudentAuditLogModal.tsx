import React from 'react';
import { X, ShieldCheck, Clock, UserCheck, AlertCircle } from 'lucide-react';
import { StudentAuditLogItem } from '../../types';

interface StudentAuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: StudentAuditLogItem[];
}

export const StudentAuditLogModal: React.FC<StudentAuditLogModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[75vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-black">Student Operations Audit Trail & Compliance</h3>
              <p className="text-xs text-slate-400">Institutional Governance & Role-Based Action Ledger</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50 dark:bg-slate-950/50 text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs">{log.action}</span>
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {log.timestamp}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">{log.details}</p>
              <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 mt-2">
                <span className="font-medium text-slate-500">Student: <strong className="text-slate-700 dark:text-slate-300">{log.studentName}</strong> ({log.studentId})</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">By: {log.user}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
