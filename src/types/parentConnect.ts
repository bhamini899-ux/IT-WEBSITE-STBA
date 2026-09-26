export type ParentConnectTab = 
  | 'dashboard'
  | 'entry_exit'
  | 'attendance'
  | 'transport'
  | 'academics'
  | 'homework'
  | 'timetable'
  | 'fees'
  | 'notifications'
  | 'ptm_events'
  | 'teacher_chat'
  | 'documents'
  | 'emergency';

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  className: string;
  section: string;
  rollNo: number;
  house: 'Agni' | 'Surya' | 'Prithvi' | 'Vayu' | 'Trishul';
  admissionNo: string;
  dob: string;
  bloodGroup: string;
  classTeacher: string;
  classTeacherPhone: string;
  busNumber: string;
  transportRoute: string;
  todayStatus: 'In School' | 'In Transit' | 'At Home' | 'On Leave' | 'On Approved Leave' | 'Absent';
  todayStatusDetail: string;
  entryTimeToday: string | null;
  exitTimeToday: string | null;
  attendanceRate: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  totalLateDays: number;
  academicAverage: number;
  academicRank: number;
  pendingHomeworkCount: number;
  pendingFeeAmount: number;
  nextFeeDueDate: string;
  parentLinked?: boolean;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

export interface ChildEntryExitRecord {
  id: string;
  date: string;
  day: string;
  entryTime: string;
  entryGate: string;
  exitTime: string | null;
  exitGate: string | null;
  status: 'Normal Entry' | 'Late Entry' | 'Normal Dispersal' | 'Early Gate Pass';
  verifiedBy: string;
  rfidCardId: string;
  notes?: string;
}

export interface ChildAttendanceDay {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  status: 'present' | 'absent' | 'late' | 'holiday' | 'weekend';
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export interface ParentLeaveRequest {
  id: string;
  childId: string;
  fromDate: string;
  toDate: string;
  daysCount: number;
  reason: 'Medical Leave' | 'Family Function' | 'Outstation Travel' | 'Personal Emergency';
  explanation: string;
  appliedDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  reviewedBy?: string;
  reviewRemarks?: string;
}

export interface ChildTransportDetails {
  busNumber: string;
  vehicleRegNo: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  driverPhoto: string;
  conductorName: string;
  conductorPhone: string;
  pickupStop: string;
  pickupTime: string;
  dropStop: string;
  dropTime: string;
  currentStatus: 'Boarded Bus' | 'In Transit' | 'Reached School' | 'Dispersal In Transit' | 'Reached Home' | 'Idle';
  speedKmh: number;
  currentLocationName: string;
  etaMinutes: number;
  gpsStatus: 'Active' | 'Weak' | 'Offline';
  routeStops: {
    stopName: string;
    scheduledTime: string;
    actualTime?: string;
    completed: boolean;
    isChildStop?: boolean;
    isSchool?: boolean;
  }[];
  transportNotifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'pickup' | 'arrival' | 'delay' | 'drop';
  }[];
}

export interface ChildSubjectAcademic {
  id: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  teacherAvatar: string;
  teacherEmail: string;
  recentScore: number;
  recentMaxScore: number;
  examName: string;
  termAverage: number;
  grade: string;
  trend: 'up' | 'down' | 'stable';
  teacherRemarks: string;
}

export interface ChildHomeworkItem {
  id: string;
  childId: string;
  subject: string;
  title: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  isOverdue?: boolean;
  completed: boolean;
  completedAt?: string;
  teacherName: string;
  teacherRemarks?: string;
  attachmentName?: string;
}

export interface ChildTimetablePeriod {
  periodNumber: number;
  timeSlot: string;
  subject: string;
  teacher: string;
  room: string;
  isBreak?: boolean;
  isCurrent?: boolean;
}

export interface DayTimetable {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: ChildTimetablePeriod[];
}

export interface ChildFeeSummary {
  totalAnnualFee: number;
  paidAmount: number;
  pendingAmount: number;
  nextDueDate: string;
  academicYear: string;
  installments: {
    id: string;
    term: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    paidDate?: string;
    receiptNo?: string;
  }[];
  paymentHistory: {
    receiptNo: string;
    title: string;
    date: string;
    amount: number;
    paymentMode: string;
    status: 'Success';
    downloadable: boolean;
  }[];
}

export interface ParentConnectNotification {
  id: string;
  childId: string;
  category: 
    | 'ENTRY'
    | 'EXIT'
    | 'ATTENDANCE'
    | 'BUS'
    | 'HOMEWORK'
    | 'EXAM'
    | 'RESULT'
    | 'FEES'
    | 'PTM'
    | 'EVENTS'
    | 'ANNOUNCEMENTS';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'low' | 'medium' | 'high';
  actionLabel?: string;
  actionTab?: ParentConnectTab;
}

export interface ParentPTMItem {
  id: string;
  title: string;
  date: string;
  timeSlot: string;
  teacherName: string;
  teacherDesignation: string;
  roomNumber: string;
  agenda: string;
  status: 'Confirmed' | 'Pending Confirmation' | 'Completed';
  notes?: string;
}

export interface SchoolEventItem {
  id: string;
  title: string;
  category: 'Sports' | 'Cultural' | 'Academic' | 'Exhibition' | 'Holiday';
  date: string;
  time: string;
  venue: string;
  description: string;
  forClasses: string;
}

export interface ParentTeacherMessage {
  id: string;
  childId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  subject: string;
  message: string;
  timestamp: string;
  isBroadcast: boolean;
  unread: boolean;
  replyAllowed: boolean;
}

export interface ParentSchoolDocument {
  id: string;
  childId: string;
  title: string;
  category: 'Report Card' | 'Certificate' | 'Circular' | 'Fee Receipt' | 'Medical' | 'Identity Card' | 'Transport Pass' | 'Health Record';
  issueDate: string;
  date?: string;
  fileSize: string;
  format: 'PDF' | 'IMAGE' | 'DOC';
  fileType?: string;
  description: string;
}

export interface SchoolEmergencyContact {
  id: string;
  department: string;
  contactPerson: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  timing: string;
  badge: string;
  isEmergencyHotline?: boolean;
}

export type EmergencyContactInfo = SchoolEmergencyContact;

export interface CommunicationMessageItem {
  id: string;
  senderName: string;
  senderRole: 'Parent' | 'Teacher' | 'Admin';
  timestamp: string;
  text: string;
}

export interface TeacherCommunicationThread {
  id: string;
  childId: string;
  teacherName: string;
  teacherRole: string;
  teacherAvatar?: string;
  teacherEmail: string;
  subject: string;
  lastUpdated: string;
  status: 'Open' | 'Resolved';
  messages: CommunicationMessageItem[];
}

