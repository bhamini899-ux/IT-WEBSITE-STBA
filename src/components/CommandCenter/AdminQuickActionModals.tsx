import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  GraduationCap, 
  Users, 
  CalendarPlus, 
  BookOpen, 
  FileText, 
  Check, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  FileCheck,
  Megaphone,
  Layers,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { Student, Teacher, ClassAttendanceSummary, TeacherLeaveRequest } from '../../types';
import { 
  createUserAccount, 
  getUserAccounts 
} from '../../services/userService';
import { 
  createSchoolHomework, 
  createSchoolExam, 
  updateExamResults, 
  getSchoolExams, 
  createSchoolNotification,
  normalizeClass
} from '../../services/schoolDataHub';

export type AdminQuickActionType = 
  | 'add_student'
  | 'add_teacher'
  | 'create_parent'
  | 'assign_teacher'
  | 'create_class'
  | 'add_homework'
  | 'add_exam'
  | 'upload_exam_sheet'
  | 'send_announcement'
  | 'manage_leaves'
  | null;

interface AdminQuickActionModalsProps {
  type: AdminQuickActionType;
  onClose: () => void;
  onSuccess: (message: string) => void;
  students: Student[];
  teachers: Teacher[];
  classes: ClassAttendanceSummary[];
  leaveRequests: TeacherLeaveRequest[];
  onAddStudent: (student: Student) => void;
  onAddTeacher: (teacher: Partial<Teacher>) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onAddClass: (newClass: ClassAttendanceSummary) => void;
  onApproveLeave: (leave: TeacherLeaveRequest) => void;
  onRejectLeave: (leaveId: string) => void;
  onNavigateToAttendance?: () => void;
}

export const AdminQuickActionModals: React.FC<AdminQuickActionModalsProps> = ({
  type,
  onClose,
  onSuccess,
  students,
  teachers,
  classes,
  leaveRequests,
  onAddStudent,
  onAddTeacher,
  onUpdateTeacher,
  onAddClass,
  onApproveLeave,
  onRejectLeave,
  onNavigateToAttendance
}) => {
  if (!type) return null;

  // Form states for each action
  // 1. Add Student
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState(`STU-${Math.floor(1100 + Math.random() * 8900)}`);
  const [rollNo, setRollNo] = useState('25');
  const [studentClass, setStudentClass] = useState('10');
  const [studentSection, setStudentSection] = useState('B');
  const [dob, setDob] = useState('2010-06-15');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('+91 98290 55678');
  const [studentPassword, setStudentPassword] = useState('student123');

  // 2. Add Teacher
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmpId, setTeacherEmpId] = useState(`FAC-${Math.floor(100 + Math.random() * 900)}`);
  const [teacherSubject, setTeacherSubject] = useState('Mathematics');
  const [teacherDepartment, setTeacherDepartment] = useState('Mathematics');
  const [teacherDesignation, setTeacherDesignation] = useState('PGT Senior Faculty');
  const [teacherAssignedClasses, setTeacherAssignedClasses] = useState('10-B, 9-A');
  const [teacherIsClassTeacher, setTeacherIsClassTeacher] = useState(false);
  const [teacherClassTeacherOf, setTeacherClassTeacherOf] = useState('10-B');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('+91 98290 12345');
  const [teacherPassword, setTeacherPassword] = useState('teacher123');

  // 3. Create Parent
  const [parentName, setParentName] = useState('');
  const [parentUsername, setParentUsername] = useState('');
  const [parentPassword, setParentPassword] = useState('parent123');
  const [parentPhone, setParentPhone] = useState('+91 98290 99887');
  const [parentEmail, setParentEmail] = useState('');
  const [parentLinkedStudentId, setParentLinkedStudentId] = useState(students[0]?.id || '');

  // 4. Assign Teacher
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [assignSubject, setAssignSubject] = useState('Mathematics');
  const [assignClass, setAssignClass] = useState('10');
  const [assignSection, setAssignSection] = useState('B');
  const [assignRole, setAssignRole] = useState<'Subject Teacher' | 'Class Teacher'>('Subject Teacher');

  // 5. Create Class
  const [newClassGrade, setNewClassGrade] = useState('10');
  const [newClassSection, setNewClassSection] = useState('C');
  const [newClassTeacher, setNewClassTeacher] = useState(teachers[0]?.name || 'Dr. Rajesh Rao');
  const [newClassRoom, setNewClassRoom] = useState('Room 205');

  // 7. Add Homework
  const [hwClass, setHwClass] = useState('10');
  const [hwSection, setHwSection] = useState('B');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDueDate, setHwDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [hwInstructions, setHwInstructions] = useState('');
  const [hwTeacherName, setHwTeacherName] = useState(teachers[0]?.name || 'Rajesh Sharma');

  // 8. Add Exam
  const [examName, setExamName] = useState('Mid-Term Examination');
  const [examClass, setExamClass] = useState('10');
  const [examSection, setExamSection] = useState('B');
  const [examSubject, setExamSubject] = useState('Mathematics');
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [examTime, setExamTime] = useState('09:00 AM – 12:00 PM');
  const [examMaxMarks, setExamMaxMarks] = useState(80);
  const [examPassingMarks, setExamPassingMarks] = useState(27);

  // 9. Upload Exam Sheet
  const examsList = getSchoolExams();
  const [selectedExamId, setSelectedExamId] = useState(examsList[0]?.id || '');
  const [examSheetFileName, setExamSheetFileName] = useState('Maths_Term1_Evaluation_Sheet.xlsx');
  const [isExamSheetUploaded, setIsExamSheetUploaded] = useState(false);

  // 10. Send Announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annAudience, setAnnAudience] = useState<'Everyone' | 'Teachers' | 'Students' | 'Parents' | 'Specific Class'>('Everyone');
  const [annTargetClass, setAnnTargetClass] = useState('10');
  const [annTargetSection, setAnnTargetSection] = useState('B');
  const [annPriority, setAnnPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Normal');
  const [annExpiryDate, setAnnExpiryDate] = useState('');

  // 11. Manage Leaves
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');

  // HANDLERS

  // 1. Submit Add Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const fullClassName = `${studentClass}-${studentSection}`;
    const newStudent: Student = {
      id: studentId.trim(),
      name: studentName.trim(),
      className: studentClass,
      class: studentClass,
      section: studentSection,
      rollNo: parseInt(rollNo) || 1,
      rollNumber: parseInt(rollNo) || 1,
      admissionNo: `ADM-${Date.now().toString().slice(-4)}`,
      admissionDate: new Date().toISOString().slice(0, 10),
      todayStatus: 'present',
      attendancePercentage: 100,
      lastAbsence: 'None (Newly Enrolled)',
      guardianName: guardianName.trim() || 'Parent/Guardian',
      guardianPhone: guardianPhone.trim(),
      feeStatus: 'Paid',
      gender,
      dob,
      academicStatus: 'Good',
      academicAverage: 85,
      isNewAdmission: true,
      status: 'Active'
    };

    onAddStudent(newStudent);

    // Create student login credentials
    const cleanUsername = `student.${studentName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    createUserAccount({
      name: studentName.trim(),
      username: cleanUsername,
      passwordHash: studentPassword.trim() || 'student123',
      role: 'Student',
      status: 'Active',
      studentId: newStudent.id,
      className: studentClass,
      section: studentSection,
      rollNo: newStudent.rollNo,
      phone: guardianPhone
    });

    onSuccess(`Student "${newStudent.name}" enrolled in Class ${fullClassName}. Login: ${cleanUsername} / ${studentPassword}`);
    onClose();
  };

  // 2. Submit Add Teacher
  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;

    const classesArray = teacherAssignedClasses.split(',').map(c => c.trim()).filter(Boolean);
    const newTeacher: Partial<Teacher> = {
      name: teacherName.trim(),
      employeeId: teacherEmpId.trim(),
      department: teacherDepartment,
      designation: teacherDesignation,
      subjects: [teacherSubject.trim()],
      classes: classesArray.length > 0 ? classesArray : ['10-B'],
      classTeacherOf: teacherIsClassTeacher ? teacherClassTeacherOf : undefined,
      email: teacherEmail.trim() || `${teacherName.toLowerCase().replace(/\s+/g, '.')}@bafna.edu.in`,
      phone: teacherPhone.trim(),
      currentStatus: 'Present',
      attendanceToday: 'Present',
      attendanceRate: 100
    };

    onAddTeacher(newTeacher);

    // Create teacher login credentials
    const cleanUsername = `teacher.${teacherName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    createUserAccount({
      name: teacherName.trim(),
      username: cleanUsername,
      passwordHash: teacherPassword.trim() || 'teacher123',
      role: 'Teacher',
      status: 'Active',
      teacherId: teacherEmpId.trim(),
      employeeId: teacherEmpId.trim(),
      department: teacherDepartment,
      designation: teacherDesignation,
      subject: teacherSubject.trim(),
      className: teacherAssignedClasses,
      phone: teacherPhone
    });

    onSuccess(`Faculty member "${teacherName}" added with assigned classes [${teacherAssignedClasses}]. Login: ${cleanUsername}`);
    onClose();
  };

  // 3. Submit Create Parent
  const handleCreateParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) return;

    const linkedStudent = students.find(s => s.id === parentLinkedStudentId);
    const cleanUsername = parentUsername.trim() || `parent.${parentName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    createUserAccount({
      name: parentName.trim(),
      username: cleanUsername,
      passwordHash: parentPassword.trim() || 'parent123',
      role: 'Parent',
      status: 'Active',
      parentId: `PAR-${Date.now().toString().slice(-4)}`,
      linkedStudentIds: [parentLinkedStudentId],
      phone: parentPhone.trim(),
      email: parentEmail.trim() || `${cleanUsername}@gmail.com`
    });

    onSuccess(`Parent account created for "${parentName}", linked to student ${linkedStudent ? linkedStudent.name : parentLinkedStudentId}. Login: ${cleanUsername}`);
    onClose();
  };

  // 4. Submit Assign Teacher
  const handleAssignTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTeacher = teachers.find(t => t.id === selectedTeacherId);
    if (!targetTeacher) return;

    const classSectionTag = `${assignClass}-${assignSection}`;
    const updatedClasses = Array.from(new Set([...targetTeacher.classes, classSectionTag]));
    const updatedSubjects = Array.from(new Set([...targetTeacher.subjects, assignSubject.trim()]));

    const updatedTeacher: Teacher = {
      ...targetTeacher,
      classes: updatedClasses,
      subjects: updatedSubjects,
      classTeacherOf: assignRole === 'Class Teacher' ? classSectionTag : targetTeacher.classTeacherOf
    };

    onUpdateTeacher(updatedTeacher);

    // Also update in user accounts for teacher session
    try {
      const allUsers = getUserAccounts();
      const user = allUsers.find(u => u.teacherId === targetTeacher.id || u.employeeId === targetTeacher.employeeId || u.name === targetTeacher.name);
      if (user) {
        user.className = updatedClasses.join(', ');
        user.subject = updatedSubjects.join(', ');
      }
    } catch (e) {}

    onSuccess(`Assigned ${targetTeacher.name} to Class ${classSectionTag} for ${assignSubject} (${assignRole}). Teacher portal updated immediately.`);
    onClose();
  };

  // 5. Submit Create Class
  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const classTag = `${newClassGrade}-${newClassSection}`;

    const newClassSummary: ClassAttendanceSummary = {
      className: classTag,
      total: 35,
      present: 34,
      absent: 1,
      late: 0,
      attendanceRate: 97.1
    };

    onAddClass(newClassSummary);
    onSuccess(`Class ${classTag} (${newClassRoom}, Class Teacher: ${newClassTeacher}) registered into academy schedule.`);
    onClose();
  };

  // 7. Submit Add Homework
  const handleAddHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim() || !hwInstructions.trim()) return;

    createSchoolHomework({
      title: hwTitle.trim(),
      subject: hwSubject.trim(),
      className: hwClass,
      section: hwSection,
      instructions: hwInstructions.trim(),
      assignedDate: new Date().toISOString().slice(0, 10),
      dueDate: hwDueDate,
      teacherId: 'ADM-001',
      teacherName: hwTeacherName,
      attachmentName: 'Homework_Assignment_Guide.pdf',
      attachmentSize: '420 KB'
    });

    onSuccess(`Homework "${hwTitle}" assigned to Class ${hwClass}-${hwSection}. Notification sent to students & parents.`);
    onClose();
  };

  // 8. Submit Add Exam
  const handleAddExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;

    createSchoolExam({
      examName: examName.trim(),
      subject: examSubject.trim(),
      className: examClass,
      section: examSection,
      examDate: examDate,
      startTime: examTime,
      instructions: 'Main Examination Wing',
      maxMarks: Number(examMaxMarks) || 80,
      passingMarks: Number(examPassingMarks) || 27,
      status: 'Upcoming',
      results: [],
      createdBy: 'Administration Office'
    });

    onSuccess(`Exam "${examName}" scheduled for Class ${examClass}-${examSection} on ${examDate}. Alert published to student portal.`);
    onClose();
  };

  // 9. Submit Upload Exam Sheet
  const handleUploadExamSheetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId) return;

    // Simulate grading results for class students
    const classStudents = students.filter(s => s.className === '10' || s.className === '10-B');
    const studentResults = classStudents.map((s, idx) => ({
      studentId: s.id,
      studentName: s.name,
      rollNumber: s.rollNo || idx + 1,
      className: s.className,
      section: s.section || 'B',
      marksObtained: 65 + (idx * 3) % 25,
      maxMarks: 80,
      percentage: Math.round(((65 + (idx * 3) % 25) / 80) * 100),
      grade: 'A',
      attendanceStatus: 'Present' as const,
      remarks: 'Good conceptual comprehension and accurate numerical execution.'
    }));

    updateExamResults(selectedExamId, studentResults, examSheetFileName, '1.4 MB');
    onSuccess(`Marks sheet "${examSheetFileName}" uploaded. Examination results published to report cards & parents.`);
    onClose();
  };

  // 10. Submit Send Announcement
  const handleSendAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;

    createSchoolNotification({
      title: annTitle.trim(),
      message: annMessage.trim(),
      category: annPriority === 'Urgent' ? 'Emergency' : 'General',
      priority: annPriority,
      audience: annAudience,
      targetClass: annAudience === 'Specific Class' ? annTargetClass : undefined,
      targetSection: annAudience === 'Specific Class' ? annTargetSection : undefined,
      expiryDate: annExpiryDate || undefined,
      createdBy: 'Administration Office'
    });

    onSuccess(`Announcement "${annTitle}" dispatched with ${annPriority} priority to ${annAudience}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              {type === 'add_student' && <UserPlus className="w-5 h-5" />}
              {type === 'add_teacher' && <GraduationCap className="w-5 h-5" />}
              {type === 'create_parent' && <Users className="w-5 h-5" />}
              {type === 'assign_teacher' && <Layers className="w-5 h-5" />}
              {type === 'create_class' && <Layers className="w-5 h-5" />}
              {type === 'add_homework' && <BookOpen className="w-5 h-5" />}
              {type === 'add_exam' && <FileText className="w-5 h-5" />}
              {type === 'upload_exam_sheet' && <FileCheck className="w-5 h-5" />}
              {type === 'send_announcement' && <Megaphone className="w-5 h-5" />}
              {type === 'manage_leaves' && <ClipboardList className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {type === 'add_student' && 'Add New Student'}
                {type === 'add_teacher' && 'Add Faculty Member'}
                {type === 'create_parent' && 'Create Parent Account'}
                {type === 'assign_teacher' && 'Assign Teacher to Class'}
                {type === 'create_class' && 'Create Class & Section'}
                {type === 'add_homework' && 'Assign Academic Homework'}
                {type === 'add_exam' && 'Schedule Academic Examination'}
                {type === 'upload_exam_sheet' && 'Upload Examination Sheet & Results'}
                {type === 'send_announcement' && 'Broadcast School Announcement'}
                {type === 'manage_leaves' && 'Manage Teacher Leave Requests'}
              </h2>
              <p className="text-xs text-slate-500">
                {type === 'add_student' && 'Enroll student, assign class & auto-generate portal credentials'}
                {type === 'add_teacher' && 'Register faculty, assign subjects, classes & teacher credentials'}
                {type === 'create_parent' && 'Create portal login for parent and link to enrolled student'}
                {type === 'assign_teacher' && 'Assign subject or class teacher role to a specific section'}
                {type === 'create_class' && 'Register a new class level or section in the academic master roster'}
                {type === 'add_homework' && 'Assign homework with instructions directly to student/parent portals'}
                {type === 'add_exam' && 'Publish upcoming exam schedule with syllabus details'}
                {type === 'upload_exam_sheet' && 'Upload marks sheet and publish report cards to portals'}
                {type === 'send_announcement' && 'Send prioritized notices to students, parents, or faculty'}
                {type === 'manage_leaves' && 'Review, approve or decline pending faculty leave applications'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* 1. ADD STUDENT FORM */}
          {type === 'add_student' && (
            <form onSubmit={handleAddStudentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Yash Vardhan"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student ID (Auto-Generated)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class *
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="10">Class 10</option>
                    <option value="9">Class 9</option>
                    <option value="8">Class 8</option>
                    <option value="7">Class 7</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section *
                  </label>
                  <select
                    value={studentSection}
                    onChange={(e) => setStudentSection(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="number"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth (Optional)
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="e.g. Mukesh Vardhan"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Portal Login Password
                  </label>
                  <input
                    type="text"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Student username will be formatted as: student.{studentName ? studentName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'name'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Save & Enroll Student
                </button>
              </div>
            </form>
          )}

          {/* 2. ADD TEACHER FORM */}
          {type === 'add_teacher' && (
            <form onSubmit={handleAddTeacherSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teacher Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g. Dr. Alok Mathur"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={teacherEmpId}
                    onChange={(e) => setTeacherEmpId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherSubject}
                    onChange={(e) => setTeacherSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={teacherDepartment}
                    onChange={(e) => setTeacherDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science & Physics</option>
                    <option value="English">English & Literature</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Classes (Comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherAssignedClasses}
                    onChange={(e) => setTeacherAssignedClasses(e.target.value)}
                    placeholder="e.g. 10-A, 10-B, 9-A"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={teacherPhone}
                    onChange={(e) => setTeacherPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="classTeacherCheck"
                      checked={teacherIsClassTeacher}
                      onChange={(e) => setTeacherIsClassTeacher(e.target.checked)}
                      className="rounded text-blue-600 cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="classTeacherCheck" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      Designate as Class Teacher (Section In-Charge)
                    </label>
                  </div>
                  {teacherIsClassTeacher && (
                    <div className="flex items-center gap-2 pt-1 pl-6">
                      <span className="text-xs text-slate-500">In-Charge of Class:</span>
                      <select
                        value={teacherClassTeacherOf}
                        onChange={(e) => setTeacherClassTeacherOf(e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-bold"
                      >
                        <option value="10-A">Class 10-A</option>
                        <option value="10-B">Class 10-B</option>
                        <option value="10-C">Class 10-C</option>
                        <option value="9-A">Class 9-A</option>
                        <option value="9-B">Class 9-B</option>
                        <option value="8-A">Class 8-A</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Portal Login Password
                  </label>
                  <input
                    type="text"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Teacher username: teacher.{teacherName ? teacherName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'name'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Save & Register Faculty
                </button>
              </div>
            </form>
          )}

          {/* 3. CREATE PARENT FORM */}
          {type === 'create_parent' && (
            <form onSubmit={handleCreateParentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Mr. Rakesh Sharma"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Link to Enrolled Student *
                  </label>
                  <select
                    value={parentLinkedStudentId}
                    onChange={(e) => setParentLinkedStudentId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Class {s.className}, Roll #{s.rollNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Username (Optional)
                  </label>
                  <input
                    type="text"
                    value={parentUsername}
                    onChange={(e) => setParentUsername(e.target.value)}
                    placeholder="e.g. parent.sharma"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono focus:outline-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Parent Portal Password *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentPassword}
                    onChange={(e) => setParentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Parent will be able to log into Parent Portal to monitor attendance, fee dues, bus tracking, and exam cards for their linked child.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Create Parent Account
                </button>
              </div>
            </form>
          )}

          {/* 4. ASSIGN TEACHER FORM */}
          {type === 'assign_teacher' && (
            <form onSubmit={handleAssignTeacherSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Teacher *
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-blue-500"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.department} ({t.classes.join(', ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject to Teach *
                  </label>
                  <input
                    type="text"
                    required
                    value={assignSubject}
                    onChange={(e) => setAssignSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Role in Section *
                  </label>
                  <select
                    value={assignRole}
                    onChange={(e) => setAssignRole(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="Subject Teacher">Subject Teacher</option>
                    <option value="Class Teacher">Class Teacher (In-Charge)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class *
                  </label>
                  <select
                    value={assignClass}
                    onChange={(e) => setAssignClass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="10">Class 10</option>
                    <option value="9">Class 9</option>
                    <option value="8">Class 8</option>
                    <option value="7">Class 7</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section *
                  </label>
                  <select
                    value={assignSection}
                    onChange={(e) => setAssignSection(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-300">
                <span className="font-bold">Immediate Data Consistency:</span> The assigned teacher will immediately gain access to Class {assignClass}-{assignSection} students, roll call, homework, and timetable.
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          )}

          {/* 5. CREATE CLASS FORM */}
          {type === 'create_class' && (
            <form onSubmit={handleCreateClassSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class Grade *
                  </label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="10">Class 10</option>
                    <option value="9">Class 9</option>
                    <option value="8">Class 8</option>
                    <option value="7">Class 7</option>
                    <option value="6">Class 6</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClassSection}
                    onChange={(e) => setNewClassSection(e.target.value.toUpperCase())}
                    placeholder="e.g. C or D"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Class Teacher
                  </label>
                  <select
                    value={newClassTeacher}
                    onChange={(e) => setNewClassTeacher(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Designated Room Number
                  </label>
                  <input
                    type="text"
                    value={newClassRoom}
                    onChange={(e) => setNewClassRoom(e.target.value)}
                    placeholder="e.g. Room 208, Block B"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Create Section
                </button>
              </div>
            </form>
          )}

          {/* 7. ADD HOMEWORK FORM */}
          {type === 'add_homework' && (
            <form onSubmit={handleAddHomeworkSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class *
                  </label>
                  <select
                    value={hwClass}
                    onChange={(e) => setHwClass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="10">Class 10</option>
                    <option value="9">Class 9</option>
                    <option value="8">Class 8</option>
                    <option value="7">Class 7</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section *
                  </label>
                  <select
                    value={hwSection}
                    onChange={(e) => setHwSection(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={hwSubject}
                    onChange={(e) => setHwSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={hwDueDate}
                    onChange={(e) => setHwDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Homework Title / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={hwTitle}
                    onChange={(e) => setHwTitle(e.target.value)}
                    placeholder="e.g. Quadratic Formula & Discriminant Practice Problems"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Assignment Instructions *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={hwInstructions}
                    onChange={(e) => setHwInstructions(e.target.value)}
                    placeholder="Write detailed questions, exercises, or page references..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          )}

          {/* 8. ADD EXAM FORM */}
          {type === 'add_exam' && (
            <form onSubmit={handleAddExamSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Examination Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g. Term 1 Summative Assessment"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class *
                  </label>
                  <select
                    value={examClass}
                    onChange={(e) => setExamClass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="10">Class 10</option>
                    <option value="9">Class 9</option>
                    <option value="8">Class 8</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section *
                  </label>
                  <select
                    value={examSection}
                    onChange={(e) => setExamSection(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="B">Section B</option>
                    <option value="A">Section A</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Maximum Marks *
                  </label>
                  <input
                    type="number"
                    value={examMaxMarks}
                    onChange={(e) => setExamMaxMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Schedule Exam
                </button>
              </div>
            </form>
          )}

          {/* 9. UPLOAD EXAM SHEET FORM */}
          {type === 'upload_exam_sheet' && (
            <form onSubmit={handleUploadExamSheetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Scheduled Examination *
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-blue-500"
                >
                  {examsList.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.examName} — {e.subject} (Class {e.className}-{e.section}, {e.examDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Evaluation Sheet File (Excel / CSV)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
                  <FileCheck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {examSheetFileName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ready for parsing: 35 student scores matched with Student IDs
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Formatted & Verified (CBSE Standards)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300">
                <span className="font-bold">Publishing Notice:</span> Uploading this marks sheet will immediately compute grades and notify students & parents via report cards.
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Upload & Publish Results
                </button>
              </div>
            </form>
          )}

          {/* 10. SEND ANNOUNCEMENT FORM */}
          {type === 'send_announcement' && (
            <form onSubmit={handleSendAnnouncementSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Schedule for CBSE Half-Yearly Practical Assessments"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Audience *
                  </label>
                  <select
                    value={annAudience}
                    onChange={(e) => setAnnAudience(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  >
                    <option value="Everyone">Everyone (School-Wide)</option>
                    <option value="Students">All Students</option>
                    <option value="Parents">All Parents</option>
                    <option value="Teachers">All Faculty & Staff</option>
                    <option value="Specific Class">Specific Class / Section</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:outline-blue-500"
                  >
                    <option value="Normal">Normal Priority</option>
                    <option value="Important">Important Priority</option>
                    <option value="Urgent">Urgent / Action Required</option>
                  </select>
                </div>

                {annAudience === 'Specific Class' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Target Class *
                      </label>
                      <select
                        value={annTargetClass}
                        onChange={(e) => setAnnTargetClass(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                      >
                        <option value="10">Class 10</option>
                        <option value="9">Class 9</option>
                        <option value="8">Class 8</option>
                        <option value="7">Class 7</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Target Section *
                      </label>
                      <select
                        value={annTargetSection}
                        onChange={(e) => setAnnTargetSection(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                      >
                        <option value="B">Section B</option>
                        <option value="A">Section A</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Optional Expiry Date
                  </label>
                  <input
                    type="date"
                    value={annExpiryDate}
                    onChange={(e) => setAnnExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Auto-archived after this date</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Body / Circular Text *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={annMessage}
                    onChange={(e) => setAnnMessage(e.target.value)}
                    placeholder="Write the institutional announcement or notice..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Broadcast Announcement
                </button>
              </div>
            </form>
          )}

          {/* 11. MANAGE LEAVE REQUESTS */}
          {type === 'manage_leaves' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pending Faculty Leave Applications ({pendingLeaves.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Approving triggers automatic substitution alerts
                </span>
              </div>

              {pendingLeaves.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No Pending Leave Applications
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    All faculty leave requests have been reviewed and resolved.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingLeaves.map(leave => (
                    <div 
                      key={leave.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {leave.teacherName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            {leave.department}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {leave.leaveType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-slate-900 dark:text-white">Duration:</span> {leave.startDate} to {leave.endDate} ({leave.days} day{leave.days > 1 ? 's' : ''})
                        </p>
                        <p className="text-xs text-slate-500 italic">
                          "{leave.reason}"
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Submitted: {leave.appliedAt} • Impact: {leave.affectedPeriodsCount || 3} periods today
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            onRejectLeave(leave.id);
                            onSuccess(`Declined leave request for ${leave.teacherName}.`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => {
                            onApproveLeave(leave);
                            onSuccess(`Approved ${leave.leaveType} for ${leave.teacherName}. Timetable substitution engine deployed.`);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Substitute</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
