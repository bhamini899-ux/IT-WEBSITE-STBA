import React, { useState } from 'react';
import { 
  Award, 
  Save, 
  CheckCircle, 
  Search, 
  Edit3, 
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Filter
} from 'lucide-react';
import { StudentMarksRecord, Student } from '../../types';
import { INITIAL_MARKS_DATA } from '../../data/academicData';
import { DETAILED_360_STUDENTS } from '../../data/student360Data';

interface MarksManagementViewProps {
  onSelectStudent: (student: Student) => void;
}

export const MarksManagementView: React.FC<MarksManagementViewProps> = ({ onSelectStudent }) => {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedExam, setSelectedExam] = useState('Periodic Assessment 1');
  const [maxMarks, setMaxMarks] = useState<number>(50);
  const [marksData, setMarksData] = useState<StudentMarksRecord[]>(INITIAL_MARKS_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to compute grade from percentage
  const calculateGrade = (pct: number) => {
    if (pct >= 90) return { grade: 'A1', status: 'Strong' as const };
    if (pct >= 80) return { grade: 'A2', status: 'Strong' as const };
    if (pct >= 70) return { grade: 'B1', status: 'Satisfactory' as const };
    if (pct >= 60) return { grade: 'B2', status: 'Average' as const };
    if (pct >= 50) return { grade: 'C1', status: 'Needs Support' as const };
    if (pct >= 40) return { grade: 'C2', status: 'Needs Support' as const };
    return { grade: 'D', status: 'Needs Support' as const };
  };

  // Filter records by selected class
  const classMarks = marksData.filter(m => m.className === selectedClass);

  const handleScoreChange = (recordId: string, newScore: number) => {
    const validScore = Math.min(Math.max(0, newScore || 0), maxMarks);
    setMarksData(prev => prev.map(rec => {
      if (rec.id === recordId) {
        const pct = Math.round((validScore / maxMarks) * 100 * 10) / 10;
        const { grade, status } = calculateGrade(pct);
        return {
          ...rec,
          marksObtained: validScore,
          maxMarks,
          percentage: pct,
          grade,
          status
        };
      }
      return rec;
    }));
  };

  const handleSaveMarks = () => {
    setToastMessage(`✓ Marks updated successfully for Class ${selectedClass} ${selectedSubject} (${selectedExam})`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Selector Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Marks Management & Assessment Grading
            </h3>
            <p className="text-xs text-slate-500">
              Record, edit and publish continuous evaluation and term marks
            </p>
          </div>

          <button
            id="btn-save-marks-primary"
            onClick={handleSaveMarks}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all self-start md:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Marks</span>
          </button>
        </div>

        {/* 4 Selectors: Class, Subject, Examination, Max Marks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Class & Section
            </label>
            <select
              id="select-marks-class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
            >
              {['10-A', '10-B', '10-C', '10-D', '10-E'].map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Subject
            </label>
            <select
              id="select-marks-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
            >
              {['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Commerce'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Examination
            </label>
            <select
              id="select-marks-exam"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="Periodic Assessment 1">Periodic Assessment 1 (50 Marks)</option>
              <option value="Unit Test 2">Unit Test 2 (40 Marks)</option>
              <option value="Mid-Term Examination">Mid-Term Examination (80 Marks)</option>
              <option value="Pre-Board Examination">Pre-Board Examination (80 Marks)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Maximum Marks
            </label>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(parseInt(e.target.value) || 50)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Grading Register: {selectedClass} • {selectedSubject} • {selectedExam}
            </h4>
            <p className="text-xs text-slate-500">
              Type directly in the Marks field to edit. Percentage and CBSE grade recalculate instantly.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {classMarks.length} Candidates Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Roll No.</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Marks Obtained</th>
                <th className="py-3 px-4">Max Marks</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">CBSE Grade</th>
                <th className="py-3 px-4">Academic Status</th>
                <th className="py-3 px-4">Teacher Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {classMarks.map((rec) => {
                const isStrong = rec.status === 'Strong';
                const isSupport = rec.status === 'Needs Support';

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-500">
                      {rec.rollNo}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          const student = DETAILED_360_STUDENTS.find(s => s.id === rec.studentId) || {
                            id: rec.studentId,
                            name: rec.studentName,
                            className: rec.className,
                            rollNo: rec.rollNo,
                            todayStatus: 'present',
                            attendancePercentage: 94,
                            lastAbsence: 'N/A',
                            guardianName: 'Guardian',
                            guardianPhone: '+91 98290 00000',
                            academicAverage: rec.percentage
                          };
                          onSelectStudent(student);
                        }}
                        className="font-bold text-slate-900 dark:text-white hover:text-blue-600 flex items-center gap-1 cursor-pointer text-left"
                      >
                        <span>{rec.studentName}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </button>
                      <div className="text-[10px] text-slate-400">ID: {rec.studentId}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {rec.subject}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          id={`input-marks-${rec.id}`}
                          value={rec.marksObtained}
                          onChange={(e) => handleScoreChange(rec.id, parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-xs font-black text-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                        <span className="text-slate-400 text-xs">/ {maxMarks}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold">
                      {maxMarks}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-black text-slate-900 dark:text-white">
                        {rec.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {rec.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        isStrong
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isSupport
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-xs truncate">
                      {rec.remarks || 'Standard assessment submission.'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Save Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            All modifications will reflect immediately in student report cards and the Parent 360° Portal.
          </span>
          <button
            id="btn-save-marks-footer"
            onClick={handleSaveMarks}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Marks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
