export type AppSection = 
  // Command
  | 'dashboard'
  // People
  | 'students'
  | 'teachers'
  | 'users'
  | 'attendance'
  | 'parents'
  | 'parent_connect'
  // Academics
  | 'timetable'
  | 'academics'
  // Campus
  | 'classrooms'
  | 'assets'
  | 'maintenance'
  | 'safety'
  | 'visitors'
  // Services
  | 'library'
  | 'transport'
  | 'canteen'
  | 'health'
  // Resources
  | 'finance'
  | 'energy'
  | 'water'
  | 'waste'
  | 'green_campus'
  // Communication
  | 'announcements'
  | 'messages'
  | 'calendar'
  // Intelligence
  | 'ai_assistant'
  | 'smart_insights'
  | 'smart_alerts'
  // Reporting
  | 'reports'
  | 'audit_log'
  // System
  | 'security'
  | 'settings'
  | 'demo_mode'
  | 'notifications'
  | 'profile';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'Present' | 'Absent' | 'Late' | 'Excused';

export type StudentHouse = 'Agni' | 'Surya' | 'Prithvi' | 'Vayu' | 'Trishul';
export type StudentStatus = 'Active' | 'On Leave' | 'Transferred' | 'Archived';
export type AcademicStatus = 'Distinction' | 'Excellent' | 'Good' | 'Average' | 'Needs Support';
export type UserRoleView = 'Administrator' | 'Teacher' | 'Librarian' | 'Transport Manager' | 'Security' | 'Parent' | 'Student';

export interface SubjectScore {
  subject: string;
  score: number;
  maxScore: number;
  grade: string;
  remarks?: string;
}

export interface StudentFamily {
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  fatherEmail: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  motherEmail: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export interface StudentTransportInfo {
  busNumber: string;
  routeId: string;
  routeName: string;
  stopName: string;
  morningPickupTime: string;
  afternoonDropTime: string;
  driverName: string;
  driverPhone: string;
  mode: 'School Bus' | 'Private' | 'Walker' | 'Bicycle';
}

export interface FeeReceipt {
  id: string;
  date: string;
  amount: number;
  term: string;
  mode: 'UPI' | 'Net Banking' | 'Card' | 'Cheque' | 'Cash';
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface StudentFeeDetails {
  totalAnnual: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  nextDueDate: string;
  lastPaymentDate: string;
  receipts: FeeReceipt[];
}

export interface StudentLibrarySummary {
  activeIssuedCount: number;
  overdueCount: number;
  totalReadCount: number;
  totalFinesPending: number;
}

export interface StudentLeaveRecord {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  category: 'Medical' | 'Family Function' | 'Bereavement' | 'Academic' | 'Sports' | 'Casual' | 'Other';
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
  approvedBy?: string;
  documentName?: string;
}

export interface StudentActivityItem {
  id: string;
  title: string;
  type: 'Club' | 'Sports' | 'Competition' | 'Cultural' | 'Workshop' | 'Leadership';
  role: string;
  date: string;
  details: string;
}

export interface StudentAchievementItem {
  id: string;
  title: string;
  category: 'Academic' | 'Sports' | 'Cultural' | 'Competition' | 'Leadership';
  date: string;
  position: '1st Place (Gold)' | '2nd Place (Silver)' | '3rd Place (Bronze)' | 'Special Mention' | 'Participant';
  event: string;
  certificateUrl?: string;
  description: string;
}

export interface StudentDisciplineItem {
  id: string;
  date: string;
  type: 'Negative' | 'Positive Recognition';
  category: string;
  description: string;
  reportedBy: string;
  actionTaken: string;
  followUp?: string;
  status: 'Resolved' | 'Under Review' | 'Active';
}

export interface StudentHealthProfile {
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  dietaryRestrictions: string;
  emergencyActionPlan: string;
  pediatricianName: string;
  pediatricianPhone: string;
  vaccinationsUpToDate: boolean;
}

export interface StudentDocumentRecord {
  id: string;
  name: string;
  category: 'Admission' | 'Identity' | 'Academic' | 'Medical' | 'Certificate';
  uploadDate: string;
  fileSize: string;
  verified: boolean;
  expiryDate?: string;
}

export interface StudentCommunicationLog {
  id: string;
  date: string;
  time: string;
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'Phone Call' | 'Portal Notice';
  recipient: string;
  subject: string;
  message: string;
  delivered: boolean;
  sentBy: string;
}

export interface StudentTimelineEvent {
  id: string;
  date: string;
  time: string;
  category: 'Attendance' | 'Academic' | 'Library' | 'Transport' | 'Fee' | 'Leave' | 'Discipline' | 'Achievement' | 'System';
  title: string;
  description: string;
}

export interface StudentAlertTag {
  id: string;
  type: 'attendance' | 'fee' | 'library' | 'health' | 'document' | 'exam' | 'leave';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  sourceModule: AppSection;
}

export interface StudentNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface StudentAuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  studentId: string;
  studentName: string;
  details: string;
}

export interface Student {
  id: string;
  name: string;
  className: string;
  todayStatus: AttendanceStatus;
  attendancePercentage: number;
  lastAbsence: string;
  guardianName: string;
  guardianPhone: string;
  rollNo?: number;
  gender?: 'M' | 'F';
  feeStatus?: 'Paid' | 'Pending' | 'Overdue';
  transportRoute?: string;
  // Student 360° Extensions
  admissionNo?: string;
  admissionDate?: string;
  isNewAdmission?: boolean;
  section?: string;
  house?: StudentHouse;
  status?: StudentStatus;
  photoUrl?: string;
  dob?: string;
  bloodGroup?: string;
  address?: string;
  motherTongue?: string;
  nationality?: string;
  aadhaarNo?: string;
  academicStatus?: AcademicStatus;
  academicAverage?: number;
  academicRank?: number;
  academicScores?: SubjectScore[];
  family?: StudentFamily;
  transportDetails?: StudentTransportInfo;
  feeDetails?: StudentFeeDetails;
  libraryDetails?: StudentLibrarySummary;
  leaves?: StudentLeaveRecord[];
  activities?: StudentActivityItem[];
  achievements?: StudentAchievementItem[];
  disciplineRecords?: StudentDisciplineItem[];
  healthRecords?: StudentHealthProfile;
  documents?: StudentDocumentRecord[];
  communications?: StudentCommunicationLog[];
  timeline?: StudentTimelineEvent[];
  smartAlerts?: StudentAlertTag[];
  notes?: StudentNote[];
  class?: string;
  rollNumber?: number | string;
  avatar?: string;
  fatherName?: string;
  motherName?: string;
  parentContact?: string;
  parentEmail?: string;
  totalFeesDue?: number;
  tags?: string[];
  emergencyContact?: string;
}

export interface ClassAttendanceSummary {
  className: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
  excused?: number;
}

export interface TeacherSummary {
  id: string;
  name: string;
  subject: string;
  department: string;
  status: 'Present' | 'On Leave' | 'In Class' | 'Free';
  assignedClass: string;
  phone: string;
  email: string;
}

export interface StaffStats {
  totalTeachers: number;
  teachersPresent: number;
  teachersOnLeave: number;
  totalStaff: number;
  staffPresent: number;
  staffOnLeave: number;
}

export interface TimetablePeriod {
  id: string;
  periodNumber: number;
  timeRange: string;
  subject: string;
  className: string;
  room: string;
  teacher: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  endsInMinutes?: number;
}

export interface SchoolActivityEvent {
  id: string;
  timestamp: string;
  time: string;
  category: 'Attendance' | 'Transport' | 'Library' | 'Finance' | 'Maintenance' | 'Academics' | 'Safety' | 'Communication';
  description: string;
  detail?: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  relatedEntityId?: string;
}

export interface SchoolEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: 'Sports' | 'Academic' | 'Exhibition' | 'Workshop' | 'Holiday' | 'Exam';
  registeredCount?: number;
  status: 'Confirmed' | 'Scheduled' | 'Tentative';
  description?: string;
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  category?: string;
  author: string;
  time?: string;
  date?: string;
  audience: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  read?: boolean;
  readPercentage?: number;
  readCount?: number;
  totalTarget?: number;
  content: string;
}

export interface SmartAlertItem {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  module: 'Health' | 'Transport' | 'Energy' | 'Library' | 'Finance' | 'Safety' | 'Maintenance' | 'Attendance';
  time: string;
  title: string;
  description: string;
  resolved: boolean;
  actionLabel?: string;
  targetSection: AppSection;
}

export interface MaintenanceIssue {
  id: string;
  room: string;
  equipment: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Assigned' | 'Resolved';
  reportedAt: string;
  assignedTechnician?: string;
  estimatedFixTime?: string;
  issue?: string;
  description?: string;
  reportedTime?: string;
}

export interface AdminReminder {
  id: string;
  title: string;
  count?: number;
  category: string;
  dueTime: string;
  completed: boolean;
  targetSection: AppSection;
}

export interface SchoolAIInsight {
  id: string;
  category: 'Attendance' | 'Energy' | 'Transport' | 'Library' | 'Maintenance' | 'Finance';
  title: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
  suggestedAction: string;
  targetSection: AppSection;
}

export interface FinanceSnapshot {
  todayCollection: number;
  monthlyCollectionLakhs: number;
  outstandingLakhs: number;
  overdueAccountsCount: number;
  monthlyExpensesLakhs: number;
  netBalanceLakhs: number;
  collectionTargetPct: number;
  dailyTrend: { day: string; amountThousands: number }[];
}

export interface ClassroomBlockOccupancy {
  blockName: string;
  totalRooms: number;
  occupiedRooms: number;
  utilizationPct: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  borrowedCount: number;
}

export interface BorrowRecord {
  id: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  overdueDays: number;
  fineAmount: number;
}

export interface Bus {
  id: string;
  busNumber: string;
  registrationPlate: string;
  driverName: string;
  driverPhone: string;
  routeId: string;
  routeName: string;
  studentsCount: number;
  currentStop: string;
  nextStop: string;
  etaMinutes: number;
  status: 'On Route' | 'At School' | 'Delayed' | 'Maintenance';
  x: number; // Simulated map X %
  y: number; // Simulated map Y %
  speedKmh: number;
  fuelLevel: number;
  capacity?: number;
  stops?: any[];
  fuelLevelPct?: number;
  currentLocation?: string;
}

export interface TransportRoute {
  routeId: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  students: number;
  status: 'Active' | 'At School' | 'Completed';
  stopsCount: number;
}

export type BusRoute = TransportRoute;

export interface ClassroomEnergy {
  roomNumber: string;
  wing: string;
  floor: number;
  lights: boolean;
  fans: boolean;
  ac: boolean;
  occupancy: number; // detected headcount
  lightsPowerKwh: number;
  fansPowerKwh: number;
  acPowerKwh: number;
}

export interface SchoolNotification {
  id: string;
  title: string;
  message: string;
  type: 'attendance' | 'library' | 'transport' | 'energy' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
  targetSection: AppSection;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

// ==========================================
// MODULE 3: TEACHER + TIMETABLE + STAFF TYPES
// ==========================================

export type TeacherDepartment = 
  | 'Mathematics' 
  | 'Science' 
  | 'English' 
  | 'Social Studies' 
  | 'Hindi' 
  | 'Computer Science & AI' 
  | 'Arts & Physical Ed' 
  | 'Commerce'
  | string;

export type TeacherDesignation = 
  | 'Teacher' 
  | 'Senior Teacher' 
  | 'Coordinator' 
  | 'Head of Department' 
  | 'HOD' 
  | 'PGT' 
  | 'TGT' 
  | 'PRT' 
  | 'Activity Teacher' 
  | string;

export type StaffAttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave' | 'On Duty';

export type SystemRole = 'Administrator' | 'Teacher' | 'Student' | 'Parent';

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  role: SystemRole;
  status: 'Active' | 'Inactive';
  createdAt: string;
  email?: string;
  phone?: string;
  // Specific Entity Links
  teacherId?: string;
  employeeId?: string;
  studentId?: string;
  parentId?: string;
  linkedStudentIds?: string[]; // for Parents
  // Quick metadata
  avatar?: string;
  department?: string;
  designation?: string;
  subject?: string;
  className?: string;
  section?: string;
  rollNo?: number;
  classTeacherOf?: string;
}

export type TeacherAttendanceRecordStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF DAY' | 'ON LEAVE' | 'HOLIDAY';

export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: TeacherAttendanceRecordStatus;
  checkIn?: string;
  checkOut?: string;
  remarks?: string;
  isApprovedLeave?: boolean;
  recordedBy?: string;
  recordedAt?: string;
}

export interface TeacherLeaveBalance {
  casual: number;
  sick: number;
  emergency: number;
  officialDuty: number;
  totalAvailable: number;
}

export interface TeacherLeaveRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  employeeId: string;
  department: TeacherDepartment;
  leaveType: 'Casual' | 'Sick' | 'Emergency' | 'Official Duty' | 'Other';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
  reviewedBy?: string;
  affectedPeriodsCount: number;
}

export interface TeacherTask {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  department: TeacherDepartment;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  category: 'Marks Submission' | 'Question Paper' | 'Homework Verification' | 'Department Meeting' | 'CBSE Portal' | 'Lesson Plan';
  completedAt?: string;
}

export interface TeacherActivityLog {
  id: string;
  teacherId: string;
  teacherName: string;
  timestamp: string;
  time: string;
  action: string;
  type: 'attendance' | 'teaching' | 'substitution' | 'leave' | 'task' | 'general';
}

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  department: TeacherDepartment;
  designation: TeacherDesignation;
  subjects: string[];
  classes: string[];
  classTeacherOf?: string;
  currentStatus: 'Present' | 'Absent' | 'On Leave' | 'Currently Teaching' | 'Free';
  attendanceToday: StaffAttendanceStatus;
  attendanceRate: number;
  workloadWeekly: number; // e.g. 24 periods
  maxWorkloadWeekly: number; // e.g. 30 periods
  currentPeriod: number | null; // e.g. 3 (currently teaching) or null (free)
  nextPeriod: number | null; // e.g. 4
  freePeriodsToday: number[]; // e.g. [2, 5, 7]
  email: string;
  phone: string;
  qualification: string;
  experienceYears: number;
  joiningDate: string;
  room: string;
  leaveBalance: TeacherLeaveBalance;
  tasksCount: number;
  consecutivePeriodsMax?: number;
}

export interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  category: 'Teacher' | 'Administrative' | 'Support';
  department: string;
  designation: string;
  status: StaffAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  phone: string;
  email: string;
  isTeacher?: boolean;
  teacherRefId?: string;
}

export type TimetableDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  id: string;
  day: TimetableDay;
  periodNumber: number; // 1 to 8
  timeRange: string;
  className: string; // e.g. '10-B'
  subject: string; // e.g. 'Mathematics'
  teacherId: string;
  teacherName: string;
  room: string; // e.g. 'Room 204' or 'Physics Lab'
  isBreak?: boolean;
  breakTitle?: string;
  isSubstituted?: boolean;
  substituteTeacherId?: string;
  substituteTeacherName?: string;
  originalTeacherName?: string;
}

export interface TimetableConflict {
  id: string;
  type: 
    | 'teacher_double_booking' 
    | 'room_double_booking' 
    | 'class_double_booking' 
    | 'teacher_unavailable' 
    | 'room_unavailable' 
    | 'lab_conflict'
    | 'invalid_period';
  description: string;
  day: string;
  periodNumber: number;
  timeRange: string;
  affectedClass: string;
  affectedTeacher: string;
  affectedRoom: string;
  suggestedResolution?: string;
  severity?: 'critical' | 'warning' | 'info';
}

// Aliases and types for convenience across intelligence tools
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  className?: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  markedBy?: string;
}
export type TransportBus = Bus;
export type LibraryBook = Book;

export interface SubstitutionRecommendation {
  teacherId: string;
  teacherName: string;
  department: TeacherDepartment;
  subjectMatch: boolean;
  freePeriod: boolean;
  currentWorkload: number;
  familiarWithClass: boolean;
  reasoning: string;
}

export interface SubstitutionRecord {
  id: string;
  date: string;
  day: string;
  periodNumber: number;
  timeRange: string;
  className: string;
  subject: string;
  absentTeacherId: string;
  absentTeacherName: string;
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  room: string;
  status: 'Pending' | 'Assigned' | 'Notified' | 'Completed';
  reason: string;
  recommendations: SubstitutionRecommendation[];
  assignedAt?: string;
  slotId?: string;
  notes?: string;
}

// ==========================================
// MODULE 5: PARENT & GUARDIAN 360° TYPES
// ==========================================

export type ParentRelationship = 'Father' | 'Mother' | 'Guardian';
export type ParentAccountStatus = 'Active' | 'Verified' | 'Pending Invite';
export type ParentCommunicationChannel = 'WhatsApp' | 'SMS' | 'App' | 'Email' | 'School Notification';
export type CommunicationDeliveryStatus = 'Sent' | 'Delivered' | 'Read' | 'Pending' | 'Failed';
export type NotificationCategory = 
  | 'ENTRY' 
  | 'EXIT' 
  | 'ATTENDANCE' 
  | 'BUS' 
  | 'ACADEMICS' 
  | 'FEES' 
  | 'EVENTS' 
  | 'EXAMS' 
  | 'ANNOUNCEMENTS';

export interface ParentGuardianRecord {
  id: string;
  name: string;
  primaryContactName: string;
  relationship: ParentRelationship;
  phone: string;
  email: string;
  secondaryName?: string;
  secondaryPhone?: string;
  secondaryRelation?: string;
  address: string;
  preferredChannel: 'WhatsApp' | 'SMS' | 'App' | 'Email';
  accountStatus: ParentAccountStatus;
  communicationStatus: 'Opted In' | 'Active' | 'SMS Only' | 'App Verified';
  lastNotificationDate: string;
  lastNotificationType: string;
  pendingActionCount: number;
  pendingActionsList: string[];
  engagementLevel: 'High' | 'Moderate' | 'Low' | 'Needs Follow-up';
  
  // Linked Student Information
  linkedStudentId: string;
  linkedStudentName: string;
  className: string;
  section: string;
  rollNo: number;
  studentPhotoUrl: string;
  
  // Quick Academic / Operation metrics
  ptmStatus: 'Confirmed' | 'Pending' | 'Declined' | 'Completed';
  ptmSlot?: string;
  ptmTeacher?: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  feePendingAmount: number;
  totalFeeAnnual: number;
  lastPaymentDate?: string;
  nextFeeDueDate?: string;
  
  // Transport info
  transportRoute: string;
  busNumber: string;
  busStop: string;
  busEta: string;
  busBoardingStatus: 'On Board' | 'Boarded' | 'At Stop' | 'Reached Home';
  
  // Attendance info
  attendanceRate: number;
  todayAttendance: 'present' | 'absent' | 'late';
  lastAbsenceDate?: string;
  
  // Academic summary
  academicRank: number;
  academicAverage: number;
  academicStatus: AcademicStatus;
  libraryActiveCount: number;
  libraryOverdueCount: number;
  consentPending: boolean;
}

export interface ParentCommunicationItem {
  id: string;
  date: string;
  time: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  className: string;
  category: NotificationCategory;
  type?: string;
  subject: string;
  message: string;
  channel: ParentCommunicationChannel;
  status: CommunicationDeliveryStatus;
  acknowledged?: boolean;
}

export interface ParentActionItem {
  id: string;
  title: string;
  description: string;
  affectedCount: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'attendance' | 'ptm' | 'consent' | 'announcements' | 'fees' | 'transport';
  actionLabel: 'Notify' | 'View' | 'Review' | 'Resolve' | 'Remind' | 'Send Statement';
  filterKeyword: string;
}

export interface PTMAppointment {
  id: string;
  title: string;
  date: string;
  time: string;
  room: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  className: string;
  teacherName: string;
  subject: string;
  status: 'Confirmed' | 'Pending' | 'Declined' | 'Completed';
  remarks: string;
  notes?: string;
}

// Module 6: Academics & Examination 360° Types
export interface ExaminationItem {
  id: string;
  title: string;
  subject: string;
  className: string;
  section: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  invigilator: string;
  invigilatorId?: string;
  maxMarks: number;
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Results Published';
  totalCandidates: number;
  hasConflict?: boolean;
  conflictDescription?: string;
}

export interface ExamConflictItem {
  id: string;
  examId: string;
  examTitle: string;
  type: 'room_clash' | 'teacher_clash' | 'class_clash' | 'missing_invigilator' | 'capacity_issue';
  description: string;
  severity: 'critical' | 'warning';
  suggestedAction: string;
  affectedRoom?: string;
  affectedTeacher?: string;
  affectedClass?: string;
}

export interface AcademicSubjectStat {
  id: string;
  subject: string;
  code: string;
  department: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
  studentsBelowTarget: number;
  assignmentCompletion: number;
  teacherName: string;
  teacherId: string;
  recentAssessment: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ClassAcademicSummary {
  className: string;
  classTeacher: string;
  studentCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  attendanceRate: number;
  assignmentsCompleted: number;
  studentsNeedingAttention: number;
  trend: number[];
}

export interface StudentMarksRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: number;
  className: string;
  subject: string;
  examId: string;
  examName: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  status: 'Strong' | 'Satisfactory' | 'Average' | 'Needs Support';
  remarks?: string;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  teacherName?: string;
  teacherId: string;
  className: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  submissionRate: number;
  totalSubmissions: number;
  totalStudents: number;
  submittedStudents?: string[];
  status: 'Active' | 'Due Today' | 'Overdue' | 'Completed' | 'Pending Review';
}

export interface AcademicAttentionStudent {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  rollNo: number;
  averageScore: number;
  trend: 'declining' | 'stagnant' | 'irregular' | 'stable';
  mainAcademicConcern: string;
  primaryConcern?: string;
  recommendedSchoolAction: string;
  recommendedAction?: string;
  guardianName: string;
  guardianPhone: string;
  incompleteAssignmentsCount: number;
  parentNotified: boolean;
  lastNotificationDate?: string;
}

export interface ScholasticScore {
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
  remarks: string;
}

export interface ReportCardItem {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  rollNo: number;
  admissionNo: string;
  house: string;
  term: string;
  academicYear: string;
  overallPercentage: number;
  percentage?: number;
  grade?: string;
  guardianName?: string;
  academicStatus: string;
  attendancePercentage: number;
  totalWorkingDays: number;
  daysPresent: number;
  status: 'Generated' | 'Pending Review' | 'Reviewed' | 'Published';
  generatedDate: string;
  scholasticScores: ScholasticScore[];
  subjects?: ScholasticScore[];
  coScholasticScores: { skill: string; grade: string }[];
  teacherRemarks: string;
  remarks?: string;
  principalSignatureStatus: boolean;
}

export interface TeacherAcademicPerformance {
  id?: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  classes: string[];
  classesAssigned?: string[];
  assignmentsCreated: number;
  assessmentsCompleted: number;
  marksPending: number;
  avgClassPerformance: number;
  averageClassPerformance?: number;
  syllabusProgress?: number;
  syllabusStatus?: string;
  onSchedule: boolean;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  date: string;
  day?: string;
  type: 'Exam' | 'Unit Test' | 'Assignment' | 'Parent Meeting' | 'Results Publication' | 'Academic Event';
  category?: string;
  classTarget?: string;
  badgeColor?: string;
  time?: string;
  classes: string[];
  description: string;
  venue?: string;
}

