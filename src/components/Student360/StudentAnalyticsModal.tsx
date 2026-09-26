import React from 'react';
import { X, BarChart3, Users, Bus, CreditCard, Award } from 'lucide-react';
import { Student } from '../../types';

interface StudentAnalyticsModalProps {
  students?: Student[];
  isOpen: boolean;
  onClose: () => void;
}

export const StudentAnalyticsModal: React.FC<StudentAnalyticsModalProps> = ({
  students = [],
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalEnrolled = students.length;
  const activeCount = students.filter(s => s.status === 'Active' || !s.status).length;
  const avgAttendance = totalEnrolled > 0 
    ? (students.reduce((acc, s) => acc + (s.attendancePercentage || 95), 0) / totalEnrolled).toFixed(1)
    : '0';
  const paidCount = students.filter(s => s.feeStatus === 'Paid' || !s.feeStatus).length;
  const feePct = totalEnrolled > 0 ? ((paidCount / totalEnrolled) * 100).toFixed(1) : '0';
  const busRiders = students.filter(s => s.transportRoute && s.transportRoute !== 'Private' && s.transportRoute !== 'Walk').length;
  const busPct = totalEnrolled > 0 ? ((busRiders / totalEnrolled) * 100).toFixed(1) : '0';
  const privateCommute = students.filter(s => s.transportRoute === 'Private').length;
  const walkers = students.filter(s => s.transportRoute === 'Walk').length;

  // Class distribution
  const classMap = new Map<string, { count: number; totalAtt: number }>();
  students.forEach(s => {
    const cls = s.className || 'General';
    const curr = classMap.get(cls) || { count: 0, totalAtt: 0 };
    curr.count += 1;
    curr.totalAtt += (s.attendancePercentage || 95);
    classMap.set(cls, curr);
  });
  const classDist = Array.from(classMap.entries()).map(([className, data]) => ({
    className,
    count: data.count,
    attendanceRate: (data.totalAtt / data.count).toFixed(1),
  })).sort((a, b) => b.count - a.count);

  const maxClassCount = Math.max(...classDist.map(c => c.count), 1);

  // House distribution
  const houseMap = new Map<string, number>();
  students.forEach(s => {
    if (s.house) {
      houseMap.set(s.house, (houseMap.get(s.house) || 0) + 1);
    }
  });
  const houseList = [
    { name: 'Agni House (Red)', key: 'Agni', color: 'bg-red-500' },
    { name: 'Surya House (Gold)', key: 'Surya', color: 'bg-amber-500' },
    { name: 'Prithvi House (Green)', key: 'Prithvi', color: 'bg-emerald-500' },
    { name: 'Vayu House (Blue)', key: 'Vayu', color: 'bg-blue-500' },
    { name: 'Trishul House (Purple)', key: 'Trishul', color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black">Student 360° Institutional Analytics</h3>
              <p className="text-[11px] text-slate-400">Total Enrolled Population: {totalEnrolled} Students</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50 text-xs">
          {/* Top Quick Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 text-[11px] font-semibold">Active Enrollment</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{activeCount}</p>
              <p className="text-[10px] text-slate-400">of {totalEnrolled} total students</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 text-[11px] font-semibold">Average School Attendance</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{avgAttendance}%</p>
              <p className="text-[10px] text-slate-400">Calculated from saved roster</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 text-[11px] font-semibold">Fee Realization Ratio</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">{feePct}%</p>
              <p className="text-[10px] text-slate-400">{paidCount} paid in full</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 text-[11px] font-semibold">Bus Fleet Commuters</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{busRiders}</p>
              <p className="text-[10px] text-slate-400">{busPct}% ridership</p>
            </div>
          </div>

          {/* Class-wise Enrollment Bar Visualization */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                Class-wise Enrollment & Attendance Rate
              </h4>
              <span className="text-[11px] text-slate-400">{classDist.length} active classes</span>
            </div>

            {classDist.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No student records added to display class distribution.</p>
            ) : (
              <div className="space-y-2 pt-2">
                {classDist.map((cd) => (
                  <div key={cd.className} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>Class {cd.className}</span>
                      <span className="text-slate-500">
                        {cd.count} students • <span className="text-emerald-600 font-bold">{cd.attendanceRate}% att.</span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(cd.count / maxClassCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Demographic & House Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* House Distribution */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                House Balance & Standing
              </h4>
              <div className="space-y-2 text-xs">
                {houseList.map((h, i) => {
                  const count = houseMap.get(h.key) || 0;
                  return (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${h.color}`} />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{h.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white">{count} students</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commute Mode Breakdown */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-blue-500" />
                Daily Transport & Commute Modes
              </h4>
              <div className="space-y-3 text-xs pt-1">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">School Bus Transport</span>
                    <span className="text-blue-600 font-bold">{busRiders} Students</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${totalEnrolled > 0 ? (busRiders / totalEnrolled) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Private Vehicle / Parent Drop</span>
                    <span className="text-amber-600 font-bold">{privateCommute} Students</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${totalEnrolled > 0 ? (privateCommute / totalEnrolled) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Self Commuter / Walking</span>
                    <span className="text-emerald-600 font-bold">{walkers} Students</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalEnrolled > 0 ? (walkers / totalEnrolled) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
