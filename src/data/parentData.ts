import { 
  ParentGuardianRecord, 
  ParentCommunicationItem, 
  ParentActionItem, 
  PTMAppointment, 
  SchoolAnnouncement,
  NotificationCategory
} from '../types';
import { REAL_CLASS_10_STUDENTS } from './class10RealStudents';
import { INITIAL_CLASS_TEACHERS } from '../services/classTeacherService';

export const PARENT_360_STATS = {
  totalParents: 219,
  activeParents: 219,
  notificationsSentToday: 219,
  pendingParentActions: 4,
  unreadMessages: 2,
  ptmResponseRate: 85,
  ptmConfirmedCount: 146,
  ptmPendingCount: 73,
  ptmTotalInvites: 219,
  attendanceAlertsToday: 7,
  transportAlertsToday: 3,
  deliveryRate: 98.5,
  readRate: 91.0,
  responseRate: 80.0,
  acknowledgementRate: 92.0,
  announcementEngagement: 88.0
};

export function createParentRecordFromStudent(student: any, index: number = 0): ParentGuardianRecord {
  const paddedRoll = student.rollNo < 10 ? '0' + student.rollNo : '' + student.rollNo;
  const sectionKey = '10-' + student.section;
  const sectionTeacher = INITIAL_CLASS_TEACHERS[sectionKey] || 'Natik Kothari';
  const isPendingAction = student.feeStatus === 'Overdue' || (student.smartAlerts && student.smartAlerts.length > 0);
  const isOnLeave = student.status === 'On Leave' || student.todayStatus === 'excused';
  
  const nameParts = (student.name || 'STUDENT').trim().split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'Sharma';
  const cleanStudentSlug = (student.name || 'student').toLowerCase().replace(/[^a-z0-9]/g, '.');

  return {
    id: 'PAR-10' + student.section + '-' + paddedRoll,
    name: 'Guardian of ' + student.name,
    primaryContactName: student.guardianName && !student.guardianName.startsWith('Parent of') 
      ? student.guardianName 
      : 'Mr. Rajesh ' + lastName + ' (Guardian)',
    relationship: 'Guardian',
    phone: student.guardianPhone || student.parentContact || ('+91 98290 ' + (10000 + student.rollNo + (student.section.charCodeAt(0) * 100))),
    email: cleanStudentSlug + '.guardian@bafna.edu.in',
    secondaryName: student.motherName && !student.motherName.startsWith('Mother of')
      ? student.motherName 
      : 'Mrs. Anita ' + lastName,
    secondaryPhone: '+91 98290 ' + (15000 + student.rollNo),
    secondaryRelation: 'Mother',
    address: 'Bikaner, Rajasthan',
    preferredChannel: (index % 3 === 0) ? 'WhatsApp' : (index % 3 === 1 ? 'SMS' : 'App'),
    accountStatus: 'Active',
    communicationStatus: 'App Verified',
    lastNotificationDate: 'Today, 08:15 AM',
    lastNotificationType: 'Daily Class 10 Digest',
    pendingActionCount: isPendingAction ? 1 : 0,
    pendingActionsList: isPendingAction ? ['Pending Fee Clearance Verification'] : [],
    engagementLevel: isPendingAction ? 'Needs Follow-up' : (index % 5 === 0 ? 'Moderate' : 'High'),
    linkedStudentId: student.id,
    linkedStudentName: student.name,
    className: student.className || ('10-' + student.section),
    section: student.section,
    rollNo: student.rollNo,
    studentPhotoUrl: student.photoUrl || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(student.name) + '&background=0284c7&color=ffffff&bold=true'),
    ptmStatus: (index % 2 === 0) ? 'Confirmed' : 'Pending',
    ptmSlot: '25 Sep 2026 • ' + (10 + (index % 4)) + ':00 AM',
    ptmTeacher: sectionTeacher,
    feeStatus: student.feeStatus || 'Paid',
    feePendingAmount: student.feeDetails?.pendingAmount || (isPendingAction ? 24000 : 0),
    totalFeeAnnual: 72000,
    lastPaymentDate: student.feeDetails?.lastPaymentDate || '10 Aug 2026',
    nextFeeDueDate: student.feeDetails?.nextDueDate || '15 Jan 2027 (Term 3)',
    transportRoute: student.transportRoute || 'Route 01 — Sadul Ganj',
    busNumber: 'Bus 0' + ((index % 6) + 1),
    busStop: 'Subhash Nagar Circle',
    busEta: 'Reached School',
    busBoardingStatus: 'At Stop',
    attendanceRate: Math.min(95, Number(student.attendancePercentage) || 92),
    todayAttendance: isOnLeave ? 'excused' : (student.todayStatus || 'present'),
    lastAbsenceDate: isOnLeave ? 'On Sanctioned Leave' : (student.lastAbsence || 'None'),
    academicRank: student.rollNo,
    academicAverage: Math.min(95, 80 + (index % 15)),
    academicStatus: 'Distinction',
    libraryActiveCount: student.libraryDetails?.activeIssuedCount || (isPendingAction ? 1 : 0),
    libraryOverdueCount: student.libraryDetails?.overdueCount || 0,
    consentPending: false
  };
}

export const INITIAL_PARENT_RECORDS: ParentGuardianRecord[] = REAL_CLASS_10_STUDENTS.map((student, idx) => 
  createParentRecordFromStudent(student, idx)
);

export const INITIAL_COMMUNICATION_HISTORY: ParentCommunicationItem[] = [
  {
    id: 'COM-2026-0901',
    date: '17 Sep 2026',
    time: '09:05 AM',
    parentId: 'PAR-1044',
    parentName: 'Mr. Rakesh Jain',
    studentId: 'STU-1044',
    studentName: 'Kabir Jain',
    className: '10-B',
    category: 'ATTENDANCE',
    type: 'Morning Absence Notice',
    subject: 'Absence Alert: Kabir Jain (10-B)',
    message: 'Dear Parent, Kabir Jain was marked ABSENT at 08:45 AM roll call today. Kindly submit an acknowledgment or leave application in the portal.',
    channel: 'SMS',
    status: 'Delivered',
    acknowledged: false
  },
  {
    id: 'COM-2026-0902',
    date: '17 Sep 2026',
    time: '08:35 AM',
    parentId: 'PAR-1096',
    parentName: 'Mr. Ajay Verma',
    studentId: 'STU-1096',
    studentName: 'Rohan Verma',
    className: '10-B',
    category: 'ATTENDANCE',
    type: 'Late Arrival Alert',
    subject: 'Late Entry: Rohan Verma (10-B)',
    message: 'Dear Guardian, Rohan arrived at campus at 08:35 AM (15 mins late). Recorded in biometric gate registry.',
    channel: 'WhatsApp',
    status: 'Read',
    acknowledged: true
  },
  {
    id: 'COM-2026-0903',
    date: '17 Sep 2026',
    time: '08:16 AM',
    parentId: 'PAR-1021',
    parentName: 'Mrs. Anita Sharma',
    studentId: 'STU-1021',
    studentName: 'AASTHA',
    className: '10-A',
    category: 'ENTRY',
    type: 'RFID Smart Gate Check-in',
    subject: 'Safe Arrival: AASTHA',
    message: 'Aarav has safely entered campus through South Turnstile RFID Gate at 08:14 AM.',
    channel: 'App',
    status: 'Read',
    acknowledged: true
  },
  {
    id: 'COM-2026-0904',
    date: '17 Sep 2026',
    time: '08:08 AM',
    parentId: 'PAR-1048',
    parentName: 'Mr. Sanjay Singhania',
    studentId: 'STU-1048',
    studentName: 'Vihaan Singhania',
    className: '10-B',
    category: 'BUS',
    type: 'Bus Boarding Alert',
    subject: 'Bus 04 Boarded: Vihaan Singhania',
    message: 'Vihaan boarded Bus 04 (Route 04 — Central Expressway) at Civil Lines Circle stop at 08:08 AM.',
    channel: 'App',
    status: 'Delivered',
    acknowledged: true
  },
  {
    id: 'COM-2026-0905',
    date: '16 Sep 2026',
    time: '04:15 PM',
    parentId: 'PAR-1044',
    parentName: 'Mr. Rakesh Jain',
    studentId: 'STU-1044',
    studentName: 'Kabir Jain',
    className: '10-B',
    category: 'FEES',
    type: 'Fee Due Overdue Notice',
    subject: 'Urgent: Term 2 Fee Overdue Notice',
    message: 'Term 2 Tuition and Transportation fee of ₹36,000 for Kabir Jain is pending past 10 Aug 2026. Please remit promptly.',
    channel: 'Email',
    status: 'Delivered',
    acknowledged: false
  },
  {
    id: 'COM-2026-0906',
    date: '16 Sep 2026',
    time: '02:30 PM',
    parentId: 'PAR-1025',
    parentName: 'Mrs. Priya Mehta',
    studentId: 'STU-1025',
    studentName: 'Ananya Mehta',
    className: '10-A',
    category: 'EVENTS',
    type: 'PTM Slot Confirmation',
    subject: 'PTM Slot Confirmed: 22 Sep 10:30 AM',
    message: 'Your meeting with Mr. Rajesh Verma (Mathematics HOD) has been confirmed for 22 Sep at 10:30 AM in Room 204.',
    channel: 'WhatsApp',
    status: 'Read',
    acknowledged: true
  },
  {
    id: 'COM-2026-0907',
    date: '15 Sep 2026',
    time: '05:00 PM',
    parentId: 'PAR-1127',
    parentName: 'Mr. Mahendra Choudhary',
    studentId: 'STU-1127',
    studentName: 'Arjun Choudhary',
    className: '10-C',
    category: 'EXAMS',
    type: 'CBSE Board Verification',
    subject: 'CBSE Board Form Verification',
    message: 'Please review and digitally sign the CBSE Class 10 candidate verification slip attached for Arjun Choudhary.',
    channel: 'Email',
    status: 'Read',
    acknowledged: false
  },
  {
    id: 'COM-2026-0908',
    date: '15 Sep 2026',
    time: '11:20 AM',
    parentId: 'PAR-1021',
    parentName: 'Mr. Suresh Sharma',
    studentId: 'STU-1021',
    studentName: 'AASTHA',
    className: '10-A',
    category: 'ACADEMICS',
    type: 'Unit Test Marks Published',
    subject: 'Unit Test 2 Results: AASTHA',
    message: 'Aarav scored 96/100 in Mathematics (Rank 1 in 10-A). Full marksheet available in Parent 360 portal.',
    channel: 'App',
    status: 'Read',
    acknowledged: true
  },
  {
    id: 'COM-2026-0909',
    date: '14 Sep 2026',
    time: '03:40 PM',
    parentId: 'PAR-1044',
    parentName: 'Mr. Rakesh Jain',
    studentId: 'STU-1044',
    studentName: 'Kabir Jain',
    className: '10-B',
    category: 'ACADEMICS',
    type: 'Library Return Reminder',
    subject: 'Overdue Book: Computer Basics 10',
    message: 'Library book "Computer Basics 10" is 4 days overdue. Please return to Central Library to avoid accrued fines.',
    channel: 'SMS',
    status: 'Delivered',
    acknowledged: false
  },
  {
    id: 'COM-2026-0910',
    date: '14 Sep 2026',
    time: '09:00 AM',
    parentId: 'PAR-1048',
    parentName: 'Mr. Sanjay Singhania',
    studentId: 'STU-1048',
    studentName: 'Vihaan Singhania',
    className: '10-B',
    category: 'ANNOUNCEMENTS',
    type: 'General School Circular',
    subject: 'Bus Route 04 Temporary Diversion',
    message: 'Due to municipal flyover maintenance on Central Expressway, Bus 04 pickup times are advanced by 10 minutes from tomorrow.',
    channel: 'WhatsApp',
    status: 'Read',
    acknowledged: true
  }
];

export const INITIAL_PARENT_ACTIONS: ParentActionItem[] = [
  {
    id: 'ACT-01',
    title: "10 parents have not acknowledged today's attendance alerts",
    description: 'Students marked absent or tardy at morning roll call without parent counter-acknowledgment.',
    affectedCount: 10,
    severity: 'high',
    category: 'attendance',
    actionLabel: 'Notify',
    filterKeyword: 'attendance'
  },
  {
    id: 'ACT-02',
    title: '6 parents have not responded to PTM invitations',
    description: 'Term 1 Parent-Teacher Meeting slots on 22 Sep 2026 remain unreserved.',
    affectedCount: 6,
    severity: 'medium',
    category: 'ptm',
    actionLabel: 'Remind',
    filterKeyword: 'ptm'
  },
  {
    id: 'ACT-03',
    title: '8 parents have pending consent forms',
    description: 'Annual STEM RoboRace tour, CBSE Board photo consent, and laboratory safety waivers.',
    affectedCount: 8,
    severity: 'medium',
    category: 'consent',
    actionLabel: 'Review',
    filterKeyword: 'consent'
  },
  {
    id: 'ACT-04',
    title: '4 parents have unread important announcements',
    description: 'Critical school board notices regarding amended winter uniform dates and bus route adjustments.',
    affectedCount: 4,
    severity: 'low',
    category: 'announcements',
    actionLabel: 'View',
    filterKeyword: 'announcements'
  },
  {
    id: 'ACT-05',
    title: '12 parents have pending fee-related actions',
    description: 'Term 2 tuition installments past due dates requiring electronic ledger balance review.',
    affectedCount: 12,
    severity: 'critical',
    category: 'fees',
    actionLabel: 'Send Statement',
    filterKeyword: 'fees'
  },
  {
    id: 'ACT-06',
    title: '5 parents have not confirmed transport changes',
    description: 'Stops modified for Bus 02 & Bus 04 due to city road expansion works.',
    affectedCount: 5,
    severity: 'medium',
    category: 'transport',
    actionLabel: 'Resolve',
    filterKeyword: 'transport'
  }
];

export const INITIAL_PTM_APPOINTMENTS: PTMAppointment[] = [
  {
    id: 'PTM-01',
    title: 'Term 1 Academic Review',
    date: '22 Sep 2026',
    time: '10:00 AM - 10:15 AM',
    room: 'Room 202 (Class 10-A)',
    parentId: 'PAR-1021',
    parentName: 'Mrs. Anita & Mr. Suresh Sharma',
    studentId: 'STU-1021',
    studentName: 'AASTHA',
    className: '10-A',
    teacherName: 'Natik Kothari',
    subject: 'Class Teacher & English',
    status: 'Confirmed',
    remarks: 'Parent requested to discuss Olympiad preparation and leadership roles.'
  },
  {
    id: 'PTM-02',
    title: 'Term 1 Academic Review',
    date: '22 Sep 2026',
    time: '10:30 AM - 10:45 AM',
    room: 'Room 204 (Maths Lab)',
    parentId: 'PAR-1025',
    parentName: 'Mrs. Priya Mehta',
    studentId: 'STU-1025',
    studentName: 'Ananya Mehta',
    className: '10-A',
    teacherName: 'Mr. Rajesh Verma',
    subject: 'Mathematics HOD',
    status: 'Confirmed',
    remarks: 'Review trigonometry progress and advanced elective options.'
  },
  {
    id: 'PTM-03',
    title: 'Attendance & Academic Support',
    date: '22 Sep 2026',
    time: '11:15 AM - 11:30 AM',
    room: 'Counseling Office 102',
    parentId: 'PAR-1044',
    parentName: 'Mr. Rakesh Jain',
    studentId: 'STU-1044',
    studentName: 'Kabir Jain',
    className: '10-B',
    teacherName: 'Mr. Arvind Saxena',
    subject: 'Class Teacher & Physics',
    status: 'Pending',
    remarks: 'Awaiting father confirmation. Focus on 71% attendance and remedial plan.'
  },
  {
    id: 'PTM-04',
    title: 'Term 1 Academic Review',
    date: '22 Sep 2026',
    time: '11:45 AM - 12:00 PM',
    room: 'Room 205 (Class 10-B)',
    parentId: 'PAR-1048',
    parentName: 'Mr. Sanjay Singhania',
    studentId: 'STU-1048',
    studentName: 'Vihaan Singhania',
    className: '10-B',
    teacherName: 'Mr. Arvind Saxena',
    subject: 'Class Teacher',
    status: 'Confirmed',
    remarks: 'Parent confirmed via mobile app. Focus on sports balance and science lab.'
  },
  {
    id: 'PTM-05',
    title: 'CBSE Board Senior Review',
    date: '22 Sep 2026',
    time: '02:30 PM - 02:45 PM',
    room: 'Principal Conference Room',
    parentId: 'PAR-1127',
    parentName: 'Mr. Mahendra Choudhary',
    studentId: 'STU-1127',
    studentName: 'Arjun Choudhary',
    className: '10-C',
    teacherName: 'Dr. V. K. Saxena',
    subject: 'Principal & Senior Chemistry',
    status: 'Confirmed',
    remarks: 'Discussion of JEE Advanced mock results and laboratory projects.'
  }
];

export const INITIAL_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'ANN-01',
    title: 'Parent-Teacher Meeting (PTM) — Term 1 Schedule Released',
    date: '16 Sep 2026',
    category: 'Events',
    priority: 'Important',
    audience: 'All Parents (Classes 6 to 12)',
    readPercentage: 92,
    author: 'Academic Directorate',
    content: 'Term 1 PTM will be held on Saturday, 22 September 2026 from 09:00 AM to 03:00 PM. Parents can book and review individual 15-minute slots via the Parent 360 portal.'
  },
  {
    id: 'ANN-02',
    title: 'CBSE Half-Yearly Model Examination Datesheet Announced',
    date: '14 Sep 2026',
    category: 'Academics',
    priority: 'Academic',
    audience: 'Parents of Classes 9 to 12',
    readPercentage: 88,
    author: 'Examination Controller',
    content: 'Half-yearly examinations commence from 06 October 2026. Detailed syllabus breakdowns, sample papers, and sitting arrangements have been published in student portals.'
  },
  {
    id: 'ANN-03',
    title: 'Bus Route 04 Temporary Diversion Notice',
    date: '14 Sep 2026',
    category: 'Transport',
    priority: 'Transport',
    audience: 'Parents of Route 04 (Central Expressway)',
    readPercentage: 96,
    author: 'Transport Manager',
    content: 'Due to municipal flyover resurfacing, morning bus pickup will occur 10 minutes earlier than regular schedule for Stops 2 through 6 until 25 September.'
  },
  {
    id: 'ANN-04',
    title: 'Term 2 Fee Installment Due Date Reminder',
    date: '10 Sep 2026',
    category: 'Finance',
    priority: 'General',
    audience: 'Parents with Pending Term 2 Dues',
    readPercentage: 78,
    author: 'Accounts Office',
    content: 'Guardians who have not yet remitted the Term 2 tuition fee are requested to clear balances via online UPI, NetBanking, or card payment to avoid late registration charges.'
  }
];

export const NOTIFICATION_CATEGORIES_CONFIG: {
  id: NotificationCategory;
  name: string;
  emoji: string;
  badgeColor: string;
  description: string;
  defaultTemplate: string;
}[] = [
  {
    id: 'ENTRY',
    name: 'ENTRY',
    emoji: '🟢',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Child entered school (Smart RFID Gate Check-in)',
    defaultTemplate: 'Safe Arrival: {studentName} ({className}) safely entered school premises at {time} through South Turnstile.'
  },
  {
    id: 'EXIT',
    name: 'EXIT',
    emoji: '🔵',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    description: 'Child left school (Afternoon gate departure / bus bay)',
    defaultTemplate: 'Campus Departure: {studentName} ({className}) departed campus at {time} via {transportMode}.'
  },
  {
    id: 'ATTENDANCE',
    name: 'ATTENDANCE',
    emoji: '🟠',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    description: 'Child marked absent / late during morning roll call',
    defaultTemplate: 'Attendance Alert: {studentName} ({className}) was marked {status} at roll call today ({date}). Please acknowledge.'
  },
  {
    id: 'BUS',
    name: 'BUS',
    emoji: '🚌',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700',
    description: 'Child boarded bus / reached designated stop',
    defaultTemplate: 'Transport Update: {studentName} has boarded {busNumber} ({routeName}) at stop {stopName}. Current ETA: {eta}.'
  },
  {
    id: 'ACADEMICS',
    name: 'ACADEMICS',
    emoji: '📚',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    description: 'Homework, marks, unit test and academic progress updates',
    defaultTemplate: 'Academic Update: New performance marks and homework assignments uploaded for {studentName} ({className}).'
  },
  {
    id: 'FEES',
    name: 'FEES',
    emoji: '💰',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    description: 'Fee reminders, invoice statements and payment receipts',
    defaultTemplate: 'Fee Statement: Account balance update for {studentName}. Pending: ₹{pendingAmount}. Next due date: {dueDate}.'
  },
  {
    id: 'EVENTS',
    name: 'EVENTS',
    emoji: '📅',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    description: 'School events, PTM dates, annual day and holidays',
    defaultTemplate: 'Event Notice: {title} scheduled on {date} at {venue}. We cordially invite parents to attend.'
  },
  {
    id: 'EXAMS',
    name: 'EXAMS',
    emoji: '📝',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
    description: 'Examination datesheets, syllabus, seating and report cards',
    defaultTemplate: 'Examination Circular: Official schedule for {examName} released for {className}. Check portal for details.'
  },
  {
    id: 'ANNOUNCEMENTS',
    name: 'ANNOUNCEMENTS',
    emoji: '📢',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    description: 'Important institutional circulars and academy notices',
    defaultTemplate: 'Official Circular: {announcementTitle}. Please read the administrative notice on the Parent 360 portal.'
  }
];

export const AI_PARENT_COPILOT_PROMPTS = [
  'Show parents with unread attendance alerts',
  'Which parents have not responded to PTM?',
  'Show pending parent actions',
  'Find students whose parents need notification',
  'Summarize today\'s parent communication',
  'Show transport-related parent alerts'
];
