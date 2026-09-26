import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  CalendarClock, 
  Award, 
  FileText, 
  AlertTriangle, 
  UserCheck, 
  Calendar, 
  Sparkles,
  CheckCircle2,
  CheckCircle
} from 'lucide-react';
import { AcademicHeaderStats } from '../components/academics/AcademicHeaderStats';
import { AcademicPerformanceOverview } from '../components/academics/AcademicPerformanceOverview';
import { ClassPerformanceView } from '../components/academics/ClassPerformanceView';
import { SubjectAnalyticsView } from '../components/academics/SubjectAnalyticsView';
import { ExaminationCenter } from '../components/academics/ExaminationCenter';
import { MarksManagementView } from '../components/academics/MarksManagementView';
import { StudentAcademicProfileModal } from '../components/academics/StudentAcademicProfileModal';
import { ReportCardCenter } from '../components/academics/ReportCardCenter';
import { HomeworkAssignmentView } from '../components/academics/HomeworkAssignmentView';
import { AcademicAttentionCenter } from '../components/academics/AcademicAttentionCenter';
import { TeacherAcademicOverview } from '../components/academics/TeacherAcademicOverview';
import { AcademicCalendarView } from '../components/academics/AcademicCalendarView';
import { AIAcademicCopilot } from '../components/academics/AIAcademicCopilot';

import { 
  INITIAL_EXAMINATIONS, 
  INITIAL_EXAM_CONFLICTS 
} from '../data/academicData';
import { ExaminationItem, ExamConflictItem, Student } from '../types';

export const AcademicsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [examinations, setExaminations] = useState<ExaminationItem[]>(INITIAL_EXAMINATIONS);
  const [conflicts, setConflicts] = useState<ExamConflictItem[]>(INITIAL_EXAM_CONFLICTS);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState<boolean>(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 4000);
  };

  const handleOpenStudentProfile = (student: Student) => {
    setSelectedStudentForProfile(student);
    setIsStudentProfileOpen(true);
  };

  const handleNotifyParentFromProfile = (student: Student) => {
    showToast(`✓ Academic progress dossier sent to Guardian of ${student.name} via Parent 360°`);
  };

  const handleAddExam = (newExam: ExaminationItem) => {
    setExaminations(prev => [newExam, ...prev]);
  };

  const handleResolveConflict = (conflictId: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
  };

  const handleReassignRoom = (conflictId: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    setExaminations(prev => prev.map(e => e.room.includes('Room 204') ? { ...e, room: 'Examination Hall 2', hasConflict: false } : e));
  };

  const handleChangeTime = (conflictId: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    setExaminations(prev => prev.map(e => e.invigilator === 'Rajesh Verma' ? { ...e, startTime: '01:00 PM', endTime: '04:00 PM' } : e));
  };

  const tabs = [
    { id: 'overview', label: 'Academic Overview', icon: BarChart3 },
    { id: 'classes', label: 'Class Analytics', icon: Users },
    { id: 'subjects', label: 'Subject Performance', icon: BookOpen },
    { id: 'exams', label: 'Examination Center', icon: CalendarClock, badge: conflicts.length > 0 ? `${conflicts.length}` : undefined },
    { id: 'marks', label: 'Marks Management', icon: Award },
    { id: 'reportcards', label: 'Report Cards', icon: FileText },
    { id: 'homework', label: 'Homework & Coursework', icon: BookOpen },
    { id: 'attention', label: 'Academic Attention', icon: AlertTriangle, badge: '18' },
    { id: 'faculty', label: 'Faculty Activity', icon: UserCheck },
    { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
    { id: 'copilot', label: 'AI Academic Copilot', icon: Sparkles, highlight: true }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Global Toast */}
      {globalToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2.5 animate-in slide-in-from-right-4 duration-200">
          <CheckCircle className="w-5 h-5 text-white shrink-0" />
          <span>{globalToast}</span>
        </div>
      )}

      {/* Top Academic Stats Header Banner */}
      <AcademicHeaderStats onNavigateTab={(tabKey) => setActiveTab(tabKey)} />

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 shadow-xs sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-academic-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? tab.highlight 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs' 
                      : 'bg-blue-600 text-white shadow-xs'
                    : tab.highlight
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 font-black'
                    : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${tab.highlight && !isActive ? 'text-amber-500' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive 
                      ? 'bg-white text-blue-900' 
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'overview' && (
          <AcademicPerformanceOverview 
            onSelectSubject={() => setActiveTab('subjects')}
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {activeTab === 'classes' && (
          <ClassPerformanceView 
            onSelectStudent={handleOpenStudentProfile}
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectAnalyticsView 
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {activeTab === 'exams' && (
          <ExaminationCenter 
            examinations={examinations}
            conflicts={conflicts}
            onAddExam={handleAddExam}
            onResolveConflict={handleResolveConflict}
            onReassignRoom={handleReassignRoom}
            onChangeTime={handleChangeTime}
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {activeTab === 'marks' && (
          <MarksManagementView 
            onSelectStudent={handleOpenStudentProfile}
          />
        )}

        {activeTab === 'reportcards' && (
          <ReportCardCenter />
        )}

        {activeTab === 'homework' && (
          <HomeworkAssignmentView />
        )}

        {activeTab === 'attention' && (
          <AcademicAttentionCenter 
            onSelectStudent={handleOpenStudentProfile}
            onNotifyParent={handleNotifyParentFromProfile}
          />
        )}

        {activeTab === 'faculty' && (
          <TeacherAcademicOverview 
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}

        {activeTab === 'calendar' && (
          <AcademicCalendarView />
        )}

        {activeTab === 'copilot' && (
          <AIAcademicCopilot 
            onNavigateTab={(tabKey) => setActiveTab(tabKey)}
          />
        )}
      </div>

      {/* Global Student Academic 360° Profile Modal */}
      <StudentAcademicProfileModal
        isOpen={isStudentProfileOpen}
        onClose={() => setIsStudentProfileOpen(false)}
        student={selectedStudentForProfile}
        onNotifyParent={handleNotifyParentFromProfile}
      />
    </div>
  );
};
