import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TimetableSlot, Teacher, TimetableDay } from '../../types';
import { TIMETABLE_PERIODS } from '../../data/teacherData';

interface AddEditSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotToEdit?: TimetableSlot | null;
  teachers: Teacher[];
  existingSlots: TimetableSlot[];
  onSaveSlot: (slot: Omit<TimetableSlot, 'id'>, slotId?: string) => void;
}

export const AddEditSlotModal: React.FC<AddEditSlotModalProps> = ({
  isOpen,
  onClose,
  slotToEdit,
  teachers,
  existingSlots,
  onSaveSlot
}) => {
  const [day, setDay] = useState<TimetableDay>(slotToEdit?.day || 'Monday');
  const [periodNumber, setPeriodNumber] = useState<number>(slotToEdit?.periodNumber || 1);
  const [className, setClassName] = useState<string>(slotToEdit?.className || '10-A');
  const [subject, setSubject] = useState<string>(slotToEdit?.subject || 'Mathematics');
  const [teacherId, setTeacherId] = useState<string>(slotToEdit?.teacherId || teachers[0]?.id || '');
  const [room, setRoom] = useState<string>(slotToEdit?.room || 'Room 204');

  if (!isOpen) return null;

  const selectedPeriod = TIMETABLE_PERIODS.find(p => p.number === periodNumber) || TIMETABLE_PERIODS[0];
  const selectedTeacher = teachers.find(t => t.id === teacherId) || teachers[0];

  // Conflict validation: check if teacher is booked in another class at this day & period
  const teacherConflictSlot = existingSlots.find(s => 
    s.id !== slotToEdit?.id && 
    s.day === day && 
    s.periodNumber === periodNumber && 
    s.teacherId === teacherId
  );

  // Room conflict: check if room is booked by another class
  const roomConflictSlot = existingSlots.find(s => 
    s.id !== slotToEdit?.id && 
    s.day === day && 
    s.periodNumber === periodNumber && 
    s.room.toLowerCase() === room.trim().toLowerCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSlot({
      day,
      periodNumber,
      timeRange: selectedPeriod.timeRange,
      className,
      subject,
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      room: room.trim(),
      isSubstituted: slotToEdit?.isSubstituted || false,
      substituteTeacherId: slotToEdit?.substituteTeacherId,
      substituteTeacherName: slotToEdit?.substituteTeacherName
    }, slotToEdit?.id);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {slotToEdit ? 'Edit Timetable Slot' : 'Add New Timetable Slot'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Seth Tolaram Bafna Academy Academic Schedule</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Day and Period */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Day of Week</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as TimetableDay)}
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Period & Timing</label>
              <select
                value={periodNumber}
                onChange={(e) => setPeriodNumber(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                {TIMETABLE_PERIODS.map(p => (
                  <option key={p.number} value={p.number}>
                    Period {p.number} ({p.timeRange})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class and Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Class & Section</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                {['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'].map(c => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          {/* Teacher and Room */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Assigned Faculty</label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Room / Facility</label>
              <input
                type="text"
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Room 204 or Physics Lab"
                className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          {/* Live Conflict Warnings */}
          {teacherConflictSlot && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Teacher Collision Warning:</strong> {selectedTeacher?.name || 'Faculty'} is already assigned to Class {teacherConflictSlot.className} ({teacherConflictSlot.subject}) during Period {periodNumber}.
              </div>
            </div>
          )}

          {roomConflictSlot && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Room Collision Warning:</strong> {room} is already occupied by Class {roomConflictSlot.className} ({roomConflictSlot.subject}) during Period {periodNumber}.
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              {slotToEdit ? 'Update Slot' : 'Create Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
