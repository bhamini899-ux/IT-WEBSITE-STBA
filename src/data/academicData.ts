import {
  ExaminationItem,
  ExamConflictItem,
  AcademicSubjectStat,
  ClassAcademicSummary,
  StudentMarksRecord,
  HomeworkAssignment,
  AcademicAttentionStudent,
  ReportCardItem,
  TeacherAcademicPerformance,
  AcademicCalendarEvent
} from '../types';

export const ACADEMIC_HEADER_STATS = {
  totalStudents: 0,
  activeSubjects: 14,
  upcomingExams: 8,
  examsCompleted: 24,
  averageAcademicScore: 81.4,
  studentsNeedingAttention: 18,
  assignmentsPending: 12,
  reportCardsPending: 64,
  passPercentage: 97.4,
  highestScore: 99.2,
  topSubject: 'Computer Science (88.6%)'
};

export const GRADE_PERFORMANCE_METRICS = [
  { grade: 'Grade 8', average: 83.2, passRate: 98.1, totalStudents: 468, distinctionRate: 34.2 },
  { grade: 'Grade 9', average: 79.8, passRate: 96.4, totalStudents: 452, distinctionRate: 28.5 },
  { grade: 'Grade 10', average: 82.5, passRate: 97.8, totalStudents: 425, distinctionRate: 33.1 },
  { grade: 'Grade 11', average: 78.4, passRate: 95.2, totalStudents: 396, distinctionRate: 26.8 },
  { grade: 'Grade 12', average: 84.6, passRate: 99.0, totalStudents: 384, distinctionRate: 38.4 },
];

export const MONTHLY_ACADEMIC_TRENDS = [
  { month: 'Apr', average: 76.2, homeworkCompletion: 84, attendance: 96.2 },
  { month: 'May', average: 78.0, homeworkCompletion: 86, attendance: 95.8 },
  { month: 'Jul', average: 79.5, homeworkCompletion: 89, attendance: 95.1 },
  { month: 'Aug', average: 80.8, homeworkCompletion: 91, attendance: 94.7 },
  { month: 'Sep', average: 81.4, homeworkCompletion: 93, attendance: 95.4 },
];

export const ACADEMIC_SCORE_DISTRIBUTION = [
  { range: '90-100% (Distinction / A1)', percentage: 32, count: 70, color: '#10b981' },
  { range: '75-89% (First Division / A2-B1)', percentage: 44, count: 96, color: '#3b82f6' },
  { range: '60-74% (Second Division / B2-C1)', percentage: 18, count: 40, color: '#f59e0b' },
  { range: '<60% (Needs Improvement / C2-D)', percentage: 6, count: 13, color: '#ef4444' },
];

export const CLASS_ACADEMIC_DATA: ClassAcademicSummary[] = [
  {
    className: '10-A',
    classTeacher: 'Natik Kothari',
    studentCount: 44,
    averageScore: 85.1,
    highestScore: 99.2,
    lowestScore: 64.0,
    attendanceRate: 95.5,
    assignmentsCompleted: 95,
    studentsNeedingAttention: 1,
    trend: [81, 82, 84, 85, 85]
  },
  {
    className: '10-B',
    classTeacher: 'Chitra Jain',
    studentCount: 42,
    averageScore: 82.4,
    highestScore: 97.0,
    lowestScore: 58.0,
    attendanceRate: 95.2,
    assignmentsCompleted: 92,
    studentsNeedingAttention: 2,
    trend: [79, 80, 81, 82, 82]
  },
  {
    className: '10-C',
    classTeacher: 'Senior Faculty',
    studentCount: 47,
    averageScore: 83.2,
    highestScore: 98.0,
    lowestScore: 60.5,
    attendanceRate: 95.7,
    assignmentsCompleted: 94,
    studentsNeedingAttention: 1,
    trend: [80, 81, 82, 83, 83]
  },
  {
    className: '10-D',
    classTeacher: 'Senior Faculty',
    studentCount: 43,
    averageScore: 81.8,
    highestScore: 96.5,
    lowestScore: 57.0,
    attendanceRate: 95.3,
    assignmentsCompleted: 91,
    studentsNeedingAttention: 2,
    trend: [78, 79, 80, 81, 82]
  },
  {
    className: '10-E',
    classTeacher: 'Bhuvnesh Sir',
    studentCount: 43,
    averageScore: 84.6,
    highestScore: 98.5,
    lowestScore: 62.0,
    attendanceRate: 95.3,
    assignmentsCompleted: 93,
    studentsNeedingAttention: 1,
    trend: [81, 82, 83, 84, 85]
  }
];

export const SUBJECT_ANALYTICS_DATA: AcademicSubjectStat[] = [
  {
    id: 'SUB-01',
    subject: 'Mathematics',
    code: 'MATH-041',
    department: 'Mathematics',
    averageScore: 78.6,
    highestScore: 99.5,
    lowestScore: 48.0,
    passPercentage: 95.8,
    studentsBelowTarget: 24,
    assignmentCompletion: 91,
    teacherName: 'Rajesh Verma (HOD)',
    teacherId: 'T-1001',
    recentAssessment: 'Calculus & Quadratic Eq (12 Sep)',
    trend: 'up'
  },
  {
    id: 'SUB-02',
    subject: 'Science',
    code: 'SCI-086',
    department: 'Science',
    averageScore: 81.2,
    highestScore: 98.0,
    lowestScore: 52.0,
    passPercentage: 97.1,
    studentsBelowTarget: 16,
    assignmentCompletion: 93,
    teacherName: 'Meenakshi Sundaram',
    teacherId: 'T-1021',
    recentAssessment: 'Chemical Reactions & Acids (10 Sep)',
    trend: 'stable'
  },
  {
    id: 'SUB-03',
    subject: 'Physics',
    code: 'PHY-042',
    department: 'Science',
    averageScore: 79.4,
    highestScore: 99.0,
    lowestScore: 49.5,
    passPercentage: 95.2,
    studentsBelowTarget: 19,
    assignmentCompletion: 89,
    teacherName: 'Dr. Alok Sen',
    teacherId: 'T-1004',
    recentAssessment: 'Electromagnetic Induction (14 Sep)',
    trend: 'up'
  },
  {
    id: 'SUB-04',
    subject: 'Chemistry',
    code: 'CHEM-043',
    department: 'Science',
    averageScore: 80.5,
    highestScore: 98.5,
    lowestScore: 51.0,
    passPercentage: 96.4,
    studentsBelowTarget: 15,
    assignmentCompletion: 92,
    teacherName: 'Priya Chhajer',
    teacherId: 'T-1005',
    recentAssessment: 'Organic Compounds & Halogens (11 Sep)',
    trend: 'stable'
  },
  {
    id: 'SUB-05',
    subject: 'Biology',
    code: 'BIO-044',
    department: 'Science',
    averageScore: 83.8,
    highestScore: 99.0,
    lowestScore: 58.0,
    passPercentage: 98.2,
    studentsBelowTarget: 9,
    assignmentCompletion: 95,
    teacherName: 'Meenakshi Sundaram',
    teacherId: 'T-1021',
    recentAssessment: 'Genetics & Cellular Respiration (08 Sep)',
    trend: 'up'
  },
  {
    id: 'SUB-06',
    subject: 'English',
    code: 'ENG-184',
    department: 'English',
    averageScore: 84.5,
    highestScore: 97.0,
    lowestScore: 62.0,
    passPercentage: 99.1,
    studentsBelowTarget: 7,
    assignmentCompletion: 96,
    teacherName: 'Krishna Sharma',
    teacherId: 'T-1004',
    recentAssessment: 'Literary Comprehension & Essays (15 Sep)',
    trend: 'up'
  },
  {
    id: 'SUB-07',
    subject: 'Hindi',
    code: 'HIN-002',
    department: 'Hindi',
    averageScore: 83.0,
    highestScore: 98.0,
    lowestScore: 59.0,
    passPercentage: 98.6,
    studentsBelowTarget: 11,
    assignmentCompletion: 94,
    teacherName: 'Ramesh Rathi',
    teacherId: 'T-1008',
    recentAssessment: 'Vyakaran & Kavyakhand (13 Sep)',
    trend: 'stable'
  },
  {
    id: 'SUB-08',
    subject: 'Social Studies',
    code: 'SST-087',
    department: 'Social Studies',
    averageScore: 79.8,
    highestScore: 96.5,
    lowestScore: 50.0,
    passPercentage: 96.0,
    studentsBelowTarget: 18,
    assignmentCompletion: 90,
    teacherName: 'Vikram Choudhary',
    teacherId: 'T-1022',
    recentAssessment: 'Nationalism in India & Map Work (09 Sep)',
    trend: 'down'
  },
  {
    id: 'SUB-09',
    subject: 'Computer Science',
    code: 'CS-083',
    department: 'Computer Science & AI',
    averageScore: 88.6,
    highestScore: 100.0,
    lowestScore: 68.0,
    passPercentage: 100.0,
    studentsBelowTarget: 3,
    assignmentCompletion: 98,
    teacherName: 'Ankit Surana',
    teacherId: 'T-1012',
    recentAssessment: 'Python Data Structures & SQL (16 Sep)',
    trend: 'up'
  },
  {
    id: 'SUB-10',
    subject: 'Physical Education',
    code: 'PED-048',
    department: 'Arts & Physical Ed',
    averageScore: 87.2,
    highestScore: 99.0,
    lowestScore: 70.0,
    passPercentage: 100.0,
    studentsBelowTarget: 2,
    assignmentCompletion: 97,
    teacherName: 'Col. Jagdeep Singh (Retd.)',
    teacherId: 'T-1014',
    recentAssessment: 'Athletics & Physical Fitness Test (06 Sep)',
    trend: 'stable'
  },
  {
    id: 'SUB-11',
    subject: 'Commerce',
    code: 'COM-054',
    department: 'Commerce',
    averageScore: 82.1,
    highestScore: 97.5,
    lowestScore: 55.0,
    passPercentage: 97.5,
    studentsBelowTarget: 12,
    assignmentCompletion: 92,
    teacherName: 'Deepak Bafna',
    teacherId: 'T-1016',
    recentAssessment: 'Financial Statements & Ledgers (12 Sep)',
    trend: 'up'
  }
];

export const INITIAL_EXAMINATIONS: ExaminationItem[] = [
  {
    id: 'EXAM-2026-01',
    title: 'Mid-Term Examination',
    subject: 'Mathematics',
    className: '10-B',
    section: 'B',
    date: '24 Sep 2026',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    room: 'Examination Hall 1',
    invigilator: 'Vikram Choudhary',
    invigilatorId: 'T-1022',
    maxMarks: 80,
    status: 'Scheduled',
    totalCandidates: 42,
    hasConflict: false
  },
  {
    id: 'EXAM-2026-02',
    title: 'Mid-Term Examination',
    subject: 'Science',
    className: '10-B',
    section: 'B',
    date: '24 Sep 2026',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    room: 'Room 204 (Science Block)',
    invigilator: 'Rajesh Verma',
    invigilatorId: 'T-1001',
    maxMarks: 70,
    status: 'Scheduled',
    totalCandidates: 42,
    hasConflict: false
  },
  {
    id: 'EXAM-2026-03',
    title: 'Mid-Term Examination',
    subject: 'Science (Bio/Chem)',
    className: '10-A',
    section: 'A',
    date: '25 Sep 2026',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    room: 'Examination Hall 1',
    invigilator: 'Krishna Sharma',
    invigilatorId: 'T-1004',
    maxMarks: 80,
    status: 'Scheduled',
    totalCandidates: 44,
    hasConflict: false
  },
  {
    id: 'EXAM-2026-04',
    title: 'CBSE Practice Test 1',
    subject: 'Computer Applications & IT',
    className: '10-C',
    section: 'C',
    date: '26 Sep 2026',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    room: 'AI & Robotics Lab 2',
    invigilator: 'Ankit Surana',
    invigilatorId: 'T-1012',
    maxMarks: 70,
    status: 'Scheduled',
    totalCandidates: 47,
    hasConflict: false
  },
  {
    id: 'EXAM-2026-05',
    title: 'Unit Test 2',
    subject: 'Social Science',
    className: '10-D',
    section: 'D',
    date: '22 Sep 2026',
    startTime: '08:30 AM',
    endTime: '10:00 AM',
    room: 'Room 110 (Block B)',
    invigilator: 'Ramesh Rathi',
    invigilatorId: 'T-1008',
    maxMarks: 40,
    status: 'Scheduled',
    totalCandidates: 43,
    hasConflict: false
  },
  {
    id: 'EXAM-2026-06',
    title: 'Unit Test 2',
    subject: 'English Communicative',
    className: '10-E',
    section: 'E',
    date: '18 Sep 2026',
    startTime: '08:30 AM',
    endTime: '10:00 AM',
    room: 'Room 102 (Block A)',
    invigilator: 'Anita Jain',
    invigilatorId: 'T-1025',
    maxMarks: 40,
    status: 'Ongoing',
    totalCandidates: 43,
    hasConflict: false
  },
  {
    id: 'EXAM-2026-07',
    title: 'Periodic Assessment 1',
    subject: 'Mathematics',
    className: '10-B',
    section: 'B',
    date: '15 Sep 2026',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    room: 'Chemistry Lab',
    invigilator: 'Priya Chhajer',
    invigilatorId: 'T-1005',
    maxMarks: 50,
    status: 'Completed',
    totalCandidates: 42,
    hasConflict: false
  },
  {
    id: 'EXAM-2026-08',
    title: 'Periodic Assessment 1',
    subject: 'Mathematics',
    className: '10-A',
    section: 'A',
    date: '12 Sep 2026',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    room: 'Room 201 (Block B)',
    invigilator: 'Rajesh Verma',
    invigilatorId: 'T-1001',
    maxMarks: 50,
    status: 'Results Published',
    totalCandidates: 44,
    hasConflict: false
  }
];

export const INITIAL_EXAM_CONFLICTS: ExamConflictItem[] = [
  {
    id: 'CONF-01',
    examId: 'EXAM-2026-02',
    examTitle: 'Class 10-B Science Mid-Term',
    type: 'capacity_issue',
    description: 'Room 204 capacity is 35 desk spaces, but Class 10-B has 42 registered exam candidates.',
    severity: 'critical',
    suggestedAction: 'Reassign to Examination Hall 2 or Main Auditorium.',
    affectedRoom: 'Room 204 (Science Block)',
    affectedClass: '10-B'
  },
  {
    id: 'CONF-02',
    examId: 'EXAM-SIM-09',
    examTitle: 'Class 10-C IT & Class 10-A Biology',
    type: 'room_clash',
    description: 'Room 204 is assigned to Class 10-A Biology and Class 10-C IT simultaneously on 25 Sep at 10:00 AM.',
    severity: 'critical',
    suggestedAction: 'Shift Class 10-C IT to Room 206.',
    affectedRoom: 'Room 204',
    affectedClass: '10-C'
  },
  {
    id: 'CONF-03',
    examId: 'EXAM-SIM-10',
    examTitle: 'Class 10-B Mathematics',
    type: 'teacher_clash',
    description: 'Invigilator Vikram Choudhary has consecutive 3-hour invigilation duties without statutory rest interval.',
    severity: 'warning',
    suggestedAction: 'Assign secondary invigilator or swap afternoon duty with Meenakshi Sundaram.',
    affectedTeacher: 'Vikram Choudhary'
  }
];

export const INITIAL_MARKS_DATA: StudentMarksRecord[] = [
  {
    id: 'MRK-10A-01',
    studentId: 'STU-10A-01',
    studentName: 'AASTHA',
    rollNo: 1,
    className: '10-A',
    subject: 'Mathematics',
    examId: 'EXAM-2026-08',
    examName: 'Periodic Assessment 1',
    marksObtained: 48,
    maxMarks: 50,
    percentage: 96.0,
    grade: 'A1',
    status: 'Strong',
    remarks: 'Outstanding speed in algebraic manipulation and geometrical proofs.'
  },
  {
    id: 'MRK-10A-02',
    studentId: 'STU-10A-02',
    studentName: 'ABHINAV SHARMA',
    rollNo: 2,
    className: '10-A',
    subject: 'Mathematics',
    examId: 'EXAM-2026-08',
    examName: 'Periodic Assessment 1',
    marksObtained: 46,
    maxMarks: 50,
    percentage: 92.0,
    grade: 'A1',
    status: 'Strong',
    remarks: 'Clear step-by-step presentation.'
  },
  {
    id: 'MRK-10A-03',
    studentId: 'STU-10A-03',
    studentName: 'ABHISHEK MUNDHRA',
    rollNo: 3,
    className: '10-A',
    subject: 'Mathematics',
    examId: 'EXAM-2026-08',
    examName: 'Periodic Assessment 1',
    marksObtained: 43,
    maxMarks: 50,
    percentage: 86.0,
    grade: 'A2',
    status: 'Strong',
    remarks: 'Minor calculation error in word problems.'
  },
  {
    id: 'MRK-10A-04',
    studentId: 'STU-10A-04',
    studentName: 'ANANYA SINGHANIA',
    rollNo: 4,
    className: '10-A',
    subject: 'Mathematics',
    examId: 'EXAM-2026-08',
    examName: 'Periodic Assessment 1',
    marksObtained: 41,
    maxMarks: 50,
    percentage: 82.0,
    grade: 'B1',
    status: 'Satisfactory',
    remarks: 'Good grasp of theorems.'
  },
  {
    id: 'MRK-10A-05',
    studentId: 'STU-10A-05',
    studentName: 'ANGEL KOTHARI',
    rollNo: 5,
    className: '10-A',
    subject: 'Mathematics',
    examId: 'EXAM-2026-08',
    examName: 'Periodic Assessment 1',
    marksObtained: 38,
    maxMarks: 50,
    percentage: 76.0,
    grade: 'B1',
    status: 'Satisfactory',
    remarks: 'Needs more practice in quadratic equations.'
  },
  {
    id: 'MRK-10B-01',
    studentId: 'STU-10B-01',
    studentName: 'AAYAM KHAN BHATI',
    rollNo: 1,
    className: '10-B',
    subject: 'Mathematics',
    examId: 'EXAM-2026-08',
    examName: 'Periodic Assessment 1',
    marksObtained: 44,
    maxMarks: 50,
    percentage: 88.0,
    grade: 'A2',
    status: 'Strong',
    remarks: 'Very consistent performance.'
  },
  {
    id: 'MRK-10B-02',
    studentId: 'STU-10B-02',
    studentName: 'ADVIT BHOJAK',
    rollNo: 2,
    className: '10-B',
    subject: 'Mathematics',
    examId: 'EXAM-2026-08',
    examName: 'Periodic Assessment 1',
    marksObtained: 42,
    maxMarks: 50,
    percentage: 84.0,
    grade: 'A2',
    status: 'Strong',
    remarks: 'Well presented answers.'
  }
];

export const INITIAL_ASSIGNMENTS: HomeworkAssignment[] = [
  {
    id: 'HW-2026-101',
    title: 'Trigonometric Identities & Application Problems',
    subject: 'Mathematics',
    teacher: 'Natik Kothari',
    teacherId: 'T-1001',
    className: '10-A',
    assignedDate: '15 Sep 2026',
    dueDate: '19 Sep 2026',
    description: 'Solve NCERT Exercise 8.4 questions 1 to 10 with step-by-step derivation in Homework Notebook.',
    submissionRate: 88.6,
    totalSubmissions: 39,
    totalStudents: 44,
    status: 'Active'
  },
  {
    id: 'HW-2026-102',
    title: 'Light Reflection and Refraction Practical Record',
    subject: 'Science',
    teacher: 'Chitra Jain',
    teacherId: 'T-1002',
    className: '10-B',
    assignedDate: '16 Sep 2026',
    dueDate: '18 Sep 2026',
    description: 'Complete Lab manual practical record for focal length calculation of convex lens.',
    submissionRate: 85.7,
    totalSubmissions: 36,
    totalStudents: 42,
    status: 'Due Today'
  },
  {
    id: 'HW-2026-103',
    title: 'Indian Nationalism & Historical Cartography Map Assignment',
    subject: 'Social Science',
    teacher: 'Senior Faculty',
    teacherId: 'T-1022',
    className: '10-C',
    assignedDate: '10 Sep 2026',
    dueDate: '14 Sep 2026',
    description: 'Mark Dandi March route, Champaran, and Jallianwala Bagh on outline political map of India.',
    submissionRate: 89.4,
    totalSubmissions: 42,
    totalStudents: 47,
    status: 'Overdue'
  },
  {
    id: 'HW-2026-104',
    title: 'Python File Handling & CSV Data Extraction Script',
    subject: 'Computer Applications',
    teacher: 'Ankit Surana',
    teacherId: 'T-1012',
    className: '10-D',
    assignedDate: '12 Sep 2026',
    dueDate: '17 Sep 2026',
    description: 'Write a Python script to parse student attendance records from CSV and plot monthly trends.',
    submissionRate: 93.0,
    totalSubmissions: 40,
    totalStudents: 43,
    status: 'Completed'
  },
  {
    id: 'HW-2026-105',
    title: 'Chemical Reactions and Equations Flowcharts',
    subject: 'Science',
    teacher: 'Bhuvnesh Sir',
    teacherId: 'T-1003',
    className: '10-E',
    assignedDate: '14 Sep 2026',
    dueDate: '20 Sep 2026',
    description: 'Prepare reaction flowcharts for balancing redox reactions and displacement reactions.',
    submissionRate: 90.7,
    totalSubmissions: 39,
    totalStudents: 43,
    status: 'Active'
  },
  {
    id: 'HW-2026-106',
    title: 'Essay: "Digital Transformation in Indian Education"',
    subject: 'English',
    teacher: 'Natik Kothari',
    teacherId: 'T-1001',
    className: '10-A',
    assignedDate: '11 Sep 2026',
    dueDate: '16 Sep 2026',
    description: 'Write an argumentative article in 250 words focusing on educational technology adoption.',
    submissionRate: 95.5,
    totalSubmissions: 42,
    totalStudents: 44,
    status: 'Pending Review'
  }
];

export const INITIAL_ATTENTION_STUDENTS: AcademicAttentionStudent[] = [
  {
    id: 'ATTN-01',
    studentId: 'STU-10B-01',
    studentName: 'AAYAM KHAN BHATI',
    className: '10-B',
    rollNo: 1,
    averageScore: 56.4,
    trend: 'declining',
    mainAcademicConcern: 'Low score in Mathematics (54%) & Chemistry (58%); 3 consecutive incomplete homework submissions.',
    recommendedSchoolAction: 'Assign peer tutor from Class 10-A and schedule remedial session on Wednesday afternoon.',
    guardianName: 'Not Provided',
    guardianPhone: 'Not Provided',
    incompleteAssignmentsCount: 4,
    parentNotified: false
  },
  {
    id: 'ATTN-02',
    studentId: 'STU-10B-02',
    studentName: 'ADVIT BHOJAK',
    className: '10-B',
    rollNo: 2,
    averageScore: 59.2,
    trend: 'declining',
    mainAcademicConcern: 'Science theory score dropped 18% over last 2 unit assessments; attendance correlation (74%).',
    recommendedSchoolAction: 'Conduct counselor & subject teacher review; invite parents for focused academic roadmap.',
    guardianName: 'Not Provided',
    guardianPhone: 'Not Provided',
    incompleteAssignmentsCount: 3,
    parentNotified: true,
    lastNotificationDate: '15 Sep 2026'
  },
  {
    id: 'ATTN-03',
    studentId: 'STU-10C-01',
    studentName: 'AKSHAT ACHARYA',
    className: '10-C',
    rollNo: 1,
    averageScore: 52.8,
    trend: 'declining',
    mainAcademicConcern: 'Social Science & Hindi scores below 55%; delayed submission of map assignment.',
    recommendedSchoolAction: 'Provide visual learning worksheets and coordinate with subject faculty for review.',
    guardianName: 'Not Provided',
    guardianPhone: 'Not Provided',
    incompleteAssignmentsCount: 5,
    parentNotified: false
  },
  {
    id: 'ATTN-04',
    studentId: 'STU-10D-01',
    studentName: 'ADITYA BHANSALI',
    className: '10-D',
    rollNo: 1,
    averageScore: 54.0,
    trend: 'stagnant',
    mainAcademicConcern: 'Mathematics problem sets & Chemistry calculations consistently scoring in C2 boundary.',
    recommendedSchoolAction: 'Enrol in Saturday Morning Academic Booster workshop in Room 104.',
    guardianName: 'Not Provided',
    guardianPhone: 'Not Provided',
    incompleteAssignmentsCount: 3,
    parentNotified: true,
    lastNotificationDate: '12 Sep 2026'
  },
  {
    id: 'ATTN-05',
    studentId: 'STU-10E-01',
    studentName: 'AARUSH SONI',
    className: '10-E',
    rollNo: 1,
    averageScore: 58.5,
    trend: 'irregular',
    mainAcademicConcern: 'High variance between oral and written assessments; requires structured exam practice.',
    recommendedSchoolAction: 'Provide guided answer writing templates and weekly diagnostic quizzes.',
    guardianName: 'Not Provided',
    guardianPhone: 'Not Provided',
    incompleteAssignmentsCount: 2,
    parentNotified: false
  }
];

export const INITIAL_REPORT_CARDS: ReportCardItem[] = [
  {
    id: 'RC-2026-001',
    studentId: 'STU-10A-01',
    studentName: 'AASTHA',
    className: '10-A',
    rollNo: 1,
    admissionNo: 'ADM-2023-0104',
    house: 'Agni',
    term: 'Term 1 (Mid-Term Assessment)',
    academicYear: '2026 - 2027',
    overallPercentage: 94.2,
    academicStatus: 'Distinction (A1)',
    attendancePercentage: 96.0,
    totalWorkingDays: 95,
    daysPresent: 91,
    status: 'Published',
    generatedDate: '15 Sep 2026',
    scholasticScores: [
      { subject: 'Mathematics (Standard)', marks: 96, maxMarks: 100, grade: 'A1', remarks: 'Exceptional algebraic insight' },
      { subject: 'Science (Physics, Chem, Bio)', marks: 94, maxMarks: 100, grade: 'A1', remarks: 'Strong experimental acumen' },
      { subject: 'English Communicative', marks: 91, maxMarks: 100, grade: 'A1', remarks: 'Articulate expressive writing' },
      { subject: 'Social Science', marks: 92, maxMarks: 100, grade: 'A1', remarks: 'Thorough analytical grasp' },
      { subject: 'Hindi Course A', marks: 94, maxMarks: 100, grade: 'A1', remarks: 'Command over grammar & composition' },
      { subject: 'Information Technology', marks: 98, maxMarks: 100, grade: 'A1', remarks: 'First rank in school code sprint' }
    ],
    coScholasticScores: [
      { skill: 'Work Education & Computer Applications', grade: 'A' },
      { skill: 'Art & Design Expression', grade: 'A' },
      { skill: 'Health & Physical Education', grade: 'A' },
      { skill: 'Discipline & School Values', grade: 'A' }
    ],
    teacherRemarks: 'AASTHA demonstrates outstanding dedication and inquisitive scholarship. A pillar of Class 10-A.',
    principalSignatureStatus: true
  },
  {
    id: 'RC-2026-002',
    studentId: 'STU-10A-02',
    studentName: 'ABHINAV SHARMA',
    className: '10-A',
    rollNo: 2,
    admissionNo: 'ADM-2023-0105',
    house: 'Surya',
    term: 'Term 1 (Mid-Term Assessment)',
    academicYear: '2026 - 2027',
    overallPercentage: 95.6,
    academicStatus: 'Distinction (A1)',
    attendancePercentage: 98.0,
    totalWorkingDays: 95,
    daysPresent: 93,
    status: 'Published',
    generatedDate: '15 Sep 2026',
    scholasticScores: [
      { subject: 'Mathematics (Standard)', marks: 97, maxMarks: 100, grade: 'A1', remarks: 'Meticulous problem solving' },
      { subject: 'Science (Physics, Chem, Bio)', marks: 96, maxMarks: 100, grade: 'A1', remarks: 'Highest score in Chemistry lab' },
      { subject: 'English Communicative', marks: 94, maxMarks: 100, grade: 'A1', remarks: 'Exemplary vocabulary' },
      { subject: 'Social Science', marks: 93, maxMarks: 100, grade: 'A1', remarks: 'Excellent project presentation' },
      { subject: 'Hindi Course A', marks: 95, maxMarks: 100, grade: 'A1', remarks: 'Top scores in poetry recitation' },
      { subject: 'Information Technology', marks: 99, maxMarks: 100, grade: 'A1', remarks: 'Flawless database design' }
    ],
    coScholasticScores: [
      { skill: 'Work Education & Computer Applications', grade: 'A' },
      { skill: 'Art & Design Expression', grade: 'A' },
      { skill: 'Health & Physical Education', grade: 'A' },
      { skill: 'Discipline & School Values', grade: 'A' }
    ],
    teacherRemarks: 'ABHINAV is a brilliant scholar with consistent excellence across both scholastic and co-scholastic domains.',
    principalSignatureStatus: true
  },
  {
    id: 'RC-2026-003',
    studentId: 'STU-10B-01',
    studentName: 'AAYAM KHAN BHATI',
    className: '10-B',
    rollNo: 1,
    admissionNo: 'ADM-2023-0142',
    house: 'Prithvi',
    term: 'Term 1 (Mid-Term Assessment)',
    academicYear: '2026 - 2027',
    overallPercentage: 88.2,
    academicStatus: 'First Division (A2)',
    attendancePercentage: 92.0,
    totalWorkingDays: 95,
    daysPresent: 87,
    status: 'Published',
    generatedDate: '16 Sep 2026',
    scholasticScores: [
      { subject: 'Mathematics (Standard)', marks: 88, maxMarks: 100, grade: 'A2', remarks: 'Strong fundamentals in algebra' },
      { subject: 'Science (Physics, Chem, Bio)', marks: 86, maxMarks: 100, grade: 'A2', remarks: 'Good practical performance' },
      { subject: 'English Communicative', marks: 90, maxMarks: 100, grade: 'A1', remarks: 'Good verbal skills' },
      { subject: 'Social Science', marks: 85, maxMarks: 100, grade: 'A2', remarks: 'Sound historical recall' },
      { subject: 'Hindi Course A', marks: 89, maxMarks: 100, grade: 'A2', remarks: 'Satisfactory grammar performance' },
      { subject: 'Information Technology', marks: 91, maxMarks: 100, grade: 'A1', remarks: 'Proficient in Python logic' }
    ],
    coScholasticScores: [
      { skill: 'Work Education & Computer Applications', grade: 'A' },
      { skill: 'Art & Design Expression', grade: 'B' },
      { skill: 'Health & Physical Education', grade: 'A' },
      { skill: 'Discipline & School Values', grade: 'A' }
    ],
    teacherRemarks: 'AAYAM shows great enthusiasm and disciplined approach in Class 10-B.',
    principalSignatureStatus: true
  }
];

export const TEACHER_ACADEMIC_OVERVIEWS: TeacherAcademicPerformance[] = [
  {
    teacherId: 'T-1001',
    teacherName: 'Natik Kothari (Class Teacher 10-A)',
    subject: 'Mathematics',
    classes: ['10-A', '10-B'],
    assignmentsCreated: 18,
    assessmentsCompleted: 6,
    marksPending: 0,
    avgClassPerformance: 83.9,
    onSchedule: true
  },
  {
    teacherId: 'T-1002',
    teacherName: 'Chitra Jain (Class Teacher 10-B)',
    subject: 'English & Literature',
    classes: ['10-B', '10-C'],
    assignmentsCreated: 15,
    assessmentsCompleted: 5,
    marksPending: 0,
    avgClassPerformance: 82.5,
    onSchedule: true
  },
  {
    teacherId: 'T-1003',
    teacherName: 'Bhuvnesh Sir (Class Teacher 10-E)',
    subject: 'Science',
    classes: ['10-D', '10-E'],
    assignmentsCreated: 14,
    assessmentsCompleted: 4,
    marksPending: 0,
    avgClassPerformance: 83.6,
    onSchedule: true
  },
  {
    teacherId: 'T-1004',
    teacherName: 'Krishna Sharma',
    subject: 'Social Science',
    classes: ['10-A', '10-C', '10-E'],
    assignmentsCreated: 21,
    assessmentsCompleted: 7,
    marksPending: 0,
    avgClassPerformance: 84.5,
    onSchedule: true
  },
  {
    teacherId: 'T-1012',
    teacherName: 'Ankit Surana',
    subject: 'Computer Applications & IT',
    classes: ['10-A', '10-B', '10-C', '10-D', '10-E'],
    assignmentsCreated: 24,
    assessmentsCompleted: 8,
    marksPending: 0,
    avgClassPerformance: 88.6,
    onSchedule: true
  }
];

export const ACADEMIC_CALENDAR_EVENTS: AcademicCalendarEvent[] = [
  {
    id: 'EVT-CAL-01',
    title: 'Unit Test 2 Commences',
    date: '2026-09-18',
    day: 'Fri, 18 Sep',
    type: 'Unit Test',
    time: '08:30 AM - 10:00 AM',
    classes: ['10-A', '10-B', '10-C', '10-D', '10-E'],
    description: 'First cycle of September Unit Tests for Class 10.',
    venue: 'Respective Classrooms'
  },
  {
    id: 'EVT-CAL-02',
    title: 'Science Practical Journal Submission Deadline',
    date: '2026-09-20',
    day: 'Sun, 20 Sep',
    type: 'Assignment',
    time: '05:00 PM',
    classes: ['10-A', '10-B', '10-C'],
    description: 'Mandatory physics and chemistry practical notebook submission for internal grading.',
    venue: 'Science Labs'
  },
  {
    id: 'EVT-CAL-03',
    title: 'CBSE Mid-Term Model Examinations Begin',
    date: '2026-09-24',
    day: 'Thu, 24 Sep',
    type: 'Exam',
    time: '09:00 AM - 12:00 PM',
    classes: ['10-A', '10-B', '10-C', '10-D', '10-E'],
    description: 'Formal 3-hour theoretical examinations in dedicated halls.',
    venue: 'Examination Halls 1 & 2'
  },
  {
    id: 'EVT-CAL-04',
    title: 'Academic Review Council & Class 10 HOD Syndicate',
    date: '2026-09-28',
    day: 'Mon, 28 Sep',
    type: 'Academic Event',
    time: '03:45 PM - 05:00 PM',
    classes: ['Class 10 Faculty'],
    description: 'Principal conference evaluating mid-term syllabus progress and remedial outcomes.',
    venue: 'Conference Hall'
  },
  {
    id: 'EVT-CAL-05',
    title: 'Parent-Teacher Meeting (PTM) — Term 1',
    date: '2026-10-03',
    day: 'Sat, 03 Oct',
    type: 'Parent Meeting',
    time: '08:30 AM - 01:30 PM',
    classes: ['Class 10 (Sections A to E)'],
    description: 'One-on-one parent review discussions and physical report card verification.',
    venue: 'Academic Block B'
  },
  {
    id: 'EVT-CAL-06',
    title: 'Term 1 Final Result Publication & Digital Report Cards',
    date: '2026-10-08',
    day: 'Thu, 08 Oct',
    type: 'Results Publication',
    time: '10:00 AM',
    classes: ['Class 10 (All Sections)'],
    description: 'Digital release of authenticated CBSE report cards to Parent 360° Portal.',
    venue: 'Online Parent Portal & Notice Board'
  }
];

export const AI_COPILOT_PRESETS = [
  'Show students below the academic target.',
  'Which subjects need attention?',
  'Show upcoming exams.',
  'Which classes have pending marks?',
  'Show assignments due today.',
  'Summarize this week\'s academic activity.',
  'Show students with declining academic performance.',
  'Which report cards are pending?'
];

export const ACADEMIC_ATTENTION_STUDENTS = INITIAL_ATTENTION_STUDENTS.map(s => ({
  ...s,
  primaryConcern: s.mainAcademicConcern,
  recommendedAction: s.recommendedSchoolAction
}));

export const INITIAL_HOMEWORK_ASSIGNMENTS = INITIAL_ASSIGNMENTS.map(a => ({
  ...a,
  teacherName: a.teacher,
  submittedStudents: Array.from({ length: a.totalSubmissions }, (_, i) => `STU-${1000 + i}`)
}));

export const TEACHER_ACADEMIC_ACTIVITY = TEACHER_ACADEMIC_OVERVIEWS.map((t: TeacherAcademicPerformance) => ({
  ...t,
  id: t.teacherId,
  classesAssigned: t.classes,
  averageClassPerformance: t.avgClassPerformance,
  syllabusProgress: t.onSchedule ? 92 : 74,
  syllabusStatus: t.onSchedule ? 'On Track' : 'Needs Acceleration'
}));

