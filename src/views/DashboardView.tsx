import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Sparkles, 
  Search, 
  Sun, 
  FileText, 
  Bot, 
  Layers, 
  SlidersHorizontal,
  Users,
  GraduationCap,
  BookOpen,
  Bus,
  Zap,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  ChevronRight,
  ClipboardList,
  Megaphone,
  FileCheck,
  UserPlus,
  Phone,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';
import { 
  AppSection, 
  SchoolEvent, 
  SchoolAnnouncement, 
  MaintenanceIssue, 
  Bus as BusType, 
  SmartAlertItem, 
  AdminReminder, 
  SchoolActivityEvent, 
  Teacher, 
  SubstitutionRecord, 
  TimetableSlot,
  Student,
  ClassAttendanceSummary,
  TeacherLeaveRequest
} from '../types';

// Quick Action & Search Modals
import { AdminQuickActionModals, AdminQuickActionType } from '../components/CommandCenter/AdminQuickActionModals';
import { GlobalSearchModal } from '../components/CommandCenter/GlobalSearchModal';
import { MorningBriefingModal } from '../components/CommandCenter/MorningBriefingModal';
import { EndOfDayReportModal } from '../components/CommandCenter/EndOfDayReportModal';
import { AIAssistantModal } from '../components/CommandCenter/AIAssistantModal';
import { FacultyInsightsWidget } from '../components/CommandCenter/FacultyInsightsWidget';

// School Data Hub Services
import { getClass10Teachers } from '../services/classTeacherService';
import { 
  getSchoolCalendarEvents, 
  createSchoolCalendarEvent, 
  SchoolCalendarEventItem,
  getSchoolExams,
  getSchoolHomework,
  getSchoolNotifications,
  createSchoolNotification
} from '../services/schoolDataHub';

interface DashboardViewProps {
  onNavigate: (section: AppSection) => void;
  attendanceStats: {
    rate: number;
    present: number;
    total: number;
    absent: number;
  };
  libraryStats: {
    available: number;
    total: number;
    issuedToday: number;
  };
  transportStats: {
    active: number;
    total: number;
    atSchool: number;
  };
  energyStats: {
    todayKwh: number;
    savingsPct: number;
    isOptimized: boolean;
  };
  onOpenMarkAttendance: () => void;
  onOpenIssueBook: () => void;
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  teachers?: Teacher[];
  substitutions?: SubstitutionRecord[];
  timetableSlots?: TimetableSlot[];
  students?: Student[];
  classes?: ClassAttendanceSummary[];
  leaveRequests?: TeacherLeaveRequest[];
  onAddStudent?: (student: Student) => void;
  onAddTeacher?: (teacher: Partial<Teacher>) => void;
  onUpdateTeacher?: (teacher: Teacher) => void;
  onAddClass?: (newClass: ClassAttendanceSummary) => void;
  onApproveLeave?: (leave: TeacherLeaveRequest) => void;
  onRejectLeave?: (leaveId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  attendanceStats,
  libraryStats,
  transportStats,
  energyStats,
  onOpenMarkAttendance,
  onOpenIssueBook,
  onShowToast,
  teachers = [],
  substitutions = [],
  timetableSlots = [],
  students = [],
  classes = [],
  leaveRequests = [],
  onAddStudent = () => {},
  onAddTeacher = () => {},
  onUpdateTeacher = () => {},
  onAddClass = () => {},
  onApproveLeave = () => {},
  onRejectLeave = () => {},
}) => {
  // Modal states
  const [activeQuickAction, setActiveQuickAction] = useState<AdminQuickActionType>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMorningBriefingOpen, setIsMorningBriefingOpen] = useState(false);
  const [isEndOfDayReportOpen, setIsEndOfDayReportOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Class inspection drilldown modal
  const [inspectedClass, setInspectedClass] = useState<string | null>(null);

  // Calendar Add Event modal
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [newEventCategory, setNewEventCategory] = useState<'Holiday' | 'Exam' | 'PTM' | 'Event' | 'Sports' | 'Academic'>('Academic');
  const [newEventAudience, setNewEventAudience] = useState<'Everyone' | 'Teachers' | 'Students' | 'Parents'>('Everyone');
  const [newEventDescription, setNewEventDescription] = useState('');

  // Calendar filter
  const [calendarCategoryFilter, setCalendarCategoryFilter] = useState<string>('all');

  // Academic Live Statistics Counts
  const examsList = useMemo(() => getSchoolExams(), []);
  const homeworkList = useMemo(() => getSchoolHomework(), []);
  const notificationsList = useMemo(() => getSchoolNotifications(), []);
  const calendarEvents = useMemo(() => getSchoolCalendarEvents(), [isAddEventModalOpen]);

  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');
  const presentTeachersCount = teachers.filter(t => t.currentStatus === 'Present' || t.attendanceToday === 'Present').length || 5;
  const onLeaveTeachersCount = teachers.filter(t => t.currentStatus === 'On Leave' || t.attendanceToday === 'On Leave').length || 0;

  // Faculty average attendance rate
  const facultyAvgAttendance = useMemo(() => {
    if (!teachers || teachers.length === 0) return 97.1;
    const sum = teachers.reduce((acc, t) => acc + (t.attendanceRate || 95), 0);
    return Number((sum / teachers.length).toFixed(1));
  }, [teachers]);

  // Class 10 sections strictly: 10-A, 10-B, 10-C, 10-D, 10-E
  const VALID_10_SECTIONS = useMemo(() => ['10-A', '10-B', '10-C', '10-D', '10-E'], []);

  // Class-wise breakdown dynamically derived from students central state
  const classAttendanceSummaries = useMemo(() => {
    return VALID_10_SECTIONS.map((secTag) => {
      const secLetter = secTag.split('-')[1];
      const secStudents = students.filter(s => {
        return s.className === secTag || s.section === secLetter;
      });
      const total = secStudents.length;
      const present = secStudents.filter(s => s.todayStatus === 'present').length;
      const absent = secStudents.filter(s => s.todayStatus === 'absent').length;
      const late = secStudents.filter(s => s.todayStatus === 'late').length;
      const attendanceRate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 95.0;

      return {
        className: secTag,
        total,
        present,
        absent,
        late,
        attendanceRate
      };
    });
  }, [students, VALID_10_SECTIONS]);

  // Classes with attendance below 92% (Low threshold alert)
  const lowAttendanceClasses = classAttendanceSummaries.filter(c => c.attendanceRate < 92);

  // Absent students for drilldown modal
  const absentStudentsInInspectedClass = useMemo(() => {
    if (!inspectedClass) return [];
    return students.filter(s => {
      const formatted = s.className || (s.section ? `10-${s.section}` : '10-A');
      return formatted === inspectedClass && (s.todayStatus === 'absent' || s.todayStatus === 'late');
    });
  }, [inspectedClass, students]);

  // Grouped classes strictly for Class 10
  const groupedClasses = useMemo(() => {
    return {
      'Class 10': VALID_10_SECTIONS,
    };
  }, [VALID_10_SECTIONS]);

  // Helper: show toast
  const handleSuccess = (msg: string) => {
    if (onShowToast) {
      onShowToast('Action Completed', msg, 'success');
    }
  };

  // Handler: Add Calendar Event
  const handleSaveCalendarEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    createSchoolCalendarEvent({
      title: newEventTitle.trim(),
      date: newEventDate,
      category: newEventCategory,
      audience: newEventAudience,
      description: newEventDescription.trim() || 'Scheduled institutional academic event.',
    });

    handleSuccess(`Calendar Event "${newEventTitle}" published to ${newEventAudience}.`);
    setIsAddEventModalOpen(false);
    setNewEventTitle('');
    setNewEventDescription('');
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300 pb-12">
      
      {/* 1. TOP COMMAND BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 text-[11px] font-extrabold uppercase tracking-wide">
              Command Center
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Cross-Portal Sync Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Seth Tolaram Bafna Academy — Master Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time administrative nerve center governing faculty, student enrollment, timetables, and campus logistics.
          </p>
        </div>

        {/* Global Action Utility Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search Everything</span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Morning Briefing Trigger */}
          <button
            onClick={() => setIsMorningBriefingOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer border border-amber-200/60 dark:border-amber-800/60 shadow-2xs"
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Morning Briefing</span>
          </button>

          {/* End-of-Day Report Trigger */}
          <button
            onClick={() => setIsEndOfDayReportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Daily Report</span>
          </button>
        </div>
      </div>

      {/* 2. MASTER LIVE STATISTICS (6 CARDS) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
            School-Wide Live Operations
          </h2>
          <span className="text-[11px] text-slate-400">Auto-refreshed with real-time logs</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Students */}
          <div 
            onClick={() => onNavigate('attendance')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Students</span>
              <Users className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {attendanceStats.total}
            </div>
            <div className="mt-1.5 space-y-0.5 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Present:</span>
                <span className="font-bold text-emerald-600">{attendanceStats.present}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Absent:</span>
                <span className="font-bold text-rose-500">{attendanceStats.absent}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Rate:</span>
                <span className="font-bold text-slate-900 dark:text-white">{attendanceStats.rate}%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Teachers & Staff */}
          <div 
            onClick={() => onNavigate('teachers')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Faculty & Staff</span>
              <GraduationCap className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {teachers.length || 5}
            </div>
            <div className="mt-1.5 space-y-0.5 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Avg Attendance:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{facultyAvgAttendance}%</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Present:</span>
                <span className="font-bold text-emerald-600">{presentTeachersCount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>On Leave:</span>
                <span className="font-bold text-amber-600">{onLeaveTeachersCount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Leaves Pending:</span>
                <span className={`font-bold ${pendingLeaves.length > 0 ? 'text-rose-600 font-extrabold' : 'text-slate-400'}`}>
                  {pendingLeaves.length}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Academics */}
          <div 
            onClick={() => onNavigate('academics')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Academics</span>
              <BookOpen className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {classAttendanceSummaries.length}
            </div>
            <div className="mt-1.5 space-y-0.5 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Active Classes:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{classAttendanceSummaries.length}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Upcoming Exams:</span>
                <span className="font-bold text-purple-600">{examsList.length}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Homework Items:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{homeworkList.length}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Transport */}
          <div 
            onClick={() => onNavigate('transport')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Transport</span>
              <Bus className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {transportStats.total}
            </div>
            <div className="mt-1.5 space-y-0.5 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Running:</span>
                <span className="font-bold text-amber-600">{transportStats.active}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>At School:</span>
                <span className="font-bold text-emerald-600">{transportStats.atSchool}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Route Alerts:</span>
                <span className="font-bold text-amber-500">1 Delay</span>
              </div>
            </div>
          </div>

          {/* Card 5: Library */}
          <div 
            onClick={() => onNavigate('library')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Library</span>
              <BookOpen className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {libraryStats.total.toLocaleString()}
            </div>
            <div className="mt-1.5 space-y-0.5 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Available:</span>
                <span className="font-bold text-emerald-600">{libraryStats.available.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Issued Today:</span>
                <span className="font-bold text-blue-600">{libraryStats.issuedToday}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Overdue:</span>
                <span className="font-bold text-slate-400">4 books</span>
              </div>
            </div>
          </div>

          {/* Card 6: Energy */}
          <div 
            onClick={() => onNavigate('energy')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
                <span>Energy</span>
                <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">Sim</span>
              </span>
              <Zap className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {energyStats.todayKwh.toFixed(1)} <span className="text-xs font-normal text-slate-400">kWh</span>
            </div>
            <div className="mt-1.5 space-y-0.5 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Current Load:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">18.7 kWh</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Savings:</span>
                <span className="font-bold text-teal-600">{energyStats.savingsPct}%</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Idle Alerts:</span>
                <span className="font-bold text-amber-500">2 Rooms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ADMIN QUICK ACTIONS BAR (11 FULLY FUNCTIONAL ACTIONS) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Admin Quick Actions
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Direct real operational updates across student, teacher & parent portals
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Action 1: Add Student */}
          <button
            onClick={() => setActiveQuickAction('add_student')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-500" />
            <span>Add Student</span>
          </button>

          {/* Action 2: Add Teacher */}
          <button
            onClick={() => setActiveQuickAction('add_teacher')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            <span>Add Teacher</span>
          </button>

          {/* Action 3: Create Parent */}
          <button
            onClick={() => setActiveQuickAction('create_parent')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
          >
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            <span>Create Parent</span>
          </button>

          {/* Action 4: Assign Teacher */}
          <button
            onClick={() => setActiveQuickAction('assign_teacher')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
          >
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Assign Teacher</span>
          </button>

          {/* Action 5: Create Class */}
          <button
            onClick={() => setActiveQuickAction('create_class')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
          >
            <Plus className="w-3.5 h-3.5 text-teal-500" />
            <span>Create Class</span>
          </button>

          {/* Action 6: Take Attendance */}
          <button
            onClick={onOpenMarkAttendance}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer border border-emerald-200 dark:border-emerald-800"
          >
            <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
            <span>Take Attendance</span>
          </button>

          {/* Action 7: Add Homework */}
          <button
            onClick={() => setActiveQuickAction('add_homework')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Add Homework</span>
          </button>

          {/* Action 8: Add Exam */}
          <button
            onClick={() => setActiveQuickAction('add_exam')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>Add Exam</span>
          </button>

          {/* Action 9: Upload Exam Sheet */}
          <button
            onClick={() => setActiveQuickAction('upload_exam_sheet')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
          >
            <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Upload Exam Sheet</span>
          </button>

          {/* Action 10: Send Announcement */}
          <button
            onClick={() => setActiveQuickAction('send_announcement')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold transition-all cursor-pointer border border-blue-200 dark:border-blue-800"
          >
            <Megaphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Send Announcement</span>
          </button>

          {/* Action 11: Manage Leaves */}
          <button
            onClick={() => setActiveQuickAction('manage_leaves')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              pendingLeaves.length > 0 
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800' 
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200/60 dark:border-slate-700'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
            <span>Manage Leaves</span>
            {pendingLeaves.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                {pendingLeaves.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 4. COMPACT ATTENTION REQUIRED (ALERTS) */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-2xl p-4.5 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
              Attention Required (Live Issues)
            </h2>
          </div>
          <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">Click any item to resolve</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Alert 1: Pending Teacher Leave */}
          <div 
            onClick={() => setActiveQuickAction('manage_leaves')}
            className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs hover:border-amber-400 cursor-pointer transition-colors"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Staff Leave
                </span>
                <span className="text-[11px] text-slate-400">Immediate</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                {pendingLeaves.length} Faculty Leave Request{pendingLeaves.length !== 1 ? 's' : ''} Pending
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {pendingLeaves[0]?.teacherName || 'Faculty members'} requested leave. Substitution review needed.
              </p>
            </div>
            <button className="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/60 rounded-lg shrink-0">
              Review
            </button>
          </div>

          {/* Alert 2: Low Class Attendance */}
          {lowAttendanceClasses.length > 0 && (
            <div 
              onClick={() => setInspectedClass(lowAttendanceClasses[0].className)}
              className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-rose-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs hover:border-rose-400 cursor-pointer transition-colors"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Low Attendance
                  </span>
                  <span className="text-[11px] text-slate-400">Threshold Alert</span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                  Class {lowAttendanceClasses[0].className} at {lowAttendanceClasses[0].attendanceRate}%
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {lowAttendanceClasses[0].absent} students absent today. Parent alerts recommended.
                </p>
              </div>
              <button className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 dark:bg-rose-950/60 rounded-lg shrink-0">
                Inspect
              </button>
            </div>
          )}

          {/* Alert 3: Upcoming Exams */}
          <div 
            onClick={() => onNavigate('academics')}
            className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-blue-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs hover:border-blue-400 cursor-pointer transition-colors"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Examinations
                </span>
                <span className="text-[11px] text-slate-400">Sept 28</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                CBSE Term-1 Assessment Starts in 5 Days
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Syllabus revisions and hall allocations finalized.
              </p>
            </div>
            <button className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/60 rounded-lg shrink-0">
              Details
            </button>
          </div>

          {/* Alert 4: Transport */}
          <div 
            onClick={() => onNavigate('transport')}
            className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs hover:border-amber-400 cursor-pointer transition-colors"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Transit
                </span>
                <span className="text-[11px] text-slate-400">Route 4</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                Bus 04 Delayed (12 mins)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Congestion near Civil Lines flyover. ETA updated for 38 riders.
              </p>
            </div>
            <button className="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/60 rounded-lg shrink-0">
              Track
            </button>
          </div>

          {/* Alert 5: Energy */}
          <div 
            onClick={() => onNavigate('energy')}
            className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-teal-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs hover:border-teal-400 cursor-pointer transition-colors"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  Energy & HVAC
                </span>
                <span className="text-[11px] text-slate-400">Science Wing</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                High Idle Load in Lab 2 & Room 204
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Air conditioners running with 0 occupancy detected.
              </p>
            </div>
            <button className="px-2.5 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 dark:bg-teal-950/60 rounded-lg shrink-0">
              Optimize
            </button>
          </div>
        </div>
      </div>

      {/* 5. TODAY'S ATTENDANCE OVERVIEW & CLASS-WISE BREAKDOWN */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
              <span>Today's Attendance Overview</span>
            </h2>
            <p className="text-xs text-slate-500">
              Institutional attendance: <span className="font-bold text-emerald-600">{attendanceStats.present} present</span>, <span className="font-bold text-rose-500">{attendanceStats.absent} absent</span> ({attendanceStats.rate}% attendance rate).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMarkAttendance}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Open Live Roll Call
            </button>
          </div>
        </div>

        {/* Class-wise Attendance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {classAttendanceSummaries.map((cls) => {
            const isLow = cls.attendanceRate < 92;
            return (
              <div
                key={cls.className}
                onClick={() => setInspectedClass(cls.className)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:shadow-sm ${
                  isLow 
                    ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 hover:border-rose-400' 
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-900 dark:text-white">{cls.className}</span>
                  {isLow && (
                    <span className="text-[10px] font-black text-rose-600" title="Attendance below 92% threshold">
                      ⚠️ Low
                    </span>
                  )}
                </div>
                <div className={`text-lg font-black mt-1 ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                  {cls.attendanceRate}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {cls.present}/{cls.total} Present
                </div>
                <div className="mt-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                  <Eye className="w-3 h-3" />
                  <span>Inspect</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. CLASSES & SECTIONS OVERVIEW */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Classes & Sections Master Directory</span>
            </h2>
            <p className="text-xs text-slate-500">
              Academic structure with class teachers, student counts & assigned faculty.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveQuickAction('create_class')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-blue-500" />
              <span>Add Class / Section</span>
            </button>
            <button
              onClick={() => setActiveQuickAction('assign_teacher')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Assign Teacher</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {VALID_10_SECTIONS.map(secTag => {
            const summary = classAttendanceSummaries.find(c => c.className === secTag);
            const enrolledCount = summary?.total || 0;
            const classTeachersMap = getClass10Teachers();
            const teacherName = classTeachersMap[secTag] || 'Not Assigned';

            return (
              <div 
                key={secTag}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-2 shadow-2xs hover:border-blue-400 transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    Class {secTag}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {enrolledCount} Students
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-400 font-medium">Class Teacher:</span>{' '}
                    <span className={`font-bold ${teacherName === 'Not Assigned' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                      {teacherName}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 pt-1 text-[10px]">
                    <span>Present: <strong className="text-emerald-600">{summary?.present || 0}</strong></span>
                    <span>Absent: <strong className="text-rose-500">{summary?.absent || 0}</strong></span>
                    <span>Rate: <strong className="text-slate-700 dark:text-slate-300">{summary?.attendanceRate || 0}%</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('students')}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View Students</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setActiveQuickAction('assign_teacher')}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Edit Teacher
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. FACULTY INSIGHTS WIDGET (ATTENDANCE TRENDS, WORKLOAD, LEAVES) */}
      <FacultyInsightsWidget
        teachers={teachers}
        leaveRequests={leaveRequests}
        onNavigate={onNavigate}
        onOpenManageLeaves={() => setActiveQuickAction('manage_leaves')}
      />

      {/* 8. RECENT ACTIVITY & LIVE SCHOOL CALENDAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* RECENT ACTIVITY FEED */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span>Recent Campus Activity</span>
            </h2>
            <span className="text-xs text-slate-400">Live operational ledger</span>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
            {[
              {
                id: 'act-1',
                time: '10 mins ago',
                user: 'Rajesh Sharma',
                action: 'assigned Homework to Class 10-B',
                detail: 'Quadratic Formula & Discriminant Exercises (Due: Sept 25)',
                tag: 'Homework',
                tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              },
              {
                id: 'act-2',
                time: '25 mins ago',
                user: 'Administration',
                action: 'reassigned student Aarav Sharma',
                detail: 'Transferred from Class 10-B to Class 10-C (Roll #28)',
                tag: 'Roster',
                tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
              },
              {
                id: 'act-3',
                time: '1 hour ago',
                user: 'Krishna Sharma',
                action: 'submitted Medical Leave request',
                detail: 'Applied for 2 days leave (Sept 24 - 25). Timetable substitution queued.',
                tag: 'Leave',
                tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              },
              {
                id: 'act-4',
                time: '2 hours ago',
                user: 'Examination Wing',
                action: 'published results for Periodic Assessment 1',
                detail: 'CBSE Mathematics scores uploaded. Report cards generated for 35 students.',
                tag: 'Exams',
                tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              },
              {
                id: 'act-5',
                time: '3 hours ago',
                user: 'Transportation Control',
                action: 'dispatched Bus 04 on Route 4',
                detail: 'Civil Lines morning student pickup route started with GPS telemetry active.',
                tag: 'Transit',
                tagColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
              }
            ].map(act => (
              <div key={act.id} className="pt-3 first:pt-0 flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{act.user}</span>
                    <span className="text-slate-500">{act.action}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${act.tagColor}`}>
                      {act.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {act.detail}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SCHOOL CALENDAR */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>School Calendar & Scheduled Events</span>
            </h2>
            <button
              onClick={() => setIsAddEventModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold pb-1">
            {['all', 'Holiday', 'Exam', 'PTM', 'Sports', 'Academic'].map(cat => (
              <button
                key={cat}
                onClick={() => setCalendarCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                  calendarCategoryFilter === cat
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Events' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
            {calendarEvents
              .filter(e => calendarCategoryFilter === 'all' || e.category === calendarCategoryFilter)
              .map(evt => (
                <div 
                  key={evt.id}
                  className="p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{evt.title}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        evt.category === 'Holiday' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        evt.category === 'Exam' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        evt.category === 'PTM' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {evt.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      📅 {evt.date} {evt.time ? `• ⏰ ${evt.time}` : ''} {evt.location ? `• 📍 ${evt.location}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                      {evt.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {evt.audience}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* 1. Admin Quick Actions Modals (Supports all 11 Actions) */}
      <AdminQuickActionModals
        type={activeQuickAction}
        onClose={() => setActiveQuickAction(null)}
        onSuccess={handleSuccess}
        students={students}
        teachers={teachers}
        classes={classAttendanceSummaries}
        leaveRequests={leaveRequests}
        onAddStudent={onAddStudent}
        onAddTeacher={onAddTeacher}
        onUpdateTeacher={onUpdateTeacher}
        onAddClass={onAddClass}
        onApproveLeave={onApproveLeave}
        onRejectLeave={onRejectLeave}
        onNavigateToAttendance={onOpenMarkAttendance}
      />

      {/* 2. Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
        students={students}
        teachers={teachers}
        classes={classAttendanceSummaries}
      />

      {/* 3. Morning Briefing Modal */}
      <MorningBriefingModal
        isOpen={isMorningBriefingOpen}
        onClose={() => setIsMorningBriefingOpen(false)}
        onNavigate={onNavigate}
      />

      {/* 4. End of Day Report Modal */}
      <EndOfDayReportModal
        isOpen={isEndOfDayReportOpen}
        onClose={() => setIsEndOfDayReportOpen(false)}
        attendanceRate={attendanceStats.rate}
        presentCount={attendanceStats.present}
        totalStudents={attendanceStats.total}
      />

      {/* 5. AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onNavigate={onNavigate}
        teachers={teachers}
        substitutions={substitutions}
        timetableSlots={timetableSlots}
      />

      {/* 6. Class Attendance Drilldown Modal */}
      {inspectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Class {inspectedClass} Attendance Inspection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live roll call details & absent student tracking
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectedClass(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-xs text-blue-900 dark:text-blue-300">
                <span>Class Attendance Status:</span>
                <span className="font-bold text-sm">
                  {classAttendanceSummaries.find(c => c.className === inspectedClass)?.attendanceRate || 94}%
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Absent / Unaccounted Students Today ({absentStudentsInInspectedClass.length})
                </h4>

                {absentStudentsInInspectedClass.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">All students present or accounted for!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No attendance infractions recorded for Class {inspectedClass} today.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {absentStudentsInInspectedClass.map(s => (
                      <div 
                        key={s.id}
                        className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {s.name} (Roll #{s.rollNo || '-'})
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Guardian: {s.guardianName} • Phone: {s.guardianPhone}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            createSchoolNotification({
                              title: `Attendance Alert: ${s.name}`,
                              message: `Dear ${s.guardianName}, your child was marked absent today in Class ${inspectedClass}. Please contact the school.`,
                              category: 'Emergency',
                              priority: 'Urgent',
                              audience: 'Parents',
                              targetStudentId: s.id,
                              createdBy: 'Administration Office'
                            });
                            handleSuccess(`SMS & Portal Attendance alert transmitted to ${s.guardianName} (${s.guardianPhone}).`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Alert Parent</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectedClass(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add School Calendar Event Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Schedule Calendar Event
                  </h3>
                  <p className="text-xs text-slate-500">
                    Creates school-wide calendar entry & automatically dispatches notifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEventModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCalendarEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Annual Inter-House Science Fair"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-purple-500"
                  >
                    <option value="Holiday">Holiday</option>
                    <option value="Exam">Exam</option>
                    <option value="PTM">Parent-Teacher Meeting (PTM)</option>
                    <option value="Event">School Event</option>
                    <option value="Sports">Sports</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Audience *
                </label>
                <select
                  value={newEventAudience}
                  onChange={(e) => setNewEventAudience(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-purple-500"
                >
                  <option value="Everyone">Everyone (School-Wide)</option>
                  <option value="Students">All Students</option>
                  <option value="Parents">All Parents</option>
                  <option value="Teachers">All Teachers & Faculty</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Event Details
                </label>
                <textarea
                  rows={3}
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="Provide instructions, timings, or location..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-purple-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Schedule & Broadcast Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
