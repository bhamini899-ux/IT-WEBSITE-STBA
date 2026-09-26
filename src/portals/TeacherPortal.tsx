import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Bell, 
  LogOut, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Plus, 
  X, 
  CalendarDays,
  Send,
  Building2,
  Mail,
  Phone,
  Briefcase,
  Award,
  Search,
  Filter,
  Check,
  Save,
  CheckSquare,
  AlertTriangle,
  FileCheck,
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  RotateCcw
} from 'lucide-react';
import { 
  Teacher, 
  Student, 
  TeacherLeaveRequest, 
  TimetableSlot, 
  UserAccount 
} from '../types';
import { ConnectedExaminationManager } from '../components/academics/ConnectedExaminationManager';
import { SchoolNotificationCenter } from '../components/notifications/SchoolNotificationCenter';
import { NotificationBellDrawer } from '../components/notifications/NotificationBellDrawer';
import { 
  getAssignedClassesForTeacher, 
  CLASS_TEACHER_EVENT 
} from '../services/classTeacherService';
import { 
  submitTeacherApplication, 
  getTeacherApplications, 
  TeacherApplicationItem,
  getDailyAttendanceForClass,
  isAttendanceAlreadyRecorded,
  saveClassDailyAttendance,
  StudentDailyAttendanceRecord,
  getHomeworkForTeacher,
  createSchoolHomework,
  SchoolHomeworkItem,
  normalizeClass
} from '../services/schoolDataHub';

interface TeacherPortalProps {
  currentUser: UserAccount;
  teachers: Teacher[];
  students: Student[];
  timetableSlots: TimetableSlot[];
  leaveRequests: TeacherLeaveRequest[];
  onSubmitLeave: (newLeave: Omit<TeacherLeaveRequest, 'id' | 'status' | 'appliedAt'>) => void;
  onLogout: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  onClassAttendanceRecorded?: (className: string, section: string, date: string, records: StudentDailyAttendanceRecord[]) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  currentUser,
  teachers,
  students,
  timetableSlots,
  leaveRequests,
  onSubmitLeave,
  onLogout,
  onShowToast,
  onClassAttendanceRecorded
}) => {
  // Navigation tabs in Teacher Portal
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'profile' | 'timetable' | 'classes' | 'students' | 'attendance' | 'homework' | 'examinations' | 'leave' | 'notices'
  >('dashboard');

  // Match the active teacher record
  const currentTeacher: Teacher = teachers.find(
    t => t.employeeId === currentUser.employeeId || t.id === currentUser.teacherId || t.name === currentUser.name
  ) || {
    id: currentUser.teacherId || 'T-1001',
    employeeId: currentUser.employeeId || 'EMP-1001',
    name: currentUser.name,
    avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: (currentUser.department as any) || 'Mathematics',
    designation: (currentUser.designation as any) || 'PGT',
    subjects: [currentUser.subject || 'Mathematics'],
    classes: [currentUser.className || '10-A', '10-B'],
    currentStatus: 'Present',
    attendanceToday: 'Present',
    attendanceRate: 98,
    workloadWeekly: 22,
    maxWorkloadWeekly: 28,
    currentPeriod: 3,
    nextPeriod: 4,
    freePeriodsToday: [2, 5, 7],
    email: currentUser.email || 'teacher@bafna.edu.in',
    phone: currentUser.phone || '+91 98290 12345',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    experienceYears: 9,
    joiningDate: '2018-07-01',
    room: 'Room 204 (Maths Wing)',
    leaveBalance: { casual: 5, sick: 7, emergency: 2, officialDuty: 4, totalAvailable: 18 },
    tasksCount: 2
  };

  const [classTeacherTrigger, setClassTeacherTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setClassTeacherTrigger(prev => prev + 1);
    };
    window.addEventListener(CLASS_TEACHER_EVENT, handleUpdate);
    return () => window.removeEventListener(CLASS_TEACHER_EVENT, handleUpdate);
  }, []);

  // Assigned classes (strictly Class 10 sections: 10-A to 10-E, dynamically derived from central classTeacherService)
  const assignedClassList = useMemo(() => {
    return getAssignedClassesForTeacher(currentTeacher.name, currentTeacher.classes || []);
  }, [currentTeacher.name, currentTeacher.classes, classTeacherTrigger]);

  // =========================================================================
  // ATTENDANCE MODULE STATE & LOGIC (High Priority Mobile-Friendly System)
  // =========================================================================
  const [selectedAttendanceClass, setSelectedAttendanceClass] = useState<string>(assignedClassList[0] || '10-A');

  // Keep selected attendance class aligned with available assigned classes
  useEffect(() => {
    if (assignedClassList.length > 0 && !assignedClassList.includes(selectedAttendanceClass)) {
      setSelectedAttendanceClass(assignedClassList[0]);
    }
  }, [assignedClassList, selectedAttendanceClass]);
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent' | 'late' | 'half_day'>>({});
  const [isAttendanceSaving, setIsAttendanceSaving] = useState(false);
  const [attendanceAlreadyRecorded, setAttendanceAlreadyRecorded] = useState(false);
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState('');
  const [attendanceFilterStatus, setAttendanceFilterStatus] = useState<'all' | 'present' | 'absent' | 'late'>('all');

  // Real Teacher Timetable Slots from central timetable
  const myTimetableSlots = useMemo(() => {
    const norm = currentTeacher.name.toLowerCase().trim();
    const teacherId = currentTeacher.id || '';
    const empId = currentTeacher.employeeId || '';
    return timetableSlots.filter(s => {
      const slotTeacher = (s.teacherName || '').toLowerCase().trim();
      const isSub = (s.substituteTeacherName || '').toLowerCase().trim() === norm;
      const matchesName = slotTeacher.includes(norm) || norm.includes(slotTeacher);
      const matchesId = (teacherId && s.teacherId === teacherId) || (empId && s.teacherId === empId);
      return matchesName || matchesId || isSub;
    }).sort((a, b) => a.periodNumber - b.periodNumber);
  }, [timetableSlots, currentTeacher]);

  const todayDayName = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = days[new Date().getDay()];
    return d === 'Sunday' ? 'Monday' : d;
  }, []);

  const todaySlots = useMemo(() => {
    return myTimetableSlots.filter(s => s.day === todayDayName);
  }, [myTimetableSlots, todayDayName]);

  // Parse class and section
  const [attClassName, attSection] = useMemo(() => {
    const parts = selectedAttendanceClass.split('-');
    return [parts[0] || '10', parts[1] || 'B'];
  }, [selectedAttendanceClass]);

  // Students belonging strictly to the selected attendance class
  const classStudents = useMemo(() => {
    const selectedNormalized = normalizeClass(selectedAttendanceClass);
    return students.filter(s => {
      const studentNormalized = normalizeClass(s.className || s.class, s.section);
      return studentNormalized === selectedNormalized;
    });
  }, [students, selectedAttendanceClass]);

  // Filtered students for attendance sheet (search & status filters)
  const filteredAttendanceStudents = useMemo(() => {
    return classStudents.filter(s => {
      const status = attendanceMap[s.id] || 'present';
      if (attendanceFilterStatus !== 'all' && status !== attendanceFilterStatus) {
        return false;
      }
      if (attendanceSearchQuery.trim()) {
        const q = attendanceSearchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesRoll = String(s.rollNumber || s.rollNo || '').includes(q);
        const matchesId = s.id.toLowerCase().includes(q);
        return matchesName || matchesRoll || matchesId;
      }
      return true;
    });
  }, [classStudents, attendanceMap, attendanceFilterStatus, attendanceSearchQuery]);

  // Load attendance records whenever selected class or date changes
  useEffect(() => {
    const existing = getDailyAttendanceForClass(attClassName, attSection, attendanceDate);
    if (existing.length > 0) {
      setAttendanceAlreadyRecorded(true);
      const newMap: Record<string, 'present' | 'absent' | 'late' | 'half_day'> = {};
      existing.forEach(r => {
        newMap[r.studentId] = r.status;
      });
      setAttendanceMap(newMap);
    } else {
      setAttendanceAlreadyRecorded(false);
      // Default all to 'present' for fast single-tap marking
      const defaultMap: Record<string, 'present' | 'absent' | 'late' | 'half_day'> = {};
      classStudents.forEach(s => {
        defaultMap[s.id] = (s.todayStatus as any) || 'present';
      });
      setAttendanceMap(defaultMap);
    }
  }, [attClassName, attSection, attendanceDate, classStudents.length]);

  // Quick Action: Mark All Present
  const handleMarkAllPresent = () => {
    const newMap: Record<string, 'present' | 'absent' | 'late' | 'half_day'> = {};
    classStudents.forEach(s => {
      newMap[s.id] = 'present';
    });
    setAttendanceMap(newMap);
    onShowToast('Updated', `All ${classStudents.length} students marked PRESENT.`, 'info');
  };

  // Quick Action: Mark All Absent
  const handleMarkAllAbsent = () => {
    const newMap: Record<string, 'present' | 'absent' | 'late' | 'half_day'> = {};
    classStudents.forEach(s => {
      newMap[s.id] = 'absent';
    });
    setAttendanceMap(newMap);
    onShowToast('Updated', `All ${classStudents.length} students marked ABSENT.`, 'warning');
  };

  // Toggle single student status
  const handleSetStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Calculate live attendance counts
  const attendanceCounts = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    classStudents.forEach(s => {
      const st = attendanceMap[s.id] || 'present';
      if (st === 'present') present++;
      else if (st === 'absent') absent++;
      else if (st === 'late' || st === 'half_day') late++;
    });
    const total = classStudents.length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;
    return { present, absent, late, total, rate };
  }, [classStudents, attendanceMap]);

  // Save Attendance to Storage & Hub
  const handleSaveAttendance = () => {
    if (classStudents.length === 0) {
      onShowToast('No Students', 'There are no students enrolled in this class to record.', 'warning');
      return;
    }

    setIsAttendanceSaving(true);
    const recordsToSave: StudentDailyAttendanceRecord[] = classStudents.map(s => ({
      id: `ATT-${s.id}-${attendanceDate}`,
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo || (s as any).rollNumber || 1,
      className: attClassName,
      section: attSection,
      date: attendanceDate,
      status: attendanceMap[s.id] || 'present',
      recordedByTeacherName: currentTeacher.name,
      recordedByTeacherId: currentTeacher.id,
      recordedAt: new Date().toISOString(),
      checkInTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }));

    saveClassDailyAttendance(
      attClassName, 
      attSection, 
      attendanceDate, 
      recordsToSave, 
      currentTeacher.name, 
      currentTeacher.id
    );

    // Call parent handler to update live students state in App.tsx
    if (onClassAttendanceRecorded) {
      onClassAttendanceRecorded(attClassName, attSection, attendanceDate, recordsToSave);
    }

    setAttendanceAlreadyRecorded(true);
    setIsAttendanceSaving(false);

    onShowToast(
      'Attendance Saved Successfully', 
      `Class ${selectedAttendanceClass} attendance recorded: ${attendanceCounts.present} Present, ${attendanceCounts.absent} Absent.`, 
      'success'
    );
  };

  // =========================================================================
  // HOMEWORK MODULE STATE & LOGIC
  // =========================================================================
  const [teacherHomeworkList, setTeacherHomeworkList] = useState<SchoolHomeworkItem[]>(() => {
    return getHomeworkForTeacher(currentTeacher.id, currentTeacher.name);
  });
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [hwClass, setHwClass] = useState<string>(assignedClassList[0] || '10-B');
  const [hwSubject, setHwSubject] = useState<string>(currentTeacher.subjects[0] || 'Mathematics');
  const [hwTitle, setHwTitle] = useState('');
  const [hwInstructions, setHwInstructions] = useState('');
  const [hwDueDate, setHwDueDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [hwFilter, setHwFilter] = useState<'All' | 'Active' | 'Past Due'>('All');

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim() || !hwInstructions.trim()) {
      onShowToast('Missing Fields', 'Please provide both homework title and instructions.', 'warning');
      return;
    }

    const [cls, sec] = hwClass.split('-');
    const newHw = createSchoolHomework({
      className: cls || '10',
      section: sec || 'B',
      subject: hwSubject,
      title: hwTitle.trim(),
      instructions: hwInstructions.trim(),
      assignedDate: new Date().toISOString().slice(0, 10),
      dueDate: hwDueDate,
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name
    });

    setTeacherHomeworkList(getHomeworkForTeacher(currentTeacher.id, currentTeacher.name));
    setIsHomeworkModalOpen(false);
    setHwTitle('');
    setHwInstructions('');

    onShowToast(
      'Homework Assigned', 
      `Assigned "${newHw.title}" to Class ${hwClass}. Visible immediately in Student and Parent Portals.`, 
      'success'
    );
  };

  // =========================================================================
  // MY STUDENTS FILTER & SEARCH STATE
  // =========================================================================
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState<string>('All');

  // Filtered students belonging ONLY to this teacher's assigned classes
  const myStudents = useMemo(() => {
    return students.filter(s => {
      const normalized = normalizeClass(s.className || s.class, s.section);
      return assignedClassList.some(ac => normalizeClass(ac) === normalized);
    });
  }, [students, assignedClassList]);

  // Filtered displayed students in "My Students" tab
  const displayedStudents = useMemo(() => {
    return myStudents.filter(s => {
      const normalized = normalizeClass(s.className || s.class, s.section);
      const matchesClass = studentClassFilter === 'All' || normalizeClass(studentClassFilter) === normalized;
      const matchesSearch = studentSearchQuery === '' || 
        s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        String(s.rollNumber || s.rollNo || '').includes(studentSearchQuery);
      return matchesClass && matchesSearch;
    });
  }, [myStudents, studentClassFilter, studentSearchQuery]);

  // =========================================================================
  // LEAVE REQUEST LOGIC
  // =========================================================================
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Emergency' | 'Official Duty' | 'Other'>('Casual');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveNote, setLeaveNote] = useState('');
  const [leaveError, setLeaveError] = useState('');

  const myLeaves = leaveRequests.filter(
    l => l.teacherId === currentTeacher.id || l.employeeId === currentTeacher.employeeId || l.teacherName === currentTeacher.name
  );

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    if (e < s) return 0;
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diff);
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveError('');

    if (!startDate || !endDate) {
      setLeaveError('Please select both start and end date.');
      return;
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      setLeaveError('End date cannot be before start date.');
      return;
    }
    if (!leaveReason.trim()) {
      setLeaveError('Please provide a reason for your leave request.');
      return;
    }

    const days = calculateDays();
    onSubmitLeave({
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      employeeId: currentTeacher.employeeId,
      department: currentTeacher.department,
      leaveType,
      startDate,
      endDate,
      days,
      reason: leaveReason.trim() + (leaveNote.trim() ? ` (Note: ${leaveNote.trim()})` : ''),
      affectedPeriodsCount: days * 4
    });

    submitTeacherApplication({
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      employeeId: currentTeacher.employeeId,
      department: currentTeacher.department,
      applicationType: leaveType === 'Casual' ? 'Casual Leave' : leaveType === 'Sick' ? 'Sick Leave' : 'Emergency Leave',
      startDate,
      endDate,
      days,
      reason: leaveReason.trim() + (leaveNote.trim() ? ` (Note: ${leaveNote.trim()})` : '')
    });

    setIsLeaveModalOpen(false);
    setLeaveReason('');
    setLeaveNote('');
    onShowToast('Leave Application Submitted', 'Your request is now pending review by the Principal.', 'success');
  };

  // Check if primary class attendance is recorded today
  const primaryClass = assignedClassList[0] || '10-B';
  const isPrimaryAttendanceDoneToday = isAttendanceAlreadyRecorded(
    primaryClass.split('-')[0] || '10',
    primaryClass.split('-')[1] || 'B',
    new Date().toISOString().slice(0, 10)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Seth Tolaram Bafna Academy
                </h1>
                <span className="px-2 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold uppercase">
                  Teacher Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentTeacher.name} • {currentTeacher.department} ({currentTeacher.employeeId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBellDrawer 
              currentUser={currentUser} 
              onViewAll={() => setActiveTab('notices')} 
            />

            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply for Leave</span>
            </button>

            <button
              id="teacher-logout-btn"
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
        <aside className="w-full md:w-60 shrink-0 space-y-1">
          {[
            { id: 'dashboard', label: 'Teacher Dashboard', icon: Building2 },
            { id: 'attendance', label: 'Class Attendance', icon: ClipboardCheck, badge: isPrimaryAttendanceDoneToday ? undefined : 'Due' },
            { id: 'classes', label: 'My Classes', icon: BookOpen },
            { id: 'students', label: 'My Students', icon: Users },
            { id: 'homework', label: 'Homework & Tasks', icon: FileCheck },
            { id: 'timetable', label: 'My Timetable', icon: Calendar },
            { id: 'examinations', label: 'Examinations & Marks', icon: Award },
            { id: 'leave', label: 'My Leave Applications', icon: FileText, badge: myLeaves.filter(l => l.status === 'Pending').length },
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'notices', label: 'School Notices & Circulars', icon: Bell },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {Boolean(tab.badge) && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    tab.badge === 'Due' 
                      ? 'bg-amber-500 text-white animate-pulse' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {/* ========================================================
              TAB: DASHBOARD
              ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Greeting Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wide">
                    Academic Year 2026-27 • Faculty Portal
                  </span>
                  <h2 className="text-2xl font-black mt-2">
                    Good Morning, {currentTeacher.name}
                  </h2>
                  <p className="text-xs text-blue-100 max-w-lg mt-1">
                    Department of {currentTeacher.department} • Assigned Classes: {assignedClassList.join(', ')}.
                  </p>

                  {/* Quick Action Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/15">
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="px-3.5 py-2 rounded-xl bg-white text-blue-800 font-extrabold text-xs shadow-md hover:bg-blue-50 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Take Attendance</span>
                    </button>
                    <button
                      onClick={() => {
                        setHwClass(assignedClassList[0] || '10-B');
                        setIsHomeworkModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Assign Homework</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('classes')}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>My Classes ({assignedClassList.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('students')}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>My Students ({myStudents.length})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Attendance Quick Status Alert Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                isPrimaryAttendanceDoneToday
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isPrimaryAttendanceDoneToday ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {isPrimaryAttendanceDoneToday ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">
                      {isPrimaryAttendanceDoneToday 
                        ? `Class ${primaryClass} Attendance Completed for Today`
                        : `Class ${primaryClass} Attendance Pending for Today`}
                    </h4>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {isPrimaryAttendanceDoneToday
                        ? `Attendance records are synchronized with School Central Database. You can review or edit anytime.`
                        : `Please mark morning attendance for your primary class before 09:30 AM.`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAttendanceClass(primaryClass);
                    setActiveTab('attendance');
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-xs ${
                    isPrimaryAttendanceDoneToday
                      ? 'bg-white dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {isPrimaryAttendanceDoneToday ? 'Review Attendance' : 'Mark Attendance Now'}
                </button>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Faculty Status</div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {currentTeacher.attendanceToday}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Biometric in at 08:15 AM</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assigned Classes</div>
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {assignedClassList.length} Classes
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{assignedClassList.join(', ')}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Enrolled Students</div>
                  <div className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1">
                    {myStudents.length} Students
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Under your supervision</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Weekly Workload</div>
                  <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">
                    {currentTeacher.workloadWeekly} / {currentTeacher.maxWorkloadWeekly}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Periods Scheduled</div>
                </div>
              </div>

              {/* Today's Schedule & Quick Leave Action */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Today's Class Schedule</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold">Today's Periods</span>
                  </div>

                  <div className="space-y-2">
                    {todaySlots.length > 0 ? (
                      todaySlots.map((slot) => (
                        <div key={slot.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 dark:text-white">Class {slot.className}</p>
                              {slot.isSubstituted && (
                                <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                  Sub: {slot.substituteTeacherName}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">{slot.subject} • {slot.room}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold text-[11px]">
                              Period {slot.periodNumber} ({slot.timeRange})
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      assignedClassList.map((cls, idx) => (
                        <div key={cls} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">Class {cls}</p>
                            <p className="text-[11px] text-slate-500">{currentTeacher.subjects[0]} • Room 204</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold text-[11px]">
                              Period {idx === 0 ? 1 : 4} ({idx === 0 ? '08:30 - 09:15' : '11:15 - 12:00'})
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Recent Class Homework</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('homework')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {teacherHomeworkList.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No homework tasks assigned yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {teacherHomeworkList.slice(0, 3).map(hw => (
                        <div key={hw.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                                Class {hw.className}-{hw.section}
                              </span>
                              <p className="font-bold text-slate-900 dark:text-white">{hw.title}</p>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Due: {hw.dueDate}</p>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {(hw.submissions || []).length} Submitted
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setHwClass(assignedClassList[0] || '10-B');
                      setIsHomeworkModalOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign New Homework</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: PROFILE
              ======================================================== */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <img 
                  src={currentTeacher.avatar} 
                  alt={currentTeacher.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500" 
                />
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{currentTeacher.name}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {currentTeacher.employeeId} • {currentTeacher.department}
                  </p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-bold">
                    {currentTeacher.designation}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Assigned Department</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentTeacher.department}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Teaching Subjects</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentTeacher.subjects.join(', ')}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Assigned Classes</span>
                  <span className="font-bold text-slate-900 dark:text-white">{assignedClassList.join(', ')}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Primary Room</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentTeacher.room}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Qualification</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentTeacher.qualification}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Contact Details</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentTeacher.email} • {currentTeacher.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: TIMETABLE
              ======================================================== */}
          {activeTab === 'timetable' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>My Weekly Timetable</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live schedule assigned to {currentTeacher.name} ({currentTeacher.department})
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono">
                  {myTimetableSlots.length} Periods Scheduled / Week
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                  const daySlots = myTimetableSlots.filter(s => s.day === day);
                  const isToday = day === todayDayName;

                  return (
                    <div 
                      key={day} 
                      className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                        isToday 
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800 ring-1 ring-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={`text-xs font-black uppercase tracking-wider ${isToday ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {day}
                        </h3>
                        {isToday && (
                          <span className="px-2 py-0.2 rounded-full bg-blue-600 text-white font-black text-[10px] uppercase">
                            Today
                          </span>
                        )}
                      </div>

                      {daySlots.length === 0 ? (
                        <div className="p-4 text-center rounded-xl bg-white/60 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
                          No teaching periods scheduled
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {daySlots.map(slot => (
                            <div key={slot.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-2xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                  Period {slot.periodNumber} • {slot.timeRange}
                                </span>
                                {slot.isSubstituted && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                    Substituted
                                  </span>
                                )}
                              </div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                Class {slot.className} — {slot.subject}
                              </p>
                              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                                <span>{slot.room}</span>
                                {slot.substituteTeacherName && (
                                  <span className="text-amber-600 font-medium">Sub: {slot.substituteTeacherName}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: CLASS ATTENDANCE (HIGH PRIORITY MOBILE-FRIENDLY SYSTEM)
              ======================================================== */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <ClipboardCheck className="w-6 h-6 text-blue-600" />
                      <span>Class Daily Attendance</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Mark and submit daily morning student attendance for your assigned classes.
                    </p>
                  </div>

                  {/* Class and Date Selectors */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Class:</span>
                      <select
                        value={selectedAttendanceClass}
                        onChange={(e) => setSelectedAttendanceClass(e.target.value)}
                        className="bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                      >
                        {assignedClassList.map(cls => (
                          <option key={cls} value={cls} className="dark:bg-slate-900">
                            Class {cls}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Date:</span>
                      <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="bg-transparent text-xs font-mono font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Notice Banner */}
                {attendanceAlreadyRecorded ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Attendance already recorded for <strong>Class {selectedAttendanceClass}</strong> on <strong>{attendanceDate}</strong>. You may make adjustments and re-save.
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-extrabold text-[10px] uppercase shrink-0">
                      Recorded
                    </span>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        Recording new morning attendance for <strong>Class {selectedAttendanceClass}</strong> ({classStudents.length} students).
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-200/80 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-extrabold text-[10px] uppercase shrink-0">
                      In Progress
                    </span>
                  </div>
                )}

                {/* Quick Action Bar & Live Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleMarkAllPresent}
                      className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs hover:bg-emerald-100 cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Mark All Present</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleMarkAllAbsent}
                      className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-extrabold text-xs hover:bg-rose-100 cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Mark All Absent</span>
                    </button>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                      <span>Total:</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono">
                        {attendanceCounts.total}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-emerald-600">
                      <span>Present:</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 font-mono">
                        {attendanceCounts.present}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-rose-600">
                      <span>Absent:</span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 font-mono">
                        {attendanceCounts.absent}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <span>Late:</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 font-mono">
                        {attendanceCounts.late}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Attendance List (Touch-Target Optimized for Mobile) */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Students Roster ({classStudents.length})
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Tap status buttons to mark roll call. Submissions sync directly to school central database.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    Live Projected Rate: <strong className="text-blue-600 font-mono text-sm">{attendanceCounts.rate}%</strong>
                  </span>
                </div>

                {/* Filter and Quick Search Bar for Attendance Sheet */}
                {classStudents.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setAttendanceFilterStatus('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          attendanceFilterStatus === 'all'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        All ({classStudents.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendanceFilterStatus('present')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          attendanceFilterStatus === 'present'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        Present ({attendanceCounts.present})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendanceFilterStatus('absent')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          attendanceFilterStatus === 'absent'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 hover:bg-rose-50'
                        }`}
                      >
                        Absent ({attendanceCounts.absent})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendanceFilterStatus('late')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          attendanceFilterStatus === 'late'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50'
                        }`}
                      >
                        Late ({attendanceCounts.late})
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search student or roll #..."
                        value={attendanceSearchQuery}
                        onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                        className="bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-full sm:w-48"
                      />
                      {attendanceSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setAttendanceSearchQuery('')}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {classStudents.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No students enrolled in Class {selectedAttendanceClass}.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Please select another assigned class from the selector above.</p>
                  </div>
                ) : filteredAttendanceStudents.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300">No students matching the selected filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setAttendanceFilterStatus('all');
                        setAttendanceSearchQuery('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredAttendanceStudents.map((s, index) => {
                      const currentStatus = attendanceMap[s.id] || 'present';
                      return (
                        <div
                          key={s.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            currentStatus === 'present'
                              ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80'
                              : currentStatus === 'absent'
                              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                              : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                          }`}
                        >
                          {/* Student Info */}
                          <div className="flex items-center gap-3.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-mono font-black text-xs shrink-0">
                              {s.rollNumber || index + 1}
                            </div>
                            <img
                              src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                              alt={s.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                  {s.name}
                                </h4>
                                <span className="font-mono text-[10px] text-slate-400">
                                  {s.id}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Roll #{s.rollNumber || index + 1} • Overall Attendance: {s.attendancePercentage}%
                              </p>
                            </div>
                          </div>

                          {/* Large Touch Target Status Toggles (Min 44px Height) */}
                          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSetStudentStatus(s.id, 'present')}
                              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500'
                                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              <span>PRESENT</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetStudentStatus(s.id, 'absent')}
                              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                                currentStatus === 'absent'
                                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30 ring-2 ring-rose-500'
                                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700'
                              }`}
                            >
                              <X className="w-4 h-4" />
                              <span>ABSENT</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetStudentStatus(s.id, 'late')}
                              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                currentStatus === 'late'
                                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400'
                                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-700'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>LATE</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Save Attendance Floating / Bottom Bar */}
                {classStudents.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Summary for submission: <strong className="text-emerald-600">{attendanceCounts.present} Present</strong>, <strong className="text-rose-600">{attendanceCounts.absent} Absent</strong>, <strong className="text-amber-600">{attendanceCounts.late} Late</strong> out of {attendanceCounts.total} students.
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAttendance}
                      disabled={isAttendanceSaving}
                      className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAttendanceSaving ? 'Saving Records...' : `Save Attendance for Class ${selectedAttendanceClass}`}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: MY CLASSES
              ======================================================== */}
          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                      <span>My Assigned Classes</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Classes under your academic curriculum and class mentorship for Session 2026-27.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-extrabold">
                    {assignedClassList.length} Classes Assigned
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedClassList.map((cls, idx) => {
                    const enrolledInClass = students.filter(s => {
                      return normalizeClass(s.className || s.class, s.section) === normalizeClass(cls);
                    });
                    const isPrimary = idx === 0;

                    return (
                      <div
                        key={cls}
                        className="p-5 rounded-3xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                {isPrimary ? 'Class Teacher' : 'Subject Faculty'}
                              </span>
                              <span className="text-xs text-slate-400">Room 204</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                              Class {cls}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Subject: <strong>{currentTeacher.subjects[0] || 'Mathematics'}</strong>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block font-mono">
                              {enrolledInClass.length}
                            </span>
                            <span className="text-[11px] text-slate-400 font-bold">Enrolled Students</span>
                          </div>
                        </div>

                        {/* Class Actions */}
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAttendanceClass(cls);
                              setActiveTab('attendance');
                            }}
                            className="py-2 px-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 text-center transition-colors cursor-pointer"
                          >
                            Attendance
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setStudentClassFilter(cls);
                              setActiveTab('students');
                            }}
                            className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 text-center transition-colors cursor-pointer"
                          >
                            Students
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setHwClass(cls);
                              setIsHomeworkModalOpen(true);
                            }}
                            className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 text-center transition-colors cursor-pointer"
                          >
                            + Homework
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: MY STUDENTS
              ======================================================== */}
          {activeTab === 'students' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    <span>My Enrolled Students</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing students strictly from your assigned classes ({assignedClassList.join(', ')}).
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={studentClassFilter}
                      onChange={(e) => setStudentClassFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="All" className="dark:bg-slate-900">All Assigned Classes</option>
                      {assignedClassList.map(cls => (
                        <option key={cls} value={cls} className="dark:bg-slate-900">
                          Class {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search student or roll #..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-36 sm:w-48"
                    />
                  </div>
                </div>
              </div>

              {/* Students Count Badge */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Displaying <strong>{displayedStudents.length}</strong> of {myStudents.length} students</span>
                {studentClassFilter !== 'All' && (
                  <button
                    onClick={() => setStudentClassFilter('All')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Responsive Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-3 px-3">Roll & Student</th>
                      <th className="py-3 px-3">Student ID</th>
                      <th className="py-3 px-3">Class</th>
                      <th className="py-3 px-3">Today Status</th>
                      <th className="py-3 px-3">Attendance Rate</th>
                      <th className="py-3 px-3">Parent Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {displayedStudents.map((s, index) => {
                      const studentToday = attendanceMap[s.id] || s.todayStatus || 'present';
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                                {s.rollNumber || index + 1}
                              </span>
                              <img
                                src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                                alt={s.name}
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                              <span className="font-bold text-slate-900 dark:text-white">
                                {s.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-500">
                            {s.id}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">
                            Class {s.className || s.class}-{s.section || 'A'}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              studentToday === 'present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              studentToday === 'absent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                              'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {studentToday}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-emerald-600 font-mono">
                              {s.attendancePercentage}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                            {s.guardianPhone || '+91 98290 87654'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: HOMEWORK & TASKS
              ======================================================== */}
          {activeTab === 'homework' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <FileCheck className="w-6 h-6 text-emerald-600" />
                      <span>Homework & Assignments</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Assign tasks with due dates. Students and parents will see them in real-time.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Filter buttons */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                      {(['All', 'Active', 'Past Due'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setHwFilter(f)}
                          className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            hwFilter === f
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setHwClass(assignedClassList[0] || '10-B');
                        setIsHomeworkModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Assign Homework</span>
                    </button>
                  </div>
                </div>

                {/* Homework List */}
                {teacherHomeworkList.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    <FileCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No homework assignments found.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Click "Assign Homework" to create tasks for your classes.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teacherHomeworkList
                      .filter(hw => {
                        if (hwFilter === 'Active') return new Date(hw.dueDate).getTime() >= new Date().setHours(0,0,0,0);
                        if (hwFilter === 'Past Due') return new Date(hw.dueDate).getTime() < new Date().setHours(0,0,0,0);
                        return true;
                      })
                      .map(hw => (
                        <div
                          key={hw.id}
                          className="p-5 rounded-3xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] uppercase">
                                  Class {hw.className}-{hw.section}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px]">
                                  {hw.subject}
                                </span>
                              </div>
                              <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                                {hw.title}
                              </h4>
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-500">
                              Due: {hw.dueDate}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                            {hw.instructions}
                          </p>

                          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                            <span>Submissions: <strong className="text-emerald-600 font-mono">{(hw.submissions || []).length}</strong> students</span>
                            <span className="text-[11px] text-slate-400">Created: {hw.createdAt}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: LEAVE APPLICATIONS
              ======================================================== */}
          {activeTab === 'leave' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    My Leave Applications
                  </h2>
                  <p className="text-xs text-slate-400">
                    Track approvals by the School Principal / Administrative Head.
                  </p>
                </div>
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Apply for Leave</span>
                </button>
              </div>

              {myLeaves.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">No leave requests found.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Submit your first application using the "Apply for Leave" button above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myLeaves.map(l => (
                    <div 
                      key={l.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' :
                            l.status === 'Rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300' : 
                            'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          }`}>
                            {l.status}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {l.leaveType} Leave
                          </span>
                          <span className="text-slate-400 font-medium">({l.days} Day{l.days > 1 ? 's' : ''})</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                          Dates: <strong>{l.startDate}</strong> to <strong>{l.endDate}</strong>
                        </p>
                        <p className="text-slate-400 italic text-[11px] mt-0.5">
                          "{l.reason}"
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-400 block">Submitted on {l.appliedAt}</span>
                        {l.status === 'Approved' && (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px] mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Attendance set to On Leave</span>
                          </span>
                        )}
                        {l.status === 'Pending' && (
                          <span className="text-amber-600 font-bold text-[11px] mt-1 block">
                            Awaiting Head of School Decision
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB: EXAMINATIONS & MARKS
              ======================================================== */}
          {activeTab === 'examinations' && (
            <ConnectedExaminationManager
              currentUser={currentUser}
              students={students}
              onShowToast={onShowToast}
            />
          )}

          {/* ========================================================
              TAB: SCHOOL NOTICES & CIRCULARS
              ======================================================== */}
          {activeTab === 'notices' && (
            <SchoolNotificationCenter
              currentUser={currentUser}
              onShowToast={onShowToast}
            />
          )}
        </main>
      </div>

      {/* ========================================================
          MODAL: APPLY FOR LEAVE
          ======================================================== */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 sm:p-7 relative">
            <button
              onClick={() => setIsLeaveModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              Apply for Leave
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Submit your leave request for administrative review. If approved, your attendance will automatically record as ON LEAVE.
            </p>

            {leaveError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs font-medium">
                {leaveError}
              </div>
            )}

            <form onSubmit={handleSubmitLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Leave Type *
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Emergency">Emergency Leave</option>
                  <option value="Official Duty">Personal Leave</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs flex justify-between items-center">
                <span className="text-blue-900 dark:text-blue-300 font-medium">Calculated Duration:</span>
                <span className="font-black text-blue-700 dark:text-blue-200">
                  {calculateDays()} Day{calculateDays() > 1 ? 's' : ''}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Leave *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Urgent personal family engagement / medical appointment..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Syllabus covered up to Chapter 4"
                  value={leaveNote}
                  onChange={(e) => setLeaveNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Leave Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ASSIGN HOMEWORK
          ======================================================== */}
      {isHomeworkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 sm:p-7 relative">
            <button
              onClick={() => setIsHomeworkModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Assign Class Homework
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Create homework or practice assignments. This will be published immediately to students of the selected class.
            </p>

            <form onSubmit={handleCreateHomework} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Class *
                  </label>
                  <select
                    value={hwClass}
                    onChange={(e) => setHwClass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    {assignedClassList.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <select
                    value={hwSubject}
                    onChange={(e) => setHwSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    {currentTeacher.subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Homework Title / Topic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Equations - Exercise 4.3 (Q 1 to 8)"
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={hwDueDate}
                  onChange={(e) => setHwDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions & Guidelines *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide step-by-step guidance, chapters, formula reference, or notebook submission guidelines..."
                  value={hwInstructions}
                  onChange={(e) => setHwInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHomeworkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Homework</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
