import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Award, 
  FileText, 
  CreditCard, 
  Bell, 
  LogOut, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Download,
  GraduationCap,
  Sparkles,
  Receipt,
  Check,
  CheckSquare,
  X,
  Filter,
  Search,
  RotateCcw,
  Send,
  CheckCircle,
  ChevronRight,
  ClipboardCheck,
  FileCheck
} from 'lucide-react';
import { Student, UserAccount, TimetableSlot, TimetableDay } from '../types';
import { ConnectedExaminationManager } from '../components/academics/ConnectedExaminationManager';
import { SchoolNotificationCenter } from '../components/notifications/SchoolNotificationCenter';
import { NotificationBellDrawer } from '../components/notifications/NotificationBellDrawer';
import { 
  getSchoolExams, 
  getStudentFees, 
  getStudentAttendanceHistory, 
  getHomeworkForClass, 
  toggleStudentHomeworkSubmission,
  SchoolHomeworkItem,
  StudentDailyAttendanceRecord,
  normalizeClass
} from '../services/schoolDataHub';

interface StudentPortalProps {
  currentUser: UserAccount;
  students: Student[];
  timetableSlots: TimetableSlot[];
  onLogout: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  students,
  timetableSlots,
  onLogout,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'profile' | 'attendance' | 'timetable' | 'marks' | 'assignments' | 'fees' | 'notices'
  >('dashboard');

  // Match the active student record
  const currentStudent: Student = students.find(
    s => s.id === currentUser.studentId || s.name.toLowerCase() === currentUser.name.toLowerCase()
  ) || {
    id: currentUser.studentId || 'STU-10A-01',
    name: currentUser.name || 'AASTHA',
    className: currentUser.className || '10-A',
    class: '10',
    section: currentUser.section || 'A',
    rollNumber: currentUser.rollNo || 1,
    rollNo: currentUser.rollNo || 1,
    gender: 'F',
    bloodGroup: 'Not Provided',
    dob: 'Not Provided',
    fatherName: 'Not Provided',
    motherName: 'Not Provided',
    parentContact: 'Not Provided',
    parentEmail: 'Not Provided',
    address: 'Bikaner, Rajasthan',
    admissionDate: 'Session 2026-2027',
    attendancePercentage: 95.0,
    academicStatus: 'Distinction',
    feeStatus: 'Paid',
    totalFeesDue: 0,
    tags: ['Class 10 Roster'],
    avatar: currentUser.avatar || 'https://ui-avatars.com/api/?name=AASTHA&background=0284c7&color=ffffff&bold=true',
    emergencyContact: 'Not Provided',
    todayStatus: 'present',
    lastAbsence: 'None',
    guardianName: 'Not Provided',
    guardianPhone: 'Not Provided'
  };

  const studentClassName = currentStudent.className || currentStudent.class || '10';
  const studentSection = currentStudent.section || 'B';

  // =========================================================================
  // REAL ATTENDANCE HISTORY
  // =========================================================================
  const [attendanceMonth, setAttendanceMonth] = useState<string>('All');
  const attendanceData = useMemo(() => {
    return getStudentAttendanceHistory(
      currentStudent.id, 
      attendanceMonth === 'All' ? undefined : attendanceMonth
    );
  }, [currentStudent.id, attendanceMonth]);

  // =========================================================================
  // REAL HOMEWORK & ASSIGNMENTS
  // =========================================================================
  const [homeworkVersion, setHomeworkVersion] = useState(0);
  const [hwFilter, setHwFilter] = useState<'All' | 'Pending' | 'Submitted'>('All');
  
  const classHomeworkList = useMemo(() => {
    return getHomeworkForClass(studentClassName, studentSection);
  }, [studentClassName, studentSection, homeworkVersion]);

  const pendingHomeworkCount = useMemo(() => {
    return classHomeworkList.filter(
      h => !h.submissions.some(s => s.studentId === currentStudent.id)
    ).length;
  }, [classHomeworkList, currentStudent.id]);

  const handleToggleSubmission = (hw: SchoolHomeworkItem) => {
    const isNowSubmitted = toggleStudentHomeworkSubmission(hw.id, currentStudent.id, currentStudent.name);
    setHomeworkVersion(v => v + 1);
    if (isNowSubmitted) {
      onShowToast('Homework Submitted', `Submitted "${hw.title}". Your teacher has received your work.`, 'success');
    } else {
      onShowToast('Submission Reopened', `Marked "${hw.title}" back as pending.`, 'info');
    }
  };

  // =========================================================================
  // CLASS TIMETABLE
  // =========================================================================
  const weekdayNames: TimetableDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<TimetableDay>(() => {
    const dayIndex = new Date().getDay(); // 0 is Sunday
    if (dayIndex === 0) return 'Monday';
    return weekdayNames[dayIndex - 1] || 'Monday';
  });

  const daySchedule = useMemo(() => {
    const targetNormalized = normalizeClass(studentClassName, studentSection);
    return timetableSlots.filter(s => 
      s.day === selectedTimetableDay && 
      normalizeClass(s.className) === targetNormalized
    ).sort((a, b) => a.periodNumber - b.periodNumber);
  }, [timetableSlots, selectedTimetableDay, studentClassName, studentSection]);

  // Mock Marks
  const marksData = [
    { subject: 'Mathematics', maxMarks: 100, scoredMarks: 94, grade: 'A1', remarks: 'Excellent logical aptitude' },
    { subject: 'Science (Physics/Chem/Bio)', maxMarks: 100, scoredMarks: 91, grade: 'A1', remarks: 'Strong experimental grasp' },
    { subject: 'English Language & Lit', maxMarks: 100, scoredMarks: 88, grade: 'A2', remarks: 'Very good comprehension' },
    { subject: 'Social Science', maxMarks: 100, scoredMarks: 86, grade: 'A2', remarks: 'Consistent answers' },
    { subject: 'Hindi Course A', maxMarks: 100, scoredMarks: 90, grade: 'A1', remarks: 'Good creative writing' },
    { subject: 'Artificial Intelligence', maxMarks: 50, scoredMarks: 48, grade: 'A1', remarks: 'Outstanding project' }
  ];

  // Mock Assignments
  const assignments = [
    { id: 'ASG-1', title: 'Quadratic Equations Exercise 4.3', subject: 'Mathematics', dueDate: '2026-09-22', status: 'Submitted' },
    { id: 'ASG-2', title: 'Ray Optics Ray Diagrams Lab Report', subject: 'Science', dueDate: '2026-09-24', status: 'Pending' },
    { id: 'ASG-3', title: 'Essay: The Role of Sustainable Energy', subject: 'English', dueDate: '2026-09-26', status: 'Pending' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Seth Tolaram Bafna Academy
                </h1>
                <span className="px-2 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase">
                  Student Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentStudent.name} • Class {currentStudent.class}-{currentStudent.section} (Roll #{currentStudent.rollNumber})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBellDrawer 
              currentUser={currentUser} 
              onViewAll={() => setActiveTab('notices')} 
            />

            <button
              id="student-logout-btn"
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
          {[
            { id: 'dashboard', label: 'My Dashboard', icon: GraduationCap },
            { id: 'profile', label: 'Student Profile', icon: User },
            { id: 'attendance', label: 'My Attendance', icon: Clock },
            { id: 'timetable', label: 'Class Timetable', icon: Calendar },
            { id: 'marks', label: 'Report Card & Marks', icon: Award },
            { id: 'assignments', label: 'Homework & Tasks', icon: FileText, badge: pendingHomeworkCount > 0 ? pendingHomeworkCount : undefined },
            { id: 'fees', label: 'Fee Invoices', icon: CreditCard },
            { id: 'notices', label: 'School Notices', icon: Bell }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink md:w-full ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 md:bg-transparent md:dark:bg-transparent border border-slate-200/60 dark:border-slate-800 md:border-0 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {Boolean(tab.badge) && (
                  <span className="ml-2 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg relative overflow-hidden">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase">
                  Welcome to Your Student Portal
                </span>
                <h2 className="text-2xl font-black mt-2">
                  Hello, {currentStudent.name}
                </h2>
                <p className="text-xs text-emerald-100 mt-1">
                  Class {studentClassName}-{studentSection} • Roll #{currentStudent.rollNumber} • Admission #{currentStudent.id}
                </p>
              </div>

              {/* Top Stats */}
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
                    {attendanceData.presentCount} of {attendanceData.totalWorkingDays} Working Days
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('marks')}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-blue-500 transition-all"
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Academic Status</span>
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="text-xl font-black text-blue-600 mt-1">
                    {currentStudent.academicStatus || 'Distinction'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Class {studentClassName}-{studentSection} Rank #3</div>
                </div>

                <div 
                  onClick={() => setActiveTab('assignments')}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-amber-500 transition-all"
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Pending Tasks</span>
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="text-xl font-black text-amber-600 mt-1">
                    {pendingHomeworkCount} Tasks
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {pendingHomeworkCount > 0 ? 'Action required' : 'All up to date'}
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('fees')}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-teal-500 transition-all"
                >
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Fee Clearance</span>
                    <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="text-xl font-black text-teal-600 mt-1">
                    {currentStudent.feeStatus || 'Paid'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">No overdue balance</div>
                </div>
              </div>

              {/* Quick Action Widget: Homework & Class Schedule Snippet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pending Homework Quick List */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Class Homework ({classHomeworkList.length})</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('assignments')}
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {classHomeworkList.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No homework assignments published currently.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {classHomeworkList.slice(0, 3).map(hw => {
                        const isDone = hw.submissions.some(s => s.studentId === currentStudent.id);
                        return (
                          <div 
                            key={hw.id}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-extrabold text-slate-900 dark:text-white block truncate">
                                {hw.title}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {hw.subject} • Due: {hw.dueDate}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleSubmission(hw)}
                              className={`min-h-[36px] px-3 py-1 rounded-xl text-[11px] font-black cursor-pointer transition-colors shrink-0 ${
                                isDone 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 hover:bg-emerald-600 hover:text-white'
                              }`}
                            >
                              {isDone ? 'Submitted ✓' : 'Mark Done'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Today's Timetable Snippet */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{selectedTimetableDay}'s Classes</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('timetable')}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      <span>Full Schedule</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {daySchedule.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No classes scheduled for {selectedTimetableDay}.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {daySchedule.slice(0, 3).map(slot => (
                        <div 
                          key={slot.id}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                Period {slot.periodNumber}: {slot.subject}
                              </span>
                              {slot.isSubstituted && (
                                <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                                  Sub
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {slot.teacherName} • {slot.room}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-500 shrink-0">
                            {slot.timeRange}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Report Card Preview */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Term 1 Examination Scores</span>
                  </h3>
                  <span className="text-xs text-slate-400">Academic Year 2026-27</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                        <th className="py-2 px-3">Subject</th>
                        <th className="py-2 px-3">Max Marks</th>
                        <th className="py-2 px-3">Scored Marks</th>
                        <th className="py-2 px-3">Grade</th>
                        <th className="py-2 px-3">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {marksData.map(m => (
                        <tr key={m.subject}>
                          <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{m.subject}</td>
                          <td className="py-2 px-3 font-mono text-slate-500">{m.maxMarks}</td>
                          <td className="py-2 px-3 font-mono font-black text-emerald-600">{m.scoredMarks}</td>
                          <td className="py-2 px-3 font-bold">{m.grade}</td>
                          <td className="py-2 px-3 text-slate-500 italic text-[11px]">{m.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img src={currentStudent.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500" />
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{currentStudent.name}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Student ID: {currentStudent.id} • Class {currentStudent.class}-{currentStudent.section}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                    Roll #{currentStudent.rollNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                  <span className="text-slate-400 block mb-1">Father's Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentStudent.fatherName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                  <span className="text-slate-400 block mb-1">Mother's Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentStudent.motherName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                  <span className="text-slate-400 block mb-1">Parent Contact</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentStudent.parentContact}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                  <span className="text-slate-400 block mb-1">Residential Address</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentStudent.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* Marks & Examinations Tab */}
          {activeTab === 'marks' && (
            <div className="space-y-6">
              <ConnectedExaminationManager
                currentUser={currentUser}
                students={students}
                onShowToast={onShowToast}
                readOnlyStudentView={true}
              />

              {/* Personal Report Card Summary */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Official Term 1 Academic Transcript</span>
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
                        <th className="py-2.5 px-3">Remarks</th>
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

          {/* School Notices Tab */}
          {activeTab === 'notices' && (
            <SchoolNotificationCenter
              currentUser={currentUser}
              onShowToast={onShowToast}
            />
          )}

          {/* Fee Invoices Tab */}
          {activeTab === 'fees' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span>Tuition & Transportation Fee Account</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official billing records for Academic Year 2026-27
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
                    <Receipt className="w-4 h-4 text-emerald-600" />
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

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <span>Official Attendance Register</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Seth Tolaram Bafna Academy • Class {studentClassName}-{studentSection} (Roll #{currentStudent.rollNumber})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Filter Month:</span>
                    <select
                      value={attendanceMonth}
                      onChange={(e) => setAttendanceMonth(e.target.value)}
                      className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200"
                    >
                      <option value="All">All Months (2026-27)</option>
                      <option value="2026-09">September 2026</option>
                      <option value="2026-08">August 2026</option>
                      <option value="2026-07">July 2026</option>
                    </select>
                  </div>
                </div>

                {/* Attendance Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      Attendance Rate
                    </span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">
                      {attendanceData.percentage}%
                    </div>
                    <span className="text-[10px] text-emerald-600/80">CBSE Minimum: 75%</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Working Days
                    </span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {attendanceData.totalWorkingDays}
                    </div>
                    <span className="text-[10px] text-slate-400">Official instruction days</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Days Present
                    </span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">
                      {attendanceData.presentCount}
                    </div>
                    <span className="text-[10px] text-slate-400">Classes attended</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Days Absent
                    </span>
                    <div className="text-2xl font-black text-rose-600 mt-1">
                      {attendanceData.absentCount}
                    </div>
                    <span className="text-[10px] text-slate-400">Excused & Unexcused</span>
                  </div>
                </div>

                {/* Today's Status Banner */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      Today's Verification Status:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black uppercase text-[10px]">
                      Present
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    Recorded by Class Teacher • Gate Entry at 08:05 AM
                  </span>
                </div>

                {/* Subject-Wise Attendance Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Subject-Wise Attendance Breakdown</span>
                    </h3>
                    <span className="text-[11px] text-slate-400">Current Semester Progress</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { subject: 'Mathematics', attended: 40, total: 42, faculty: 'Rajesh Sharma', room: 'Room 204' },
                      { subject: 'Science (Physics/Chem/Bio)', attended: 37, total: 40, faculty: 'Krishna Sharma', room: 'Science Lab 2' },
                      { subject: 'English Language & Lit', attended: 36, total: 38, faculty: 'Priya Nair', room: 'Room 108' },
                      { subject: 'Social Science', attended: 32, total: 35, faculty: 'Vikram Joshi', room: 'Room 202' },
                      { subject: 'Computer Science & AI', attended: 29, total: 30, faculty: 'Neha Agarwal', room: 'Computer Lab 1' },
                      { subject: 'Hindi Course A', attended: 33, total: 35, faculty: 'Suman Jain', room: 'Room 104' },
                    ].map(subj => {
                      const pct = Math.round((subj.attended / subj.total) * 100);
                      const isHigh = pct >= 90;
                      return (
                        <div key={subj.subject} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs space-y-2.5">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">{subj.subject}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">{subj.faculty} • {subj.room}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isHigh ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'}`}>
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200/70 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                              style={{ width: `${pct}%` }} 
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>Attended: <strong className="text-slate-800 dark:text-slate-200">{subj.attended}</strong> / {subj.total} classes</span>
                            <span className={pct >= 75 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                              {pct >= 75 ? 'Eligible ✓' : 'Shortage ⚠'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Records Table */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Daily Log History
                  </h3>

                  {attendanceData.records.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                      No attendance entries recorded for this filter.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 uppercase">
                            <th className="py-2.5 px-3.5">Date</th>
                            <th className="py-2.5 px-3.5">Status</th>
                            <th className="py-2.5 px-3.5">Check-In Time</th>
                            <th className="py-2.5 px-3.5">Recorded By</th>
                            <th className="py-2.5 px-3.5">Remarks</th>
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
                                  {rec.remarks || 'Biometric verified'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Homework & Tasks Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span>Class Assignments & Homework</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Published coursework for Class {studentClassName}-{studentSection}
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

                {/* Homework Cards List */}
                <div className="space-y-3.5">
                  {classHomeworkList
                    .filter(hw => {
                      const isDone = hw.submissions.some(s => s.studentId === currentStudent.id);
                      if (hwFilter === 'Pending') return !isDone;
                      if (hwFilter === 'Submitted') return isDone;
                      return true;
                    })
                    .map(hw => {
                      const isDone = hw.submissions.some(s => s.studentId === currentStudent.id);
                      const mySubmission = hw.submissions.find(s => s.studentId === currentStudent.id);

                      return (
                        <div
                          key={hw.id}
                          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 shadow-2xs space-y-3 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
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
                                {hw.submissions.length} classmate(s) submitted
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-xs">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Submitted {mySubmission?.submittedAt ? `on ${mySubmission.submittedAt}` : ''}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                                  <Clock className="w-4 h-4" />
                                  <span>Submission Pending</span>
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleSubmission(hw)}
                              className={`min-h-[44px] px-5 py-2 rounded-2xl text-xs font-black cursor-pointer transition-all flex items-center gap-2 ${
                                isDone
                                  ? 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-300'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
                              }`}
                            >
                              {isDone ? (
                                <>
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Revert Submission</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Mark as Submitted</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {classHomeworkList.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                      No assignments found for Class {studentClassName}-{studentSection}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timetable Tab */}
          {activeTab === 'timetable' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <span>Class Timetable & Daily Schedule</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Weekly period schedule for Class {studentClassName}-{studentSection}
                    </p>
                  </div>
                </div>

                {/* Day of Week Selector */}
                <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                  {weekdayNames.map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedTimetableDay(day)}
                      className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all ${
                        selectedTimetableDay === day
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Periods List */}
                <div className="space-y-3">
                  {daySchedule.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                      No scheduled periods on {selectedTimetableDay}.
                    </div>
                  ) : (
                    daySchedule.map(slot => (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-sm shrink-0">
                            P{slot.periodNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                {slot.subject}
                              </h4>
                              {slot.isSubstituted && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black uppercase">
                                  Substituted: {slot.substituteTeacherName}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Faculty: {slot.teacherName} • Location: {slot.room}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center font-mono text-xs font-bold text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{slot.timeRange}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
