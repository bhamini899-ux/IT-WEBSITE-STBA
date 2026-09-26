import { AttendanceStatus } from '../types';

export interface SmartAttendanceStudent {
  id: string;
  name: string;
  rollNo: number;
  className: string;
  section: string;
  admissionNo: string;
  gender: 'M' | 'F';
  todayStatus: AttendanceStatus;
  checkInTime: string;
  attendancePercentage: number;
  monthlyPercentage: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  lastAbsence: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  recentTrend: ('P' | 'A' | 'L' | 'E')[]; // Last 7 days
  requiresAttention: boolean;
  attentionReason?: string;
  avatarUrl?: string;
}

export interface ClassAttendanceDetail {
  className: string;
  grade: number;
  section: string;
  classTeacher: string;
  room: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
  status: 'Excellent' | 'Normal' | 'Attention' | 'Critical';
}

export interface AttendanceDayRecord {
  date: string;
  dayName: string;
  rate: number;
  present: number;
  absent: number;
  late: number;
  total: number;
}

export interface MonthlyAttendanceRecord {
  month: string;
  rate: number;
  workingDays: number;
  avgPresent: number;
}

export interface AttendanceNotificationEvent {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  className: string;
  rollNo: number;
  status: 'absent' | 'late';
  guardianName: string;
  guardianPhone: string;
  message: string;
  deliveryStatus: 'Queued' | 'Sent' | 'Delivered';
}

// Class 10 Academic Sections with exact user-assigned Class Teachers
export const SMART_ATTENDANCE_CLASSES: ClassAttendanceDetail[] = [
  { className: '10-A', grade: 10, section: 'A', classTeacher: 'Natik Kothari', room: 'Room 301', totalStudents: 44, present: 42, absent: 2, late: 0, attendanceRate: 95.5, status: 'Excellent' },
  { className: '10-B', grade: 10, section: 'B', classTeacher: 'Chitra Jain', room: 'Room 302', totalStudents: 42, present: 40, absent: 2, late: 0, attendanceRate: 95.2, status: 'Excellent' },
  { className: '10-C', grade: 10, section: 'C', classTeacher: 'Krishna Sharma', room: 'Room 303', totalStudents: 47, present: 45, absent: 2, late: 0, attendanceRate: 95.7, status: 'Excellent' },
  { className: '10-D', grade: 10, section: 'D', classTeacher: 'Sanwarlal Prajapat', room: 'Room 304', totalStudents: 43, present: 41, absent: 2, late: 0, attendanceRate: 95.3, status: 'Excellent' },
  { className: '10-E', grade: 10, section: 'E', classTeacher: 'Bhuvnesh Sir', room: 'Room 305', totalStudents: 43, present: 41, absent: 2, late: 0, attendanceRate: 95.3, status: 'Excellent' },
];

// 40+ Detailed Students Across all Class 10 sections
export const INITIAL_SMART_ATTENDANCE_STUDENTS: SmartAttendanceStudent[] = [];

// Last 7 Days Attendance Trend Analytics (Class 10 - 219 Students Total)
export const WEEKLY_ATTENDANCE_TREND: AttendanceDayRecord[] = [
  { date: '11 Sep', dayName: 'Thu', rate: 95.4, present: 209, absent: 7, late: 3, total: 219 },
  { date: '12 Sep', dayName: 'Fri', rate: 95.9, present: 210, absent: 6, late: 3, total: 219 },
  { date: '13 Sep', dayName: 'Sat', rate: 94.1, present: 206, absent: 9, late: 4, total: 219 },
  { date: '15 Sep', dayName: 'Mon', rate: 95.0, present: 208, absent: 7, late: 4, total: 219 },
  { date: '16 Sep', dayName: 'Tue', rate: 96.3, present: 211, absent: 5, late: 3, total: 219 },
  { date: '17 Sep', dayName: 'Wed', rate: 95.4, present: 209, absent: 7, late: 3, total: 219 },
  { date: 'Today',  dayName: 'Thu', rate: 95.4, present: 209, absent: 8, late: 2, total: 219 }
];

// Monthly Attendance History (Class 10)
export const MONTHLY_ATTENDANCE_TREND: MonthlyAttendanceRecord[] = [
  { month: 'Apr 2026', rate: 96.2, workingDays: 22, avgPresent: 211 },
  { month: 'May 2026', rate: 94.5, workingDays: 18, avgPresent: 207 },
  { month: 'Jul 2026', rate: 95.1, workingDays: 24, avgPresent: 208 },
  { month: 'Aug 2026', rate: 95.8, workingDays: 23, avgPresent: 210 },
  { month: 'Sep 2026', rate: 95.4, workingDays: 16, avgPresent: 209 }
];

// Initial Internal Parent Notification Events
export const INITIAL_ATTENDANCE_NOTIFICATIONS: AttendanceNotificationEvent[] = [
  {
    id: 'ATT-EV-01',
    timestamp: '08:45 AM',
    studentId: 'STU-1044',
    studentName: 'Kabir Jain',
    className: '10-B',
    rollNo: 14,
    status: 'absent',
    guardianName: 'Rakesh Jain',
    guardianPhone: '+91 98290 33456',
    message: 'ATTENDANCE: 🔴 Kabir Jain was marked absent today in Class 10-B roll call.',
    deliveryStatus: 'Delivered'
  },
  {
    id: 'ATT-EV-02',
    timestamp: '08:46 AM',
    studentId: 'STU-1045',
    studentName: 'Ananya Mehta',
    className: '10-B',
    rollNo: 7,
    status: 'absent',
    guardianName: 'Vikram Mehta',
    guardianPhone: '+91 98290 44567',
    message: 'ATTENDANCE: 🔴 Ananya Mehta was marked absent today in Class 10-B roll call.',
    deliveryStatus: 'Delivered'
  },
  {
    id: 'ATT-EV-03',
    timestamp: '08:48 AM',
    studentId: 'STU-1047',
    studentName: 'Rohan Sharma',
    className: '10-B',
    rollNo: 24,
    status: 'late',
    guardianName: 'Dinesh Sharma',
    guardianPhone: '+91 98290 77112',
    message: 'ATTENDANCE: 🟠 Rohan Sharma checked in late at 08:42 AM for Class 10-B.',
    deliveryStatus: 'Delivered'
  }
];
