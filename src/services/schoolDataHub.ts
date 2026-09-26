import { UserAccount, SystemRole } from '../types';

export interface SchoolNotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'General' | 'Academic' | 'Holiday' | 'Exam' | 'Attendance' | 'Event' | 'Transport' | 'Emergency' | 'Application';
  priority: 'Normal' | 'Important' | 'Urgent';
  audience: 'Everyone' | 'Teachers' | 'Students' | 'Parents' | 'Specific Class';
  targetClass?: string;
  targetSection?: string;
  targetStudentId?: string;
  targetParentId?: string;
  expiryDate?: string;
  createdAt: string;
  createdBy: string;
  readBy: string[]; // array of user IDs or usernames
  status: 'Sent' | 'Scheduled';
  relatedApplicationId?: string;
}

export interface TeacherApplicationItem {
  id: string;
  teacherId: string;
  teacherName: string;
  employeeId?: string;
  department?: string;
  applicationType: 'Casual Leave' | 'Sick Leave' | 'Emergency Leave' | 'Official Duty' | 'Other';
  reason: string;
  startDate: string;
  endDate: string;
  days: number;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminRemarks?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ExamStudentResult {
  studentId: string;
  studentName: string;
  rollNumber: string | number;
  className: string;
  section: string;
  attendanceStatus: 'Present' | 'Absent';
  marksObtained?: number; // undefined if Absent
  percentage?: number; // calculated: (marks / max) * 100
  grade?: string;
  remarks?: string;
}

export interface SchoolExamItem {
  id: string;
  examName: string; // e.g. "Mid-Term Examination", "Unit Test 1"
  subject: string;
  className: string;
  section: string;
  examDate: string;
  startTime?: string;
  endTime?: string;
  maxMarks: number;
  passingMarks?: number;
  instructions?: string;
  uploadedSheetName?: string;
  uploadedSheetDate?: string;
  uploadedSheetSize?: string;
  results: ExamStudentResult[];
  status: 'Upcoming' | 'Completed' | 'Results Published';
  createdBy: string;
  createdAt: string;
}

export interface StudentFeeItem {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
  receiptNumber?: string;
}

export interface StudentDailyAttendanceRecord {
  id: string; // e.g. "att-STU-2026-001-2026-09-22"
  studentId: string;
  studentName: string;
  rollNo: number | string;
  className: string; // "10"
  section: string; // "B"
  date: string; // "YYYY-MM-DD"
  status: 'present' | 'absent' | 'late' | 'half_day';
  checkInTime?: string;
  recordedByTeacherId: string;
  recordedByTeacherName: string;
  recordedAt: string;
  remarks?: string;
}

export interface SchoolHomeworkItem {
  id: string;
  title: string;
  subject: string;
  className: string; // "10"
  section: string; // "B"
  instructions: string;
  assignedDate: string; // "YYYY-MM-DD"
  dueDate: string; // "YYYY-MM-DD"
  teacherId: string;
  teacherName: string;
  attachmentName?: string;
  attachmentSize?: string;
  submissions: {
    studentId: string;
    studentName: string;
    submittedAt: string;
    status: 'Submitted' | 'Pending' | 'Completed';
  }[];
  createdAt: string;
}

/**
 * Normalizes class and section strings into a standard comparable format (e.g. "10-B", "9-A")
 * Handles variants like ("10-B"), ("10", "B"), ("10-B", "B"), ("9-A", "A"), etc.
 */
export function normalizeClass(cls?: string | number, sec?: string): string {
  if (!cls && !sec) return '';
  const cleanCls = cls ? String(cls).trim().toUpperCase() : '';
  const cleanSec = sec ? String(sec).trim().toUpperCase() : '';
  if (cleanCls.includes('-')) {
    return cleanCls;
  }
  return cleanSec ? `${cleanCls}-${cleanSec}` : cleanCls;
}

const NOTIFICATIONS_STORAGE_KEY = 'stba_school_notifications_v2';
const APPLICATIONS_STORAGE_KEY = 'stba_teacher_applications_v2';
const EXAMS_STORAGE_KEY = 'stba_school_exams_v2';
const FEES_STORAGE_KEY = 'stba_student_fees_v2';
const STUDENT_ATTENDANCE_STORAGE_KEY = 'stba_student_attendance_records_v3';
const HOMEWORK_STORAGE_KEY = 'stba_school_homework_v3';

// Initial Demo Notifications connecting the school
const INITIAL_NOTIFICATIONS: SchoolNotificationItem[] = [
  {
    id: 'NOTIF-001',
    title: 'School Closed Tomorrow — Heavy Rainfall Alert',
    message: 'Due to severe weather warnings issued by the district administration, the school campus will remain closed tomorrow. Online study material has been posted.',
    category: 'Holiday',
    priority: 'Urgent',
    audience: 'Everyone',
    createdAt: '2026-09-20 08:30',
    createdBy: 'Principal Office',
    readBy: [],
    status: 'Sent'
  },
  {
    id: 'NOTIF-002',
    title: 'Upcoming Mid-Term Examination Schedule Released',
    message: 'The comprehensive timetable for Class 10 Mid-Term Examinations (Term 1) is now published. Please review subject dates and seating plans.',
    category: 'Exam',
    priority: 'Important',
    audience: 'Specific Class',
    targetClass: '10',
    targetSection: 'B',
    createdAt: '2026-09-19 14:00',
    createdBy: 'Examination Cell',
    readBy: [],
    status: 'Sent'
  },
  {
    id: 'NOTIF-003',
    title: 'Parent-Teacher Meeting (PTM) Scheduled',
    message: 'Quarterly Parent-Teacher Meeting will be held this Saturday from 09:00 AM to 01:00 PM. Parents are invited to discuss term academic progress.',
    category: 'Event',
    priority: 'Normal',
    audience: 'Parents',
    createdAt: '2026-09-18 10:15',
    createdBy: 'Academic Coordinator',
    readBy: [],
    status: 'Sent'
  }
];

// Initial Demo Applications
const INITIAL_APPLICATIONS: TeacherApplicationItem[] = [
  {
    id: 'APP-101',
    teacherId: 'T-1001',
    teacherName: 'Rajesh Sharma',
    employeeId: 'EMP-1001',
    department: 'Mathematics',
    applicationType: 'Casual Leave',
    reason: 'Family wedding ceremony in Jaipur. Class substitution notes provided to Hod.',
    startDate: '2026-09-24',
    endDate: '2026-09-25',
    days: 2,
    submittedAt: '2026-09-19 11:30',
    status: 'Pending'
  }
];

// Initial Demo Exams with realistic structure
const INITIAL_EXAMS: SchoolExamItem[] = [
  {
    id: 'EXAM-2026-001',
    examName: 'Mid-Term Examination 2026',
    subject: 'Mathematics',
    className: '10',
    section: 'B',
    examDate: '2026-09-25',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    maxMarks: 100,
    passingMarks: 33,
    instructions: 'Calculators are strictly prohibited. Bring your own geometry set and school ID card.',
    uploadedSheetName: 'Maths_MidTerm_Class10B_QuestionPaper.pdf',
    uploadedSheetDate: '2026-09-18',
    uploadedSheetSize: '1.2 MB',
    results: [
      {
        studentId: 'STU-10A-01',
        studentName: 'AASTHA',
        rollNumber: 1,
        className: '10',
        section: 'A',
        attendanceStatus: 'Present',
        marksObtained: 94,
        percentage: 94,
        grade: 'A1',
        remarks: 'Outstanding analytical skills'
      },
      {
        studentId: 'STU-10A-02',
        studentName: 'ABHINAV SHARMA',
        rollNumber: 2,
        className: '10',
        section: 'A',
        attendanceStatus: 'Present',
        marksObtained: 88,
        percentage: 88,
        grade: 'A2',
        remarks: 'Very good presentation'
      },
      {
        studentId: 'STU-10A-03',
        studentName: 'ABHISHEK MUNDHRA',
        rollNumber: 3,
        className: '10',
        section: 'A',
        attendanceStatus: 'Absent',
        remarks: 'Medical leave on exam day'
      }
    ],
    status: 'Results Published',
    createdBy: 'Natik Kothari',
    createdAt: '2026-09-15'
  }
];

// Initial Demo Fees
const INITIAL_FEES: StudentFeeItem[] = [
  {
    id: 'FEE-2026-01',
    studentId: 'STU-10A-01',
    studentName: 'AASTHA',
    className: '10',
    section: 'A',
    feeType: 'Tuition Fee (Quarter 3)',
    amount: 14500,
    dueDate: '2026-10-15',
    status: 'Paid',
    paidDate: '2026-09-10',
    receiptNumber: 'REC-STBA-8821'
  },
  {
    id: 'FEE-2026-02',
    studentId: 'STU-10A-01',
    studentName: 'AASTHA',
    className: '10',
    section: 'A',
    feeType: 'Annual Computer & Robotics Lab Fee',
    amount: 3200,
    dueDate: '2026-11-01',
    status: 'Pending'
  }
];

// --- NOTIFICATIONS API ---
export function getSchoolNotifications(): SchoolNotificationItem[] {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load notifications from storage', err);
  }
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  } catch (e) {}
  return INITIAL_NOTIFICATIONS;
}

export function saveSchoolNotifications(items: SchoolNotificationItem[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save notifications', err);
  }
}

export function createSchoolNotification(
  notif: Omit<SchoolNotificationItem, 'id' | 'createdAt' | 'readBy' | 'status'>
): SchoolNotificationItem {
  const newItem: SchoolNotificationItem = {
    ...notif,
    id: `NOTIF-${Date.now()}`,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    readBy: [],
    status: 'Sent'
  };
  const list = getSchoolNotifications();
  const updated = [newItem, ...list];
  saveSchoolNotifications(updated);
  return newItem;
}

export function markNotificationAsRead(notifId: string, userId: string): void {
  const list = getSchoolNotifications();
  const updated = list.map(item => {
    if (item.id === notifId && !item.readBy.includes(userId)) {
      return { ...item, readBy: [...item.readBy, userId] };
    }
    return item;
  });
  saveSchoolNotifications(updated);
}

export function markAllNotificationsAsRead(userId: string, role: SystemRole): void {
  const list = getSchoolNotifications();
  const updated = list.map(item => {
    if (!item.readBy.includes(userId)) {
      return { ...item, readBy: [...item.readBy, userId] };
    }
    return item;
  });
  saveSchoolNotifications(updated);
}

export function getNotificationsForRole(
  role: SystemRole,
  userId: string,
  userClass?: string,
  userSection?: string,
  linkedStudentIds?: string[]
): SchoolNotificationItem[] {
  const list = getSchoolNotifications();
  const todayStr = new Date().toISOString().slice(0, 10);

  return list.filter(item => {
    // 1. Expiry Check
    if (item.expiryDate && item.expiryDate < todayStr) {
      return false;
    }

    // 2. Admin always sees all notifications
    if (role === 'Administrator') return true;

    // 3. Direct student targeting (e.g. absent alert or individual disciplinary/fee note)
    if (item.targetStudentId) {
      if (role === 'Student') {
        return item.targetStudentId === userId;
      }
      if (role === 'Parent') {
        return !!(linkedStudentIds && linkedStudentIds.includes(item.targetStudentId));
      }
      return false;
    }

    // 4. General audiences
    if (item.audience === 'Everyone') return true;
    if (item.audience === 'Teachers' && role === 'Teacher') return true;

    if (item.audience === 'Students' && role === 'Student') {
      if (!item.targetClass) return true;
      const targetNormalized = normalizeClass(item.targetClass, item.targetSection);
      const userNormalized = normalizeClass(userClass, userSection);
      return targetNormalized === userNormalized;
    }

    if (item.audience === 'Parents' && role === 'Parent') {
      if (!item.targetClass) return true;
      const targetNormalized = normalizeClass(item.targetClass, item.targetSection);
      const userNormalized = normalizeClass(userClass, userSection);
      return targetNormalized === userNormalized;
    }

    if (item.audience === 'Specific Class') {
      if (role === 'Teacher') return true;
      const targetNormalized = normalizeClass(item.targetClass, item.targetSection);
      const userNormalized = normalizeClass(userClass, userSection);
      return targetNormalized === userNormalized;
    }

    return false;
  });
}

// --- TEACHER APPLICATIONS API ---
export function getTeacherApplications(): TeacherApplicationItem[] {
  try {
    const data = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load applications from storage', err);
  }
  try {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  } catch (e) {}
  return INITIAL_APPLICATIONS;
}

export function saveTeacherApplications(items: TeacherApplicationItem[]): void {
  try {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save teacher applications', err);
  }
}

export function submitTeacherApplication(
  app: Omit<TeacherApplicationItem, 'id' | 'submittedAt' | 'status'>
): TeacherApplicationItem {
  const newApp: TeacherApplicationItem = {
    ...app,
    id: `APP-${Date.now()}`,
    submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    status: 'Pending'
  };
  const list = getTeacherApplications();
  const updated = [newApp, ...list];
  saveTeacherApplications(updated);

  // Automatically create an Admin Notification!
  createSchoolNotification({
    title: `🔔 New Teacher Application: ${app.teacherName}`,
    message: `${app.teacherName} (${app.department || 'Faculty'}) submitted a ${app.applicationType} for ${app.days} day(s) from ${app.startDate} to ${app.endDate}. Reason: "${app.reason}".`,
    category: 'Application',
    priority: 'Important',
    audience: 'Everyone', // Admin always receives all notifications
    createdBy: app.teacherName,
    relatedApplicationId: newApp.id
  });

  return newApp;
}

export function reviewTeacherApplication(
  appId: string,
  newStatus: 'Approved' | 'Rejected',
  adminRemarks?: string,
  reviewerName: string = 'Administrator'
): void {
  const list = getTeacherApplications();
  let reviewedApp: TeacherApplicationItem | undefined;

  const updated = list.map(item => {
    if (item.id === appId) {
      reviewedApp = {
        ...item,
        status: newStatus,
        adminRemarks: adminRemarks || (newStatus === 'Approved' ? 'Approved by Administration Office' : 'Declined per academic roster policy'),
        reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reviewedBy: reviewerName
      };
      return reviewedApp;
    }
    return item;
  });

  saveTeacherApplications(updated);

  if (reviewedApp) {
    // Notify the teacher
    createSchoolNotification({
      title: `Application ${newStatus}: ${reviewedApp.applicationType}`,
      message: `Your ${reviewedApp.applicationType} application for ${reviewedApp.startDate} to ${reviewedApp.endDate} has been ${newStatus.toUpperCase()} by ${reviewerName}.${adminRemarks ? ' Note: ' + adminRemarks : ''}`,
      category: 'Application',
      priority: newStatus === 'Approved' ? 'Normal' : 'Important',
      audience: 'Teachers',
      createdBy: reviewerName,
      relatedApplicationId: appId
    });
  }
}

// --- EXAMINATIONS API ---
export function getSchoolExams(): SchoolExamItem[] {
  try {
    const data = localStorage.getItem(EXAMS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load exams from storage', err);
  }
  try {
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(INITIAL_EXAMS));
  } catch (e) {}
  return INITIAL_EXAMS;
}

export function saveSchoolExams(items: SchoolExamItem[]): void {
  try {
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save exams', err);
  }
}

export function createSchoolExam(
  examData: Omit<SchoolExamItem, 'id' | 'createdAt'>
): SchoolExamItem {
  const newExam: SchoolExamItem = {
    ...examData,
    id: `EXAM-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10)
  };
  const list = getSchoolExams();
  const updated = [newExam, ...list];
  saveSchoolExams(updated);

  // Automatically broadcast notification for relevant students
  createSchoolNotification({
    title: `Upcoming Exam: ${newExam.examName} — ${newExam.subject}`,
    message: `${newExam.examName} (${newExam.subject}) is scheduled on ${newExam.examDate} (${newExam.startTime || 'Morning Slot'}) for Class ${newExam.className}-${newExam.section}. Maximum Marks: ${newExam.maxMarks}.`,
    category: 'Exam',
    priority: 'Important',
    audience: 'Specific Class',
    targetClass: newExam.className,
    targetSection: newExam.section,
    createdBy: examData.createdBy
  });

  return newExam;
}

export function updateExamResults(
  examId: string,
  results: ExamStudentResult[],
  uploadedSheetName?: string,
  uploadedSheetSize?: string
): void {
  const list = getSchoolExams();
  const updated = list.map(e => {
    if (e.id === examId) {
      return {
        ...e,
        results,
        status: 'Results Published' as const,
        ...(uploadedSheetName ? { uploadedSheetName, uploadedSheetSize, uploadedSheetDate: new Date().toISOString().slice(0, 10) } : {})
      };
    }
    return e;
  });
  saveSchoolExams(updated);

  const matched = list.find(e => e.id === examId);
  if (matched) {
    createSchoolNotification({
      title: `Results Published: ${matched.examName} (${matched.subject})`,
      message: `The evaluation results for Class ${matched.className}-${matched.section} (${matched.subject}) have been published. Check your Report Card for marks and performance breakdown.`,
      category: 'Academic',
      priority: 'Important',
      audience: 'Specific Class',
      targetClass: matched.className,
      targetSection: matched.section,
      createdBy: matched.createdBy
    });
  }
}

export function uploadExamSheetOnly(
  examId: string,
  sheetName: string,
  sheetSize: string = '1.4 MB'
): void {
  const list = getSchoolExams();
  const updated = list.map(e => {
    if (e.id === examId) {
      return {
        ...e,
        uploadedSheetName: sheetName,
        uploadedSheetSize: sheetSize,
        uploadedSheetDate: new Date().toISOString().slice(0, 10)
      };
    }
    return e;
  });
  saveSchoolExams(updated);
}

// --- STUDENT FEES API ---
export function getStudentFees(studentId?: string): StudentFeeItem[] {
  try {
    const data = localStorage.getItem(FEES_STORAGE_KEY);
    let list: StudentFeeItem[] = INITIAL_FEES;
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) list = parsed;
    } else {
      localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(INITIAL_FEES));
    }
    if (studentId) {
      return list.filter(f => f.studentId === studentId);
    }
    return list;
  } catch (err) {
    console.error('Failed to load fees', err);
    return INITIAL_FEES;
  }
}

export function saveStudentFees(items: StudentFeeItem[]): void {
  try {
    localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save fees', err);
  }
}

export function createStudentFee(feeData: Omit<StudentFeeItem, 'id'>): StudentFeeItem {
  const newFee: StudentFeeItem = {
    ...feeData,
    id: `FEE-${Date.now()}`
  };
  const list = getStudentFees();
  const updated = [newFee, ...list];
  saveStudentFees(updated);
  return newFee;
}

// --- INITIAL DATA: DAILY STUDENT ATTENDANCE ---
const INITIAL_STUDENT_ATTENDANCE: StudentDailyAttendanceRecord[] = [
  // 2026-09-22 (Today)
  {
    id: 'att-STU-10A-01-2026-09-22',
    studentId: 'STU-10A-01',
    studentName: 'AASTHA',
    rollNo: 1,
    className: '10',
    section: 'A',
    date: '2026-09-22',
    status: 'present',
    checkInTime: '08:15 AM',
    recordedByTeacherId: 'T-1001',
    recordedByTeacherName: 'Natik Kothari',
    recordedAt: '2026-09-22 08:30'
  },
  {
    id: 'att-STU-10A-02-2026-09-22',
    studentId: 'STU-10A-02',
    studentName: 'ABHINAV SHARMA',
    rollNo: 2,
    className: '10',
    section: 'A',
    date: '2026-09-22',
    status: 'present',
    checkInTime: '08:10 AM',
    recordedByTeacherId: 'T-1001',
    recordedByTeacherName: 'Natik Kothari',
    recordedAt: '2026-09-22 08:30'
  },
  {
    id: 'att-STU-10A-03-2026-09-22',
    studentId: 'STU-10A-03',
    studentName: 'ABHISHEK MUNDHRA',
    rollNo: 3,
    className: '10',
    section: 'A',
    date: '2026-09-22',
    status: 'absent',
    recordedByTeacherId: 'T-1001',
    recordedByTeacherName: 'Natik Kothari',
    recordedAt: '2026-09-22 08:30',
    remarks: 'Medical leave informed by guardian'
  },
  {
    id: 'att-STU-10A-04-2026-09-22',
    studentId: 'STU-10A-04',
    studentName: 'ANANYA SINGHANIA',
    rollNo: 4,
    className: '10',
    section: 'A',
    date: '2026-09-22',
    status: 'present',
    checkInTime: '08:12 AM',
    recordedByTeacherId: 'T-1001',
    recordedByTeacherName: 'Natik Kothari',
    recordedAt: '2026-09-22 08:30'
  },
  {
    id: 'att-STU-10B-01-2026-09-22',
    studentId: 'STU-10B-01',
    studentName: 'AADITYA CHANDAK',
    rollNo: 1,
    className: '10',
    section: 'B',
    date: '2026-09-22',
    status: 'present',
    checkInTime: '08:18 AM',
    recordedByTeacherId: 'T-1002',
    recordedByTeacherName: 'Chitra Jain',
    recordedAt: '2026-09-22 08:30'
  },
  // 2026-09-21
  {
    id: 'att-STU-10A-01-2026-09-21',
    studentId: 'STU-10A-01',
    studentName: 'AASTHA',
    rollNo: 1,
    className: '10',
    section: 'A',
    date: '2026-09-21',
    status: 'present',
    checkInTime: '08:14 AM',
    recordedByTeacherId: 'T-1001',
    recordedByTeacherName: 'Natik Kothari',
    recordedAt: '2026-09-21 08:30'
  },
  {
    id: 'att-STU-10A-02-2026-09-21',
    studentId: 'STU-10A-02',
    studentName: 'ABHINAV SHARMA',
    rollNo: 2,
    className: '10',
    section: 'A',
    date: '2026-09-21',
    status: 'present',
    checkInTime: '08:11 AM',
    recordedByTeacherId: 'T-1001',
    recordedByTeacherName: 'Natik Kothari',
    recordedAt: '2026-09-21 08:30'
  }
];

// --- INITIAL DATA: SCHOOL HOMEWORK ---
const INITIAL_HOMEWORK: SchoolHomeworkItem[] = [
  {
    id: 'HW-2026-001',
    title: 'Quadratic Equations Exercise 4.2 & 4.3',
    subject: 'Mathematics',
    className: '10',
    section: 'A',
    instructions: 'Complete all questions from Section A & B in your fair notebook. Show all step-by-step factorization and quadratic formula methods. Bring notebook for verification on Wednesday.',
    assignedDate: '2026-09-22',
    dueDate: '2026-09-24',
    teacherId: 'T-1001',
    teacherName: 'Natik Kothari',
    attachmentName: 'Maths_Quadratic_Practice_Set.pdf',
    attachmentSize: '450 KB',
    submissions: [
      {
        studentId: 'STU-10A-01',
        studentName: 'AASTHA',
        submittedAt: '2026-09-22 17:30',
        status: 'Submitted'
      }
    ],
    createdAt: '2026-09-22 09:15'
  },
  {
    id: 'HW-2026-002',
    title: 'Ray Optics Lens Formula & Ray Diagrams',
    subject: 'Science',
    className: '10',
    section: 'B',
    instructions: 'Draw neat, well-labelled ray diagrams for convex and concave lenses when the object is at 2F, F, and between F and O. Write sign convention rules.',
    assignedDate: '2026-09-21',
    dueDate: '2026-09-23',
    teacherId: 'T-1002',
    teacherName: 'Chitra Jain',
    attachmentName: 'Ray_Optics_Lab_Guide.pdf',
    attachmentSize: '780 KB',
    submissions: [],
    createdAt: '2026-09-21 11:00'
  },
  {
    id: 'HW-2026-003',
    title: 'Formal Editorial Letter: Road Safety Around School',
    subject: 'English',
    className: '10',
    section: 'A',
    instructions: 'Write a formal letter to the editor of a national daily expressing concern over reckless driving near school zones and suggesting practical measures in 150-200 words.',
    assignedDate: '2026-09-20',
    dueDate: '2026-09-22',
    teacherId: 'T-1006',
    teacherName: 'Arundhati Roy',
    submissions: [
      {
        studentId: 'STU-10A-01',
        studentName: 'AASTHA',
        submittedAt: '2026-09-21 19:10',
        status: 'Completed'
      },
      {
        studentId: 'STU-10A-02',
        studentName: 'ABHINAV SHARMA',
        submittedAt: '2026-09-21 20:00',
        status: 'Completed'
      }
    ],
    createdAt: '2026-09-20 10:30'
  }
];

// --- STUDENT DAILY ATTENDANCE API ---
export function getStudentDailyAttendanceRecords(): StudentDailyAttendanceRecord[] {
  try {
    const data = localStorage.getItem(STUDENT_ATTENDANCE_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load daily attendance from storage', err);
  }
  try {
    localStorage.setItem(STUDENT_ATTENDANCE_STORAGE_KEY, JSON.stringify(INITIAL_STUDENT_ATTENDANCE));
  } catch (e) {}
  return INITIAL_STUDENT_ATTENDANCE;
}

export function saveStudentDailyAttendanceRecords(items: StudentDailyAttendanceRecord[]): void {
  try {
    localStorage.setItem(STUDENT_ATTENDANCE_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save student daily attendance', err);
  }
}

export function getDailyAttendanceForClass(
  className: string,
  section: string,
  date: string
): StudentDailyAttendanceRecord[] {
  const all = getStudentDailyAttendanceRecords();
  const targetNormalized = normalizeClass(className, section);
  return all.filter(r => {
    return normalizeClass(r.className, r.section) === targetNormalized && r.date === date;
  });
}

export function isAttendanceAlreadyRecorded(
  className: string,
  section: string,
  date: string
): boolean {
  const records = getDailyAttendanceForClass(className, section, date);
  return records.length > 0;
}

export function saveClassDailyAttendance(
  className: string,
  section: string,
  date: string,
  records: StudentDailyAttendanceRecord[],
  teacherId: string,
  teacherName: string
): void {
  const all = getStudentDailyAttendanceRecords();
  const c = className.trim().replace(/^Class\s+/i, '');
  const s = section.trim().toUpperCase();

  // Remove existing records for this class & section & date
  const filtered = all.filter(r => {
    const rClass = r.className.trim().replace(/^Class\s+/i, '');
    const rSec = r.section.trim().toUpperCase();
    return !(rClass === c && rSec === s && r.date === date);
  });

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const stampedRecords = records.map(r => ({
    ...r,
    className: c,
    section: s,
    date,
    recordedByTeacherId: teacherId,
    recordedByTeacherName: teacherName,
    recordedAt: timestamp
  }));

  const updated = [...stampedRecords, ...filtered];
  saveStudentDailyAttendanceRecords(updated);

  // Send a general circular notice
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;

  createSchoolNotification({
    title: `Attendance Recorded: Class ${c}-${s} (${date})`,
    message: `${teacherName} marked attendance for Class ${c}-${s}: ${presentCount} Present, ${absentCount} Absent out of ${records.length} students.`,
    category: 'Attendance',
    priority: 'Normal',
    audience: 'Everyone',
    createdBy: teacherName
  });

  // Specifically notify parents of absent students (Requirement 16)
  const absentStudents = records.filter(r => r.status === 'absent');
  absentStudents.forEach(st => {
    createSchoolNotification({
      title: `Attendance Alert: ${st.studentName} Marked Absent`,
      message: `${st.studentName} was marked absent today (${date}) in Class ${c}-${s}. If this absence was unexpected, please contact the academy office or class teacher ${teacherName}.`,
      category: 'Attendance',
      priority: 'Urgent',
      audience: 'Parents',
      targetStudentId: st.studentId,
      targetClass: c,
      targetSection: s,
      createdBy: teacherName
    });
  });
}

export function getStudentAttendanceHistory(
  studentId: string,
  monthYear?: string
): {
  records: StudentDailyAttendanceRecord[];
  totalWorkingDays: number;
  presentCount: number;
  absentCount: number;
  percentage: number;
} {
  const all = getStudentDailyAttendanceRecords();
  let studentRecords = all.filter(r => r.studentId === studentId);

  if (monthYear) {
    // e.g. "2026-09"
    studentRecords = studentRecords.filter(r => r.date.startsWith(monthYear));
  }

  // Sort descending by date
  studentRecords.sort((a, b) => b.date.localeCompare(a.date));

  const totalWorkingDays = studentRecords.length;
  const presentCount = studentRecords.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'half_day').length;
  const absentCount = studentRecords.filter(r => r.status === 'absent').length;
  const percentage = totalWorkingDays > 0 ? Math.round((presentCount / totalWorkingDays) * 100) : 95;

  return {
    records: studentRecords,
    totalWorkingDays: totalWorkingDays > 0 ? totalWorkingDays : 22,
    presentCount: totalWorkingDays > 0 ? presentCount : 20,
    absentCount: totalWorkingDays > 0 ? absentCount : 2,
    percentage
  };
}

// --- SCHOOL HOMEWORK API ---
export function getSchoolHomework(): SchoolHomeworkItem[] {
  try {
    const data = localStorage.getItem(HOMEWORK_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load homework from storage', err);
  }
  try {
    localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(INITIAL_HOMEWORK));
  } catch (e) {}
  return INITIAL_HOMEWORK;
}

export function saveSchoolHomework(items: SchoolHomeworkItem[]): void {
  try {
    localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save homework', err);
  }
}

export function createSchoolHomework(
  hw: Omit<SchoolHomeworkItem, 'id' | 'createdAt' | 'submissions'>
): SchoolHomeworkItem {
  const newHw: SchoolHomeworkItem = {
    ...hw,
    id: `HW-${Date.now()}`,
    submissions: [],
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };
  const list = getSchoolHomework();
  const updated = [newHw, ...list];
  saveSchoolHomework(updated);

  // Automatically broadcast notification to students and parents of that class!
  createSchoolNotification({
    title: `New Homework: ${hw.subject} — Class ${hw.className}-${hw.section}`,
    message: `${hw.teacherName} assigned new homework "${hw.title}". Due date: ${hw.dueDate}. Instructions: ${hw.instructions.slice(0, 80)}...`,
    category: 'Academic',
    priority: 'Normal',
    audience: 'Specific Class',
    targetClass: hw.className,
    targetSection: hw.section,
    createdBy: hw.teacherName
  });

  return newHw;
}

export function getHomeworkForClass(className: string, section?: string): SchoolHomeworkItem[] {
  const list = getSchoolHomework();
  const targetNormalized = normalizeClass(className, section);

  return list.filter(h => {
    return normalizeClass(h.className, h.section) === targetNormalized;
  });
}

export function getHomeworkForTeacher(teacherId: string, teacherName?: string): SchoolHomeworkItem[] {
  const list = getSchoolHomework();
  return list.filter(h => h.teacherId === teacherId || (teacherName && h.teacherName.toLowerCase() === teacherName.toLowerCase()));
}

export function toggleStudentHomeworkSubmission(
  homeworkId: string,
  studentId: string,
  studentName: string
): boolean {
  const list = getSchoolHomework();
  let isNowSubmitted = false;

  const updated = list.map(h => {
    if (h.id === homeworkId) {
      const existingSubIndex = h.submissions.findIndex(s => s.studentId === studentId);
      let newSubmissions = [...h.submissions];
      if (existingSubIndex >= 0) {
        // Toggle off
        newSubmissions = newSubmissions.filter(s => s.studentId !== studentId);
        isNowSubmitted = false;
      } else {
        // Mark submitted
        newSubmissions.push({
          studentId,
          studentName,
          submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'Submitted'
        });
        isNowSubmitted = true;
      }
      return { ...h, submissions: newSubmissions };
    }
    return h;
  });

  saveSchoolHomework(updated);
  return isNowSubmitted;
}

// --- MASTER SCHOOL CALENDAR API ---
export interface SchoolCalendarEventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  category: 'Holiday' | 'Exam' | 'PTM' | 'Event' | 'Sports' | 'Academic';
  audience: 'Everyone' | 'Teachers' | 'Students' | 'Parents' | 'Specific Class';
  targetClass?: string;
  targetSection?: string;
  description: string;
  createdAt: string;
}

const CALENDAR_STORAGE_KEY = 'stba_calendar_events_v1';

export const INITIAL_CALENDAR_EVENTS: SchoolCalendarEventItem[] = [
  {
    id: 'CAL-001',
    title: 'Annual Inter-House Athletics Meet',
    date: '2026-09-25',
    time: '08:30 AM',
    location: 'Main Sports Complex',
    category: 'Sports',
    audience: 'Everyone',
    description: 'Field events, 100m/400m track championships, and march-past parade.',
    createdAt: '2026-09-01'
  },
  {
    id: 'CAL-002',
    title: 'CBSE Term-1 Mathematics Assessment',
    date: '2026-09-28',
    time: '09:00 AM',
    location: 'Designated Examination Halls',
    category: 'Exam',
    audience: 'Students',
    targetClass: '10',
    targetSection: 'B',
    description: 'Periodic Assessment covering Algebra, Quadratic Equations, and Geometry.',
    createdAt: '2026-09-05'
  },
  {
    id: 'CAL-003',
    title: 'Gandhi Jayanti (Gazetted Holiday)',
    date: '2026-10-02',
    category: 'Holiday',
    audience: 'Everyone',
    description: 'Campus remains closed for all classes. Online revision modules active on student portal.',
    createdAt: '2026-09-01'
  },
  {
    id: 'CAL-004',
    title: 'Quarterly Parent-Teacher Meeting (PTM)',
    date: '2026-10-03',
    time: '09:30 AM – 01:30 PM',
    location: 'Academic Classrooms',
    category: 'PTM',
    audience: 'Parents',
    description: 'Comprehensive review of academic grades, attendance, and student conduct dossier.',
    createdAt: '2026-09-10'
  },
  {
    id: 'CAL-005',
    title: 'Annual Science & Robotics Innovation Expo',
    date: '2026-10-14',
    time: '10:00 AM',
    location: 'Innovation Lab & Auditorium',
    category: 'Academic',
    audience: 'Everyone',
    description: 'Student project demonstration, IoT models, and green energy prototypes exhibition.',
    createdAt: '2026-09-12'
  }
];

export function getSchoolCalendarEvents(): SchoolCalendarEventItem[] {
  try {
    const data = localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load calendar events', err);
  }
  try {
    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(INITIAL_CALENDAR_EVENTS));
  } catch (e) {}
  return INITIAL_CALENDAR_EVENTS;
}

export function saveSchoolCalendarEvents(events: SchoolCalendarEventItem[]): void {
  try {
    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save calendar events', err);
  }
}

export function createSchoolCalendarEvent(
  eventData: Omit<SchoolCalendarEventItem, 'id' | 'createdAt'>
): SchoolCalendarEventItem {
  const newEvt: SchoolCalendarEventItem = {
    ...eventData,
    id: `CAL-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10)
  };
  const list = getSchoolCalendarEvents();
  const updated = [newEvt, ...list];
  saveSchoolCalendarEvents(updated);

  // Broadcast announcement / notification to calendar audience
  createSchoolNotification({
    title: `Calendar Update: ${newEvt.title} (${newEvt.category})`,
    message: `${newEvt.title} has been scheduled for ${newEvt.date}${newEvt.time ? ' at ' + newEvt.time : ''}. ${newEvt.description}`,
    category: newEvt.category === 'Holiday' ? 'Holiday' : newEvt.category === 'Exam' ? 'Exam' : 'Event',
    priority: newEvt.category === 'Holiday' || newEvt.category === 'Exam' ? 'Important' : 'Normal',
    audience: newEvt.audience,
    targetClass: newEvt.targetClass,
    targetSection: newEvt.targetSection,
    createdBy: 'Administration Office'
  });

  return newEvt;
}

