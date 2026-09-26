import React, { useState } from 'react';
import { 
  Radio, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Bus as BusIcon, 
  Send, 
  Search, 
  Filter, 
  Sparkles,
  Smartphone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { TransportBoardingRecord } from '../../types/transportManagement';

interface BoardingExitTrackingProps {
  records: TransportBoardingRecord[];
  onSimulateRfidTap: (recordId: string) => void;
  onSendParentNotification: (studentName: string, event: string) => void;
}

export const BoardingExitTracking: React.FC<BoardingExitTrackingProps> = ({
  records,
  onSimulateRfidTap,
  onSendParentNotification
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchStudent, setSearchStudent] = useState<string>('');

  const filteredRecords = records.filter(record => {
    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    const matchesSearch = searchStudent.trim() === '' || 
      record.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      record.busNumber.toLowerCase().includes(searchStudent.toLowerCase()) ||
      record.stopName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      record.rfidCardId.toLowerCase().includes(searchStudent.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & RFID BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-5 border border-emerald-800/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Active RFID Conductor Tap Gateway</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            Student Boarding & Exit Telemetry
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Automated RFID transit card scans synchronized live with Seth Tolaram Bafna Academy attendance and Parent Connect alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-900/40 border border-emerald-700/50 p-3 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>Bi-directional sync enabled with <strong>Module 7: Parent Connect</strong></span>
        </div>
      </div>

      {/* FILTER BUTTONS & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'Boarded', 'Reached School', 'Awaiting Pickup', 'Not Boarded', 'Exception'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            placeholder="Filter by student, bus, RFID..."
            className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* RECORDS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Bus</th>
                <th className="py-3 px-4">Assigned Stop</th>
                <th className="py-3 px-4">Boarding Time</th>
                <th className="py-3 px-4">Exit Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">RFID Card</th>
                <th className="py-3 px-4 text-right">Simulate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{rec.studentName}</div>
                    <div className="text-[11px] text-slate-400">{rec.studentId}</div>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {rec.className}-{rec.section}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.busNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{rec.stopName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {rec.boardingTime ? (
                      <span className="text-emerald-600 dark:text-emerald-400">{rec.boardingTime}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">
                    {rec.exitTime ? (
                      <span className="text-sky-600 dark:text-sky-400">{rec.exitTime}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      rec.status === 'Boarded' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200' :
                      rec.status === 'Reached School' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200' :
                      rec.status === 'Awaiting Pickup' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200' :
                      rec.status === 'Not Boarded' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                      'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        rec.status === 'Boarded' ? 'bg-emerald-500' :
                        rec.status === 'Reached School' ? 'bg-sky-500' :
                        rec.status === 'Awaiting Pickup' ? 'bg-amber-500' :
                        rec.status === 'Not Boarded' ? 'bg-slate-400' : 'bg-rose-500'
                      }`} />
                      {rec.status}
                    </span>
                    {rec.exceptionReason && (
                      <div className="text-[10px] text-rose-500 mt-0.5 max-w-[150px] leading-tight">
                        {rec.exceptionReason}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {rec.rfidCardId}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSimulateRfidTap(rec.id)}
                        title="Simulate Card Tap by Conductor"
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Simulate Tap
                      </button>
                      <button
                        onClick={() => onSendParentNotification(rec.studentName, rec.status)}
                        title="Dispatch Parent Notice"
                        className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
