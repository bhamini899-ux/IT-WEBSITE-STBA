import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Send, 
  UserCheck, 
  CheckCircle, 
  TrendingDown, 
  BookOpen, 
  Search,
  Award,
  ArrowUpRight,
  ShieldAlert,
  Users
} from 'lucide-react';
import { AcademicAttentionStudent, Student } from '../../types';
import { INITIAL_ATTENTION_STUDENTS } from '../../data/academicData';
import { DETAILED_360_STUDENTS } from '../../data/student360Data';

interface AcademicAttentionCenterProps {
  onSelectStudent: (student: Student) => void;
  onNotifyParent: (student: Student) => void;
}

export const AcademicAttentionCenter: React.FC<AcademicAttentionCenterProps> = ({
  onSelectStudent,
  onNotifyParent
}) => {
  const [students, setStudents] = useState<AcademicAttentionStudent[]>(INITIAL_ATTENTION_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleNotifyParentClick = (stu: AcademicAttentionStudent) => {
    const fullStudent = DETAILED_360_STUDENTS.find(s => s.id === stu.studentId) || {
      id: stu.studentId,
      name: stu.studentName,
      className: stu.className,
      rollNo: stu.rollNo,
      todayStatus: 'present',
      attendancePercentage: 82,
      lastAbsence: 'N/A',
      guardianName: 'Guardian',
      guardianPhone: '+91 98290 00000',
      academicAverage: stu.averageScore
    };
    onNotifyParent(fullStudent);
    showToast(`✓ Academic progress alert dispatched to Guardian of ${stu.studentName} via Parent 360°`);
  };

  const handleAssignSupport = (stu: AcademicAttentionStudent) => {
    showToast(`✓ Remedial support schedule & peer tutor assigned for ${stu.studentName} (${stu.className})`);
  };

  const handleReviewPerformance = (stuId: string) => {
    setStudents(prev => prev.map(s => s.id === stuId ? { ...s, trend: 'stable' as const } : s));
    showToast('✓ Student academic performance dossier marked as reviewed by Academic Coordinator');
  };

  const filteredStudents = students.filter(s => {
    const concern = s.primaryConcern || s.mainAcademicConcern || '';
    return (
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concern.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Academic Attention & Early Intervention Center
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              {students.length} Flags Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated student performance radar identifying learners requiring immediate academic support, remedial classes and parent coordination.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flagged student..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Criteria Pill Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">1. Average Below Target</span>
          <span className="text-slate-500 text-[11px]">Cumulative score &lt;60% across assessments</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">2. Repeated Low Assessments</span>
          <span className="text-slate-500 text-[11px]">Consecutive scores below 45% in core subject</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">3. Incomplete Homework</span>
          <span className="text-slate-500 text-[11px]">More than 3 overdue or missing assignments</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">4. Declining Trajectory</span>
          <span className="text-slate-500 text-[11px]">Sustained drop of &gt;8% compared to term baseline</span>
        </div>
      </div>

      {/* List of Flagged Students Cards */}
      <div className="space-y-3.5">
        {filteredStudents.map((stu) => (
          <div
            key={stu.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            {/* Student Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const fullStudent = DETAILED_360_STUDENTS.find(s => s.id === stu.studentId) || {
                      id: stu.studentId,
                      name: stu.studentName,
                      className: stu.className,
                      rollNo: stu.rollNo,
                      todayStatus: 'present',
                      attendancePercentage: 82,
                      lastAbsence: 'N/A',
                      guardianName: 'Guardian',
                      guardianPhone: '+91 98290 00000',
                      academicAverage: stu.averageScore
                    };
                    onSelectStudent(fullStudent);
                  }}
                  className="font-bold text-slate-900 dark:text-white hover:text-blue-600 text-sm flex items-center gap-1 cursor-pointer"
                >
                  <span>{stu.studentName}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-xs">
                  Class {stu.className} • Roll #{stu.rollNo}
                </span>
                <span className="flex items-center text-xs font-bold text-rose-600">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  Avg: {stu.averageScore}%
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                <strong>Primary Concern:</strong> {stu.primaryConcern || stu.mainAcademicConcern}
              </div>

              <div className="text-xs text-blue-600 dark:text-blue-400">
                <strong>Recommended Action:</strong> {stu.recommendedAction || stu.recommendedSchoolAction}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
              <button
                id={`btn-notify-parent-${stu.id}`}
                onClick={() => handleNotifyParentClick(stu)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Notify Parent (Parent 360°)</span>
              </button>

              <button
                id={`btn-assign-support-${stu.id}`}
                onClick={() => handleAssignSupport(stu)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assign Support</span>
              </button>

              <button
                id={`btn-review-${stu.id}`}
                onClick={() => handleReviewPerformance(stu.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Review Performance</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
