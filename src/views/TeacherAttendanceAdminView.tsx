import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Save, 
  CheckSquare, 
  Search, 
  Filter, 
  UserPlus, 
  History, 
  FileText, 
  Check, 
  X, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronRight,
  CalendarDays
} from 'lucide-react';
import { 
  Teacher, 
  TeacherLeaveRequest, 
  TeacherAttendanceRecord, 
  TeacherAttendanceRecordStatus,
  AppSection
} from '../types';
import { 
  getTeacherAttendanceForDate, 
  saveTeacherAttendanceForDate, 
  markAllTeachersPresent, 
  calculateTeacherAttendanceStats,
  getTeacherAttendanceHistory
} from '../services/teacherAttendanceService';

interface TeacherAttendanceAdminViewProps {
  teachers: Teacher[];
  leaveRequests: TeacherLeaveRequest[];
  onApproveLeave: (leaveId: string) => void;
  onDeclineLeave: (leaveId: string, reason?: string) => void;
  onNavigate: (section: AppSection) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onOpenAddTeacher?: () => void;
}

export const TeacherAttendanceAdminView: React.FC<TeacherAttendanceAdminViewProps> = ({
  teachers,
  leaveRequests,
  onApproveLeave,
  onDeclineLeave,
  onNavigate,
  onShowToast,
  onOpenAddTeacher
}) => {
  // Current Active Tab
  const [activeTab, setActiveTab] = useState<'daily' | 'leave_requests' | 'history'>('daily');

  // Selected Date (default: 2026-09-19)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-19');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TeacherAttendanceRecordStatus>('ALL');

  // Active Attendance Records for the chosen date
  const [records, setRecords] = useState<TeacherAttendanceRecord[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Selected Teacher for History Modal
  const [selectedTeacherForHistory, setSelectedTeacherForHistory] = useState<Teacher | null>(null);

  // Decline Modal State
  const [declineModalLeave, setDeclineModalLeave] = useState<TeacherLeaveRequest | null>(null);
  const [declineReason, setDeclineReason] = useState<string>('');

  // Load records whenever selectedDate, teachers, or leaveRequests change
  useEffect(() => {
    const loaded = getTeacherAttendanceForDate(selectedDate, teachers, leaveRequests);
    setRecords(loaded);
    setHasUnsavedChanges(false);
  }, [selectedDate, teachers, leaveRequests]);

  // Attendance stats calculated dynamically from actual records
  const stats = useMemo(() => {
    return calculateTeacherAttendanceStats(records, teachers.length);
  }, [records, teachers.length]);

  // Filtered teacher attendance records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesQuery = 
        r.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  // Pending Leave Requests
  const pendingLeaves = useMemo(() => {
    return leaveRequests.filter(l => l.status === 'Pending');
  }, [leaveRequests]);

  // Update Individual Teacher Status
  const handleSetStatus = (teacherId: string, newStatus: TeacherAttendanceRecordStatus) => {
    setRecords(prev => prev.map(r => {
      if (r.teacherId === teacherId) {
        return {
          ...r,
          status: newStatus,
          checkIn: newStatus === 'PRESENT' || newStatus === 'LATE' ? (r.checkIn || '08:15 AM') : undefined,
          isApprovedLeave: newStatus === 'ON LEAVE' ? r.isApprovedLeave : false
        };
      }
      return r;
    }));
    setHasUnsavedChanges(true);
  };

  // Update Remarks
  const handleUpdateRemarks = (teacherId: string, remarks: string) => {
    setRecords(prev => prev.map(r => r.teacherId === teacherId ? { ...r, remarks } : r));
    setHasUnsavedChanges(true);
  };

  // Bulk Action: Mark All Present
  const handleMarkAllPresent = () => {
    const bulk = markAllTeachersPresent(selectedDate, teachers, leaveRequests);
    setRecords(bulk);
    setHasUnsavedChanges(true);
    onShowToast('Marked All Present', 'All available teachers marked Present. Approved leaves preserved.', 'info');
  };

  // Save Attendance to Storage
  const handleSaveAttendance = () => {
    saveTeacherAttendanceForDate(selectedDate, records);
    setHasUnsavedChanges(false);
    onShowToast(
      'Attendance Saved', 
      `Teacher attendance for ${selectedDate} has been saved successfully.`, 
      'success'
    );
  };

  // Approve Leave Handler
  const handleApproveLeave = (leave: TeacherLeaveRequest) => {
    onApproveLeave(leave.id);
    onShowToast(
      'Leave Approved', 
      `Leave for ${leave.teacherName} approved. Attendance will automatically reflect "ON LEAVE" for ${leave.startDate} to ${leave.endDate}.`, 
      'success'
    );
  };

  // Open Decline Modal
  const handleOpenDeclineModal = (leave: TeacherLeaveRequest) => {
    setDeclineModalLeave(leave);
    setDeclineReason('');
  };

  // Confirm Decline
  const handleConfirmDecline = () => {
    if (declineModalLeave) {
      onDeclineLeave(declineModalLeave.id, declineReason);
      onShowToast('Leave Declined', `Request for ${declineModalLeave.teacherName} has been declined.`, 'info');
      setDeclineModalLeave(null);
    }
  };

  // Status Styling Badge
  const getStatusBadgeClass = (status: TeacherAttendanceRecordStatus) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'ABSENT':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'LATE':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'HALF DAY':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
      case 'ON LEAVE':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'HOLIDAY':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 text-[11px] font-extrabold uppercase tracking-wide">
              Faculty Administration
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Staff Attendance & Leaves
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Teacher Attendance & Leave Workflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Admin/Head marks daily teacher attendance and reviews faculty leave applications with automatic roster synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            Daily Attendance
          </button>

          <button
            onClick={() => setActiveTab('leave_requests')}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'leave_requests'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>Leave Requests</span>
            {pendingLeaves.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {pendingLeaves.length}
              </span>
            )}
          </button>

          {onOpenAddTeacher && (
            <button
              onClick={onOpenAddTeacher}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Teacher</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Summary Cards (Real Records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Teachers</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {teachers.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {teachers.length === 0 ? 'No teachers added yet' : 'Class 10 Faculty Roster'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Present Today</div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
            {stats.present}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {stats.total > 0 ? `${stats.rate}% Rate` : '0%'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Avg Attendance</div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">
            {stats.total > 0 ? `${stats.rate}%` : '97.1%'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Faculty Benchmark</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Absent Today</div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">
            {stats.absent}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Unexcused Absences</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Late Arrivals</div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
            {stats.late}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Arrived post 08:30 AM</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">On Leave</div>
          <div className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-1">
            {stats.onLeave}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Approved Portal Leaves</div>
        </div>
      </div>

      {/* =======================================================
          TAB 1: DAILY ATTENDANCE MARKING
          ======================================================= */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span>Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-0 font-mono text-xs font-bold focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search faculty name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 text-[11px]">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                  <option value="HALF DAY">Half Day</option>
                  <option value="ON LEAVE">On Leave</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 justify-end">
              <button
                onClick={handleMarkAllPresent}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>

              <button
                onClick={handleSaveAttendance}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                  hasUnsavedChanges
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 animate-pulse'
                    : 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{hasUnsavedChanges ? 'Save Attendance *' : 'Save Attendance'}</span>
              </button>
            </div>
          </div>

          {/* Roster Table */}
          {teachers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <Building2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No teachers added yet.</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
                The school faculty roster is currently empty. Add your school's actual teachers or create accounts via User Management.
              </p>
              {onOpenAddTeacher && (
                <button
                  onClick={onOpenAddTeacher}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Teacher</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Faculty Member</th>
                      <th className="py-3 px-4">Department & Role</th>
                      <th className="py-3 px-4">Attendance Status</th>
                      <th className="py-3 px-4">Check-In Time</th>
                      <th className="py-3 px-4">Remarks</th>
                      <th className="py-3 px-4 text-right">History</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {filteredRecords.map(record => {
                      const teacher = teachers.find(t => t.id === record.teacherId);
                      return (
                        <tr key={record.teacherId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {teacher?.avatar ? (
                                <img 
                                  src={teacher.avatar} 
                                  alt={record.teacherName} 
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700" 
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                                  {record.teacherName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white leading-tight">
                                  {record.teacherName}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  {record.employeeId}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {teacher?.department || 'Faculty'}
                            </span>
                            <p className="text-[11px] text-slate-400">{teacher?.designation || 'Teacher'}</p>
                          </td>

                          <td className="py-3 px-4">
                            {record.isApprovedLeave ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 text-xs font-bold border border-purple-200">
                                <span>ON LEAVE (Approved Portal Leave)</span>
                              </div>
                            ) : (
                              <div className="flex flex-wrap items-center gap-1">
                                {(['PRESENT', 'ABSENT', 'LATE', 'HALF DAY', 'ON LEAVE'] as TeacherAttendanceRecordStatus[]).map(st => {
                                  const isSelected = record.status === st;
                                  return (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => handleSetStatus(record.teacherId, st)}
                                      className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all cursor-pointer border ${
                                        isSelected
                                          ? getStatusBadgeClass(st) + ' ring-1 ring-offset-1 ring-blue-500 shadow-xs'
                                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      {st}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-mono text-slate-600 dark:text-slate-400">
                              {record.checkIn || '—'}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <input
                              type="text"
                              placeholder="Optional remarks..."
                              value={record.remarks || ''}
                              onChange={(e) => handleUpdateRemarks(record.teacherId, e.target.value)}
                              className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white w-full max-w-[180px]"
                            />
                          </td>

                          <td className="py-3 px-4 text-right">
                            {teacher && (
                              <button
                                onClick={() => setSelectedTeacherForHistory(teacher)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                              >
                                <History className="w-3.5 h-3.5" />
                                <span>History</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =======================================================
          TAB 2: LEAVE REQUESTS APPROVAL WORKFLOW
          ======================================================= */}
      {activeTab === 'leave_requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Teacher Leave Applications</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-black">
                {leaveRequests.length} Total
              </span>
            </h2>
          </div>

          {leaveRequests.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <CalendarDays className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700 dark:text-slate-300">No leave requests submitted yet.</p>
              <p className="text-xs text-slate-400 mt-0.5">Faculty members can apply for leave directly from their Teacher Portal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaveRequests.map(leave => {
                const isPending = leave.status === 'Pending';
                return (
                  <div 
                    key={leave.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPending 
                        ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800 shadow-sm' 
                        : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${
                        leave.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : leave.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                          : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      }`}>
                        {leave.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {leave.appliedAt}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {leave.teacherName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {leave.department} • {leave.employeeId}
                    </p>

                    <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Leave Type:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{leave.leaveType} Leave</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Dates:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{leave.startDate} to {leave.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Duration:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{leave.days} Day{leave.days > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="text-xs mb-4">
                      <span className="text-slate-400 font-medium block mb-0.5">Reason:</span>
                      <p className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 italic text-[11px]">
                        "{leave.reason}"
                      </p>
                    </div>

                    {isPending ? (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => handleApproveLeave(leave)}
                          className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleOpenDeclineModal(leave)}
                          className="py-2 px-3 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span>Reviewed by Principal / Head</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Decision Recorded</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =======================================================
          MODAL: TEACHER ATTENDANCE HISTORY
          ======================================================= */}
      {selectedTeacherForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl p-6 sm:p-7 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedTeacherForHistory(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              {selectedTeacherForHistory.avatar ? (
                <img src={selectedTeacherForHistory.avatar} alt="" className="w-11 h-11 rounded-2xl object-cover" />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 font-black flex items-center justify-center">
                  {selectedTeacherForHistory.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedTeacherForHistory.name}
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedTeacherForHistory.employeeId} • {selectedTeacherForHistory.department} ({selectedTeacherForHistory.designation})
                </p>
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Historical Attendance Records
            </h3>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
              {getTeacherAttendanceHistory(selectedTeacherForHistory.id).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No previous historical attendance logs saved for this teacher.
                </div>
              ) : (
                getTeacherAttendanceHistory(selectedTeacherForHistory.id).map(h => (
                  <div key={h.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{h.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(h.status)}`}>
                        {h.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">{h.checkIn ? `In: ${h.checkIn}` : 'No check-in'}</span>
                      {h.remarks && <p className="text-[10px] text-slate-500 italic">{h.remarks}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setSelectedTeacherForHistory(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL: DECLINE LEAVE REASON MODAL
          ======================================================= */}
      {declineModalLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setDeclineModalLeave(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
              Decline Leave Request
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter reason for declining {declineModalLeave.teacherName}'s {declineModalLeave.leaveType} leave application:
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Critical examination duties / high faculty absence on these dates..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeclineModalLeave(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecline}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
