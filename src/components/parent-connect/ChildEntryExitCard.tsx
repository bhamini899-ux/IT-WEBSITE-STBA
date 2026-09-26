import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Radio, 
  RotateCcw, 
  Calendar, 
  UserCheck, 
  ArrowRight,
  LogOut,
  Sparkles,
  Info
} from 'lucide-react';
import { ChildEntryExitRecord, ChildProfile } from '../../types/parentConnect';

interface ChildEntryExitCardProps {
  child: ChildProfile;
  records: ChildEntryExitRecord[];
  onSimulateGateTap: () => void;
}

export const ChildEntryExitCard: React.FC<ChildEntryExitCardProps> = ({
  child,
  records,
  onSimulateGateTap,
}) => {
  const [filter, setFilter] = useState<'all' | 'normal' | 'late'>('all');
  const todayRecord = records[0];

  const filteredRecords = records.filter(r => {
    if (filter === 'normal') return r.status.includes('Normal');
    if (filter === 'late') return r.status.includes('Late');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Live Campus Ingress & Egress Status Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Campus Gate Telemetry & RFID Scanner
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated biometric gate sensors at Seth Tolaram Bafna Academy
                </p>
              </div>
            </div>

            {/* Interactive Simulation Button */}
            <button
              id="simulate-gate-tap-btn"
              onClick={onSimulateGateTap}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Gate Tap</span>
            </button>
          </div>

          {/* Dual Entry vs Exit Live Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* 🟢 Entry Status Card */}
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/30 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Child Entered School
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  {child.entryTimeToday || '07:48 AM'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Main Campus Gate 1 (RFID Scanner 01)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified by: Havildar R. S. Rathore (Head Security)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Smart Badge ID: {todayRecord?.rfidCardId || 'RFID-STU-1021-A'}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Safely Inside Campus
                </span>
              </div>
            </div>

            {/* 🔵 Exit Status Card */}
            <div className={`bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border relative ${
              child.exitTimeToday ? 'border-blue-500/40' : 'border-slate-700/60'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${child.exitTimeToday ? 'bg-blue-500' : 'bg-slate-500'}`}></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Child Dispersal / Exit
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-700">
                  {child.exitTimeToday || 'Expected 02:30 PM'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Dispersal Gate 2 (Bus Bay A & Parent Pickup)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Standard Shift Closes: 02:30 PM (Mon-Fri)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>
                    {child.exitTimeToday 
                      ? `Exited at ${child.exitTimeToday} via School Bus 01`
                      : 'Child is in active classroom learning; dispersal notice will broadcast automatically.'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Gate Security:</span>
                <span className="font-semibold text-blue-300">
                  {child.exitTimeToday ? 'Dispersal Logged & Cleared' : 'In Session • Next Event: 02:30 PM'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Historical Gate Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Complete Entry & Exit History
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified daily gate records authenticated by campus security
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'all' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setFilter('normal')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'normal' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              On Time
            </button>
            <button
              onClick={() => setFilter('late')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'late' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Late Slips
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Date & Day</th>
                <th className="p-3.5">Entry Time</th>
                <th className="p-3.5">Exit Time</th>
                <th className="p-3.5">Gate / Scanner</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Security Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {record.date}
                    </div>
                    <div className="text-[11px] text-slate-400">{record.day}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{record.entryTime}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    {record.exitTime ? (
                      <div className="flex items-center gap-1.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span>{record.exitTime}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">In Session</span>
                    )}
                  </td>

                  <td className="p-3.5 text-slate-600 dark:text-slate-400">
                    <div>{record.entryGate}</div>
                    {record.exitGate && (
                      <div className="text-[11px] text-slate-400 mt-0.5">Exit: {record.exitGate}</div>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      record.status.includes('Late')
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">
                      {record.verifiedBy}
                    </div>
                    {record.notes && (
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs" title={record.notes}>
                        {record.notes}
                      </div>
                    )}
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
