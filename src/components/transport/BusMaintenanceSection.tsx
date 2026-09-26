import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Plus, 
  X, 
  DollarSign,
  Bus as BusIcon
} from 'lucide-react';
import { BusMaintenanceRecord, DetailedBus } from '../../types/transportManagement';

interface BusMaintenanceSectionProps {
  maintenanceRecords: BusMaintenanceRecord[];
  buses: DetailedBus[];
  onAddMaintenanceRecord: (rec: BusMaintenanceRecord) => void;
  onUpdateIssueStatus: (recordId: string, status: 'Open' | 'In Progress' | 'Resolved') => void;
}

export const BusMaintenanceSection: React.FC<BusMaintenanceSectionProps> = ({
  maintenanceRecords,
  buses,
  onAddMaintenanceRecord,
  onUpdateIssueStatus
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newBusNumber, setNewBusNumber] = useState<string>(buses[0]?.busNumber || 'Bus 01');
  const [newServiceType, setNewServiceType] = useState<string>('Preventive Maintenance');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCost, setNewCost] = useState<number>(4500);
  const [newNextDue, setNewNextDue] = useState<string>('2026-11-20');

  const fitCount = buses.filter(b => b.operationalStatus !== 'Issue' && b.operationalStatus !== 'Inactive').length;
  const underRepairCount = buses.filter(b => b.operationalStatus === 'Issue').length;
  const scheduledCount = buses.filter(b => b.operationalStatus === 'Inactive').length + 1;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBus = buses.find(b => b.busNumber === newBusNumber);
    const newRecord: BusMaintenanceRecord = {
      id: `maint-${Date.now()}`,
      busId: targetBus?.id || 'bus-1',
      busNumber: newBusNumber,
      serviceDate: new Date().toISOString().split('T')[0],
      serviceType: newServiceType,
      odometerReading: targetBus?.odometerKm || 45000,
      costInr: Number(newCost),
      technicianNotes: newDesc || 'Routine scheduled inspection and replacement.',
      nextServiceDue: newNextDue,
      status: 'Resolved'
    };
    onAddMaintenanceRecord(newRecord);
    setShowAddModal(false);
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Fleet Fitness & Maintenance Records</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Automotive maintenance logbook, scheduled oil/brake overhauls, and statutory RTO fitness compliance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Maintenance Entry</span>
        </button>
      </div>

      {/* THREE HEALTH CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Fleet Fit & Roadworthy</span>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">{fitCount} Buses</div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">RTO inspection certified</span>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Scheduled Service Due</span>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">{scheduledCount} Buses</div>
            <span className="text-[11px] text-amber-700 dark:text-amber-400">Within next 30 days</span>
          </div>
          <Clock className="w-8 h-8 text-amber-500" />
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">Currently in Workshop</span>
            <div className="text-2xl font-bold text-rose-900 dark:text-rose-100 mt-1">{underRepairCount} Bus</div>
            <span className="text-[11px] text-rose-700 dark:text-rose-400">Alternator & Belt repair</span>
          </div>
          <Wrench className="w-8 h-8 text-rose-500" />
        </div>
      </div>

      {/* SERVICE HISTORY TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Service Logbook & Workshop History</h3>
          <span className="text-xs text-slate-400">{maintenanceRecords.length} Historical Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Bus</th>
                <th className="py-3 px-4">Service Date</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Odometer</th>
                <th className="py-3 px-4">Technician Notes</th>
                <th className="py-3 px-4">Cost (INR)</th>
                <th className="py-3 px-4">Next Due</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {maintenanceRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {rec.busNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {rec.serviceDate}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {rec.serviceType}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {(rec.odometerReading ?? rec.odometerKm ?? 0).toLocaleString()} KM
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[260px] truncate">
                    {rec.technicianNotes || 'Routine inspection and checkup'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    ₹{(rec.costInr ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                    {rec.nextServiceDue}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      rec.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      rec.status === 'In Progress' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD LOG MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Log New Maintenance Event
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Bus</label>
                <select
                  value={newBusNumber}
                  onChange={(e) => setNewBusNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                >
                  {buses.map(b => (
                    <option key={b.id} value={b.busNumber}>{b.busNumber} ({b.registrationPlate})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Service Classification</label>
                <select
                  value={newServiceType}
                  onChange={(e) => setNewServiceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="Preventive Maintenance">Preventive Maintenance (Oil / Filters)</option>
                  <option value="Brake & Clutch Overhaul">Brake & Clutch Overhaul</option>
                  <option value="Tyre Rotation & Alignment">Tyre Rotation & Alignment</option>
                  <option value="Electrical & Speed Governor">Electrical & Speed Governor</option>
                  <option value="RTO Fitness Certification">RTO Fitness Certification</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Invoice Amount (INR)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Next Due Date</label>
                  <input
                    type="date"
                    value={newNextDue}
                    onChange={(e) => setNewNextDue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mechanic / Workshop Notes</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details of parts serviced, oil grade used, authorized workshop name..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
