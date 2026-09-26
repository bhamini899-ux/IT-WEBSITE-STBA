import React, { useState } from 'react';
import { 
  Calendar, 
  HeartHandshake, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Megaphone,
  Bell,
  Sun,
  FileText
} from 'lucide-react';
import { ParentPTMItem, SchoolEventItem, ChildProfile } from '../../types/parentConnect';

interface ParentPTMEventsSectionProps {
  child: ChildProfile;
  ptmList: ParentPTMItem[];
  eventsList: SchoolEventItem[];
  onConfirmPTM: (ptmId: string) => void;
}

export const ParentPTMEventsSection: React.FC<ParentPTMEventsSectionProps> = ({
  child,
  ptmList,
  eventsList,
  onConfirmPTM,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ptm' | 'events' | 'exams' | 'holidays'>('ptm');

  const upcomingExams = [
    { subject: 'Science (Physics & Chemistry)', date: '12 Oct 2026', time: '09:00 - 12:00 PM', room: 'Hall A' },
    { subject: 'Mathematics (Standard & Basic)', date: '15 Oct 2026', time: '09:00 - 12:00 PM', room: 'Hall A' },
    { subject: 'Social Science', date: '18 Oct 2026', time: '09:00 - 12:00 PM', room: 'Hall A' },
    { subject: 'English Communicative', date: '21 Oct 2026', time: '09:00 - 12:00 PM', room: 'Hall A' },
    { subject: 'Computer Science & AI', date: '23 Oct 2026', time: '09:00 - 11:30 AM', room: 'Lab 2' }
  ];

  const holidayList = [
    { name: 'Institutional Founder Day', date: '25 Sep 2026', day: 'Friday', type: 'School Holiday' },
    { name: 'Gandhi Jayanti', date: '02 Oct 2026', day: 'Friday', type: 'National Holiday' },
    { name: 'Diwali Festive Break', date: '24 Oct - 01 Nov 2026', day: '10 Days', type: 'Vacation Period' },
    { name: 'Guru Nanak Jayanti', date: '15 Nov 2026', day: 'Sunday', type: 'Gazetted Holiday' },
    { name: 'Winter Break', date: '25 Dec 2026 - 05 Jan 2027', day: '12 Days', type: 'Winter Vacation' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              PTM, School Calendar & Events
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Academic Session 2026-27
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Teacher consultation slots, inter-school championships, CBSE examination schedules, and institutional breaks
          </p>
        </div>

        {/* Sub-tab Pill Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('ptm')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'ptm'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            PTM Conferences
          </button>
          <button
            onClick={() => setActiveSubTab('events')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'events'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            School Events
          </button>
          <button
            onClick={() => setActiveSubTab('exams')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'exams'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Exam Dates
          </button>
          <button
            onClick={() => setActiveSubTab('holidays')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'holidays'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Holidays
          </button>
        </div>
      </div>

      {/* PTM Conferences Tab */}
      {activeSubTab === 'ptm' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HeartHandshake className="w-5 h-5 text-blue-600" />
              <div>
                <strong className="text-xs text-blue-950 dark:text-blue-200 block">
                  Mid-Term Parent-Teacher Conference: Saturday, 19 Sep 2026
                </strong>
                <span className="text-[11px] text-blue-700 dark:text-blue-400">
                  Venue: Seth Tolaram Bafna Academy Senior Wing • Allocated individual slots
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              RSVP Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ptmList.map((ptm) => (
              <div
                key={ptm.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {ptm.timeSlot}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                      {ptm.title}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                    {ptm.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold">{ptm.teacherName}</span>
                    <span className="text-slate-400">({ptm.teacherDesignation})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Venue: <strong>{ptm.roomNumber}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date: {ptm.date}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-200 block text-[11px] mb-0.5">Conference Agenda:</strong>
                  <p>{ptm.agenda}</p>
                </div>

                {ptm.notes && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ {ptm.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* School Events Tab */}
      {activeSubTab === 'events' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventsList.map((evt) => (
              <div
                key={evt.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {evt.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{evt.forClasses}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {evt.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {evt.date} • {evt.time}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {evt.venue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Dates Tab */}
      {activeSubTab === 'exams' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                CBSE Term 1 Final Examinations Timetable
              </h4>
              <p className="text-xs text-slate-500">Commencing October 2026 • Reporting time: 08:30 AM</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {upcomingExams.map((exam, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {exam.subject}
                  </span>
                  <div className="text-slate-500 text-[11px] flex items-center gap-2">
                    <span>Venue: {exam.room}</span>
                    <span>•</span>
                    <span>Timing: {exam.time}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold font-mono">
                    {exam.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holidays Tab */}
      {activeSubTab === 'holidays' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Institutional Holidays & Semester Breaks
          </h4>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {holidayList.map((hol, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">
                    {hol.name}
                  </span>
                  <span className="text-[11px] text-slate-400">{hol.type} • {hol.day}</span>
                </div>

                <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-bold font-mono">
                  {hol.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
