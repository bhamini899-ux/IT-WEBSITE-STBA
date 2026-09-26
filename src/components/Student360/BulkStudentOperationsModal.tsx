import React, { useState } from 'react';
import { X, SlidersHorizontal, Users, Send, CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import { Student, StudentHouse } from '../../types';

interface BulkStudentOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudentIds: string[];
  students: Student[];
  onApplyBulkUpdate: (updatedStudents: Partial<Student>[], actionSummary: string) => void;
}

export const BulkStudentOperationsModal: React.FC<BulkStudentOperationsModalProps> = ({
  isOpen,
  onClose,
  selectedStudentIds,
  students,
  onApplyBulkUpdate,
}) => {
  const [operationType, setOperationType] = useState<'house' | 'class' | 'message' | 'attendance'>('house');
  const [targetHouse, setTargetHouse] = useState<StudentHouse>('Agni');
  const [targetClass, setTargetClass] = useState('10-A');
  const [broadcastMessage, setBroadcastMessage] = useState('Dear Parents, please note that parent-teacher consultations are scheduled for this Saturday 9:00 AM.');
  const [attendanceStatus, setAttendanceStatus] = useState<'present' | 'late' | 'excused'>('present');
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const targetStudents = students.filter(s => selectedStudentIds.includes(s.id));
  const count = targetStudents.length > 0 ? targetStudents.length : students.length;
  const isOperatingOnAll = targetStudents.length === 0;

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const studentsToModify = isOperatingOnAll ? students : targetStudents;

    let updates: Partial<Student>[] = [];
    let summary = '';

    if (operationType === 'house') {
      updates = studentsToModify.map(s => ({
        id: s.id,
        house: targetHouse
      }));
      summary = `Assigned ${count} students to House ${targetHouse}`;
    } else if (operationType === 'class') {
      updates = studentsToModify.map(s => ({
        id: s.id,
        className: targetClass
      }));
      summary = `Reassigned ${count} students to Class ${targetClass}`;
    } else if (operationType === 'attendance') {
      updates = studentsToModify.map(s => ({
        id: s.id,
        todayStatus: attendanceStatus
      }));
      summary = `Updated ${count} students attendance to ${attendanceStatus}`;
    } else if (operationType === 'message') {
      updates = studentsToModify.map(s => ({
        id: s.id,
        communications: [
          ...(s.communications || []),
          {
            id: `COM-BULK-${Date.now()}`,
            date: 'Today',
            time: 'Just now',
            channel: 'SMS',
            recipient: s.guardianPhone,
            subject: 'School Broadcast',
            message: broadcastMessage,
            delivered: true,
            sentBy: 'Administration Desk'
          }
        ]
      }));
      summary = `Dispatched SMS broadcast to guardians of ${count} students`;
    }

    onApplyBulkUpdate(updates, summary);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-black">Bulk Student Operations Engine</h3>
              <p className="text-xs text-slate-400">
                Targeting {count} {count === 1 ? 'student' : 'students'} {isOperatingOnAll ? '(All visible)' : '(Selected)'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successNotice && (
          <div className="bg-emerald-600 text-white py-2 px-4 text-xs font-bold text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Bulk operation executed and synced across Smart School 360°</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Operation Selector Tabs */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Select Bulk Operation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'house', label: 'Assign House' },
                { id: 'class', label: 'Shift Class' },
                { id: 'attendance', label: 'Mark Attendance' },
                { id: 'message', label: 'Broadcast SMS' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setOperationType(tab.id as any)}
                  className={`py-2 px-2.5 rounded-lg font-bold border transition-colors cursor-pointer text-center ${
                    operationType === tab.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Operation Details */}
          {operationType === 'house' && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Target School House
              </label>
              <select
                value={targetHouse}
                onChange={(e) => setTargetHouse(e.target.value as StudentHouse)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="Agni">Agni House (Red)</option>
                <option value="Surya">Surya House (Gold)</option>
                <option value="Prithvi">Prithvi House (Green)</option>
                <option value="Vayu">Vayu House (Blue)</option>
                <option value="Trishul">Trishul House (Purple)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Will update house affiliations and rebalance house sports rosters immediately.
              </p>
            </div>
          )}

          {operationType === 'class' && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Target Class & Section
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="10-A">Class 10-A</option>
                <option value="10-B">Class 10-B</option>
                <option value="9-A">Class 9-A</option>
                <option value="9-B">Class 9-B</option>
                <option value="11-A">Class 11-A</option>
                <option value="12-A">Class 12-A</option>
                <option value="8-A">Class 8-A</option>
              </select>
            </div>
          )}

          {operationType === 'attendance' && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Set Today's Attendance Status
              </label>
              <select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="present">Mark Present (Turnstile RFID Verified)</option>
                <option value="late">Mark Late / Tardy Arrival</option>
                <option value="excused">Mark Sanctioned Leave / Excused</option>
              </select>
            </div>
          )}

          {operationType === 'message' && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Broadcast Text to Guardians
              </label>
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
              />
              <p className="text-[11px] text-slate-400">
                Will be delivered via school SMS Gateway to all {count} registered primary guardian phone numbers.
              </p>
            </div>
          )}

          {/* Target preview pill box */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sample Students Affected ({count}):
            </p>
            <div className="flex flex-wrap gap-1">
              {(targetStudents.length > 0 ? targetStudents : students).slice(0, 5).map(s => (
                <span key={s.id} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-medium border border-slate-200 dark:border-slate-600">
                  {s.name} ({s.className})
                </span>
              ))}
              {count > 5 && (
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                  +{count - 5} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecute}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Execute on {count} Students
          </button>
        </div>
      </div>
    </div>
  );
};
