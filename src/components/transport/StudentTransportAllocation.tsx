import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Bus as BusIcon, 
  Route as RouteIcon, 
  MapPin, 
  Clock, 
  Filter, 
  Edit3, 
  X, 
  CheckCircle2, 
  Phone,
  ArrowRight
} from 'lucide-react';
import { StudentTransportAllocation, DetailedBus, DetailedTransportRoute } from '../../types/transportManagement';

interface StudentTransportAllocationProps {
  allocations: StudentTransportAllocation[];
  buses: DetailedBus[];
  routes: DetailedTransportRoute[];
  onUpdateAllocation: (updated: StudentTransportAllocation) => void;
}

export const StudentTransportAllocationSection: React.FC<StudentTransportAllocationProps> = ({
  allocations,
  buses,
  routes,
  onUpdateAllocation
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [busFilter, setBusFilter] = useState<string>('All');
  const [routeFilter, setRouteFilter] = useState<string>('All');
  const [editingStudent, setEditingStudent] = useState<StudentTransportAllocation | null>(null);

  // Available classes & sections
  const classOptions = ['All', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const filteredAllocations = allocations.filter(alloc => {
    const matchesSearch = searchQuery.trim() === '' || 
      alloc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alloc.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alloc.assignedStopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alloc.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = classFilter === 'All' || alloc.className === classFilter;
    const matchesBus = busFilter === 'All' || alloc.assignedBusNumber === busFilter;
    const matchesRoute = routeFilter === 'All' || alloc.assignedRouteName.toLowerCase().includes(routeFilter.toLowerCase());

    return matchesSearch && matchesClass && matchesBus && matchesRoute;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdateAllocation(editingStudent);
      setEditingStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & SUMMARY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Transport Allocation Roster</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Assigned school bus, pickup waypoint and designated morning/afternoon schedules for enrolled students.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
          {filteredAllocations.length} Students Allocated
        </span>
      </div>

      {/* FILTER BAR: Search, Class, Bus, Route */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or parent..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          {classOptions.map(cls => (
            <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : cls}</option>
          ))}
        </select>

        <select
          value={busFilter}
          onChange={(e) => setBusFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <option value="All">All Buses ({buses.length})</option>
          {buses.map(b => (
            <option key={b.id} value={b.busNumber}>{b.busNumber} ({b.registrationPlate})</option>
          ))}
        </select>

        <select
          value={routeFilter}
          onChange={(e) => setRouteFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <option value="All">All Routes ({routes.length})</option>
          {routes.map(r => (
            <option key={r.routeId} value={r.routeName}>{r.routeNumber} - {r.routeName}</option>
          ))}
        </select>
      </div>

      {/* ROSTER TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class & Sec</th>
                <th className="py-3 px-4">Assigned Bus</th>
                <th className="py-3 px-4">Assigned Route</th>
                <th className="py-3 px-4">Pickup Stop</th>
                <th className="py-3 px-4">Times (Pick / Drop)</th>
                <th className="py-3 px-4">Parent Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredAllocations.map((alloc) => (
                <tr key={alloc.studentId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={alloc.avatar}
                        alt={alloc.studentName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{alloc.studentName}</div>
                        <div className="text-[11px] text-slate-400">{alloc.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {alloc.className}-{alloc.section}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {alloc.assignedBusNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                      {alloc.assignedRouteName}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{alloc.assignedStopName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">
                    <div className="text-emerald-600 font-semibold">{alloc.pickupTime}</div>
                    <div className="text-slate-400">{alloc.dropOffTime}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div>{alloc.parentName}</div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400">{alloc.parentPhone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      alloc.transportStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      alloc.transportStatus === 'On Leave' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {alloc.transportStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditingStudent(alloc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT REASSIGNMENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Transport Allocation
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Student</label>
                <input
                  disabled
                  value={`${editingStudent.studentName} (${editingStudent.className}-${editingStudent.section})`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assigned Bus</label>
                <select
                  value={editingStudent.assignedBusNumber}
                  onChange={(e) => {
                    const found = buses.find(b => b.busNumber === e.target.value);
                    setEditingStudent({
                      ...editingStudent,
                      assignedBusNumber: e.target.value,
                      assignedBusId: found?.id || editingStudent.assignedBusId
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer font-medium"
                >
                  {buses.map(b => (
                    <option key={b.id} value={b.busNumber}>{b.busNumber} ({b.driverName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assigned Stop Name</label>
                <input
                  type="text"
                  value={editingStudent.assignedStopName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, assignedStopName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Pickup Time</label>
                  <input
                    type="text"
                    value={editingStudent.pickupTime}
                    onChange={(e) => setEditingStudent({ ...editingStudent, pickupTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Drop-Off Time</label>
                  <input
                    type="text"
                    value={editingStudent.dropOffTime}
                    onChange={(e) => setEditingStudent({ ...editingStudent, dropOffTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Transport Status</label>
                <select
                  value={editingStudent.transportStatus}
                  onChange={(e) => setEditingStudent({ ...editingStudent, transportStatus: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
