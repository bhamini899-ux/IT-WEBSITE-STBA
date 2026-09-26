import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building, 
  UserCheck, 
  Search, 
  Filter,
  CheckCircle
} from 'lucide-react';
import { ExaminationItem, ExamConflictItem } from '../../types';
import { ExamScheduleModal } from './ExamScheduleModal';
import { ExamConflictModal } from './ExamConflictModal';

interface ExaminationCenterProps {
  examinations: ExaminationItem[];
  conflicts: ExamConflictItem[];
  onAddExam: (exam: ExaminationItem) => void;
  onResolveConflict: (conflictId: string) => void;
  onReassignRoom: (conflictId: string) => void;
  onChangeTime: (conflictId: string) => void;
  onNavigateTab: (tabKey: string) => void;
}

export const ExaminationCenter: React.FC<ExaminationCenterProps> = ({
  examinations,
  conflicts,
  onAddExam,
  onResolveConflict,
  onReassignRoom,
  onChangeTime,
  onNavigateTab
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<'all' | 'Scheduled' | 'Ongoing' | 'Completed' | 'Results Published'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const roomsList = [
    'Examination Hall 1',
    'Examination Hall 2',
    'Room 102 (Block A)',
    'Room 110 (Block B)',
    'Room 201 (Block B)',
    'Room 204 (Science Block)',
    'Chemistry Lab',
    'AI & Robotics Lab 2',
    'Main Auditorium'
  ];

  const teachersList = [
    'Rajesh Verma',
    'Vikram Choudhary',
    'Meenakshi Sundaram',
    'Dr. Alok Sen',
    'Krishna Sharma',
    'Ankit Surana',
    'Priya Chhajer',
    'Ramesh Rathi',
    'Anita Jain',
    'Col. Jagdeep Singh (Retd.)'
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScheduleExam = (exam: ExaminationItem) => {
    onAddExam(exam);
    showToast(`✓ Examination scheduled successfully: ${exam.title} (${exam.className})`);
  };

  const filteredExams = examinations.filter((exam) => {
    const matchesStatus = activeStatusTab === 'all' || exam.status === activeStatusTab;
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.invigilator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Conflict Alert Banner if any conflicts exist */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {conflicts.length} Examination Scheduling Conflict{conflicts.length > 1 ? 's' : ''} Detected
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                {conflicts[0].description}
              </p>
            </div>
          </div>
          <button
            id="btn-open-conflict-inspector"
            onClick={() => setIsConflictModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <span>Inspect & Resolve Conflicts</span>
          </button>
        </div>
      )}

      {/* Action Header: Search, Status Filter & Schedule Exam Button */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { key: 'all', label: `All (${examinations.length})` },
            { key: 'Scheduled', label: 'Upcoming' },
            { key: 'Ongoing', label: 'Ongoing' },
            { key: 'Completed', label: 'Completed' },
            { key: 'Results Published', label: 'Results Published' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveStatusTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeStatusTab === tab.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Schedule Action */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam, class, room..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <button
            id="btn-schedule-exam-center"
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Exam</span>
          </button>
        </div>
      </div>

      {/* Examination Master Timetable Cards & Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-blue-600" />
              Examination Timetable & Duty Roster
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized seating allocations, invigilator schedules and real-time status
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {filteredExams.length} Examinations Shown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Examination</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Room / Hall</th>
                <th className="py-3 px-4">Invigilator</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Marks Entry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    <div>{exam.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Max: {exam.maxMarks} Marks • {exam.totalCandidates} Candidates</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-xs">
                      Class {exam.className}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {exam.subject}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    <div className="font-semibold">{exam.date}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{exam.startTime} – {exam.endTime}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.room}</span>
                    </div>
                    {exam.hasConflict && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-bold mt-0.5">
                        <AlertTriangle className="w-3 h-3" /> Capacity Alert
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium">{exam.invigilator}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      exam.status === 'Scheduled'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : exam.status === 'Ongoing'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                        : exam.status === 'Results Published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      id={`btn-manage-marks-${exam.id}`}
                      onClick={() => onNavigateTab('marks')}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                    >
                      Enter Marks →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ExamScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleExam}
        existingRooms={roomsList}
        existingTeachers={teachersList}
      />

      <ExamConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        conflicts={conflicts}
        onResolve={(id) => {
          onResolveConflict(id);
          showToast('✓ Conflict marked as resolved successfully.');
        }}
        onReassignRoom={(id) => {
          onReassignRoom(id);
          showToast('✓ Examination room reassigned to Examination Hall 2.');
        }}
        onChangeTime={(id) => {
          onChangeTime(id);
          showToast('✓ Examination slot shifted to avoid teacher overlap.');
        }}
      />
    </div>
  );
};
