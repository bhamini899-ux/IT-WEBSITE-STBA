import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  Download, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TransportBoardingRecord, DetailedBus } from '../../types/transportManagement';

interface TransportAttendanceSectionProps {
  records: TransportBoardingRecord[];
  buses: DetailedBus[];
}

export const TransportAttendanceSection: React.FC<TransportAttendanceSectionProps> = ({
  records,
  buses
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-18');
  const [busFilter, setBusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalAssigned = 386; // total fleet capacity load across 10 buses
  const presentCount = records.filter(r => r.status === 'Boarded' || r.status === 'Reached School').length;
  const absentCount = records.filter(r => r.status === 'Not Boarded').length;
  const exceptionCount = records.filter(r => r.status === 'Exception').length;
  const attendanceRate = Math.round((presentCount / (presentCount + absentCount || 1)) * 100);

  const filteredRecords = records.filter(rec => {
    const matchesBus = busFilter === 'All' || rec.busNumber === busFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.stopName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Transit Attendance Audit</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Consolidated morning and afternoon student ridership records with RFID boarding logs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          />
        </div>
      </div>

      {/* METRIC STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Enrolled Riders</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalAssigned}
          </div>
          <span className="text-[11px] text-slate-400">10 Routes active</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Boarded / Present</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {presentCount}
          </div>
          <span className="text-[11px] text-slate-400">{attendanceRate}% turnout rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Absent from Transit</span>
          <div className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">
            {absentCount}
          </div>
          <span className="text-[11px] text-slate-400">Self-commute / Parent pick</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Exceptions Logged</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {exceptionCount}
          </div>
          <span className="text-[11px] text-slate-400">Parent verification required</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or stop..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={busFilter}
          onChange={(e) => setBusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <option value="All">All Buses ({buses.length})</option>
          {buses.map(b => (
            <option key={b.id} value={b.busNumber}>{b.busNumber}</option>
          ))}
        </select>
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Bus</th>
                <th className="py-3 px-4">Pickup Point</th>
                <th className="py-3 px-4">Board Time</th>
                <th className="py-3 px-4">School Reach Time</th>
                <th className="py-3 px-4">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {rec.studentName}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {rec.className}-{rec.section}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {rec.busNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {rec.stopName}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {rec.boardingTime || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {rec.exitTime || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      rec.status === 'Reached School' || rec.status === 'Boarded'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : rec.status === 'Not Boarded'
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {rec.status === 'Reached School' || rec.status === 'Boarded' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span>{rec.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
