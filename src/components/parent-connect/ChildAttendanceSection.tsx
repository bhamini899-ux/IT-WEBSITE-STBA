import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Plus, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Send,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ChildProfile, ChildAttendanceDay, ParentLeaveRequest } from '../../types/parentConnect';

interface ChildAttendanceSectionProps {
  child: ChildProfile;
  attendanceDays: ChildAttendanceDay[];
  leaveRequests: ParentLeaveRequest[];
  onSubmitLeaveRequest: (newReq: Omit<ParentLeaveRequest, 'id' | 'appliedDate' | 'status'>) => void;
}

export const ChildAttendanceSection: React.FC<ChildAttendanceSectionProps> = ({
  child,
  attendanceDays,
  leaveRequests,
  onSubmitLeaveRequest,
}) => {
  const [selectedDay, setSelectedDay] = useState<ChildAttendanceDay>(attendanceDays[17] || attendanceDays[0]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Leave Form State
  const [fromDate, setFromDate] = useState('2026-09-22');
  const [toDate, setToDate] = useState('2026-09-22');
  const [leaveReason, setLeaveReason] = useState<ParentLeaveRequest['reason']>('Medical Leave');
  const [leaveExplanation, setLeaveExplanation] = useState('');

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveExplanation.trim()) return;

    onSubmitLeaveRequest({
      childId: child.id,
      fromDate,
      toDate,
      daysCount: 1,
      reason: leaveReason,
      explanation: leaveExplanation.trim(),
    });

    setLeaveExplanation('');
    setIsLeaveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 4 Attendance KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Present Days</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {child.totalPresentDays}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Active session 2026-27
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Absent Days</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {child.totalAbsentDays}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Sanctioned medical leave
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Late Arrivals</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {child.totalLateDays}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Traffic delay waived
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Attendance Rate</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            {child.attendanceRate}%
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Threshold 75% required
          </p>
        </div>
      </div>

      {/* Monthly Attendance Calendar & Selected Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                September 2026 Attendance
              </h4>
            </div>

            {/* Legend indicators */}
            <div className="hidden sm:flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Present
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Absent
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Late
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span> Holiday
              </span>
            </div>
          </div>

          {/* Days of the Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-400 text-xs py-2">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          {/* Monthly Day Grid */}
          <div className="grid grid-cols-7 gap-2">
            {attendanceDays.map((day) => {
              const isSelected = selectedDay.dayNumber === day.dayNumber;
              let bgStyle = 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700';
              let badgeDot = 'bg-slate-400';

              if (day.status === 'present') {
                bgStyle = 'bg-emerald-50/70 hover:bg-emerald-100/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/60';
                badgeDot = 'bg-emerald-500';
              } else if (day.status === 'absent') {
                bgStyle = 'bg-rose-50/80 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800';
                badgeDot = 'bg-rose-500';
              } else if (day.status === 'late') {
                bgStyle = 'bg-amber-50/80 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800';
                badgeDot = 'bg-amber-500';
              } else if (day.status === 'weekend' || day.status === 'holiday') {
                bgStyle = 'bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800';
                badgeDot = 'bg-slate-400';
              }

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-xl p-1 sm:p-2 border flex flex-col items-center justify-between text-xs transition-all cursor-pointer ${bgStyle} ${
                    isSelected ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900 font-bold' : ''
                  }`}
                >
                  <span className="text-xs font-semibold">{day.dayNumber}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${badgeDot}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Selected Day Details
            </span>
            <h5 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {selectedDay.date}
            </h5>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] uppercase ${
                  selectedDay.status === 'present'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : selectedDay.status === 'absent'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : selectedDay.status === 'late'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {selectedDay.status}
                </span>
              </div>

              {selectedDay.checkInTime && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Check-In</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedDay.checkInTime}
                  </span>
                </div>
              )}

              {selectedDay.checkOutTime && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Check-Out</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedDay.checkOutTime}
                  </span>
                </div>
              )}

              {selectedDay.remarks && (
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  <span className="font-bold block text-slate-800 dark:text-slate-200 text-[11px] mb-1">Remarks:</span>
                  <p>{selectedDay.remarks}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leave Requests & Sanction History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Leave Requests & Sanctions
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official absence applications submitted by parents
            </p>
          </div>

          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply For Leave</span>
          </button>
        </div>

        <div className="space-y-3">
          {leaveRequests.filter(r => r.childId === child.id).map((req) => (
            <div 
              key={req.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {req.reason}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {req.fromDate} to {req.toDate} ({req.daysCount} Day{req.daysCount > 1 ? 's' : ''})
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">
                  "{req.explanation}"
                </p>
                {req.reviewRemarks && (
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{req.reviewedBy}: {req.reviewRemarks}</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                  req.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : req.status === 'Pending'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                }`}>
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Application Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Leave Application
              </h4>
              <button 
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Child Enrolled
                </label>
                <input 
                  type="text" 
                  disabled 
                  value={`${child.name} — Class ${child.className}`} 
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Absence
                </label>
                <select
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value as ParentLeaveRequest['reason'])}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Medical Leave">Medical Leave / Sick Rest</option>
                  <option value="Family Function">Family Function / Ceremony</option>
                  <option value="Outstation Travel">Outstation Travel</option>
                  <option value="Personal Emergency">Personal Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Explanation / Doctor's Note
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide details for the Class Teacher and Principal's review..."
                  value={leaveExplanation}
                  onChange={(e) => setLeaveExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Class Teacher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
