import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Award, 
  BarChart3, 
  ShieldCheck, 
  UserCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Teacher, TimetableSlot, TeacherLeaveRequest, TeacherTask, TeacherActivityLog } from '../../types';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  timetableSlots?: TimetableSlot[];
  leaveRequests?: TeacherLeaveRequest[];
  tasks?: TeacherTask[];
  activities?: TeacherActivityLog[];
  onOpenTimetable?: (teacherId: string) => void;
  onAssignSubstitute?: (teacher: Teacher) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  teacher,
  timetableSlots = [],
  leaveRequests = [],
  tasks = [],
  activities = [],
  onOpenTimetable,
  onAssignSubstitute
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'workload' | 'leaves' | 'tasks' | 'activity'>('overview');

  if (!isOpen || !teacher) return null;

  const teacherSlots = timetableSlots.filter(s => s.teacherId === teacher.id || s.substituteTeacherId === teacher.id);
  const teacherLeaves = leaveRequests.filter(l => l.teacherId === teacher.id);
  const teacherTasks = tasks.filter(t => t.teacherId === teacher.id);
  const teacherActivities = activities.filter(a => a.teacherId === teacher.id);

  const getStatusBadge = (status: Teacher['currentStatus']) => {
    switch (status) {
      case 'Present':
      case 'Free':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Currently Teaching':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800 animate-pulse';
      case 'Absent':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'On Leave':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img 
                src={teacher.avatar} 
                alt={teacher.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                teacher.currentStatus === 'Absent' ? 'bg-rose-500' :
                teacher.currentStatus === 'On Leave' ? 'bg-amber-500' :
                teacher.currentStatus === 'Currently Teaching' ? 'bg-blue-500' : 'bg-emerald-500'
              }`} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {teacher.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(teacher.currentStatus)}`}>
                  {teacher.currentStatus}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800">
                  {teacher.employeeId}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
                {teacher.designation} • {teacher.department} Department
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {teacher.room}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {teacher.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {teacher.phone}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Overview & Schedule
          </button>
          <button
            onClick={() => setActiveTab('workload')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'workload'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Workload & Metrics
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'leaves'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Leaves & Attendance ({teacher.attendanceRate}%)
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Tasks & Duties ({teacherTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'activity'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Activity Timeline
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Weekly Workload</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {teacher.workloadWeekly} <span className="text-xs font-medium text-slate-400">/ {teacher.maxWorkloadWeekly} periods</span>
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Attendance Rate</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {teacher.attendanceRate}%
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Experience</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {teacher.experienceYears} <span className="text-xs font-medium text-slate-400">years</span>
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Leave Balance</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {teacher.leaveBalance.totalAvailable} <span className="text-xs font-medium text-slate-400">days</span>
                  </p>
                </div>
              </div>

              {/* Teaching Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    Academic Credentials & Subjects
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-500">Qualification:</span>{' '}
                      <span className="text-slate-800 dark:text-slate-200">{teacher.qualification}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Joined School:</span>{' '}
                      <span className="text-slate-800 dark:text-slate-200">{teacher.joiningDate}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Subjects Taught:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {teacher.subjects.map((sub, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-[11px] border border-blue-200 dark:border-blue-800">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Assigned Classes:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {teacher.classes.map((cls, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px]">
                            Class {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    Today's Real-time Schedule
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Current Period (Period 3):</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {teacher.currentPeriod ? `Teaching Period ${teacher.currentPeriod}` : 'Free Period (Available in Staff Room)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Next Period (Period 4):</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {teacher.nextPeriod ? `Period ${teacher.nextPeriod} Scheduled` : 'Free / Preparation'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Free Periods Today:</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        {teacher.freePeriodsToday.length > 0 ? (
                          teacher.freePeriodsToday.map(p => (
                            <span key={p} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                              Period {p}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">No free periods remaining</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timetable Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Assigned Timetable Slots (Monday Schedule)
                  </h3>
                  {onOpenTimetable && (
                    <button
                      onClick={() => onOpenTimetable(teacher.id)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Open Full Timetable <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {teacherSlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {teacherSlots.map(slot => (
                      <div key={slot.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold text-xs">
                            Period {slot.periodNumber}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">{slot.timeRange}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{slot.subject}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Class {slot.className} • {slot.room}</p>
                        </div>
                        {slot.isSubstituted && (
                          <span className="mt-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                            Substituted by {slot.substituteTeacherName}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-3">No specific slots scheduled for this day.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Weekly Teaching Quota</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {teacher.workloadWeekly} of {teacher.maxWorkloadWeekly} periods ({Math.round((teacher.workloadWeekly / teacher.maxWorkloadWeekly) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      teacher.workloadWeekly >= 28 ? 'bg-rose-500' :
                      teacher.workloadWeekly >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (teacher.workloadWeekly / teacher.maxWorkloadWeekly) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {teacher.workloadWeekly >= 26 
                    ? '⚠️ High Workload: System flags teacher as busy to preserve instructional stamina and avoid burn-out.' 
                    : 'Balanced teaching load: Teacher is eligible for priority emergency substitution duty when needed.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500">Max Consecutive Periods</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {teacher.consecutivePeriodsMax || 2} <span className="text-xs font-normal text-slate-400">periods</span>
                  </p>
                  <p className="text-[11px] text-emerald-600 mt-1">Within CBSE guidelines</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500">Monthly Substitutions Taken</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    4 <span className="text-xs font-normal text-slate-400">periods</span>
                  </p>
                  <p className="text-[11px] text-blue-600 mt-1">Recognized contributor</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500">Department Rank</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    Top 10%
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Based on student feedback</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div className="space-y-6">
              {/* Balances Card */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Leave Balances (Academic Session 2026-2027)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Casual Leave</p>
                    <p className="text-xl font-black text-blue-900 dark:text-blue-100 mt-1">{teacher.leaveBalance.casual}</p>
                    <p className="text-[10px] text-blue-500">days left</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Sick Leave</p>
                    <p className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-1">{teacher.leaveBalance.sick}</p>
                    <p className="text-[10px] text-emerald-500">days left</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Emergency</p>
                    <p className="text-xl font-black text-amber-900 dark:text-amber-100 mt-1">{teacher.leaveBalance.emergency}</p>
                    <p className="text-[10px] text-amber-500">days left</p>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Official Duty</p>
                    <p className="text-xl font-black text-indigo-900 dark:text-indigo-100 mt-1">{teacher.leaveBalance.officialDuty}</p>
                    <p className="text-[10px] text-indigo-500">days left</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
                    <p className="text-xs font-bold opacity-80">Total Available</p>
                    <p className="text-xl font-black mt-1">{teacher.leaveBalance.totalAvailable}</p>
                    <p className="text-[10px] opacity-75">total days</p>
                  </div>
                </div>
              </div>

              {/* Leave Requests Log */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Leave Request History</h3>
                {teacherLeaves.length > 0 ? (
                  <div className="space-y-2">
                    {teacherLeaves.map(lv => (
                      <div key={lv.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{lv.leaveType} Leave ({lv.days} day{lv.days > 1 ? 's' : ''})</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lv.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              lv.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {lv.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{lv.startDate} to {lv.endDate} • Reason: {lv.reason}</p>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">{lv.appliedAt}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-2">No recent leave requests recorded.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Assigned Academic Tasks & Deadlines
              </h3>
              {teacherTasks.length > 0 ? (
                <div className="space-y-2">
                  {teacherTasks.map(t => (
                    <div key={t.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">{t.title}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            t.priority === 'High' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            t.priority === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {t.priority} Priority
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Category: {t.category} • Deadline: {t.deadline}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-3">All assigned academic tasks are up to date.</p>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Live Faculty Activity Feed
              </h3>
              {teacherActivities.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
                  {teacherActivities.map(act => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-400">{act.time}</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{act.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-3">Standard morning RFID check-in logged.</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Seth Tolaram Bafna Academy • Faculty Registry
          </div>

          <div className="flex items-center gap-2">
            {onAssignSubstitute && teacher.currentStatus !== 'Absent' && (
              <button
                onClick={() => {
                  onAssignSubstitute(teacher);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Assign As Substitute
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
