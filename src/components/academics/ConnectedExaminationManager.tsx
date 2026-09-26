import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CalendarClock, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  UserCheck, 
  Users, 
  Search, 
  Plus, 
  ArrowRight, 
  Clock, 
  Eye, 
  Check, 
  X,
  FileCheck,
  TrendingUp,
  Download,
  AlertTriangle
} from 'lucide-react';
import { 
  getSchoolExams, 
  createSchoolExam, 
  updateExamResults, 
  uploadExamSheetOnly, 
  SchoolExamItem, 
  ExamStudentResult 
} from '../../services/schoolDataHub';
import { Student, UserAccount } from '../../types';

interface ConnectedExaminationManagerProps {
  currentUser: UserAccount;
  students: Student[];
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  readOnlyStudentView?: boolean;
}

export const ConnectedExaminationManager: React.FC<ConnectedExaminationManagerProps> = ({
  currentUser,
  students,
  onShowToast,
  readOnlyStudentView = false
}) => {
  const [exams, setExams] = useState<SchoolExamItem[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'create' | 'marks' | 'upload' | 'analytics'>('list');
  const [selectedExamId, setSelectedExamId] = useState<string>('');

  // Form State for Creating Exam
  const [examName, setExamName] = useState('');
  const [examSubject, setExamSubject] = useState('Mathematics');
  const [examClass, setExamClass] = useState('10');
  const [examSection, setExamSection] = useState('B');
  const [examDate, setExamDate] = useState(new Date().toISOString().slice(0, 10));
  const [examStartTime, setExamStartTime] = useState('09:30 AM');
  const [examEndTime, setExamEndTime] = useState('12:30 PM');
  const [maxMarks, setMaxMarks] = useState<number>(100);
  const [instructions, setInstructions] = useState('');
  const [formError, setFormError] = useState('');

  // Marks Entry State
  const [marksEntries, setMarksEntries] = useState<ExamStudentResult[]>([]);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadExamTargetId, setUploadExamTargetId] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Load Exams
  const loadExams = () => {
    const list = getSchoolExams();
    setExams(list);
    if (list.length > 0 && !selectedExamId) {
      setSelectedExamId(list[0].id);
      setUploadExamTargetId(list[0].id);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  // Selected Exam Object
  const currentExam = exams.find(e => e.id === selectedExamId) || exams[0];

  // Initialize Marks Table when selecting an exam
  useEffect(() => {
    if (!currentExam) return;

    // If the exam already has results saved, load them
    if (currentExam.results && currentExam.results.length > 0) {
      setMarksEntries(currentExam.results);
      return;
    }

    // Otherwise, generate rows from the student roster matching this exam's class
    const matchingStudents = students.filter(s => {
      const sClass = s.className || s.class || '';
      const matchesClass = sClass.toString() === currentExam.className.toString();
      const matchesSection = !s.section || s.section.toUpperCase() === currentExam.section.toUpperCase();
      return matchesClass && matchesSection;
    });

    if (matchingStudents.length > 0) {
      const generated: ExamStudentResult[] = matchingStudents.map((s, idx) => ({
        studentId: s.id,
        studentName: s.name,
        rollNumber: s.rollNumber || s.rollNo || (idx + 1),
        className: currentExam.className,
        section: currentExam.section,
        attendanceStatus: 'Present',
        marksObtained: undefined,
        percentage: undefined,
        grade: undefined
      }));
      setMarksEntries(generated);
    } else {
      // Demo fallback if student store has no matches for this class
      setMarksEntries([
        {
          studentId: 'STU-2026-001',
          studentName: 'Aarav Sharma',
          rollNumber: 12,
          className: currentExam.className,
          section: currentExam.section,
          attendanceStatus: 'Present',
          marksObtained: 94,
          percentage: 94,
          grade: 'A1'
        },
        {
          studentId: 'STU-2026-002',
          studentName: 'Diya Patel',
          rollNumber: 15,
          className: currentExam.className,
          section: currentExam.section,
          attendanceStatus: 'Present',
          marksObtained: 88,
          percentage: 88,
          grade: 'A2'
        },
        {
          studentId: 'STU-2026-003',
          studentName: 'Kabir Verma',
          rollNumber: 18,
          className: currentExam.className,
          section: currentExam.section,
          attendanceStatus: 'Absent',
          remarks: 'Medical leave on exam day'
        }
      ]);
    }
  }, [selectedExamId, exams]);

  // Handle Exam Creation
  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!examName.trim()) {
      setFormError('Please enter the examination title.');
      return;
    }
    if (!examDate) {
      setFormError('Please select the examination date.');
      return;
    }
    if (maxMarks <= 0) {
      setFormError('Maximum marks must be greater than 0.');
      return;
    }

    const newExam = createSchoolExam({
      examName: examName.trim(),
      subject: examSubject,
      className: examClass,
      section: examSection,
      examDate,
      startTime: examStartTime,
      endTime: examEndTime,
      maxMarks,
      passingMarks: Math.round(maxMarks * 0.33),
      instructions: instructions.trim() || 'Calculators are prohibited. Bring official School ID Card.',
      results: [],
      status: 'Upcoming',
      createdBy: currentUser.name
    });

    onShowToast(
      'Exam Created Successfully',
      `${newExam.examName} (${newExam.subject}) scheduled for Class ${newExam.className}-${newExam.section}.`,
      'success'
    );

    loadExams();
    setSelectedExamId(newExam.id);
    setActiveSubTab('list');
    setExamName('');
    setInstructions('');
  };

  // Handle Marks Change
  const handleMarkChange = (studentId: string, val: string) => {
    setMarksEntries(prev => prev.map(entry => {
      if (entry.studentId === studentId) {
        if (val === '') {
          return { ...entry, marksObtained: undefined, percentage: undefined, grade: undefined };
        }
        const num = Math.min(Math.max(0, parseFloat(val) || 0), currentExam.maxMarks);
        const pct = Number(((num / currentExam.maxMarks) * 100).toFixed(1));
        let gr = 'A1';
        if (pct < 33) gr = 'F (Needs Improvement)';
        else if (pct < 50) gr = 'C';
        else if (pct < 70) gr = 'B';
        else if (pct < 85) gr = 'A2';
        return {
          ...entry,
          marksObtained: num,
          percentage: pct,
          grade: gr
        };
      }
      return entry;
    }));
  };

  // Toggle Attendance (Present / Absent)
  const handleToggleAttendance = (studentId: string, status: 'Present' | 'Absent') => {
    setMarksEntries(prev => prev.map(entry => {
      if (entry.studentId === studentId) {
        if (status === 'Absent') {
          return {
            ...entry,
            attendanceStatus: 'Absent',
            marksObtained: undefined,
            percentage: undefined,
            grade: 'Absent',
            remarks: 'Marked Absent'
          };
        } else {
          return {
            ...entry,
            attendanceStatus: 'Present',
            grade: undefined,
            remarks: ''
          };
        }
      }
      return entry;
    }));
  };

  // Save and Publish Marks
  const handleSaveMarks = () => {
    if (!currentExam) return;
    updateExamResults(currentExam.id, marksEntries);
    onShowToast(
      'Marks Saved & Published',
      `Examination results for ${currentExam.examName} (${currentExam.subject}) published to students.`,
      'success'
    );
    loadExams();
    setActiveSubTab('analytics');
  };

  // Handle File Upload
  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      onShowToast('File Required', 'Please choose an examination sheet document or PDF to upload.', 'warning');
      return;
    }
    const targetId = uploadExamTargetId || currentExam?.id;
    if (!targetId) return;

    const sizeInMB = (uploadedFile.size / (1024 * 1024)).toFixed(1) + ' MB';
    uploadExamSheetOnly(targetId, uploadedFile.name, sizeInMB);

    setUploadSuccess(`✓ "${uploadedFile.name}" successfully uploaded and linked to ${currentExam?.examName || 'Examination'}.`);
    onShowToast('Upload Successful', `Examination sheet "${uploadedFile.name}" stored securely.`, 'success');
    loadExams();
    setUploadedFile(null);
    setTimeout(() => setUploadSuccess(null), 5000);
  };

  // Calculations for current exam
  const totalCandidates = marksEntries.length;
  const presentCount = marksEntries.filter(m => m.attendanceStatus === 'Present').length;
  const absentCount = marksEntries.filter(m => m.attendanceStatus === 'Absent').length;
  const presentWithMarks = marksEntries.filter(m => m.attendanceStatus === 'Present' && m.marksObtained !== undefined);
  
  const classAverage = presentWithMarks.length > 0
    ? Number((presentWithMarks.reduce((acc, m) => acc + (m.marksObtained || 0), 0) / presentWithMarks.length).toFixed(1))
    : 0;

  const classAveragePct = currentExam && currentExam.maxMarks > 0
    ? Number(((classAverage / currentExam.maxMarks) * 100).toFixed(1))
    : 0;

  const highestScore = presentWithMarks.length > 0
    ? Math.max(...presentWithMarks.map(m => m.marksObtained || 0))
    : 0;

  const lowestScore = presentWithMarks.length > 0
    ? Math.min(...presentWithMarks.map(m => m.marksObtained || 0))
    : 0;

  const passCount = presentWithMarks.filter(m => (m.marksObtained || 0) >= (currentExam?.passingMarks || 33)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'list', label: 'Examinations & Upcoming', icon: CalendarClock },
            ...(!readOnlyStudentView ? [
              { id: 'create', label: 'Create Exam', icon: Plus },
              { id: 'marks', label: 'Enter Marks', icon: Award },
              { id: 'upload', label: 'Upload Sheet', icon: Upload },
              { id: 'analytics', label: 'Results & Averages', icon: TrendingUp }
            ] : [])
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Exam Selector Dropdown */}
        {exams.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Selected Exam:</span>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="text-xs font-bold py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {exams.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.examName} — {ex.subject} (Class {ex.className}-{ex.section})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: Examinations & Upcoming List */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-600" />
                <span>Scheduled Examinations & Result Documents</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official exam schedules, question papers, and published mark sheets
              </p>
            </div>
            {!readOnlyStudentView && (
              <button
                onClick={() => setActiveSubTab('create')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Exam</span>
              </button>
            )}
          </div>

          {exams.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <CalendarClock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No examination records available yet.
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {readOnlyStudentView 
                  ? 'Upcoming examinations will appear here once scheduled by faculty.' 
                  : 'Click "Create Exam" above to schedule upcoming tests, enter marks and upload question sheets.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map(exam => (
                <div
                  key={exam.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                          Class {exam.className}-{exam.section}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                          {exam.examName}
                        </h4>
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          Subject: {exam.subject}
                        </p>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        exam.status === 'Results Published'
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                      }`}>
                        {exam.status}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Date & Time</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {exam.examDate} ({exam.startTime || 'Morning'})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Maximum Marks</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {exam.maxMarks} Marks (Pass: {exam.passingMarks || Math.round(exam.maxMarks * 0.33)})
                        </span>
                      </div>
                    </div>

                    {/* Uploaded Sheet Info */}
                    {exam.uploadedSheetName ? (
                      <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-blue-950 dark:text-blue-200 block truncate">
                              {exam.uploadedSheetName}
                            </span>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400">
                              Uploaded {exam.uploadedSheetDate || 'Recently'} • {exam.uploadedSheetSize || '1.2 MB'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-white dark:bg-slate-800 px-2 py-0.5 rounded shadow-xs">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 text-[11px] text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>No examination sheet uploaded yet</span>
                      </div>
                    )}
                  </div>

                  {!readOnlyStudentView && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedExamId(exam.id);
                          setActiveSubTab('marks');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Enter / Edit Marks →
                      </button>
                      <button
                        onClick={() => {
                          setSelectedExamId(exam.id);
                          setUploadExamTargetId(exam.id);
                          setActiveSubTab('upload');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Sheet</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Create Exam Form */}
      {!readOnlyStudentView && activeSubTab === 'create' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-2xl mx-auto">
          <div className="mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Create New Examination</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Schedule test for assigned classes and automatically notify students & parents
            </p>
          </div>

          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Examination Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mid-Term Examination 2026, Unit Test 1"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class *
                </label>
                <select
                  value={examClass}
                  onChange={(e) => setExamClass(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Section *
                </label>
                <select
                  value={examSection}
                  onChange={(e) => setExamSection(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics"
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Date *
                </label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Time Slot
                </label>
                <input
                  type="text"
                  placeholder="09:30 AM – 12:30 PM"
                  value={examStartTime}
                  onChange={(e) => setExamStartTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Maximum Marks *
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  max="1000"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Instructions for Candidates
              </label>
              <textarea
                rows={2}
                placeholder="Permitted stationery, timing rules, calculator restrictions..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none font-medium"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('list')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create & Schedule Exam</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Enter Marks & Absent Status */}
      {!readOnlyStudentView && activeSubTab === 'marks' && currentExam && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                Evaluation Roster
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentExam.examName} — {currentExam.subject} (Class {currentExam.className}-{currentExam.section})
              </h3>
              <p className="text-xs text-slate-500">
                Max Marks: {currentExam.maxMarks} • Passing Threshold: {currentExam.passingMarks || Math.round(currentExam.maxMarks * 0.33)}
              </p>
            </div>

            <button
              onClick={handleSaveMarks}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Marks</span>
            </button>
          </div>

          {/* Student Marks Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200/60 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Roll No.</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Attendance Status</th>
                  <th className="py-3 px-4">Marks Obtained (/{currentExam.maxMarks})</th>
                  <th className="py-3 px-4">Calculated %</th>
                  <th className="py-3 px-4">Result / Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {marksEntries.map(entry => {
                  const isAbsent = entry.attendanceStatus === 'Absent';
                  return (
                    <tr key={entry.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">
                        #{entry.rollNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {entry.studentName}
                        <span className="block text-[10px] text-slate-400 font-normal">ID: {entry.studentId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(entry.studentId, 'Present')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                              !isAbsent
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleAttendance(entry.studentId, 'Absent')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                              isAbsent
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {isAbsent ? (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-rose-600 dark:text-rose-400">
                            <X className="w-3.5 h-3.5" />
                            <span>ABSENT</span>
                          </span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            max={currentExam.maxMarks}
                            step="0.5"
                            placeholder="Enter marks"
                            value={entry.marksObtained !== undefined ? entry.marksObtained : ''}
                            onChange={(e) => handleMarkChange(entry.studentId, e.target.value)}
                            className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                          />
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {isAbsent ? '—' : (entry.percentage !== undefined ? `${entry.percentage}%` : 'Pending')}
                      </td>
                      <td className="py-3 px-4">
                        {isAbsent ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-[11px]">
                            ABSENT
                          </span>
                        ) : entry.percentage !== undefined ? (
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            entry.percentage >= 33
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {entry.percentage >= 33 ? `Passed (${entry.grade})` : 'Failed'}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not graded</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Upload Examination Sheet */}
      {!readOnlyStudentView && activeSubTab === 'upload' && currentExam && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-xl mx-auto">
          <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Upload Examination Sheet / Question Paper</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Attach question sheet or official answer key (PDF, JPG, PNG)
            </p>
          </div>

          {uploadSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <form onSubmit={handleFileUpload} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Link Document to Examination:
              </label>
              <select
                value={uploadExamTargetId || currentExam.id}
                onChange={(e) => setUploadExamTargetId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
              >
                {exams.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.examName} ({ex.subject} - Class {ex.className}-{ex.section})
                  </option>
                ))}
              </select>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">
                Choose Examination Sheet
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Supported formats: PDF, JPG, JPEG, PNG (Up to 10MB)
              </p>
              
              <input
                id="exam-sheet-upload-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />

              {uploadedFile && (
                <div className="mt-3 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-left text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-950 dark:text-blue-200 block">{uploadedFile.name}</span>
                    <span className="text-[10px] text-blue-600">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-[10px]">Ready to upload</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!uploadedFile}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Examination Sheet</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: Class Results & Averages Analytics */}
      {!readOnlyStudentView && activeSubTab === 'analytics' && currentExam && (
        <div className="space-y-4">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Candidates Appeared</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {presentCount} <span className="text-xs text-slate-400 font-normal">/ {totalCandidates}</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600">
                {totalCandidates > 0 ? ((presentCount / totalCandidates) * 100).toFixed(0) : 0}% Attendance
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Students Absent</span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {absentCount}
              </div>
              <span className="text-[10px] text-slate-400">Marked ABSENT in records</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Class Average</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {classAverage} <span className="text-xs text-slate-400 font-normal">({classAveragePct}%)</span>
              </div>
              <span className="text-[10px] text-slate-400">Passing: {passCount} students</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Highest / Lowest</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {highestScore} <span className="text-xs text-slate-400 font-normal">/ {lowestScore}</span>
              </div>
              <span className="text-[10px] text-slate-400">Range spread</span>
            </div>
          </div>

          {/* Absent Students Notice if any */}
          {absentCount > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold text-rose-900 dark:text-rose-200">
                    {absentCount} Student{absentCount > 1 ? 's were' : ' was'} Absent for {currentExam.examName}:
                  </span>
                  <span className="text-rose-700 dark:text-rose-300 ml-1">
                    {marksEntries.filter(m => m.attendanceStatus === 'Absent').map(m => m.studentName).join(', ')}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px] font-bold">
                Not Graded 0
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
