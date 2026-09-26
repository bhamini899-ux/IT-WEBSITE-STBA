import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  UserX,
  Building2,
  Calendar,
  Phone
} from 'lucide-react';
import { Student } from '../../types';

interface RemoveStudentConfirmModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRemove: (studentId: string, reason: string, tcNumber?: string, remarks?: string, archiveRecord?: boolean) => void;
}

export const RemoveStudentConfirmModal: React.FC<RemoveStudentConfirmModalProps> = ({
  student,
  isOpen,
  onClose,
  onConfirmRemove,
}) => {
  const [reason, setReason] = useState('Transfer Certificate (TC) Issued / Relocated');
  const [tcNumber, setTcNumber] = useState(`TC-STBA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [remarks, setRemarks] = useState('');
  const [archiveRecord, setArchiveRecord] = useState(true);
  const [confirmNameInput, setConfirmNameInput] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRemoving) return;
    setIsRemoving(true);
    onConfirmRemove(student.id, reason, tcNumber, remarks, archiveRecord);
    setTimeout(() => {
      setIsRemoving(false);
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/50 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-rose-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>Remove Student from Roster</span>
              </h3>
              <p className="text-[11px] text-rose-200/80">
                Seth Tolaram Bafna Academy • Administrative De-enrollment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-rose-200 hover:text-white hover:bg-rose-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-rose-900 dark:text-rose-200 text-xs">
                Permanent Roster Removal Warning
              </p>
              <p className="text-rose-700 dark:text-rose-300 text-[11px] leading-relaxed">
                Removing this student immediately withdraws them from active roll calls, deallocates their assigned bus seat, releases library reservations, and deactivates their student and parent portal accounts.
              </p>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-slate-600 dark:text-slate-300 text-sm">
                    {student.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                    {student.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                    Class {student.className}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  ID: {student.id} {student.rollNo ? `• Roll #${student.rollNo}` : ''} {student.admissionNo ? `• Adm #${student.admissionNo}` : ''}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Guardian</span>
                <span className="font-semibold">{student.guardianName || 'Parent / Guardian'}</span>
                {student.guardianPhone && (
                  <span className="block text-[10px] font-mono text-slate-400">{student.guardianPhone}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Attendance</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {student.attendancePercentage}% ({student.academicStatus || 'Good Standing'})
                </span>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Official Removal / Withdrawal Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold cursor-pointer"
            >
              <option value="Transfer Certificate (TC) Issued / Relocated">Transfer Certificate (TC) Issued / Family Relocated</option>
              <option value="Withdrawn by Parent / Guardian">Withdrawn by Parent / Guardian</option>
              <option value="Course Completion / Graduated">Course Completion / Graduated Secondary Level</option>
              <option value="Disciplinary Withdrawal">Disciplinary / Administrative Sanction</option>
              <option value="Non-Payment of Dues / Abandoned Enrollment">Non-Payment of Dues / Abandoned Enrollment</option>
              <option value="Duplicate Record / System Clean-up">Duplicate Entry / Database Clean-up</option>
              <option value="Other">Other Specific Reason</option>
            </select>
          </div>

          {/* Transfer Certificate Number if TC selected */}
          {reason.includes('Transfer Certificate') && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Transfer Certificate (TC) Docket Number
              </label>
              <input
                type="text"
                value={tcNumber}
                onChange={(e) => setTcNumber(e.target.value)}
                placeholder="e.g., TC-STBA-2026-104"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-semibold"
              />
            </div>
          )}

          {/* Remarks */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Administrative Remarks / Record Note
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g., All library books returned; clearance slip verified by Registrar."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Archive option */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <input
              type="checkbox"
              id="archiveRecord"
              checked={archiveRecord}
              onChange={(e) => setArchiveRecord(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <label htmlFor="archiveRecord" className="text-slate-700 dark:text-slate-300 text-[11px] font-semibold cursor-pointer">
              Preserve comprehensive snapshot in Academy Audit Log (recommended for regulatory compliance)
            </label>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRemoving}
              className={`min-h-[44px] px-5 py-2 rounded-xl text-white font-extrabold shadow-md transition-all flex items-center gap-2 ${
                isRemoving
                  ? 'bg-rose-400 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20 cursor-pointer'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{isRemoving ? 'Removing from Roster...' : 'Confirm & Remove Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
