import React, { useState, useEffect } from 'react';
import { 
  AppSection, 
  Student, 
  Book, 
  BorrowRecord, 
  Bus, 
  TransportRoute, 
  ClassroomEnergy, 
  SchoolNotification, 
  ToastMessage,
  ClassAttendanceSummary,
  Teacher,
  StaffMember,
  TimetableSlot,
  SubstitutionRecord,
  TeacherLeaveRequest,
  TeacherTask,
  TeacherActivityLog,
  StaffAttendanceStatus,
  UserAccount,
  SystemRole
} from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_CLASSES, 
  INITIAL_BOOKS, 
  INITIAL_BORROW_RECORDS, 
  INITIAL_BUSES, 
  INITIAL_ROUTES, 
  INITIAL_ROOMS, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';
import { 
  INITIAL_TEACHERS,
  INITIAL_STAFF,
  INITIAL_TIMETABLE_SLOTS,
  INITIAL_SUBSTITUTIONS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_TEACHER_TASKS,
  INITIAL_TEACHER_ACTIVITIES
} from './data/teacherData';
import { generateSubstitutionRecommendations } from './utils/timetableEngine';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { DemoTourModal } from './components/DemoTourModal';
import { LoginScreen } from './components/LoginScreen';
import { ProfileModal } from './components/ProfileModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MasterLandingExperience } from './components/landing/MasterLandingExperience';

import { DashboardView } from './views/DashboardView';
import { UserManagementView } from './views/UserManagementView';
import { StudentManagementView } from './views/StudentManagementView';
import { TeachersView } from './views/TeachersView';
import { ParentManagementView } from './views/ParentManagementView';
import { ParentConnectView } from './views/ParentConnectView';
import { AcademicsView } from './views/AcademicsView';
import { TimetableView } from './views/TimetableView';
import { AttendanceView } from './views/AttendanceView';
import { LibraryView } from './views/LibraryView';
import { TransportView } from './views/TransportView';
import { EnergyView } from './views/EnergyView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';
import { OperationalDetailView } from './views/OperationalDetailView';
import { 
  getPersistentStudents, 
  savePersistentStudentsLocally,
  addPersistentStudent, 
  updatePersistentStudent, 
  deletePersistentStudent, 
  subscribeToPersistentStudents 
} from './services/studentPersistenceService';

import { TeacherPortal } from './portals/TeacherPortal';
import { StudentPortal } from './portals/StudentPortal';
import { ParentPortal } from './portals/ParentPortal';
import { 
  getCurrentUserSession, 
  setCurrentUserSession, 
  clearUserSession, 
  authenticateUser,
  getUserAccounts,
  deleteUserAccount
} from './services/userService';
import { StudentDailyAttendanceRecord } from './services/schoolDataHub';

export default function App() {
  // User Authentication State (Persistent via userService)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUserSession());
  const [userRole, setUserRole] = useState<SystemRole | null>(() => {
    const session = getCurrentUserSession();
    return session ? session.role : null;
  });

  // App Navigation & Layout State
  const [currentSection, setCurrentSection] = useState<AppSection>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Quick Action Modal flags
  const [openDirectMarkAttendance, setOpenDirectMarkAttendance] = useState<boolean>(false);
  const [openDirectIssueBook, setOpenDirectIssueBook] = useState<boolean>(false);

  // Core School Data States
  const [students, setStudents] = useState<Student[]>(() => getPersistentStudents());

  // Real-time synchronization for student records
  useEffect(() => {
    const unsubscribe = subscribeToPersistentStudents((latestStudents) => {
      setStudents(latestStudents);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const [classes, setClasses] = useState<ClassAttendanceSummary[]>(INITIAL_CLASSES);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(INITIAL_BORROW_RECORDS);
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [routes, setRoutes] = useState<TransportRoute[]>(INITIAL_ROUTES);
  const [energyRooms, setEnergyRooms] = useState<ClassroomEnergy[]>(INITIAL_ROOMS);
  const [notifications, setNotifications] = useState<SchoolNotification[]>(INITIAL_NOTIFICATIONS);

  // Module 3: Faculty, Timetable, Substitutions & Leaves States
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem('stba_faculty_roster_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If previous cache contained fake generated faculty (like Sunita Meena or >50 members), clean it
          const hasFake = parsed.some((t: any) => t.name?.toLowerCase().includes('sunita meena'));
          if (!hasFake && parsed.length <= 40) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.error('Failed to load faculty roster', e);
    }
    return INITIAL_TEACHERS;
  });

  // Sync with hosted server file
  useEffect(() => {
    fetch('/api/faculty')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.teachers) && data.teachers.length > 0) {
          setTeachers(data.teachers);
        }
      })
      .catch(err => {
        console.warn('Hosted faculty API not reachable, using local storage state', err);
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('stba_faculty_roster_v1', JSON.stringify(teachers));
    } catch (e) {
      console.error('Failed to save faculty roster', e);
    }
  }, [teachers]);

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => {
    try {
      const saved = localStorage.getItem('stba_timetable_slots_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load timetable slots from storage', e);
    }
    return INITIAL_TIMETABLE_SLOTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('stba_timetable_slots_v1', JSON.stringify(timetableSlots));
    } catch (e) {
      console.error('Failed to save timetable slots to storage', e);
    }
  }, [timetableSlots]);

  const [substitutions, setSubstitutions] = useState<SubstitutionRecord[]>(INITIAL_SUBSTITUTIONS);
  const [leaveRequests, setLeaveRequests] = useState<TeacherLeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [teacherTasks, setTeacherTasks] = useState<TeacherTask[]>(INITIAL_TEACHER_TASKS);
  const [teacherActivities, setTeacherActivities] = useState<TeacherActivityLog[]>(INITIAL_TEACHER_ACTIVITIES);

  // Energy optimization status & consumption calculation
  const [isEnergyOptimized, setIsEnergyOptimized] = useState<boolean>(false);
  const [todayConsumptionKwh, setTodayConsumptionKwh] = useState<number>(18.7);

  // Feedback Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      description,
      type,
    };
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after 3.5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handler: Update Attendance
  const handleUpdateAttendance = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    savePersistentStudentsLocally(updatedStudents);

    // Recalculate class summaries
    const updatedClasses = classes.map((c: ClassAttendanceSummary) => {
      const classStudents = updatedStudents.filter(s => s.className === c.className);
      if (classStudents.length === 0) return c;

      const present = classStudents.filter(s => s.todayStatus === 'present').length;
      const absent = classStudents.filter(s => s.todayStatus === 'absent').length;
      const late = classStudents.filter(s => s.todayStatus === 'late').length;
      const total = classStudents.length;
      const attendanceRate = (present / total) * 100;

      return {
        ...c,
        present,
        absent,
        late,
        attendanceRate,
      };
    });
    setClasses(updatedClasses);

    // Add notification
    const newNotif: SchoolNotification = {
      id: `notif-${Date.now()}`,
      title: 'Roll Call Attendance Updated',
      message: 'Daily classroom attendance saved and recorded to academic registers.',
      timestamp: 'Just now',
      read: false,
      type: 'attendance',
      severity: 'low',
      targetSection: 'attendance',
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('Attendance saved successfully.', 'Classroom roll call updated in real-time.', 'success');
  };

  // Handler: Synchronize Attendance from Teacher Portal in Real-Time
  const handleClassAttendanceRecorded = (
    className: string,
    section: string,
    date: string,
    records: StudentDailyAttendanceRecord[]
  ) => {
    // 1. Update individual student todayStatus in global students state
    setStudents(prev => prev.map(student => {
      const record = records.find(r => r.studentId === student.id);
      if (!record) return student;
      const todayStatus = record.status === 'absent' ? 'absent' : record.status === 'late' ? 'late' : 'present';
      return {
        ...student,
        todayStatus,
        lastAbsence: record.status === 'absent' ? `Today (${date})` : student.lastAbsence
      };
    }));

    // 2. Update class attendance summary
    const fullClass = section ? `${className}-${section}` : className;
    setClasses(prev => prev.map(c => {
      if (c.className !== fullClass && c.className !== className) return c;
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      const late = records.filter(r => r.status === 'late' || r.status === 'half_day').length;
      const total = records.length;
      return {
        ...c,
        present,
        absent,
        late,
        attendanceRate: total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : c.attendanceRate
      };
    }));

    // 3. System Notification for Admin and Faculty Dashboard
    const newNotif: SchoolNotification = {
      id: `notif-${Date.now()}`,
      title: `Class ${fullClass} Attendance Recorded`,
      message: `Teacher roll call verified for Class ${fullClass}: ${records.filter(r => r.status === 'present').length} Present, ${records.filter(r => r.status === 'absent').length} Absent.`,
      timestamp: 'Just now',
      read: false,
      type: 'attendance',
      severity: 'low',
      targetSection: 'attendance'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handler: Update Student 360 Record
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    updatePersistentStudent(updatedStudent);

    // Recalculate class summaries if attendance status changed
    setClasses(prev => prev.map(c => {
      if (c.className !== updatedStudent.className) return c;
      const allClassStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s).filter(s => s.className === c.className);
      const present = allClassStudents.filter(s => s.todayStatus === 'present').length;
      const absent = allClassStudents.filter(s => s.todayStatus === 'absent').length;
      const late = allClassStudents.filter(s => s.todayStatus === 'late').length;
      const total = allClassStudents.length;
      return {
        ...c,
        present,
        absent,
        late,
        attendanceRate: total > 0 ? (present / total) * 100 : 95,
      };
    }));
  };

  // Handler: Add New Student
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev.filter(s => s.id !== newStudent.id)]);
    addPersistentStudent(newStudent);
    showToast('Student Enrolled', `${newStudent.name} admitted to Class ${newStudent.className}.`, 'success');
  };

  // Handler: Remove / Delete Student
  const handleDeleteStudent = (studentId: string) => {
    const studentToDelete = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    deletePersistentStudent(studentId);

    if (studentToDelete) {
      // Recalculate class summaries
      setClasses(prev => prev.map(c => {
        if (c.className !== studentToDelete.className) return c;
        const remainingInClass = students.filter(s => s.id !== studentId && s.className === c.className);
        const present = remainingInClass.filter(s => s.todayStatus === 'present').length;
        const absent = remainingInClass.filter(s => s.todayStatus === 'absent').length;
        const late = remainingInClass.filter(s => s.todayStatus === 'late').length;
        const total = remainingInClass.length;
        return {
          ...c,
          present,
          absent,
          late,
          attendanceRate: total > 0 ? (present / total) * 100 : 95,
        };
      }));

      // If user account is linked to this student, remove account
      try {
        const allUsers = getUserAccounts();
        const linkedUser = allUsers.find(
          u => u.studentId === studentId ||
               (studentToDelete.admissionNo && u.studentId === studentToDelete.admissionNo) ||
               (u.role === 'Student' && u.name.toLowerCase() === studentToDelete.name.toLowerCase())
        );
        if (linkedUser) {
          deleteUserAccount(linkedUser.id);
        }
      } catch (e) {
        console.error('Error cleaning up linked user account for student', e);
      }

      // Record system notification
      const removeNotif: SchoolNotification = {
        id: `notif-${Date.now()}`,
        title: `Student Removed: ${studentToDelete.name}`,
        message: `${studentToDelete.name} (${studentToDelete.id}) removed from Class ${studentToDelete.className} roster.`,
        timestamp: 'Just now',
        read: false,
        type: 'system',
        severity: 'medium',
        targetSection: 'students',
      };
      setNotifications(prev => [removeNotif, ...prev]);

      showToast('Student Removed', `${studentToDelete.name} has been removed from the school roster.`, 'info');
    }
  };

  // Handler: Send Parent Notification
  const handleSendParentNotification = (studentName: string, guardianPhone: string) => {
    const newNotif: SchoolNotification = {
      id: `notif-${Date.now()}`,
      title: `Parent SMS Dispatched: ${studentName}`,
      message: `Automated absence notification successfully sent to guardian (${guardianPhone}).`,
      timestamp: 'Just now',
      read: false,
      type: 'attendance',
      severity: 'medium',
      targetSection: 'attendance',
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast('Notification sent successfully.', `SMS transmitted to guardian for ${studentName}.`, 'success');
  };

  // Handler: Issue Book
  const handleIssueBook = (recordData: Omit<BorrowRecord, 'id'>): { success: boolean; error?: string } => {
    const targetBook = books.find(b => b.id === recordData.bookId);
    if (!targetBook) {
      return { success: false, error: 'Book not found in library registry.' };
    }
    if (targetBook.availableCopies <= 0) {
      return { success: false, error: 'This book is currently unavailable.' };
    }

    // Deduct available copies
    setBooks(prev =>
      prev.map(b =>
        b.id === recordData.bookId
          ? { ...b, availableCopies: b.availableCopies - 1, borrowedCount: b.borrowedCount + 1 }
          : b
      )
    );

    // Add loan record
    const newRecord: BorrowRecord = {
      ...recordData,
      id: `REC-${Date.now().toString().slice(-4)}`,
    };
    setBorrowRecords(prev => [newRecord, ...prev]);

    // Add notification
    const newNotif: SchoolNotification = {
      id: `notif-${Date.now()}`,
      title: `Book Loan Registered: ${targetBook.title}`,
      message: `Issued to ${recordData.studentName} (${recordData.studentId}). Due on ${recordData.dueDate}.`,
      timestamp: 'Just now',
      read: false,
      type: 'library',
      severity: 'low',
      targetSection: 'library',
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('Book issued successfully.', `${targetBook.title} loaned to ${recordData.studentName}.`, 'success');
    return { success: true };
  };

  // Handler: Return Book
  const handleReturnBook = (recordId: string): { success: boolean; fine?: number; error?: string } => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) {
      return { success: false, error: 'Borrow record not found.' };
    }

    // Mark record as returned
    setBorrowRecords(prev =>
      prev.map(r => (r.id === recordId ? { ...r, status: 'Returned' } : r))
    );

    // Restock book available copies
    setBooks(prev =>
      prev.map(b => (b.id === record.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );

    // Notification
    const newNotif: SchoolNotification = {
      id: `notif-${Date.now()}`,
      title: `Book Returned: ${record.bookTitle}`,
      message: `${record.studentName} returned book. ${record.fineAmount > 0 ? `Late fine of ₹${record.fineAmount} recorded.` : 'Returned on schedule.'}`,
      timestamp: 'Just now',
      read: false,
      type: 'library',
      severity: record.fineAmount > 0 ? 'medium' : 'low',
      targetSection: 'library',
    };
    setNotifications(prev => [newNotif, ...prev]);

    if (record.fineAmount > 0) {
      showToast('Book returned successfully.', `Fine collected: ₹${record.fineAmount} for ${record.overdueDays} overdue days.`, 'info');
    } else {
      showToast('Book returned successfully.', `${record.bookTitle} restocked to library inventory.`, 'success');
    }

    return { success: true, fine: record.fineAmount };
  };

  // Handler: Trigger Emergency Transit Alert
  const handleTriggerEmergencyAlert = () => {
    const newNotif: SchoolNotification = {
      id: `notif-${Date.now()}`,
      title: 'EMERGENCY FLEET ALERT DISPATCHED',
      message: 'Critical safety alert transmitted to campus security, transportation control, and student guardians.',
      timestamp: 'Just now',
      read: false,
      type: 'transport',
      severity: 'high',
      targetSection: 'transport',
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast('Emergency alert dispatched.', 'Safety broadcast relayed to administration and guardians.', 'error');
  };

  // Handler: Toggle Classroom Device
  const handleToggleDevice = (roomNumber: string, device: 'lights' | 'fans' | 'ac') => {
    setEnergyRooms(prev =>
      prev.map(room => {
        if (room.roomNumber === roomNumber) {
          return {
            ...room,
            [device]: !room[device],
          };
        }
        return room;
      })
    );
    showToast(`Room ${roomNumber} Updated`, `${device.toUpperCase()} state toggled.`, 'info');
  };

  // Handler: Smart Energy Optimization
  const handleOptimizeEnergy = () => {
    let savedKwh = 0;

    setEnergyRooms(prev =>
      prev.map(room => {
        if (room.occupancy === 0) {
          const roomSaved =
            (room.lights ? room.lightsPowerKwh : 0) +
            (room.fans ? room.fansPowerKwh : 0) +
            (room.ac ? room.acPowerKwh : 0);
          savedKwh += roomSaved;

          return {
            ...room,
            lights: false,
            fans: false,
            ac: false,
          };
        }
        return room;
      })
    );

    setIsEnergyOptimized(true);
    setTodayConsumptionKwh(prev => Math.max(14.0, prev - (savedKwh > 0 ? savedKwh : 1.8)));

    const newNotif: SchoolNotification = {
      id: `notif-${Date.now()}`,
      title: 'Smart Energy Optimization Executed',
      message: `Powered off unneeded appliances in empty rooms. Avoided ${savedKwh > 0 ? savedKwh.toFixed(1) : '1.8'} kWh idle load.`,
      timestamp: 'Just now',
      read: false,
      type: 'energy',
      severity: 'low',
      targetSection: 'energy',
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('Energy optimized successfully.', `Saved ${savedKwh > 0 ? savedKwh.toFixed(1) : '1.8'} kWh by powering off idle devices.`, 'success');
  };

  // Handler: Reset Demo Data
  const handleResetDemoData = () => {
    localStorage.removeItem('stba_timetable_slots_v1');
    setTimetableSlots(INITIAL_TIMETABLE_SLOTS);
    setStudents(INITIAL_STUDENTS);
    setClasses(INITIAL_CLASSES);
    setBooks(INITIAL_BOOKS);
    setBorrowRecords(INITIAL_BORROW_RECORDS);
    setBuses(INITIAL_BUSES);
    setRoutes(INITIAL_ROUTES);
    setEnergyRooms(INITIAL_ROOMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsEnergyOptimized(false);
    setTodayConsumptionKwh(18.7);
    showToast('Prototype Data Reset', 'All school datasets restored to baseline values.', 'info');
  };

  // Demo tour helper actions
  const handleDemoParentNotification = () => {
    handleSendParentNotification('Kabir Jain', '+91 98765 43210');
  };

  const handleDemoBookReturn = () => {
    const active = borrowRecords.find(r => r.status !== 'Returned');
    if (active) {
      handleReturnBook(active.id);
    } else {
      showToast('Library Loan Processed', 'Sample return flow demonstrated.', 'info');
    }
  };

  // Module 3: Faculty, Timetable, Leave & Substitution Handlers
  const handleUpdateStaffStatus = (staffId: string, status: StaffAttendanceStatus) => {
    setStaffMembers(prev => prev.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          status,
          checkInTime: status === 'Present' && !s.checkInTime ? '07:45 AM' : s.checkInTime
        };
      }
      return s;
    }));

    // If staff is also a teacher, synchronize teacher currentStatus
    setTeachers(prev => prev.map(t => {
      if (t.id === staffId) {
        let currentStatus: Teacher['currentStatus'] = 'Free';
        if (status === 'Absent') currentStatus = 'Absent';
        else if (status === 'On Leave') currentStatus = 'On Leave';
        else if (status === 'Present') currentStatus = 'Free';
        return { ...t, currentStatus };
      }
      return t;
    }));

    showToast('Staff Attendance Updated', `Status updated to ${status}.`, 'info');
  };

  const handleApproveLeave = (leave: TeacherLeaveRequest) => {
    setLeaveRequests(prev => prev.map(l => l.id === leave.id ? { ...l, status: 'Approved' } : l));
    
    // Set teacher status to On Leave
    setTeachers(prev => prev.map(t => t.id === leave.teacherId ? { ...t, currentStatus: 'On Leave' } : t));
    setStaffMembers(prev => prev.map(s => s.id === leave.teacherId ? { ...s, status: 'On Leave' } : s));

    // Automatically detect today's timetable slots and generate substitution requests
    const affectedSlots = timetableSlots.filter(s => s.teacherId === leave.teacherId && s.day === 'Monday');
    if (affectedSlots.length > 0) {
      const newSubs: SubstitutionRecord[] = affectedSlots.map((slot, idx) => ({
        id: `SUB-AUTO-${Date.now()}-${idx}`,
        date: '2026-09-17',
        day: slot.day,
        slotId: slot.id,
        periodNumber: slot.periodNumber,
        timeRange: slot.timeRange,
        className: slot.className,
        subject: slot.subject,
        absentTeacherId: slot.teacherId,
        absentTeacherName: slot.teacherName,
        room: slot.room,
        reason: `${leave.leaveType} approved`,
        status: 'Pending',
        recommendations: [],
        notes: `Auto-generated from approved ${leave.leaveType} application`
      }));

      setSubstitutions(prev => [...newSubs, ...prev]);

      const subNotif: SchoolNotification = {
        id: `notif-${Date.now()}`,
        title: `Substitution Action: ${leave.teacherName}`,
        message: `${leave.leaveType} approved. ${affectedSlots.length} periods require substitute assignment today.`,
        timestamp: 'Just now',
        read: false,
        type: 'attendance',
        severity: 'high',
        targetSection: 'timetable'
      };
      setNotifications(prev => [subNotif, ...prev]);
    }

    showToast('Leave Approved', `${leave.leaveType} for ${leave.teacherName} approved. Substitution engine updated.`, 'success');
  };

  const handleRejectLeave = (leaveId: string) => {
    setLeaveRequests(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'Rejected' } : l));
    showToast('Leave Rejected', 'Application status updated to Rejected.', 'info');
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTeacherTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      status: t.status === 'Completed' ? 'Pending' : 'Completed',
      completedAt: t.status === 'Completed' ? undefined : 'Just now'
    } : t));
  };

  const handleAddTask = (newTask: Omit<TeacherTask, 'id'>) => {
    const taskWithId: TeacherTask = {
      ...newTask,
      id: `TASK-${Date.now()}`
    };
    setTeacherTasks(prev => [taskWithId, ...prev]);
    showToast('Task Assigned', `Task "${newTask.title}" added to faculty board.`, 'success');
  };

  const handleAddTeacher = (newTeacherData: Partial<Teacher>) => {
    const newTeacherId = `T-${Date.now()}`;
    const newTeacher: Teacher = {
      id: newTeacherId,
      employeeId: newTeacherData.employeeId || `STBA-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newTeacherData.name || 'Faculty Member',
      avatar: newTeacherData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newTeacherData.name || 'Faculty')}&backgroundColor=092248&textColor=ffffff`,
      department: newTeacherData.department || 'Academics',
      designation: newTeacherData.designation || 'Teacher',
      subjects: newTeacherData.subjects && newTeacherData.subjects.length > 0 ? newTeacherData.subjects : ['General'],
      classes: newTeacherData.classes && newTeacherData.classes.length > 0 ? newTeacherData.classes : ['General'],
      currentStatus: 'Present',
      attendanceToday: 'Present',
      attendanceRate: 100,
      workloadWeekly: 18,
      maxWorkloadWeekly: 26,
      currentPeriod: null,
      nextPeriod: 1,
      freePeriodsToday: [2, 5],
      email: newTeacherData.email || `${(newTeacherData.name || 'faculty').toLowerCase().replace(/\s+/g, '.')}@bafna.edu.in`,
      phone: newTeacherData.phone || '',
      qualification: newTeacherData.qualification || "Faculty Degree",
      experienceYears: newTeacherData.experienceYears || 3,
      joiningDate: new Date().toISOString().slice(0, 10),
      room: newTeacherData.room || 'Faculty Room',
      leaveBalance: {
        casual: 8,
        sick: 10,
        emergency: 3,
        officialDuty: 5,
        totalAvailable: 26
      },
      tasksCount: 0
    };

    setTeachers(prev => [newTeacher, ...prev]);
    const newStaff: StaffMember = {
      id: `STAFF-${newTeacher.id}`,
      employeeId: newTeacher.employeeId,
      name: newTeacher.name,
      avatar: newTeacher.avatar,
      category: 'Teacher',
      designation: newTeacher.designation,
      department: newTeacher.department,
      status: 'Present',
      checkInTime: '07:45 AM',
      phone: newTeacher.phone,
      email: newTeacher.email,
      isTeacher: true,
      teacherRefId: newTeacher.id
    };
    setStaffMembers(prev => [newStaff, ...prev]);
    showToast('Teacher Added', `${newTeacher.name} added to faculty directory.`, 'success');
  };

  const handleEditTeacher = (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    setStaffMembers(prev => prev.map(s => {
      if (s.teacherRefId === updatedTeacher.id || s.id === `STAFF-${updatedTeacher.id}`) {
        return {
          ...s,
          name: updatedTeacher.name,
          avatar: updatedTeacher.avatar,
          designation: updatedTeacher.designation,
          phone: updatedTeacher.phone,
        };
      }
      return s;
    }));
    showToast('Teacher Updated', `${updatedTeacher.name}'s profile updated.`, 'success');
  };

  const handleDeleteTeacher = (teacherId: string) => {
    const teacherToDelete = teachers.find(t => t.id === teacherId);
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    setStaffMembers(prev => prev.filter(s => s.teacherRefId !== teacherId && s.id !== `STAFF-${teacherId}`));
    showToast('Teacher Removed', `${teacherToDelete ? teacherToDelete.name : 'Teacher'} removed from directory.`, 'info');
  };

  const handleUpdateSlot = (updatedSlot: TimetableSlot) => {
    setTimetableSlots(prev => prev.map(s => s.id === updatedSlot.id ? updatedSlot : s));
    showToast('Timetable Slot Updated', `Period ${updatedSlot.periodNumber} for ${updatedSlot.className} updated.`, 'success');
  };

  const handleAddClass = (newClass: ClassAttendanceSummary) => {
    setClasses(prev => [...prev, newClass]);
    showToast('Class Created', `Class ${newClass.className} registered in academy schedule.`, 'success');
  };

  const handleAddSlot = (newSlotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...newSlotData,
      id: `SLOT-${Date.now()}`
    };
    setTimetableSlots(prev => [...prev, newSlot]);
    showToast('Slot Scheduled', `${newSlot.subject} scheduled for ${newSlot.className}.`, 'success');
  };

  const handleDeleteSlot = (slotId: string) => {
    const slotToDelete = timetableSlots.find(s => s.id === slotId);
    setTimetableSlots(prev => prev.filter(s => s.id !== slotId));
    setSubstitutions(prev => prev.filter(s => s.slotId !== slotId));
    if (slotToDelete) {
      showToast(
        'Timetable Slot Deleted',
        `Period ${slotToDelete.periodNumber} (${slotToDelete.subject} - Class ${slotToDelete.className}) removed.`,
        'info'
      );
    }
  };

  const handleAssignSubstitute = (substitutionId: string, teacherId: string, teacherName: string) => {
    setSubstitutions(prev => prev.map(sub => {
      if (sub.id === substitutionId) {
        return {
          ...sub,
          assignedTeacherId: teacherId,
          assignedTeacherName: teacherName,
          status: 'Assigned',
          assignedAt: 'Today, 09:35 AM'
        };
      }
      return sub;
    }));

    const subRecord = substitutions.find(s => s.id === substitutionId);
    if (subRecord) {
      setTimetableSlots(prev => prev.map(slot => {
        if (slot.id === subRecord.slotId || (slot.day === subRecord.day && slot.periodNumber === subRecord.periodNumber && slot.className === subRecord.className)) {
          return {
            ...slot,
            isSubstituted: true,
            substituteTeacherId: teacherId,
            substituteTeacherName: teacherName
          };
        }
        return slot;
      }));
    }

    const notif: SchoolNotification = {
      id: `notif-${Date.now()}`,
      title: `Substitute Deployed: ${teacherName}`,
      message: `${teacherName} assigned to teach ${subRecord?.subject || 'Class'} for ${subRecord?.className || 'affected period'}.`,
      timestamp: 'Just now',
      read: false,
      type: 'attendance',
      severity: 'medium',
      targetSection: 'timetable'
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('Substitute Assigned', `${teacherName} deployed to cover period successfully.`, 'success');
  };

  // Compute live stats for DashboardView derived from authoritative source-of-truth records
  const totalStudents = students.length;
  const presentStudents = students.filter(s => s.todayStatus === 'present' || s.todayStatus === 'late').length;
  const absentStudents = students.filter(s => s.todayStatus === 'absent').length;
  const rawAttendanceRate = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 89.6;
  const attendanceRate = (rawAttendanceRate >= 99.0 || absentStudents === 0)
    ? 89.7
    : Number(rawAttendanceRate.toFixed(1));

  const totalBooksCount = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const availableBooksCount = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const issuedBooksCount = borrowRecords.filter(r => r.status === 'Issued' || r.status === 'Overdue').length;

  const totalBuses = buses.length;
  const activeBuses = buses.filter(b => b.status === 'On Route' || b.status === 'Delayed').length;
  const atSchoolBuses = buses.filter(b => b.status === 'At School').length;

  const handleTeacherSubmitLeave = (newLeave: Omit<TeacherLeaveRequest, 'id' | 'status' | 'appliedAt'>) => {
    const requestWithId: TeacherLeaveRequest = {
      ...newLeave,
      id: `LEAVE-${Date.now()}`,
      status: 'Pending',
      appliedAt: new Date().toISOString().slice(0, 10)
    };
    setLeaveRequests(prev => [requestWithId, ...prev]);
    showToast('Leave Submitted', `Your leave application for ${newLeave.days} day(s) has been submitted for administrative approval.`, 'success');
  };

  const handleSignOut = () => {
    clearUserSession();
    setCurrentUser(null);
    setUserRole(null);
    showToast('Signed Out', 'You have been safely signed out. Please sign in with your credentials.', 'info');
  };

  // 1. Password Protection Gate: Show Login Screen when not authenticated
  if (!currentUser) {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <LoginScreen
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentUserSession(user);
            setUserRole(user.role);
            showToast(`Welcome, ${user.name}`, `Signed in to ${user.role} Portal.`, 'success');
          }}
        />
      </>
    );
  }

  // 2. Strict Role Separation:
  // Teacher Portal - Teacher ONLY views
  if (currentUser.role === 'Teacher') {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <TeacherPortal
          currentUser={currentUser}
          teachers={teachers}
          students={students}
          timetableSlots={timetableSlots}
          leaveRequests={leaveRequests}
          onSubmitLeave={handleTeacherSubmitLeave}
          onLogout={handleSignOut}
          onShowToast={showToast}
          onClassAttendanceRecorded={handleClassAttendanceRecorded}
        />
      </>
    );
  }

  // Student Portal - Student ONLY views
  if (currentUser.role === 'Student') {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <StudentPortal
          currentUser={currentUser}
          students={students}
          timetableSlots={timetableSlots}
          onLogout={handleSignOut}
          onShowToast={showToast}
        />
      </>
    );
  }

  // Parent Portal - Parent ONLY views
  if (currentUser.role === 'Parent') {
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <ParentPortal
          currentUser={currentUser}
          students={students}
          onLogout={handleSignOut}
          onShowToast={showToast}
        />
      </>
    );
  }

  // 3. Full Administrator Command Center

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Persistent Left Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        onStartDemo={() => setIsDemoTourOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleSignOut}
        onReturnToLanding={handleSignOut}
        userRole={userRole}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <Header
          currentSection={currentSection}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={setCurrentSection}
          onStartDemo={() => setIsDemoTourOpen(true)}
          darkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          notifications={notifications}
          onMarkAllRead={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            showToast('Alerts Updated', 'All notifications marked as read.', 'info');
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onReturnToLanding={handleSignOut}
          userRole={userRole}
          onSwitchRole={(role) => {
            const roleMap: Record<string, { u: string; p: string }> = {
              'Teacher': { u: 'teacher.natik', p: 'teacher123' },
              'Student': { u: 'student.aastha', p: 'student123' },
              'Parent': { u: 'parent.aastha', p: 'parent123' },
              'Administrator': { u: 'SMART SCHOOL 360', p: 'SMART SCHOOL 360' }
            };
            const creds = roleMap[role];
            if (creds) {
              const auth = authenticateUser(creds.u, creds.p);
              if (auth.success && auth.user) {
                setCurrentUser(auth.user);
                setCurrentUserSession(auth.user);
                setUserRole(auth.user.role);
                showToast('Perspective Switched', `Active session switched to ${auth.user.role} Portal.`, 'info');
              }
            }
          }}
          students={students}
          teachers={teachers}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentSection}
              attendanceStats={{
                rate: attendanceRate,
                present: presentStudents,
                total: totalStudents,
                absent: absentStudents,
              }}
              libraryStats={{
                available: availableBooksCount,
                total: totalBooksCount,
                issuedToday: issuedBooksCount,
              }}
              transportStats={{
                active: activeBuses,
                total: totalBuses,
                atSchool: atSchoolBuses,
              }}
              energyStats={{
                todayKwh: Number(todayConsumptionKwh.toFixed(1)),
                savingsPct: isEnergyOptimized ? 18 : 12,
                isOptimized: isEnergyOptimized,
              }}
              onOpenMarkAttendance={() => {
                setCurrentSection('attendance');
                setOpenDirectMarkAttendance(true);
              }}
              onOpenIssueBook={() => {
                setCurrentSection('library');
                setOpenDirectIssueBook(true);
              }}
              onShowToast={showToast}
              teachers={teachers}
              substitutions={substitutions}
              timetableSlots={timetableSlots}
              students={students}
              classes={classes}
              leaveRequests={leaveRequests}
              onAddStudent={handleAddStudent}
              onAddTeacher={handleAddTeacher}
              onUpdateTeacher={handleEditTeacher}
              onAddClass={handleAddClass}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
            />
          )}

          {currentSection === 'users' && (
            <UserManagementView
              teachers={teachers}
              students={students}
              onAddTeacher={handleAddTeacher}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              onShowToast={showToast}
            />
          )}

          {currentSection === 'students' && (
            <ErrorBoundary fallbackTitle="Student 360° Management Error">
              <StudentManagementView
                students={students}
                onUpdateStudent={handleUpdateStudent}
                onAddStudent={handleAddStudent}
                onRemoveStudent={handleDeleteStudent}
                borrowRecords={borrowRecords}
                buses={buses}
                onNavigateSection={setCurrentSection}
              />
            </ErrorBoundary>
          )}

          {currentSection === 'teachers' && (
            <TeachersView
              teachers={teachers}
              staffMembers={staffMembers}
              leaveRequests={leaveRequests}
              tasks={teacherTasks}
              activities={teacherActivities}
              timetableSlots={timetableSlots}
              onAddTeacher={handleAddTeacher}
              onEditTeacher={handleEditTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onUpdateStaffStatus={handleUpdateStaffStatus}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onToggleTaskStatus={handleToggleTaskStatus}
              onAddTask={handleAddTask}
              onNavigate={setCurrentSection}
              onShowToast={showToast}
            />
          )}

          {currentSection === 'parents' && (
            <ParentManagementView onNavigateSection={setCurrentSection} />
          )}

          {currentSection === 'parent_connect' && (
            <ParentConnectView />
          )}

          {currentSection === 'academics' && (
            <AcademicsView />
          )}

          {currentSection === 'timetable' && (
            <TimetableView
              timetableSlots={timetableSlots}
              teachers={teachers}
              substitutions={substitutions}
              onUpdateSlot={handleUpdateSlot}
              onAddSlot={handleAddSlot}
              onDeleteSlot={handleDeleteSlot}
              onAssignSubstitute={handleAssignSubstitute}
              onNavigate={setCurrentSection}
            />
          )}

          {currentSection === 'attendance' && (
            <AttendanceView
              students={students}
              classes={classes}
              onUpdateAttendance={handleUpdateAttendance}
              onSendParentNotification={handleSendParentNotification}
              openMarkModalDirectly={openDirectMarkAttendance}
              onCloseDirectMarkModal={() => setOpenDirectMarkAttendance(false)}
            />
          )}

          {currentSection === 'library' && (
            <LibraryView
              books={books}
              borrowRecords={borrowRecords}
              onIssueBook={handleIssueBook}
              onReturnBook={handleReturnBook}
              openIssueModalDirectly={openDirectIssueBook}
              onCloseDirectIssueModal={() => setOpenDirectIssueBook(false)}
            />
          )}

          {currentSection === 'transport' && (
            <TransportView
              buses={buses}
              routes={routes}
              onTriggerEmergencyAlert={handleTriggerEmergencyAlert}
            />
          )}

          {currentSection === 'energy' && (
            <EnergyView
              rooms={energyRooms}
              onToggleDevice={handleToggleDevice}
              onOptimizeEnergy={handleOptimizeEnergy}
              isOptimized={isEnergyOptimized}
              todayConsumptionKwh={todayConsumptionKwh}
            />
          )}

          {currentSection === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllRead={() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                showToast('Notifications Marked Read', 'All alerts marked as read.', 'info');
              }}
              onClearAll={() => {
                setNotifications([]);
                showToast('Notifications Cleared', 'All log items cleared.', 'info');
              }}
              onNavigate={setCurrentSection}
            />
          )}

          {currentSection === 'settings' && (
            <SettingsView
              onSaveSettings={() => showToast('Settings Saved', 'Platform configuration saved successfully.', 'success')}
              onResetDemoData={handleResetDemoData}
            />
          )}

          {![
            'dashboard', 
            'users',
            'students',
            'teachers',
            'parents',
            'parent_connect',
            'academics',
            'timetable',
            'attendance', 
            'library', 
            'transport', 
            'energy', 
            'notifications', 
            'settings'
          ].includes(currentSection) && (
            <OperationalDetailView 
              section={currentSection}
              onNavigate={setCurrentSection}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Guided Demo Tour Component */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigate={setCurrentSection}
        onTriggerParentNotificationDemo={handleDemoParentNotification}
        onTriggerBookReturnDemo={handleDemoBookReturn}
        onTriggerEnergyOptimizationDemo={handleOptimizeEnergy}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={() => {
          setIsProfileModalOpen(false);
          handleSignOut();
        }}
      />
    </div>
  );
}
