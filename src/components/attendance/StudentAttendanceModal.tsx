import React from 'react';
import { 
  X, 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  ShieldAlert, 
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles
} from 'lucide-react';
import { SmartAttendanceStudent } from '../../data/attendanceData';
import { AttendanceStatus } from '../../types';

interface StudentAttendanceModalProps {
  student: SmartAttendanceStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (studentId: string, status: AttendanceStatus) => void;
  onNotifyParent: (student: SmartAttendanceStudent) => void;
}

export const StudentAttendanceModal: React.FC<StudentAttendanceModalProps> = ({
  student,
  isOpen,
  onClose,
  onUpdateStatus,
  onNotifyParent,
}) => {
  if (!isOpen || !student) return null;

  const currentStatus = (student.todayStatus || '').toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base shadow-xs ${
              currentStatus === 'present'
                ? 'bg-emerald-100 text-emerald-800'
                : currentStatus === 'absent'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {student.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Class {student.className}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Roll No: #{student.rollNo} • Admission: {student.admissionNo} • {student.gender === 'M' ? 'Male' : 'Female'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Low Attendance Notice Banner if < 75% */}
          {student.attendancePercentage < 75 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Low Attendance Alert (&lt; 75%)</span>
                <span>{student.attentionReason || 'Current academic attendance is below the mandatory 75% minimum threshold.'}</span>
              </div>
            </div>
          )}

          {/* Today's Status & Action Box */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Today's Recorded Status (17 Sep 2026)
              </span>
              <span className="text-xs font-mono text-slate-500">
                Check-in: {student.checkInTime}
              </span>
            </div>

            {/* Status change buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateStatus(student.id, 'present')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentStatus === 'present'
                    ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Present</span>
              </button>

              <button
                onClick={() => onUpdateStatus(student.id, 'absent')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentStatus === 'absent'
                    ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-300'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                }`}
              >
                <UserX className="w-4 h-4" />
                <span>Absent</span>
              </button>

              <button
                onClick={() => onUpdateStatus(student.id, 'late')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  currentStatus === 'late'
                    ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Late</span>
              </button>
            </div>
          </div>

          {/* Monthly & Term Attendance Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Monthly % */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block">Monthly Rate</span>
              <span className={`text-xl font-extrabold mt-1 block ${
                student.monthlyPercentage >= 90
                  ? 'text-emerald-600'
                  : student.monthlyPercentage >= 75
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}>
                {student.monthlyPercentage.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500">September 2026</span>
            </div>

            {/* Total Present Days */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block">Present Days</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-1 block">
                {student.presentDays}
              </span>
              <span className="text-[10px] text-slate-500">Days attended</span>
            </div>

            {/* Total Absent Days */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block">Absent Days</span>
              <span className="text-xl font-extrabold text-rose-600 mt-1 block">
                {student.absentDays}
              </span>
              <span className="text-[10px] text-slate-500">Missed days</span>
            </div>

            {/* Late Arrivals */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block">Late Arrivals</span>
              <span className="text-xl font-extrabold text-amber-600 mt-1 block">
                {student.lateDays}
              </span>
              <span className="text-[10px] text-slate-500">Late check-ins</span>
            </div>
          </div>

          {/* Attendance Trend (Last 7 Days) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Attendance Trend (Past 7 School Days)
              </span>
              <span className="text-[11px] text-slate-400">Chronological history</span>
            </div>

            <div className="flex items-center justify-between gap-1 sm:gap-2">
              {student.recentTrend.map((statusBadge, idx) => {
                const dayLabels = ['11 Sep', '12 Sep', '13 Sep', '15 Sep', '16 Sep', '17 Sep', 'Today'];
                return (
                  <div key={idx} className="flex-1 text-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-xl flex items-center justify-center font-bold text-xs ${
                      statusBadge === 'P'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : statusBadge === 'A'
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : 'bg-amber-100 text-amber-700 border border-amber-300'
                    }`}>
                      {statusBadge}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block truncate">
                      {dayLabels[idx]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> P = Present
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> A = Absent
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> L = Late
              </span>
            </div>
          </div>

          {/* Guardian & Parent Contact info */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Guardian Details & Last Absence
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Guardian Name:</span>
                <span className="font-bold text-slate-800">{student.guardianName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Guardian Phone:</span>
                <span className="font-bold text-slate-800">{student.guardianPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email Address:</span>
                <span className="font-medium text-slate-700">{student.guardianEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Last Recorded Absence:</span>
                <span className="font-semibold text-rose-600">{student.lastAbsence}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => onNotifyParent(student)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Trigger Parent Notification Event</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
