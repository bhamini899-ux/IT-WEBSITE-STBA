import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  TrendingUp, 
  FileText, 
  Mail, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  BarChart2,
  GraduationCap
} from 'lucide-react';
import { ChildSubjectAcademic, ChildProfile, ParentSchoolDocument } from '../../types/parentConnect';

interface ChildAcademicsSectionProps {
  child: ChildProfile;
  academics: ChildSubjectAcademic[];
  onViewReportCard: () => void;
}

export const ChildAcademicsSection: React.FC<ChildAcademicsSectionProps> = ({
  child,
  academics,
  onViewReportCard,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<ChildSubjectAcademic>(academics[0]);

  return (
    <div className="space-y-6">
      {/* Overall Academic Performance Banner */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>CBSE Affiliated Scholastic Assessment 2026-27</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {child.name}'s Academic Progress
            </h3>
            <p className="text-xs text-blue-100/90 max-w-xl">
              Evaluation based on Unit Tests, Practical Labs, Periodic Assessments, and Term 1 examinations at Seth Tolaram Bafna Academy.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
                Overall Score
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {child.academicAverage}%
              </span>
            </div>

            <div className="text-center px-3 border-r border-white/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
                Class Rank
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300">
                #{child.academicRank}
              </span>
            </div>

            <div className="text-center px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
                Standing
              </span>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                Distinction
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions in Banner */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-blue-100">
            <GraduationCap className="w-4 h-4" />
            <span>Class Teacher: <strong>{child.classTeacher}</strong></span>
          </div>

          <button
            id="view-report-card-btn"
            onClick={onViewReportCard}
            className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-900 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>View Official Report Card (PDF)</span>
          </button>
        </div>
      </div>

      {/* Subject-Wise Performance Meters & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Cards Grid (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Subject Performance & Faculty</span>
            </h4>
            <span className="text-xs text-slate-400">{academics.length} Enrolled Subjects</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {academics.map((subj) => {
              const isSelected = selectedSubject.id === subj.id;
              return (
                <div
                  key={subj.id}
                  onClick={() => setSelectedSubject(subj)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {subj.subjectName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Grade {subj.grade}
                    </span>
                  </div>

                  {/* Progress Meter Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Term Score</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {subj.recentScore} / {subj.recentMaxScore}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-blue-600 transition-all duration-500" 
                        style={{ width: `${(subj.recentScore / subj.recentMaxScore) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img 
                        src={subj.teacherAvatar} 
                        alt={subj.teacherName}
                        className="w-6 h-6 rounded-full object-cover" 
                      />
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[140px]">
                        {subj.teacherName}
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                      {subj.termAverage}% Avg
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Subject Inspector & Teacher Remarks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Subject Dossier
              </span>
              <span className="text-xs font-mono font-bold text-blue-600">
                {selectedSubject.subjectCode}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-3">
              {selectedSubject.subjectName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Evaluated in: {selectedSubject.examName}
            </p>

            {/* Score & Benchmark */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Marks Scored</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedSubject.recentScore}
                </span>
                <span className="text-slate-400 text-xs"> / {selectedSubject.recentMaxScore}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">CBSE Grade</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {selectedSubject.grade}
                </span>
                <span className="text-[10px] text-slate-400 block">Above 90th percentile</span>
              </div>
            </div>

            {/* Faculty Commentary */}
            <div className="mt-4 p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <img 
                  src={selectedSubject.teacherAvatar} 
                  alt={selectedSubject.teacherName}
                  className="w-7 h-7 rounded-full object-cover" 
                />
                <div>
                  <strong className="text-slate-900 dark:text-white block text-xs">
                    {selectedSubject.teacherName}
                  </strong>
                  <span className="text-[10px] text-slate-500">Subject Faculty Feedback</span>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 italic pt-1 text-[11px] leading-relaxed">
                "{selectedSubject.teacherRemarks}"
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <a
              href={`mailto:${selectedSubject.teacherEmail}`}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email {selectedSubject.teacherName}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
