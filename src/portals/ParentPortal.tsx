import React, { useState, useMemo, useEffect } from 'react';
import { 
  HeartHandshake, 
  BookOpen, 
  Clock, 
  Award, 
  CreditCard, 
  Bus, 
  Bell, 
  LogOut, 
  User, 
  CheckCircle2, 
  MessageSquare,
  AlertCircle,
  FileText,
  CheckCircle,
  Phone,
  MapPin,
  ShieldCheck,
  Send,
  Calendar,
  Receipt,
  FileCheck,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Student, UserAccount, BusRoute } from '../types';
import { SchoolNotificationCenter } from '../components/notifications/SchoolNotificationCenter';
import { NotificationBellDrawer } from '../components/notifications/NotificationBellDrawer';
import { 
  getStudentAttendanceHistory, 
  getHomeworkForClass,
  SchoolHomeworkItem,
  StudentDailyAttendanceRecord
} from '../services/schoolDataHub';

interface ParentPortalProps {
  currentUser: UserAccount;
  students: Student[];
  onLogout: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  currentUser,
  students,
  onLogout,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'attendance' | 'homework' | 'academics' | 'fees' | 'transport' | 'messages' | 'notices'
  >('dashboard');

  // Strictly linked children for this parent account (authoritative from userService and central data)
  const linkedStudentIds = useMemo(() => currentUser.linkedStudentIds || [], [currentUser.linkedStudentIds]);
  const myChildren = useMemo(() => {
    return students.filter(s => linkedStudentIds.includes(s.id));
  }, [students, linkedStudentIds]);

  const [selectedChildId, setSelectedChildId] = useState<string>(() => myChildren[0]?.id || '');

  // Keep selected child ID synced if children list changes
  useEffect(() => {
    if (myChildren.length > 0 && (!selectedChildId || !myChildren.some(c => c.id === selectedChildId))) {
      setSelectedChildId(myChildren[0].id);
    }
  }, [myChildren, selectedChildId]);

  const activeChild = myChildren.find(c => c.id === selectedChildId) || myChildren[0] || null;

  const childClassName = activeChild?.className || activeChild?.class || '10';
  const childSection = activeChild?.section || 'A';

  // =========================================================================
  // REAL ATTENDANCE DATA FOR ACTIVE WARD
  // =========================================================================
  const [attendanceMonth, setAttendanceMonth] = useState<string>('All');
  const attendanceData = useMemo(() => {
    if (!activeChild) return { records: [], totalWorkingDays: 0, presentCount: 0, absentCount: 0, percentage: 0 };
    return getStudentAttendanceHistory(
      activeChild.id, 
      attendanceMonth === 'All' ? undefined : attendanceMonth
    );
  }, [activeChild, attendanceMonth]);

  // Leave note submission state
  const [leaveType, setLeaveType] = useState('Medical Leave');
  const [leaveDate, setLeaveDate] = useState('2026-09-25');
  const [leaveReason, setLeaveReason] = useState('');

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) {
      onShowToast('Missing Reason', 'Please provide a brief reason for the leave.', 'warning');
      return;
    }
    onShowToast('Leave Request Submitted', `Authorized leave note for ${activeChild.name} submitted to Class Teacher.`, 'success');
    setLeaveReason('');
  };

  // =========================================================================
  // REAL HOMEWORK DATA FOR ACTIVE WARD
  // =========================================================================
  const [hwFilter, setHwFilter] = useState<'All' | 'Pending' | 'Submitted'>('All');
  const childHomeworkList = useMemo(() => {
    return getHomeworkForClass(childClassName, childSection);
  }, [childClassName, childSection]);

  const pendingHomeworkCount = useMemo(() => {
    if (!activeChild) return 0;
    return childHomeworkList.filter(
      h => !h.submissions.some(s => s.studentId === activeChild.id)
    ).length;
  }, [childHomeworkList, activeChild]);

  // =========================================================================
  // MESSAGES TO TEACHER
  // =========================================================================
  const [parentMessage, setParentMessage] = useState('');
  const [messageLogs, setMessageLogs] = useState([
    {
      id: 'msg-1',
      sender: 'Mr. Rajesh Sharma (Class 10-B Faculty)',
      timestamp: 'Yesterday at 04:30 PM',
      text: `Hello ${currentUser.name}, Aarav showed remarkable clarity in solving Quadratic Equations today. Keep encouraging his regular revision.`,
      isTeacher: true
    },
    {
      id: 'msg-2',
      sender: currentUser.name,
      timestamp: 'Yesterday at 05:15 PM',
      text: 'Thank you Mr. Sharma! We are monitoring his study hours at home and ensuring he completes assignments on time.',
      isTeacher: false
    }
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!parentMessage.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: currentUser.name,
      timestamp: 'Just now',
      text: parentMessage.trim(),
      isTeacher: false
    };
    setMessageLogs(prev => [...prev, newMsg]);
    setParentMessage('');
    onShowToast('Inquiry Delivered', 'Your note has been sent to Class Teacher Mr. Rajesh Sharma.', 'success');
  };

  // Marks data for ward
  const marksData = [
    { subject: 'Mathematics', maxMarks: 100, scoredMarks: 94, grade: 'A1', remarks: 'Exceptional algebraic logic' },
    { subject: 'Science (Physics/Chem/Bio)', maxMarks: 100, scoredMarks: 91, grade: 'A1', remarks: 'Good practical accuracy' },
    { subject: 'English Language & Lit', maxMarks: 100, scoredMarks: 88, grade: 'A2', remarks: 'Strong essay writing' },
    { subject: 'Social Science', maxMarks: 100, scoredMarks: 86, grade: 'A2', remarks: 'Consistent answers' },
    { subject: 'Hindi Course A', maxMarks: 100, scoredMarks: 90, grade: 'A1', remarks: 'Very expressive' },
    { subject: 'Artificial Intelligence', maxMarks: 50, scoredMarks: 48, grade: 'A1', remarks: 'Top project score' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/25">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Seth Tolaram Bafna Academy
                </h1>
                <span className="px-2 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase">
                  Parent Connect
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Guardian: {currentUser.name} • Monitoring {activeChild.name} (Class {childClassName}-{childSection})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBellDrawer 
              currentUser={currentUser} 
              onViewAll={() => setActiveTab('notices')} 
            />

            <button
              id="parent-logout-btn"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Left Sub-Navigation */}
        <aside className="w-full md:w-56 shrink-0 flex md:flex-col overflow-x-auto no-scrollbar gap-1.5 pb-2 md:pb-0">
          {/* Ward Switcher */}
          {myChildren.length > 1 && (
            <div className="mb-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 md:w-full">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Select Ward
              </label>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              >
                {myChildren.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.class}-{c.section})</option>
                ))}
              </select>
            </div>
          )}

          {[
            { id: 'dashboard', label: 'Ward Overview', icon: BookOpen },
            { id: 'attendance', label: 'Daily Attendance', icon: Clock },
            { id: 'homework', label: 'Homework Tracking', icon: FileText, badge: pendingHomeworkCount > 0 ? pendingHomeworkCount : undefined },
            { id: 'academics', label: 'Marks & Progress', icon: Award },
            { id: 'fees', label: 'Fee Receipts', icon: CreditCard },
            { id: 'transport', label: 'School Bus GPS', icon: Bus },
            { id: 'messages', label: 'Teacher Connect', icon: MessageSquare },
            { id: 'notices', label: 'School Circulars', icon: Bell }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink md:w-full ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/20'
                    : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 md:bg-transparent md:dark:bg-transparent border border-slate-200/60 dark:border-slate-800 md:border-0 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {Boolean(tab.badge) && (
                  <span className="ml-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {!activeChild ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3 my-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Student Linked</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active student record is currently linked to your parent profile ({currentUser.name}). Once the school administrator links your child to this account, their academic dossiers, attendance records, homework, and transport updates will appear here automatically.
              </p>
            </div>
          ) : (
            <>
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg relative overflow-hidden">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase">
                  Parent Connect Dashboard
                </span>
                <h2 className="text-2xl font-black mt-2">
                  Welcome, {currentUser.name}
                </h2>
                <p className="text-xs text-amber-100 mt-1">
                  Tracking live academic, attendance, and coursework updates for {activeChild.name} (Class {childClassName}-{childSection} • Roll #{activeChild.rollNumber}).
                </p>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div 
                  onClick={() => setActiveTab('attendance')}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-emerald-500 transition-all"
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Attendance</span>
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-xl font-black text-emerald-600 mt-1">
                    {attendanceData.percentage}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {attendanceData.presentCount} of {attendanceData.totalWorkingDays} Days Present
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('homework')}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-amber-500 transition-all"
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Homework</span>
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="text-xl font-black text-amber-600 mt-1">
                    {pendingHomeworkCount} Pending
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {childHomeworkList.length} Total Assigned
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('academics')}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-blue-500 transition-all"
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Academic Grade</span>
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="text-xl font-black text-blue-600 mt-1">
                    A1 Grade
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{activeChild.academicStatus || 'Distinction'}</div>
                </div>

                <div 
                  onClick={() => setActiveTab('fees')}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-teal-500 transition-all"
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Fee Account</span>
                    <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="text-xl font-black text-teal-600 mt-1">
                    {activeChild.feeStatus || 'Paid'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">No overdue fees</div>
                </div>
              </div>

              {/* Quick Communication Box */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span>Direct Communication with Class Teacher</span>
                  </h3>
                  <span className="text-xs text-slate-400">Class {childClassName}-{childSection} Faculty: Rajesh Sharma</span>
                </div>
                <p className="text-xs text-slate-500">
                  You can send direct inquiries regarding academic progress or leave notifications directly to your child's educator.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={parentMessage}
                    onChange={(e) => setParentMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                    placeholder="Type a message or inquiry for Mr. Rajesh Sharma..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Note</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Daily Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span>{activeChild.name}'s Attendance Record</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Seth Tolaram Bafna Academy • Class {childClassName}-{childSection} (Roll #{activeChild.rollNumber})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Filter Month:</span>
                    <select
                      value={attendanceMonth}
                      onChange={(e) => setAttendanceMonth(e.target.value)}
                      className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    >
                      <option value="All">All Months (2026-27)</option>
                      <option value="2026-09">September 2026</option>
                      <option value="2026-08">August 2026</option>
                      <option value="2026-07">July 2026</option>
                    </select>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                      Attendance Rate
                    </span>
                    <div className="text-2xl font-black text-amber-600 mt-1">
                      {attendanceData.percentage}%
                    </div>
                    <span className="text-[10px] text-amber-700/80">Regular status</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Working Days
                    </span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {attendanceData.totalWorkingDays}
                    </div>
                    <span className="text-[10px] text-slate-400">Total sessions</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Days Present
                    </span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">
                      {attendanceData.presentCount}
                    </div>
                    <span className="text-[10px] text-slate-400">Attended classes</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Days Absent
                    </span>
                    <div className="text-2xl font-black text-rose-600 mt-1">
                      {attendanceData.absentCount}
                    </div>
                    <span className="text-[10px] text-slate-400">Leave / Sickness</span>
                  </div>
                </div>

                {/* Today's Verification Status */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-emerald-900 dark:text-emerald-200">
                      Today's Verification Status:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase">
                      Present at School
                    </span>
                  </div>
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium text-[11px]">
                    Check-in: 08:05 AM • Verified by Class Teacher Rajesh Sharma
                  </span>
                </div>

                {/* Attendance Logs Table */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Attendance History
                  </h3>

                  {attendanceData.records.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                      No attendance records found for this period.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 uppercase">
                            <th className="py-2.5 px-3.5">Date</th>
                            <th className="py-2.5 px-3.5">Status</th>
                            <th className="py-2.5 px-3.5">Check-In</th>
                            <th className="py-2.5 px-3.5">Marked By</th>
                            <th className="py-2.5 px-3.5">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                          {attendanceData.records.map((rec) => {
                            let badgeStyle = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                            if (rec.status === 'absent') badgeStyle = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
                            if (rec.status === 'late') badgeStyle = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                            if (rec.status === 'half_day') badgeStyle = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';

                            return (
                              <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white">
                                  {rec.date}
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${badgeStyle}`}>
                                    {rec.status.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3.5 font-mono text-slate-500">
                                  {rec.checkInTime || '08:05 AM'}
                                </td>
                                <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300 font-semibold">
                                  {rec.recordedByTeacherName || 'Rajesh Sharma'}
                                </td>
                                <td className="py-2.5 px-3.5 text-slate-400 italic text-[11px]">
                                  {rec.remarks || 'Biometric scan verified'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Submit Absence / Leave Note Form */}
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Submit Leave Application / Medical Excuse Note</span>
                  </h3>
                  <form onSubmit={handleApplyLeave} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                        Leave Type
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold"
                      >
                        <option value="Medical Leave">Medical Leave (Doctor's Note)</option>
                        <option value="Family Function">Family Event / Function</option>
                        <option value="Personal Emergency">Personal Emergency</option>
                        <option value="Other">Other Reason</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                        Date of Absence
                      </label>
                      <input
                        type="date"
                        value={leaveDate}
                        onChange={(e) => setLeaveDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                        Reason Details
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g., Viral fever / Doctor visit"
                          value={leaveReason}
                          onChange={(e) => setLeaveReason(e.target.value)}
                          className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                        <button
                          type="submit"
                          className="min-h-[44px] px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          Submit Note
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Homework Tracking Tab */}
          {activeTab === 'homework' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <span>{activeChild.name}'s Homework & Tasks</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Track assigned work for Class {childClassName}-{childSection}
                    </p>
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                    {(['All', 'Pending', 'Submitted'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setHwFilter(f)}
                        className={`min-h-[36px] px-3.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          hwFilter === f
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Homework Cards */}
                <div className="space-y-3.5">
                  {childHomeworkList
                    .filter(hw => {
                      const isDone = hw.submissions.some(s => s.studentId === activeChild.id);
                      if (hwFilter === 'Pending') return !isDone;
                      if (hwFilter === 'Submitted') return isDone;
                      return true;
                    })
                    .map(hw => {
                      const isDone = hw.submissions.some(s => s.studentId === activeChild.id);
                      const mySubmission = hw.submissions.find(s => s.studentId === activeChild.id);

                      return (
                        <div
                          key={hw.id}
                          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 shadow-2xs space-y-3 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] uppercase">
                                  {hw.subject}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Assigned by {hw.teacherName}
                                </span>
                              </div>
                              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                {hw.title}
                              </h3>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                                {hw.instructions}
                              </p>
                            </div>

                            <div className="flex flex-col sm:items-end gap-1 shrink-0">
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-slate-400 font-medium">Due Date:</span>
                                <span className="font-extrabold font-mono text-slate-900 dark:text-white">
                                  {hw.dueDate}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                Assigned: {hw.assignedDate}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Submitted by {activeChild.name} {mySubmission?.submittedAt ? `(${mySubmission.submittedAt})` : ''}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                                  <Clock className="w-4 h-4" />
                                  <span>Pending Submission</span>
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] text-slate-400">
                              {hw.submissions.length} student(s) in class completed
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  {childHomeworkList.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                      No homework assigned for Class {childClassName}-{childSection}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Academics & Marks Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>{activeChild.name}'s Term 1 Academic Transcript</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Seth Tolaram Bafna Academy • Board Affiliation Code: 1730026
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    Result: Passed (Distinction)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3">Max Marks</th>
                        <th className="py-2.5 px-3">Scored Marks</th>
                        <th className="py-2.5 px-3">Percentage</th>
                        <th className="py-2.5 px-3">Grade</th>
                        <th className="py-2.5 px-3">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {marksData.map(m => (
                        <tr key={m.subject}>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{m.subject}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{m.maxMarks}</td>
                          <td className="py-2.5 px-3 font-mono font-black text-emerald-600">{m.scoredMarks}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                            {((m.scoredMarks / m.maxMarks) * 100).toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{m.grade}</td>
                          <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">{m.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-xs bg-slate-50 dark:bg-slate-800/50">
                        <td className="py-3 px-3 uppercase text-slate-700 dark:text-slate-200">Aggregate Total</td>
                        <td className="py-3 px-3 font-mono">550</td>
                        <td className="py-3 px-3 font-mono text-emerald-600 font-black">507</td>
                        <td className="py-3 px-3 font-mono text-emerald-600 font-black">92.2%</td>
                        <td className="py-3 px-3 text-emerald-700">A1</td>
                        <td className="py-3 px-3 text-slate-500">Overall Grade: Outstanding</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === 'fees' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span>Tuition & Transportation Fee Account</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official billing records for {activeChild.name} (AY 2026-27)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                  Status: All Dues Cleared
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Billed</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹45,000</div>
                  <span className="text-[10px] text-slate-400">Terms 1 & 2 Combined</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Paid</span>
                  <div className="text-xl font-black text-emerald-600 mt-1">₹45,000</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">100% Remitted</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Outstanding Balance</span>
                  <div className="text-xl font-black text-slate-400 mt-1">₹0.00</div>
                  <span className="text-[10px] text-slate-400">No overdue balance</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Receipt #REC-2026-0982 (Term 1 Fee)</span>
                      <span className="block text-[10px] text-slate-400">Paid on 10 July 2026 via NetBanking</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-600">₹22,500 (PAID)</span>
                </div>
              </div>
            </div>
          )}

          {/* School Bus GPS Tab */}
          {activeTab === 'transport' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bus className="w-5 h-5 text-amber-600" />
                    <span>School Bus Commute & GPS Tracking</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live transit updates for {activeChild.name}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>GPS Connected</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Bus Details
                  </span>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Route #4 (Subhash Nagar - Campus)
                  </div>
                  <div className="text-slate-500">
                    Bus Registration: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">RJ-07-PA-2024</span>
                  </div>
                  <div className="text-slate-500">
                    Morning Pickup: <span className="font-bold text-slate-700 dark:text-slate-200">07:35 AM</span> • Dropoff: <span className="font-bold text-slate-700 dark:text-slate-200">02:25 PM</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Driver & Attendant
                  </span>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Mr. Sumer Singh (Authorized Driver)
                  </div>
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Emergency Contact: +91 94141 12345</span>
                  </div>
                  <div className="text-slate-500">
                    Speed limit compliant & CCTV enabled
                  </div>
                </div>
              </div>

              {/* Map Placeholder Graphic */}
              <div className="p-8 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                <MapPin className="w-8 h-8 text-amber-600 mx-auto animate-bounce" />
                <div className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                  Bus Route #4 is currently on campus (Safe Arrival Recorded at 07:55 AM)
                </div>
                <p className="text-[11px] text-slate-400">
                  Next departure for return route is scheduled at 02:00 PM.
                </p>
              </div>
            </div>
          )}

          {/* Teacher Connect / Messages Tab */}
          {activeTab === 'messages' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    <span>Faculty Messages & Progress Inquiries</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Direct communication with Class 10-B Faculty Mr. Rajesh Sharma
                  </p>
                </div>
              </div>

              {/* Conversation Stream */}
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {messageLogs.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl text-xs space-y-1 ${
                      msg.isTeacher
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 mr-8'
                        : 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 ml-8'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  value={parentMessage}
                  onChange={(e) => setParentMessage(e.target.value)}
                  placeholder="Type your message or query..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* School Circulars & Notices */}
          {activeTab === 'notices' && (
            <SchoolNotificationCenter
              currentUser={currentUser}
              onShowToast={onShowToast}
            />
          )}
          </>
          )}
        </main>
      </div>
    </div>
  );
};

