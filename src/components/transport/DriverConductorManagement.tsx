import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Bus as BusIcon, 
  Route as RouteIcon, 
  Shield, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Star, 
  Filter, 
  SlidersHorizontal,
  Edit2,
  X
} from 'lucide-react';
import { DriverConductorProfile, DetailedBus } from '../../types/transportManagement';

interface DriverConductorManagementProps {
  staffList: DriverConductorProfile[];
  buses: DetailedBus[];
  onToggleDutyStatus: (staffId: string) => void;
  onReassignStaff: (staffId: string, newBusId: string, newBusNumber: string) => void;
}

export const DriverConductorManagement: React.FC<DriverConductorManagementProps> = ({
  staffList,
  buses,
  onToggleDutyStatus,
  onReassignStaff
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [reassignModalStaff, setReassignModalStaff] = useState<DriverConductorProfile | null>(null);

  const filteredStaff = staffList.filter(s => {
    if (roleFilter === 'All') return true;
    return s.role === roleFilter;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Crew & Staff Directory</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Professional drivers and conductors operating academy routes with license verifications and duty status.
          </p>
        </div>

        {/* ROLE FILTER */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {['All', 'Driver', 'Conductor'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                roleFilter === role
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {role}s ({staffList.filter(s => role === 'All' ? true : s.role === role).length})
            </button>
          ))}
        </div>
      </div>

      {/* STAFF CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* TOP ROW: PHOTO, NAME & DUTY BADGE */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
                  />
                  <div>
                    <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {staff.name}
                      <span className="text-[11px] font-normal px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                        {staff.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      ID: {staff.employeeId} • Blood: {staff.bloodGroup}
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  staff.dutyStatus === 'On Duty' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200' :
                  staff.dutyStatus === 'On Leave' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {staff.dutyStatus}
                </span>
              </div>

              {/* STATS & METRICS */}
              <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Exp</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{staff.experienceYears} Yrs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Trips Today</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{staff.tripsCompletedToday} Runs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Rating</span>
                  <span className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500" />
                    {staff.rating}
                  </span>
                </div>
              </div>

              {/* BUS & ROUTE ASSIGNMENT */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned Bus:</span>
                  <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                    {staff.assignedBusNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned Route:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                    {staff.assignedRouteName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">License No:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{staff.licenseNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">License Expiry:</span>
                  <span className="text-slate-700 dark:text-slate-300">{staff.licenseExpiry}</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => onToggleDutyStatus(staff.id)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                Toggle Status
              </button>
              <button
                onClick={() => setReassignModalStaff(staff)}
                className="py-1.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reassign Bus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REASSIGN STAFF MODAL */}
      {reassignModalStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reassign Crew Assignment
              </h3>
              <button
                onClick={() => setReassignModalStaff(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-500 space-y-3">
              <div>
                Reassigning <strong>{reassignModalStaff.name}</strong> ({reassignModalStaff.role})
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Select Bus from Academy Fleet:
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {buses.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onReassignStaff(reassignModalStaff.id, b.id, b.busNumber);
                        setReassignModalStaff(null);
                      }}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{b.busNumber}</div>
                        <div className="text-[11px] text-slate-400">{b.routeName}</div>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600">Assign &rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setReassignModalStaff(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
