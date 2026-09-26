import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  CalendarCheck, 
  RotateCw, 
  Filter, 
  Search, 
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';
import { PTMAppointment } from '../../types';
import { INITIAL_PTM_APPOINTMENTS, PARENT_360_STATS } from '../../data/parentData';

interface PTMManagementCenterProps {
  onInspectParentByName?: (parentName: string) => void;
}

export const PTMManagementCenter: React.FC<PTMManagementCenterProps> = ({
  onInspectParentByName,
}) => {
  const [ptms, setPtms] = useState<PTMAppointment[]>(INITIAL_PTM_APPOINTMENTS);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [rescheduleModalItem, setRescheduleModalItem] = useState<PTMAppointment | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState('11:45 AM');
  const [viewDetailItem, setViewDetailItem] = useState<PTMAppointment | null>(null);

  const confirmedCount = ptms.filter(p => p.status === 'Confirmed').length;
  const pendingCount = ptms.filter(p => p.status === 'Pending').length;
  const declinedCount = ptms.filter(p => p.status === 'Declined').length;
  const completedCount = ptms.filter(p => p.status === 'Completed').length;

  const handleConfirm = (id: string) => {
    setPtms(prev => prev.map(p => p.id === id ? { ...p, status: 'Confirmed' as const } : p));
  };

  const handleExecuteReschedule = () => {
    if (!rescheduleModalItem) return;
    setPtms(prev => prev.map(p => p.id === rescheduleModalItem.id ? { ...p, time: newTimeSlot, status: 'Confirmed' as const } : p));
    setRescheduleModalItem(null);
  };

  const filteredPtms = ptms.filter(p => {
    if (selectedStatusFilter !== 'all' && p.status !== selectedStatusFilter) return false;
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Parent-Teacher Meeting (PTM) Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Term 1 Academic Consultations — Saturday, 22 September 2026.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {['all', 'Confirmed', 'Pending', 'Declined', 'Completed'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* PTM Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
          <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">Total Invitations</span>
          <div className="text-lg sm:text-xl font-bold text-purple-900 dark:text-purple-100 mt-0.5">{ptms.length}</div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">Confirmed</span>
          <div className="text-lg sm:text-xl font-bold text-emerald-900 dark:text-emerald-100 mt-0.5">{confirmedCount}</div>
        </div>
        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">Pending RSVP</span>
          <div className="text-lg sm:text-xl font-bold text-amber-900 dark:text-amber-100 mt-0.5">{pendingCount}</div>
        </div>
        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
          <span className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold">Declined / Reschedule</span>
          <div className="text-lg sm:text-xl font-bold text-rose-900 dark:text-rose-100 mt-0.5">{declinedCount}</div>
        </div>
        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold">Completed</span>
          <div className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100 mt-0.5">{completedCount}</div>
        </div>
      </div>

      {/* Parent Responses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPtms.map((ptm) => (
          <div
            key={ptm.id}
            id={`ptm-card-${ptm.id}`}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {ptm.parentName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Student: <strong className="text-slate-700 dark:text-slate-200">{ptm.studentName}</strong> — Class <span className="font-semibold text-blue-600">{ptm.className}</span>
                </p>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                ptm.status === 'Confirmed'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : ptm.status === 'Pending'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                  : ptm.status === 'Completed'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
              }`}>
                {ptm.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Faculty Member</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">{ptm.teacherName}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Consultation Slot</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{ptm.date} • {ptm.time}</p>
              </div>
            </div>

            {/* Useful Action Buttons: View, Confirm, Reschedule */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setViewDetailItem(ptm)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>

              <div className="flex items-center gap-2">
                {ptm.status !== 'Confirmed' && ptm.status !== 'Completed' && (
                  <button
                    onClick={() => handleConfirm(ptm.id)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Confirm</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setRescheduleModalItem(ptm);
                    setNewTimeSlot('11:45 AM');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Reschedule</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Reschedule PTM Appointment
            </h3>
            <p className="text-xs text-slate-500">
              Select an alternative open slot for <strong>{rescheduleModalItem.parentName}</strong> ({rescheduleModalItem.studentName}).
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Available Time Slots</label>
              <select
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="11:30 AM">11:30 AM – 11:45 AM</option>
                <option value="11:45 AM">11:45 AM – 12:00 PM</option>
                <option value="01:15 PM">01:15 PM – 01:30 PM</option>
                <option value="02:00 PM">02:00 PM – 02:15 PM</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setRescheduleModalItem(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReschedule}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs"
              >
                Save & Notify Parent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              PTM Session Details
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Parent Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewDetailItem.parentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Student & Class:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewDetailItem.studentName} ({viewDetailItem.className})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Assigned Teacher:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewDetailItem.teacherName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Venue:</span>
                <span className="text-slate-800 dark:text-slate-200">{viewDetailItem.room}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{viewDetailItem.date} at {viewDetailItem.time}</span>
              </div>
              {viewDetailItem.notes && (
                <div className="py-1">
                  <span className="text-slate-500 block mb-1">Parent Notes:</span>
                  <p className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 italic">{viewDetailItem.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewDetailItem(null)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
