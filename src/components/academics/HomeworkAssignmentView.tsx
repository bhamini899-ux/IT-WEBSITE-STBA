import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Search, 
  Filter,
  CheckCircle2,
  Users
} from 'lucide-react';
import { HomeworkAssignment } from '../../types';
import { INITIAL_ASSIGNMENTS } from '../../data/academicData';
import { CreateAssignmentModal } from './CreateAssignmentModal';

export const HomeworkAssignmentView: React.FC = () => {
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(INITIAL_ASSIGNMENTS);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSubmissionModal, setActiveSubmissionModal] = useState<HomeworkAssignment | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateAssignment = (newAssignment: HomeworkAssignment) => {
    setAssignments(prev => [newAssignment, ...prev]);
    showToast('✓ Assignment created successfully');
  };

  const filteredAssignments = assignments.filter(hw => {
    const matchesClass = selectedClass === 'all' || hw.className === selectedClass;
    const matchesStatus = selectedStatus === 'all' || hw.status === selectedStatus;
    const teacherStr = hw.teacherName || hw.teacher || '';
    const matchesSearch = hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hw.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          teacherStr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesStatus && matchesSearch;
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

      {/* Top Controls Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Homework & Assignment Center
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time coursework tracking, submission monitoring and digital homework dispatch
          </p>
        </div>

        <button
          id="btn-open-create-assignment"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {['all', 'Active', 'Due Today', 'Completed', 'Overdue'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? `All (${assignments.length})` : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignment or subject..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="all">All Classes</option>
            {['8-A', '8-B', '9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Assignment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssignments.map((hw) => {
          const isOverdue = hw.status === 'Overdue';
          const isDueToday = hw.status === 'Due Today';
          const isCompleted = hw.status === 'Completed';

          return (
            <div
              key={hw.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-xs">
                    Class {hw.className} • {hw.subject}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isOverdue 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                      : isDueToday 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {hw.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2.5 line-clamp-2">
                  {hw.title}
                </h4>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {hw.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Submissions</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {hw.totalSubmissions} / {hw.totalStudents} ({hw.submissionRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        hw.submissionRate >= 80 ? 'bg-emerald-500' : hw.submissionRate >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${hw.submissionRate}%` }}
                    />
                  </div>
                </div>

                {/* Meta details */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Faculty:</span>
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200">{hw.teacherName || hw.teacher}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due Date:</span>
                    </span>
                    <span className={`font-semibold ${isDueToday ? 'text-amber-600' : isOverdue ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                      {hw.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Assigned: {hw.assignedDate}</span>
                <button
                  id={`btn-view-submissions-${hw.id}`}
                  onClick={() => setActiveSubmissionModal(hw)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  View Submissions →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submissions Modal */}
      {activeSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Class {activeSubmissionModal.className} • {activeSubmissionModal.subject}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Submission Log: {activeSubmissionModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSubmissionModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs flex justify-between">
                <span>Submitted: <strong className="text-slate-900 dark:text-white">{activeSubmissionModal.totalSubmissions} students</strong></span>
                <span>Pending: <strong className="text-rose-600">{activeSubmissionModal.totalStudents - activeSubmissionModal.totalSubmissions} students</strong></span>
              </div>
              <p className="text-xs text-slate-500">
                Coursework submissions are synced with Student 360° and will notify parents of pending work via Parent 360°.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveSubmissionModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateAssignment}
      />
    </div>
  );
};
