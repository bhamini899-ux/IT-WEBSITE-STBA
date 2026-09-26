import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  FileSpreadsheet, 
  Check, 
  SlidersHorizontal,
  FileCheck,
  RotateCcw,
  Trash2,
  AlertTriangle,
  ArrowDownAZ,
  GraduationCap
} from 'lucide-react';
import { Student, StudentLeaveRecord, StudentAuditLogItem } from '../types';
import { StudentDashboardKPI } from '../components/Student360/StudentDashboardKPI';
import { StudentFiltersBar, StudentFilterOptions } from '../components/Student360/StudentFiltersBar';
import { StudentDirectoryTable } from '../components/Student360/StudentDirectoryTable';
import { Student360ProfileModal } from '../components/Student360/Student360ProfileModal';
import { AddStudentWizardModal } from '../components/Student360/AddStudentWizardModal';
import { DigitalIdCardModal } from '../components/Student360/DigitalIdCardModal';
import { StudentQRCodeModal } from '../components/Student360/StudentQRCodeModal';
import { BulkStudentOperationsModal } from '../components/Student360/BulkStudentOperationsModal';
import { StudentCopilotModal } from '../components/Student360/StudentCopilotModal';
import { StudentAnalyticsModal } from '../components/Student360/StudentAnalyticsModal';
import { SendMessageModal } from '../components/Student360/SendMessageModal';
import { StudentAuditLogModal } from '../components/Student360/StudentAuditLogModal';
import { RemoveStudentConfirmModal } from '../components/Student360/RemoveStudentConfirmModal';
import { EditStudentClassModal } from '../components/Student360/EditStudentClassModal';
import { ClassTeacherManagementModal } from '../components/Student360/ClassTeacherManagementModal';
import { Class10ImportPreviewModal } from '../components/Student360/Class10ImportPreviewModal';
import { INITIAL_STUDENT_AUDIT_LOG } from '../data/student360Data';
import { getClass10Teachers, CLASS_TEACHER_EVENT } from '../services/classTeacherService';
import { reassignSectionRollNumbers } from '../services/studentPersistenceService';

interface StudentManagementViewProps {
  students: Student[];
  onUpdateStudent: (updatedStudent: Student) => void;
  onAddStudent: (newStudent: Student) => void;
  onRemoveStudent?: (studentId: string) => void;
  borrowRecords?: any[];
  buses?: any[];
  onNavigateSection?: (section: any) => void;
}

const DEFAULT_FILTERS: StudentFilterOptions = {
  searchQuery: '',
  selectedClass: 'all',
  selectedHouse: 'all',
  selectedAttendanceRange: 'all',
  selectedFeeStatus: 'all',
  selectedLibraryStatus: 'all',
  selectedTransport: 'all',
  selectedStudentStatus: 'all',
  onlyNewAdmissions: false,
  onlyAttentionNeeded: false,
  sortBy: 'name_asc',
};

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  students,
  onUpdateStudent,
  onAddStudent,
  onRemoveStudent,
  borrowRecords = [],
  buses = [],
}) => {
  // Filters state
  const [filters, setFilters] = useState<StudentFilterOptions>(DEFAULT_FILTERS);
  const [activeKpiFilter, setActiveKpiFilter] = useState<string>('all');

  // Selection state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modals state
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [selectedStudentForId, setSelectedStudentForId] = useState<Student | null>(null);
  const [selectedStudentForQR, setSelectedStudentForQR] = useState<Student | null>(null);
  const [selectedStudentForMessage, setSelectedStudentForMessage] = useState<Student | null>(null);
  const [studentToRemove, setStudentToRemove] = useState<Student | null>(null);
  const [studentForClassEdit, setStudentForClassEdit] = useState<Student | null>(null);
  const [isBulkRemoveModalOpen, setIsBulkRemoveModalOpen] = useState(false);
  const [isAddWizardOpen, setIsAddWizardOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isClassTeacherModalOpen, setIsClassTeacherModalOpen] = useState(false);
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);

  // Class Teachers Real-Time State
  const [teachersMap, setTeachersMap] = useState<Record<string, string>>(() => getClass10Teachers());

  useEffect(() => {
    const handleUpdate = () => {
      setTeachersMap(getClass10Teachers());
    };
    window.addEventListener(CLASS_TEACHER_EVENT, handleUpdate);
    return () => window.removeEventListener(CLASS_TEACHER_EVENT, handleUpdate);
  }, []);

  // Section Breakdown Counts strictly across Class 10 sections
  const sectionStats = useMemo(() => {
    const getCount = (sec: string) => students.filter(s => s.className === `10-${sec}` || s.section === sec).length;
    return {
      all: students.length,
      A: getCount('A'),
      B: getCount('B'),
      C: getCount('C'),
      D: getCount('D'),
      E: getCount('E'),
    };
  }, [students]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<StudentAuditLogItem[]>(INITIAL_STUDENT_AUDIT_LOG);

  // Toast notification
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Re-index and alphabetical roll numbers handler
  const handleReassignRollNumbers = () => {
    const reindexed = reassignSectionRollNumbers(students);
    reindexed.forEach(s => onUpdateStudent(s));
    showNotification('✓ Official Roll Numbers (1 to N) alphabetically assigned across all Class 10 sections.');
  };

  // KPI Card Filter Trigger
  const handleKpiFilter = (filterType: string) => {
    setActiveKpiFilter(filterType);
    if (filterType === 'all') {
      setFilters(DEFAULT_FILTERS);
    } else if (filterType === 'Active') {
      setFilters({ ...DEFAULT_FILTERS, selectedStudentStatus: 'Active' });
    } else if (filterType === 'new_admissions') {
      setFilters({ ...DEFAULT_FILTERS, onlyNewAdmissions: true });
    } else if (filterType === 'On Leave') {
      setFilters({ ...DEFAULT_FILTERS, selectedStudentStatus: 'On Leave' });
    } else if (filterType === 'attendance_attention') {
      setFilters({ ...DEFAULT_FILTERS, selectedAttendanceRange: '<75', onlyAttentionNeeded: true });
    } else if (filterType === 'pending_actions') {
      setFilters({ ...DEFAULT_FILTERS, selectedFeeStatus: 'Overdue' });
    }
  };

  // Filter & Sort Logic
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();

          // Natural language shortcuts
          if (q.includes('below 75') || q.includes('< 75') || q.includes('<75')) {
            if (student.attendancePercentage >= 75) return false;
          } else if (q.includes('overdue book') || q.includes('library')) {
            if (!student.libraryDetails?.overdueCount || student.libraryDetails.overdueCount === 0) return false;
          } else if (q.includes('pending fee') || q.includes('overdue fee')) {
            if (student.feeStatus === 'Paid') return false;
          } else if (q.includes('new admission')) {
            if (!student.isNewAdmission) return false;
          } else {
            // General text match
            const matchesText =
              student.name.toLowerCase().includes(q) ||
              student.id.toLowerCase().includes(q) ||
              (student.admissionNo && student.admissionNo.toLowerCase().includes(q)) ||
              student.className.toLowerCase().includes(q) ||
              (student.house && student.house.toLowerCase().includes(q)) ||
              (student.guardianName && student.guardianName.toLowerCase().includes(q)) ||
              (student.guardianPhone && student.guardianPhone.includes(q)) ||
              (student.transportDetails?.busNumber && student.transportDetails.busNumber.toLowerCase().includes(q)) ||
              (student.transportDetails?.stopName && student.transportDetails.stopName.toLowerCase().includes(q));

            if (!matchesText) return false;
          }
        }

        // Class
        if (filters.selectedClass !== 'all' && student.className !== filters.selectedClass) {
          return false;
        }

        // House
        if (filters.selectedHouse !== 'all' && student.house !== filters.selectedHouse) {
          return false;
        }

        // Attendance Range
        if (filters.selectedAttendanceRange === '<75' && student.attendancePercentage >= 75) {
          return false;
        }
        if (filters.selectedAttendanceRange === '75-90' && (student.attendancePercentage < 75 || student.attendancePercentage > 90)) {
          return false;
        }
        if (filters.selectedAttendanceRange === '>90' && student.attendancePercentage <= 90) {
          return false;
        }

        // Fee Status
        if (filters.selectedFeeStatus !== 'all' && student.feeStatus !== filters.selectedFeeStatus) {
          return false;
        }

        // Library Status
        if (filters.selectedLibraryStatus === 'issued') {
          if (!student.libraryDetails?.activeIssuedCount || student.libraryDetails.activeIssuedCount === 0) return false;
        } else if (filters.selectedLibraryStatus === 'overdue') {
          if (!student.libraryDetails?.overdueCount || student.libraryDetails.overdueCount === 0) return false;
        } else if (filters.selectedLibraryStatus === 'clean') {
          if (student.libraryDetails?.activeIssuedCount && student.libraryDetails.activeIssuedCount > 0) return false;
        }

        // Transport
        if (filters.selectedTransport !== 'all') {
          const matchBus = student.transportDetails?.busNumber === filters.selectedTransport;
          const matchPrivate = filters.selectedTransport === 'Private' && student.transportRoute === 'Private';
          if (!matchBus && !matchPrivate) return false;
        }

        // Student Status
        if (filters.selectedStudentStatus !== 'all') {
          if (student.status !== filters.selectedStudentStatus) return false;
        }

        // Only New Admissions
        if (filters.onlyNewAdmissions && !student.isNewAdmission) {
          return false;
        }

        // Only Attention Needed
        if (filters.onlyAttentionNeeded) {
          const needsAttention =
            student.attendancePercentage < 75 ||
            student.feeStatus === 'Overdue' ||
            (student.libraryDetails?.overdueCount && student.libraryDetails.overdueCount > 0);
          if (!needsAttention) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'roll_asc':
            return (a.rollNo || 0) - (b.rollNo || 0);
          case 'attendance_desc':
            return b.attendancePercentage - a.attendancePercentage;
          case 'attendance_asc':
            return a.attendancePercentage - b.attendancePercentage;
          case 'academic_desc':
            return (b.academicAverage || 0) - (a.academicAverage || 0);
          case 'fee_due':
            return (b.feeDetails?.overdueAmount || 0) - (a.feeDetails?.overdueAmount || 0);
          case 'name_asc':
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [students, filters]);

  // Selection handlers
  const handleToggleSelectStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  // Leave sanction handler
  const handleApplyLeave = (studentId: string, leave: Partial<StudentLeaveRecord>) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const fullLeaveRecord: StudentLeaveRecord = {
      id: leave.id || `LV-${Date.now()}`,
      category: leave.category || 'Medical',
      startDate: leave.startDate || 'Today',
      endDate: leave.endDate || 'Tomorrow',
      days: leave.days || 1,
      reason: leave.reason || 'Approved leave',
      status: 'Approved',
      appliedAt: 'Today',
      approvedBy: 'Dr. V. K. Saxena (Principal)',
    };

    const updated: Student = {
      ...student,
      status: 'On Leave',
      todayStatus: 'excused',
      leaves: [fullLeaveRecord, ...(student.leaves || [])],
      timeline: [
        {
          id: `TM-${Date.now()}`,
          date: 'Today',
          time: 'Just now',
          category: 'Leave',
          title: `Sanctioned ${leave.category} Leave (${leave.days}d)`,
          description: leave.reason || 'Excused absence approved.',
        },
        ...(student.timeline || []),
      ],
    };

    onUpdateStudent(updated);

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: 'Just now',
        user: 'Dr. V. K. Saxena (Principal)',
        action: 'Sanctioned Leave',
        studentId: student.id,
        studentName: student.name,
        details: `${leave.days}-day ${leave.category} leave approved (${leave.reason}).`,
      },
      ...prev,
    ]);

    showNotification(`✓ Leave approved and logged for ${student.name}.`);
  };

  // Educator Note Handler
  const handleAddNote = (studentId: string, text: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const newNote = {
      id: `NOT-${Date.now()}`,
      author: 'Academic Administration',
      date: 'Today',
      text,
    };

    const updated: Student = {
      ...student,
      notes: [newNote, ...(student.notes || [])],
    };

    onUpdateStudent(updated);
    showNotification(`✓ Educator note saved to ${student.name}'s file.`);
  };

  // Send Message Handler
  const handleSendMessage = (studentId: string, channel: 'SMS' | 'WhatsApp' | 'Email', subject: string, message: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const newComm = {
      id: `COM-${Date.now()}`,
      date: 'Today',
      time: 'Just now',
      channel,
      recipient: student.guardianPhone,
      subject,
      message,
      delivered: true,
      sentBy: 'Administration Office',
    };

    const updated: Student = {
      ...student,
      communications: [newComm, ...(student.communications || [])],
    };

    onUpdateStudent(updated);

    setAuditLogs((prev) => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: 'Just now',
        user: 'Administration Desk',
        action: `Dispatched ${channel}`,
        studentId: student.id,
        studentName: student.name,
        details: `Dispatched "${subject}" to ${student.guardianPhone}.`,
      },
      ...prev,
    ]);

    showNotification(`✓ ${channel} sent to ${student.guardianName} (${student.guardianPhone}).`);
  };

  // Simulate Turnstile scan
  const handleSimulateTap = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const updated: Student = {
      ...student,
      todayStatus: 'present',
      timeline: [
        {
          id: `TM-${Date.now()}`,
          date: 'Today',
          time: 'Just now',
          category: 'Attendance',
          title: 'Turnstile RFID Tap Recorded',
          description: 'Simulated Gate Turnstile reader verified badge UID.',
        },
        ...(student.timeline || []),
      ],
    };

    onUpdateStudent(updated);
    showNotification(`✓ Turnstile tap recorded: ${student.name} marked Present.`);
  };

  // Bulk Operations Update
  const handleApplyBulkUpdate = (updatedStudents: Partial<Student>[], actionSummary: string) => {
    updatedStudents.forEach((partial) => {
      const existing = students.find((s) => s.id === partial.id);
      if (existing) {
        onUpdateStudent({
          ...existing,
          ...partial,
        });
      }
    });

    setAuditLogs((prev) => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: 'Just now',
        user: 'Administrator',
        action: 'Bulk Update Executed',
        studentId: 'MULTI',
        studentName: `${updatedStudents.length} Students`,
        details: actionSummary,
      },
      ...prev,
    ]);

    setSelectedStudentIds([]);
    showNotification(`✓ Bulk action complete: ${actionSummary}`);
  };

  // Single Student Remove Handler
  const handleConfirmRemoveStudent = (
    studentId: string, 
    reason: string, 
    tcNumber?: string, 
    remarks?: string, 
    archiveRecord?: boolean
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    if (archiveRecord) {
      setAuditLogs((prev) => [
        {
          id: `AUD-${Date.now()}`,
          timestamp: 'Just now',
          user: 'Dr. V. K. Saxena (Principal)',
          action: 'Student Removed from Roster',
          studentId: student.id,
          studentName: student.name,
          details: `Withdrawn from Class ${student.className}. Reason: ${reason}${tcNumber ? ` [TC: ${tcNumber}]` : ''}${remarks ? ` - ${remarks}` : ''}. Archive snapshot recorded.`,
        },
        ...prev,
      ]);
    }

    if (onRemoveStudent) {
      onRemoveStudent(studentId);
    }

    if (selectedStudentForProfile?.id === studentId) {
      setSelectedStudentForProfile(null);
    }

    setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    showNotification(`✓ ${student.name} (${student.id}) has been removed from the school roster.`);
  };

  // Bulk Remove Handler
  const handleConfirmBulkRemove = (reason: string = 'Administrative Bulk Withdrawal') => {
    if (selectedStudentIds.length === 0) return;
    const removedCount = selectedStudentIds.length;
    const targetStudents = students.filter((s) => selectedStudentIds.includes(s.id));
    const targetNames = targetStudents.map((s) => s.name).slice(0, 3).join(', ') + (targetStudents.length > 3 ? ` +${targetStudents.length - 3} more` : '');

    setAuditLogs((prev) => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: 'Just now',
        user: 'Dr. V. K. Saxena (Principal)',
        action: 'Bulk Student Removal Executed',
        studentId: 'MULTI',
        studentName: `${removedCount} Students`,
        details: `Batch de-enrollment executed for ${removedCount} students (${targetNames}). Reason: ${reason}.`,
      },
      ...prev,
    ]);

    if (onRemoveStudent) {
      selectedStudentIds.forEach((id) => onRemoveStudent(id));
    }

    setSelectedStudentIds([]);
    setIsBulkRemoveModalOpen(false);
    showNotification(`✓ ${removedCount} students have been removed from the academy roster.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Class', 'Roll', 'House', 'Attendance%', 'AcademicStatus', 'FeeStatus', 'Guardian', 'Phone', 'Transport'];
    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.name}"`,
      s.className,
      s.rollNo || '',
      s.house || '',
      `${s.attendancePercentage}%`,
      s.academicStatus || 'Good',
      s.feeStatus || 'Paid',
      `"${s.guardianName || ''}"`,
      s.guardianPhone || '',
      `"${s.transportDetails?.busNumber || s.transportRoute || 'Private'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartSchool360_Student_Directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`✓ Exported ${filteredStudents.length} student records to CSV.`);
  };

  // Import CSV Simulation
  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv, .xlsx';
    input.onchange = () => {
      showNotification('✓ CSV Import verified: 24 new student records validated & staged.');
    };
    input.click();
  };

  return (
    <div id="student-management-module" className="space-y-4 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Module Title & Quick Meta Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Class 10 Student 360° Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Class 10 Exclusive (10-A to 10-E)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official Roster: Seth Tolaram Bafna Academy (2026-2027) • Real PDF Student Records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>PDF Roster Preview (219)</span>
          </button>
          <button
            onClick={() => setIsClassTeacherModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Class Teachers</span>
          </button>
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: STUDENT DASHBOARD & QUICK ACTIONS */}
      <StudentDashboardKPI
        students={students}
        onOpenAddStudent={() => setIsAddWizardOpen(true)}
        onOpenBulkActions={() => setIsBulkModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenAICopilot={() => setIsCopilotOpen(true)}
        onExport={handleExportCSV}
        onImport={handleImportCSV}
        onFilterByStatus={handleKpiFilter}
        activeFilterBadge={activeKpiFilter}
        totalLoaded={students.length}
      />

      {/* SECTION 1.5: CLASS 10 SECTION NAVIGATION STRIP & ROLL NUMBER ORGANIZER */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 shrink-0">
            Section:
          </span>
          <button
            onClick={() => setFilters(prev => ({ ...prev, selectedClass: 'all' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filters.selectedClass === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            All Class 10 ({sectionStats.all})
          </button>

          {(['A', 'B', 'C', 'D', 'E'] as const).map(sec => {
            const secKey = `10-${sec}`;
            const isSelected = filters.selectedClass === secKey;
            const teacherName = teachersMap[secKey] || 'Not Assigned';
            const count = sectionStats[sec];

            return (
              <button
                key={sec}
                onClick={() => setFilters(prev => ({ ...prev, selectedClass: secKey }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Section 10-{sec} ({count})</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                  isSelected 
                    ? 'bg-blue-700 text-blue-100' 
                    : teacherName !== 'Not Assigned'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {teacherName === 'Not Assigned' ? 'No CT' : `CT: ${teacherName.split(' ')[0]}`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReassignRollNumbers}
            title="Sort students alphabetically within each section and re-index sequential roll numbers 1 to N"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <ArrowDownAZ className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Re-Index Roll Nos (A → Z)</span>
          </button>
          <button
            onClick={() => setIsClassTeacherModalOpen(true)}
            title="Manage official Class Teacher allocations for Class 10"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Class Teachers</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: SMART SEARCH & ADVANCED FILTERS */}
      <StudentFiltersBar
        filters={filters}
        onChangeFilters={setFilters}
        onResetFilters={() => {
          setFilters(DEFAULT_FILTERS);
          setActiveKpiFilter('all');
        }}
        totalFiltered={filteredStudents.length}
        totalStudents={students.length}
      />

      {/* Selected Items Multi-action Strip if any selected */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 p-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in flex-wrap gap-2">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold">
            <Check className="w-4 h-4 text-blue-600" />
            <span>{selectedStudentIds.length} students selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-colors"
            >
              Apply Bulk Actions
            </button>
            <button
              onClick={() => setIsBulkRemoveModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Selected ({selectedStudentIds.length})</span>
            </button>
            <button
              onClick={() => setSelectedStudentIds([])}
              className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: STUDENT DIRECTORY TABLE */}
      <StudentDirectoryTable
        students={filteredStudents}
        selectedStudentIds={selectedStudentIds}
        onToggleSelectStudent={handleToggleSelectStudent}
        onToggleSelectAll={handleToggleSelectAll}
        onOpenProfile={(stu) => setSelectedStudentForProfile(stu)}
        onOpenEdit={(stu) => setStudentForClassEdit(stu)}
        onOpenMessage={(stu) => setSelectedStudentForMessage(stu)}
        onOpenDigitalId={(stu) => setSelectedStudentForId(stu)}
        onOpenQRCode={(stu) => setSelectedStudentForQR(stu)}
        onRequestRemove={(stu) => setStudentToRemove(stu)}
      />

      {/* MODALS */}

      {/* 0. Edit Class & Section Modal */}
      <EditStudentClassModal
        student={studentForClassEdit}
        isOpen={!!studentForClassEdit}
        onClose={() => setStudentForClassEdit(null)}
        onSave={(updated) => {
          onUpdateStudent(updated);
          if (selectedStudentForProfile?.id === updated.id) {
            setSelectedStudentForProfile(updated);
          }
          showNotification(`✓ ${updated.name} reassigned to Class ${updated.className}${updated.section ? '-' + updated.section : ''}. Timetable and faculty access updated.`);
        }}
      />

      {/* 1. Student 360° Profile Modal */}
      <Student360ProfileModal
        student={selectedStudentForProfile}
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        onOpenDigitalId={(stu) => {
          setSelectedStudentForProfile(null);
          setSelectedStudentForId(stu);
        }}
        onOpenQRCode={(stu) => {
          setSelectedStudentForProfile(null);
          setSelectedStudentForQR(stu);
        }}
        onOpenMessage={(stu) => {
          setSelectedStudentForProfile(null);
          setSelectedStudentForMessage(stu);
        }}
        onOpenClassEdit={(stu) => {
          setStudentForClassEdit(stu);
        }}
        onRequestRemove={(stu) => {
          setSelectedStudentForProfile(null);
          setStudentToRemove(stu);
        }}
        onApplyLeave={handleApplyLeave}
        onAddNote={handleAddNote}
        borrowRecords={borrowRecords}
        buses={buses}
      />

      {/* 2. Add Student Wizard Modal */}
      <AddStudentWizardModal
        isOpen={isAddWizardOpen}
        onClose={() => setIsAddWizardOpen(false)}
        onAddStudent={(newStudent) => {
          onAddStudent(newStudent);
          showNotification(`✓ ${newStudent.name} successfully enrolled in Class ${newStudent.className}!`);
        }}
      />

      {/* 3. Digital ID Card Modal */}
      <DigitalIdCardModal
        student={selectedStudentForId}
        isOpen={!!selectedStudentForId}
        onClose={() => setSelectedStudentForId(null)}
      />

      {/* 4. QR Code Modal */}
      <StudentQRCodeModal
        student={selectedStudentForQR}
        isOpen={!!selectedStudentForQR}
        onClose={() => setSelectedStudentForQR(null)}
        onSimulateTap={handleSimulateTap}
      />

      {/* 5. Bulk Student Operations Modal */}
      <BulkStudentOperationsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedStudentIds={selectedStudentIds}
        students={filteredStudents}
        onApplyBulkUpdate={handleApplyBulkUpdate}
      />

      {/* 6. AI Student Copilot Modal */}
      <StudentCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        students={students}
        onOpenProfile={(stu) => setSelectedStudentForProfile(stu)}
      />

      {/* 7. Student Analytics Modal */}
      <StudentAnalyticsModal
        students={students}
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* 8. Send Message Modal */}
      <SendMessageModal
        student={selectedStudentForMessage}
        isOpen={!!selectedStudentForMessage}
        onClose={() => setSelectedStudentForMessage(null)}
        onSendMessage={handleSendMessage}
      />

      {/* 9. Audit Log Modal */}
      <StudentAuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={auditLogs}
      />

      {/* 10. Single Student Removal Confirmation Modal */}
      <RemoveStudentConfirmModal
        student={studentToRemove}
        isOpen={!!studentToRemove}
        onClose={() => setStudentToRemove(null)}
        onConfirmRemove={handleConfirmRemoveStudent}
      />

      {/* 11. Bulk Student Removal Confirmation Modal */}
      {isBulkRemoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/50 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <h3 className="text-sm font-black">Remove {selectedStudentIds.length} Selected Students?</h3>
                <p className="text-[11px] text-rose-200/80">Batch administrative de-enrollment</p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="text-rose-800 dark:text-rose-300 text-[11px] leading-relaxed">
                  Are you sure you want to remove <strong className="font-bold">{selectedStudentIds.length} students</strong> from active rolls? Their student and parent portal access will be revoked immediately and bus/library allocations cleared.
                </p>
              </div>

              <div className="max-h-36 overflow-y-auto rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 space-y-1 divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                {students
                  .filter((s) => selectedStudentIds.includes(s.id))
                  .map((s) => (
                    <div key={s.id} className="pt-1 first:pt-0 flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                      <span className="font-mono text-slate-400 text-[10px]">Class {s.className} • {s.id}</span>
                    </div>
                  ))}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsBulkRemoveModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmBulkRemove('Administrative Batch Removal')}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove {selectedStudentIds.length} Students</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 12. Class Teacher Management Modal */}
      <ClassTeacherManagementModal
        isOpen={isClassTeacherModalOpen}
        onClose={() => setIsClassTeacherModalOpen(false)}
        onAssignmentsUpdated={(map) => {
          setTeachersMap({ ...map });
          showNotification(`✓ Class Teacher assignments updated successfully.`);
        }}
      />

      {/* 13. Class 10 PDF Import Preview Modal */}
      <Class10ImportPreviewModal
        isOpen={isImportPreviewOpen}
        onClose={() => setIsImportPreviewOpen(false)}
        onConfirmImport={(realStudents) => {
          realStudents.forEach(stu => onAddStudent(stu));
          showNotification(`✓ Successfully confirmed and imported 219 Class 10 students from official PDF roster!`);
        }}
      />
    </div>
  );
};
