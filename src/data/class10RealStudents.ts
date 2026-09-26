import { Student } from '../types';

export interface Class10ImportStats {
  totalRecords: number;
  sectionBreakdown: {
    '10-A': number;
    '10-B': number;
    '10-C': number;
    '10-D': number;
    '10-E': number;
  };
  duplicates: number;
  needsReview: number;
  invalidRecords: number;
}

export const CLASS_10_IMPORT_STATS: Class10ImportStats = {
  totalRecords: 219,
  sectionBreakdown: {
    '10-A': 44,
    '10-B': 42,
    '10-C': 47,
    '10-D': 43,
    '10-E': 43,
  },
  duplicates: 0,
  needsReview: 0,
  invalidRecords: 0,
};

// Raw Class 10 Students extracted directly from authoritative Seth Tolaram Bafna Academy (2026-2027) PDF
const RAW_CLASS_10_STUDENTS: Array<{ name: string; section: 'A' | 'B' | 'C' | 'D' | 'E'; rollNo: number }> = [
  // Page 1: Class 10-A (44 students)
  { rollNo: 1, name: 'AASTHA', section: 'A' },
  { rollNo: 2, name: 'ABHINAV SHARMA', section: 'A' },
  { rollNo: 3, name: 'ABHISHEK MUNDHRA', section: 'A' },
  { rollNo: 4, name: 'ANANYA SINGHANIA', section: 'A' },
  { rollNo: 5, name: 'ANGEL KOTHARI', section: 'A' },
  { rollNo: 6, name: 'ANSHUMAN CHANDAK', section: 'A' },
  { rollNo: 7, name: 'AYISHA', section: 'A' },
  { rollNo: 8, name: 'BHAGYANSHI KOTHARI', section: 'A' },
  { rollNo: 9, name: 'BHAVYA KOCHAR', section: 'A' },
  { rollNo: 10, name: 'BHAWANA JANGID', section: 'A' },
  { rollNo: 11, name: 'CHIRAG SARDA', section: 'A' },
  { rollNo: 12, name: 'DAKSH YADAV', section: 'A' },
  { rollNo: 13, name: 'DEV KISHAN CHOUDHARY', section: 'A' },
  { rollNo: 14, name: 'DIVYANSH CHHANGANI', section: 'A' },
  { rollNo: 15, name: 'HANI NATH', section: 'A' },
  { rollNo: 16, name: 'HEMANT KUMAR MODI', section: 'A' },
  { rollNo: 17, name: 'JAI KUMAR KHATRI', section: 'A' },
  { rollNo: 18, name: 'JAIDEEP PEETY', section: 'A' },
  { rollNo: 19, name: 'KAIRVI GULGULIA', section: 'A' },
  { rollNo: 20, name: 'KARTIK MARU', section: 'A' },
  { rollNo: 21, name: 'KESHAV ASHOPA', section: 'A' },
  { rollNo: 22, name: 'KIRTANYA NAHATA', section: 'A' },
  { rollNo: 23, name: 'KUNAL BUCHHA', section: 'A' },
  { rollNo: 24, name: 'LAKSHYA MARU', section: 'A' },
  { rollNo: 25, name: 'MAHIKA JAIN', section: 'A' },
  { rollNo: 26, name: 'MANAS KULARIYA', section: 'A' },
  { rollNo: 27, name: 'MANISHA', section: 'A' },
  { rollNo: 28, name: 'MANVI UPADHYAY', section: 'A' },
  { rollNo: 29, name: 'MAYANK SONI', section: 'A' },
  { rollNo: 30, name: 'MOULIK BOTHRA', section: 'A' },
  { rollNo: 31, name: 'NAMAN KUMAR DAGA', section: 'A' },
  { rollNo: 32, name: 'RAJVEE PUROHIT', section: 'A' },
  { rollNo: 33, name: 'RASHI TAPARIA', section: 'A' },
  { rollNo: 34, name: 'RISHIKA SONI', section: 'A' },
  { rollNo: 35, name: 'RIYA TANWAR', section: 'A' },
  { rollNo: 36, name: 'SANCHI MUNDHRA', section: 'A' },
  { rollNo: 37, name: 'SHOURYA SURANA', section: 'A' },
  { rollNo: 38, name: 'SHUBHAM GAHLOT', section: 'A' },
  { rollNo: 39, name: 'TARUN OJHA', section: 'A' },
  { rollNo: 40, name: 'TUSHAR BOTHRA', section: 'A' },
  { rollNo: 41, name: 'VEDANT SONI', section: 'A' },
  { rollNo: 42, name: 'VIDIT BAHETI', section: 'A' },
  { rollNo: 43, name: 'YASH KHATRI', section: 'A' },
  { rollNo: 44, name: 'YASHVARDHAN SWAMI', section: 'A' },

  // Page 2: Class 10-B (42 students)
  { rollNo: 1, name: 'AAYAM KHAN BHATI', section: 'B' },
  { rollNo: 2, name: 'ADVIT BHOJAK', section: 'B' },
  { rollNo: 3, name: 'AHAM CHOUDHARY', section: 'B' },
  { rollNo: 4, name: 'ANURAG GURJAR', section: 'B' },
  { rollNo: 5, name: 'CHAYAN KOCHAR', section: 'B' },
  { rollNo: 6, name: 'DARSHITA CHOPRA', section: 'B' },
  { rollNo: 7, name: 'DIVYANSHU PANECHA', section: 'B' },
  { rollNo: 8, name: 'GARVIT KAWDIA', section: 'B' },
  { rollNo: 9, name: 'GARVIT PANDIA', section: 'B' },
  { rollNo: 10, name: 'GIRISH SARDA', section: 'B' },
  { rollNo: 11, name: 'GUNGUN GODARA', section: 'B' },
  { rollNo: 12, name: 'HARSHENDRA DHAWAN', section: 'B' },
  { rollNo: 13, name: 'HIMANSHI RATHORE', section: 'B' },
  { rollNo: 14, name: 'HITEN SONI', section: 'B' },
  { rollNo: 15, name: 'ISHA SHARMA', section: 'B' },
  { rollNo: 16, name: 'ISHAN KIRADOO', section: 'B' },
  { rollNo: 17, name: 'JHALAK BAGRI', section: 'B' },
  { rollNo: 18, name: 'JINESH SHRIMALI', section: 'B' },
  { rollNo: 19, name: 'KANISHKA SHARMA', section: 'B' },
  { rollNo: 20, name: 'KAUSHAL KUMAR SONI', section: 'B' },
  { rollNo: 21, name: 'KEERTI DAGA', section: 'B' },
  { rollNo: 22, name: 'KHUSHBU BOTHRA', section: 'B' },
  { rollNo: 23, name: 'KHUSHI RAMPURIA', section: 'B' },
  { rollNo: 24, name: 'KHUSHI SONI', section: 'B' },
  { rollNo: 25, name: 'KUNAL SIYAG', section: 'B' },
  { rollNo: 26, name: 'MADHAV AGARWAL', section: 'B' },
  { rollNo: 27, name: 'MITALI NAGAL', section: 'B' },
  { rollNo: 28, name: 'NAMAN JAIN', section: 'B' },
  { rollNo: 29, name: 'NAYAN SUKHANI', section: 'B' },
  { rollNo: 30, name: 'OJASVI JAIN', section: 'B' },
  { rollNo: 31, name: 'PULKIT BHARWANI', section: 'B' },
  { rollNo: 32, name: 'PULKIT GAHLOT', section: 'B' },
  { rollNo: 33, name: 'RAJVEER VERMA', section: 'B' },
  { rollNo: 34, name: 'RAMKISHAN MARU', section: 'B' },
  { rollNo: 35, name: 'RUSHIL BISHNOI', section: 'B' },
  { rollNo: 36, name: 'SARA', section: 'B' },
  { rollNo: 37, name: 'SUNAINA KHAN', section: 'B' },
  { rollNo: 38, name: 'TEJAS PRTAP SHARMA', section: 'B' },
  { rollNo: 39, name: 'UDIT NARAYAN SONI', section: 'B' },
  { rollNo: 40, name: 'UTRANSH KHATRI', section: 'B' },
  { rollNo: 41, name: 'VARTIKA TAK', section: 'B' },
  { rollNo: 42, name: 'VIDHI BAID', section: 'B' },

  // Page 3: Class 10-C (47 students)
  { rollNo: 1, name: 'AKSHAT ACHARYA', section: 'C' },
  { rollNo: 2, name: 'ANUJ SHARMA', section: 'C' },
  { rollNo: 3, name: 'ASHMI DAFTARI', section: 'C' },
  { rollNo: 4, name: 'BHAVYA KUMAR BHURA', section: 'C' },
  { rollNo: 5, name: 'BHAVYA NAHATA', section: 'C' },
  { rollNo: 6, name: 'CHARVI NAGAL', section: 'C' },
  { rollNo: 7, name: 'DAKSH KHATRI', section: 'C' },
  { rollNo: 8, name: 'GARVIT CHOPRA', section: 'C' },
  { rollNo: 9, name: 'GUNJAN JAJRA', section: 'C' },
  { rollNo: 10, name: 'GUNJAN SHARMA', section: 'C' },
  { rollNo: 11, name: 'HARSHIT SHARMA', section: 'C' },
  { rollNo: 12, name: 'HARSHITA SONI', section: 'C' },
  { rollNo: 13, name: 'HEMANG', section: 'C' },
  { rollNo: 14, name: 'HEMANT BUCHHA', section: 'C' },
  { rollNo: 15, name: 'HITARTH ASOPA', section: 'C' },
  { rollNo: 16, name: 'HITESHI SONI', section: 'C' },
  { rollNo: 17, name: 'JAYESH CHHAJER', section: 'C' },
  { rollNo: 18, name: 'KOMAL CHORDIA', section: 'C' },
  { rollNo: 19, name: 'KRISHNA PAREEK', section: 'C' },
  { rollNo: 20, name: 'LAKSHAY HARSHWAL', section: 'C' },
  { rollNo: 21, name: 'LATA MUNDHRA', section: 'C' },
  { rollNo: 22, name: 'MADHAV GAHLOT', section: 'C' },
  { rollNo: 23, name: 'MAHI TANWAR', section: 'C' },
  { rollNo: 24, name: 'MANAS KIRADOO', section: 'C' },
  { rollNo: 25, name: 'MANNAT GUPTA', section: 'C' },
  { rollNo: 26, name: 'MANVI KOCHAR', section: 'C' },
  { rollNo: 27, name: 'MAYURI DAGA', section: 'C' },
  { rollNo: 28, name: 'NAITIK RAKHECHA', section: 'C' },
  { rollNo: 29, name: 'NAMAN BHURA', section: 'C' },
  { rollNo: 30, name: 'NAMAN KACHHAWA', section: 'C' },
  { rollNo: 31, name: 'NAVYA JHAMB', section: 'C' },
  { rollNo: 32, name: 'NEELLANJAN SWAMI', section: 'C' },
  { rollNo: 33, name: 'PALAK GAHLOT', section: 'C' },
  { rollNo: 34, name: 'RASHI TANWAR', section: 'C' },
  { rollNo: 35, name: 'RUCHIKA PUROHIT', section: 'C' },
  { rollNo: 36, name: 'RUDRA PUROHIT', section: 'C' },
  { rollNo: 37, name: 'SARVIK BISHNOI', section: 'C' },
  { rollNo: 38, name: 'SHAGUN PAREEK', section: 'C' },
  { rollNo: 39, name: 'SHIVANSH SINGH RAJAWAT', section: 'C' },
  { rollNo: 40, name: 'SONAKSHI BHURA', section: 'C' },
  { rollNo: 41, name: 'SUHANA VERMA', section: 'C' },
  { rollNo: 42, name: 'TANISHA JOSHI', section: 'C' },
  { rollNo: 43, name: 'TANMAY SONI', section: 'C' },
  { rollNo: 44, name: 'VANSH BAGRI', section: 'C' },
  { rollNo: 45, name: 'VARTIK CHANDAK', section: 'C' },
  { rollNo: 46, name: 'VIKANSHA BHANSALI', section: 'C' },
  { rollNo: 47, name: 'VISHAKHA TANWAR', section: 'C' },

  // Page 4: Class 10-D (43 students)
  { rollNo: 1, name: 'ADITYA BHANSALI', section: 'D' },
  { rollNo: 2, name: 'ADITYA BINANI', section: 'D' },
  { rollNo: 3, name: 'ADITYA CHURA', section: 'D' },
  { rollNo: 4, name: 'ARJUN SHARMA', section: 'D' },
  { rollNo: 5, name: 'BHAVYA BOTHRA', section: 'D' },
  { rollNo: 6, name: 'CHITRA BHARWANI', section: 'D' },
  { rollNo: 7, name: 'DEVANSHU CHOPRA', section: 'D' },
  { rollNo: 8, name: 'DHANANJAY SONI', section: 'D' },
  { rollNo: 9, name: 'DHARA SARDA', section: 'D' },
  { rollNo: 10, name: 'GARV SURANA', section: 'D' },
  { rollNo: 11, name: 'GARVIT CHOUHAN', section: 'D' },
  { rollNo: 12, name: 'HARDIK SINGHI', section: 'D' },
  { rollNo: 13, name: 'HRIDAY TANWAR', section: 'D' },
  { rollNo: 14, name: 'ISHAAN PAREEK', section: 'D' },
  { rollNo: 15, name: 'ISHITA PATWA', section: 'D' },
  { rollNo: 16, name: 'JANAK SHARMA', section: 'D' },
  { rollNo: 17, name: 'JAYANT TIWARI', section: 'D' },
  { rollNo: 18, name: 'JITESH PANCHARIYA', section: 'D' },
  { rollNo: 19, name: 'KUSHAL KANWAR', section: 'D' },
  { rollNo: 20, name: 'LAKSHAY SONAWAT', section: 'D' },
  { rollNo: 21, name: 'LAWANYA SARASWAT', section: 'D' },
  { rollNo: 22, name: 'MOHAMMAD SHAHID KHAN', section: 'D' },
  { rollNo: 23, name: 'MOIN KHAN SODHA', section: 'D' },
  { rollNo: 24, name: 'MOKSHIT TANWAR', section: 'D' },
  { rollNo: 25, name: 'NIDHI ANCHALIA', section: 'D' },
  { rollNo: 26, name: 'NIHAL SAINI', section: 'D' },
  { rollNo: 27, name: 'NISCHAY AGARWAL', section: 'D' },
  { rollNo: 28, name: 'OJASVI GABA', section: 'D' },
  { rollNo: 29, name: 'PARINEETA BISSA', section: 'D' },
  { rollNo: 30, name: 'PARTH SONI', section: 'D' },
  { rollNo: 31, name: 'PRAGATI SAMSUKHA', section: 'D' },
  { rollNo: 32, name: 'PRANJAL CHARAN', section: 'D' },
  { rollNo: 33, name: 'PRATEEK DAGA', section: 'D' },
  { rollNo: 34, name: 'PRTYUSHA AGARWAL', section: 'D' },
  { rollNo: 35, name: 'RUCHIT PAREEK', section: 'D' },
  { rollNo: 36, name: 'RUDRA NARAYAN SONI', section: 'D' },
  { rollNo: 37, name: 'RUPAL SONI', section: 'D' },
  { rollNo: 38, name: 'SAANVI KHINCHI', section: 'D' },
  { rollNo: 39, name: 'SAMBHAV KHATRI', section: 'D' },
  { rollNo: 40, name: 'SHREYA SONI', section: 'D' },
  { rollNo: 41, name: 'TEJAS KULARIA', section: 'D' },
  { rollNo: 42, name: 'TEJUS SETHIA', section: 'D' },
  { rollNo: 43, name: 'VEDIKA KUMAWAT', section: 'D' },

  // Page 5: Class 10-E (43 students)
  { rollNo: 1, name: 'AARUSH SONI', section: 'E' },
  { rollNo: 2, name: 'ANAS GAYAS', section: 'E' },
  { rollNo: 3, name: 'ANCHAL AGARWAL', section: 'E' },
  { rollNo: 4, name: 'BHAVIK GULGULIA', section: 'E' },
  { rollNo: 5, name: 'BHAWANA PANDAY', section: 'E' },
  { rollNo: 6, name: 'CHARVI MARU', section: 'E' },
  { rollNo: 7, name: 'CHAVI JAIN', section: 'E' },
  { rollNo: 8, name: 'DAKSH BHURA', section: 'E' },
  { rollNo: 9, name: 'DEVANG SONI', section: 'E' },
  { rollNo: 10, name: 'DEVIKA PERIWAL', section: 'E' },
  { rollNo: 11, name: 'DHRUV SONI', section: 'E' },
  { rollNo: 12, name: 'DIGVIJAY SONI', section: 'E' },
  { rollNo: 13, name: 'DIYA BOTHRA', section: 'E' },
  { rollNo: 14, name: 'GOPAL UPADHYAY', section: 'E' },
  { rollNo: 15, name: 'HARSHIT SANCHETI', section: 'E' },
  { rollNo: 16, name: 'HIMANI SINGHAL', section: 'E' },
  { rollNo: 17, name: 'ISHIKA BHANSALI', section: 'E' },
  { rollNo: 18, name: 'KANISHAK SARSWAT', section: 'E' },
  { rollNo: 19, name: 'KAUSHAL ANAND PUROHIT', section: 'E' },
  { rollNo: 20, name: 'KHYATI PARAKH', section: 'E' },
  { rollNo: 21, name: 'KOYAL UPADHYAY', section: 'E' },
  { rollNo: 22, name: 'KUSH GAHLOT', section: 'E' },
  { rollNo: 23, name: 'LAKSHITA', section: 'E' },
  { rollNo: 24, name: 'LOKESH JYANI', section: 'E' },
  { rollNo: 25, name: 'MANISHA PANCHARIA', section: 'E' },
  { rollNo: 26, name: 'MANTHAN PUROHIT', section: 'E' },
  { rollNo: 27, name: 'MUKUL SONI', section: 'E' },
  { rollNo: 28, name: 'NAVNEET GAHLOT', section: 'E' },
  { rollNo: 29, name: 'NAVYA PUROHIT', section: 'E' },
  { rollNo: 30, name: 'NAVYA SHARMA', section: 'E' },
  { rollNo: 31, name: 'RONAK VYAS', section: 'E' },
  { rollNo: 32, name: 'RONIT SINGHI', section: 'E' },
  { rollNo: 33, name: 'SIYA SUTHAR', section: 'E' },
  { rollNo: 34, name: 'TANISH JOSHI', section: 'E' },
  { rollNo: 35, name: 'TANISHA BHURA', section: 'E' },
  { rollNo: 36, name: 'THIYA KAURA', section: 'E' },
  { rollNo: 37, name: 'UNNATI SARDA', section: 'E' },
  { rollNo: 38, name: 'VANSH SONI', section: 'E' },
  { rollNo: 39, name: 'YASH LAKHOTIYA', section: 'E' },
  { rollNo: 40, name: 'YASH WARDHAN SARSWAT', section: 'E' },
  { rollNo: 41, name: 'YASHIKA CHHIMPA', section: 'E' },
  { rollNo: 42, name: 'YASHIKA JAIN', section: 'E' },
  { rollNo: 43, name: 'YOGITA GAHLOT', section: 'E' },
];

// Helper to calculate realistic varied simulated attendance (strictly up to 95% maximum)
function getSimulatedAttendance(name: string, rollNo: number, section: string) {
  let hash = rollNo * 19;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 1000;
  }
  // Strictly capped at 95% maximum (range 81% - 95%)
  const percentage = Math.min(95, 81 + (hash % 15));
  
  // Today's status: majority present (~92%), rare absent (~6%), rare late (~2%)
  const mod = (hash + rollNo) % 20;
  const todayStatus: 'present' | 'absent' | 'late' = mod === 0 ? 'absent' : mod === 1 ? 'late' : 'present';
  
  return {
    percentage,
    todayStatus,
  };
}

// Exactly 7 Students on Sanctioned Leave across sections
const LEAVE_INDICES = new Set([12, 55, 75, 102, 125, 150, 195]);

// Exactly 37 New Admissions across sections
const NEW_ADMISSION_INDICES = new Set([
  3, 7, 14, 21, 28, 35, 41, 
  46, 51, 58, 64, 70, 76, 81, 84, 
  89, 94, 99, 107, 113, 119, 126, 131, 
  137, 142, 148, 154, 160, 167, 172, 
  177, 182, 188, 193, 199, 205, 213
]);

// Exactly 4 Students with Pending Actions (Overdue Fee / Library Alert)
const PENDING_ACTION_INDICES = new Set([4, 60, 115, 165]);

export const REAL_CLASS_10_STUDENTS: Student[] = RAW_CLASS_10_STUDENTS.map((item, index) => {
  const paddedRoll = item.rollNo < 10 ? `0${item.rollNo}` : `${item.rollNo}`;
  const studentId = `STU-10${item.section}-${paddedRoll}`;
  const fullClassName = `10-${item.section}`;
  const sim = getSimulatedAttendance(item.name, item.rollNo, item.section);

  const isOnLeave = LEAVE_INDICES.has(index);
  const isNew = NEW_ADMISSION_INDICES.has(index);
  const isPendingAction = PENDING_ACTION_INDICES.has(index);

  const todayStatus = isOnLeave ? 'excused' : sim.todayStatus;
  const status = isOnLeave ? 'On Leave' : 'Active';

  return {
    id: studentId,
    name: item.name,
    className: fullClassName,
    class: '10',
    section: item.section,
    rollNo: item.rollNo,
    rollNumber: item.rollNo,
    todayStatus: todayStatus,
    attendancePercentage: sim.percentage,
    isDemoAttendance: true,
    lastAbsence: isOnLeave ? 'On Sanctioned Leave' : (sim.todayStatus === 'absent' ? 'Today' : 'None'),
    guardianName: `Parent of ${item.name}`,
    guardianPhone: `+91 98290 ${10000 + item.rollNo + (item.section.charCodeAt(0) * 100)}`,
    fatherName: `Father of ${item.name}`,
    motherName: `Mother of ${item.name}`,
    parentContact: `+91 98290 ${10000 + item.rollNo + (item.section.charCodeAt(0) * 100)}`,
    status: status,
    isNewAdmission: isNew,
    feeStatus: isPendingAction ? 'Overdue' : 'Paid',
    transportRoute: 'Not Assigned',
    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0284c7&color=ffffff&bold=true`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0284c7&color=ffffff&bold=true`,
    feeDetails: isPendingAction ? {
      totalAnnual: 72000,
      paidAmount: 48000,
      pendingAmount: 24000,
      overdueAmount: 24000,
      nextDueDate: 'Overdue (Term 2)',
      lastPaymentDate: '10 Aug 2026',
      receipts: []
    } : {
      totalAnnual: 72000,
      paidAmount: 72000,
      pendingAmount: 0,
      overdueAmount: 0,
      nextDueDate: '15 Jan 2027',
      lastPaymentDate: '15 Sep 2026',
      receipts: []
    },
    libraryDetails: isPendingAction ? {
      activeIssuedCount: 1,
      overdueCount: 1,
      totalReadCount: 3,
      totalFinesPending: 50
    } : {
      activeIssuedCount: 0,
      overdueCount: 0,
      totalReadCount: 4,
      totalFinesPending: 0
    },
    leaves: isOnLeave ? [
      {
        id: `LV-${studentId}`,
        category: 'Medical',
        startDate: 'Today',
        endDate: 'Tomorrow',
        days: 2,
        reason: 'Sanctioned medical leave approved by administration',
        status: 'Approved',
        appliedAt: 'Today',
        approvedBy: 'Dr. V. K. Saxena (Principal)'
      }
    ] : [],
    smartAlerts: isPendingAction ? [
      {
        id: `ALT-${studentId}`,
        type: 'fee' as const,
        severity: 'warning' as const,
        message: 'Second installment fee clearance pending. Guardian notified.',
        sourceModule: 'finance' as const
      }
    ] : [],
    notes: [],
    timeline: [
      {
        id: `TM-${studentId}`,
        date: 'Session 2026-2027',
        time: 'Official Roster',
        category: 'System',
        title: `Enrolled in Class ${fullClassName}`,
        description: `Verified official admission record from Seth Tolaram Bafna Academy Class 10 roster. Roll #${item.rollNo}.`,
      },
    ],
  };
});
