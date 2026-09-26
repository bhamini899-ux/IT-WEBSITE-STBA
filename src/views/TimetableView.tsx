import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Printer, 
  Search, 
  Filter, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  Users, 
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Trash2
} from 'lucide-react';
import { 
  TimetableSlot, 
  Teacher, 
  TimetableConflict, 
  TimetableDay, 
  SubstitutionRecord,
  AppSection 
} from '../types';
import { TIMETABLE_PERIODS } from '../data/teacherData';
import { detectTimetableConflicts, autoResolveConflict } from '../utils/timetableEngine';
import { SubstitutionCenter } from '../components/Timetable/SubstitutionCenter';
import { ConflictResolutionModal } from '../components/Timetable/ConflictResolutionModal';
import { AddEditSlotModal } from '../components/Timetable/AddEditSlotModal';
import { DeleteSlotConfirmModal } from '../components/Timetable/DeleteSlotConfirmModal';

interface TimetableViewProps {
  timetableSlots: TimetableSlot[];
  teachers: Teacher[];
  substitutions: SubstitutionRecord[];
  onUpdateSlot: (updatedSlot: TimetableSlot) => void;
  onAddSlot: (newSlot: Omit<TimetableSlot, 'id'>) => void;
  onDeleteSlot?: (slotId: string) => void;
  onAssignSubstitute: (subId: string, teacherId: string, teacherName: string) => void;
  onNavigate: (section: AppSection) => void;
}

export const TimetableView: React.FC<TimetableViewProps> = ({
  timetableSlots,
  teachers,
  substitutions,
  onUpdateSlot,
  onAddSlot,
  onDeleteSlot,
  onAssignSubstitute,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'class' | 'teacher' | 'room' | 'substitutions'>('class');
  const [selectedDay, setSelectedDay] = useState<TimetableDay>('Monday');
  const [selectedClass, setSelectedClass] = useState<string>('10-B');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [selectedRoom, setSelectedRoom] = useState<string>('Room 204');

  // Conflict modal state
  const [selectedConflict, setSelectedConflict] = useState<TimetableConflict | null>(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

  // Add/edit slot modal
  const [slotToEdit, setSlotToEdit] = useState<TimetableSlot | null>(null);
  const [isAddEditSlotOpen, setIsAddEditSlotOpen] = useState(false);

  // Delete slot confirmation modal
  const [slotToDelete, setSlotToDelete] = useState<TimetableSlot | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const daysList: TimetableDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const classList = ['10-A', '10-B', '10-C', '10-D', '10-E'];
  const roomsList = ['Room 101', 'Room 102', 'Room 203', 'Room 204', 'Room 205', 'Room 301', 'Room 302', 'Physics Lab', 'Chemistry Lab', 'Computer & AI Lab'];

  // Detect conflicts live from timetableEngine
  const activeConflicts = useMemo(() => {
    return detectTimetableConflicts(timetableSlots, teachers);
  }, [timetableSlots, teachers]);

  // Filter slots for current view mode
  const currentSlots = useMemo(() => {
    return timetableSlots.filter(s => {
      const matchDay = s.day === selectedDay;
      if (!matchDay) return false;

      if (activeTab === 'class') {
        return s.className === selectedClass;
      }
      if (activeTab === 'teacher') {
        return s.teacherId === selectedTeacherId || s.substituteTeacherId === selectedTeacherId;
      }
      if (activeTab === 'room') {
        return s.room.toLowerCase().includes(selectedRoom.toLowerCase());
      }
      return true;
    });
  }, [timetableSlots, activeTab, selectedDay, selectedClass, selectedTeacherId, selectedRoom]);

  const handlePrintTimetable = () => {
    window.print();
  };

  const handleAutoResolve = (conflict: TimetableConflict) => {
    const resolvedSlot = autoResolveConflict(conflict, timetableSlots);
    if (resolvedSlot) {
      onUpdateSlot(resolvedSlot);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800">
              Module 3 • Timetable & Substitution Engine
            </span>
            <span className="text-xs text-slate-400">Seth Tolaram Bafna Academy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Smart School Timetable & Scheduling
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated conflict detection, real-time period coverage, and multi-dimensional class, faculty & room views.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSlotToEdit(null);
              setIsAddEditSlotOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slot</span>
          </button>

          <button
            onClick={handlePrintTimetable}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Live Conflict Warning Bar */}
      {activeConflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-rose-900 dark:text-rose-200">
                {activeConflicts.length} Timetable Scheduling Conflict{activeConflicts.length > 1 ? 's' : ''} Detected
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                {activeConflicts[0].description}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedConflict(activeConflicts[0]);
              setIsConflictModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inspect & Auto-Resolve</span>
          </button>
        </div>
      )}

      {/* View Mode Switcher + Days Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Main View Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('class')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'class'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Class Timetable
            </button>
            <button
              onClick={() => setActiveTab('teacher')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'teacher'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Faculty Schedule
            </button>
            <button
              onClick={() => setActiveTab('room')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'room'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Room / Lab Schedule
            </button>
            <button
              onClick={() => setActiveTab('substitutions')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'substitutions'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Substitution Center ({substitutions.filter(s => s.status === 'Pending').length})</span>
            </button>
          </div>

          {/* Contextual Filters based on activeTab */}
          {activeTab !== 'substitutions' && (
            <div className="flex flex-wrap items-center gap-2">
              {activeTab === 'class' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Select Class:</span>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {classList.map(c => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'teacher' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Select Faculty:</span>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white max-w-[220px]"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'room' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Select Room:</span>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {roomsList.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Day Selector Chips (when not in substitution center) */}
        {activeTab !== 'substitutions' && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
            {daysList.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'substitutions' ? (
        <SubstitutionCenter
          substitutions={substitutions}
          teachers={teachers}
          onAssignSubstitute={onAssignSubstitute}
          onOpenTimetableSlot={(slotId) => {
            const slot = timetableSlots.find(s => s.id === slotId);
            if (slot) {
              setSlotToEdit(slot);
              setIsAddEditSlotOpen(true);
            }
          }}
        />
      ) : (
        /* Period Slots Grid (Periods 1 - 8 + Break Intervals) */
        <div className="space-y-3">
          {/* Active Period Indicator Bar */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <span className="font-bold text-blue-900 dark:text-blue-200">
                Current Live Period: Period 3 (09:30 AM - 10:15 AM)
              </span>
            </div>
            <span className="text-slate-500 text-[11px] font-medium hidden sm:inline">
              Seth Tolaram Bafna Academy Bell Schedule
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {TIMETABLE_PERIODS.map(period => {
              const slot = currentSlots.find(s => s.periodNumber === period.number);
              const isCurrentPeriod = period.number === 3; // Live period 3

              return (
                <div
                  key={period.number}
                  onClick={() => {
                    if (slot) {
                      setSlotToEdit(slot);
                      setIsAddEditSlotOpen(true);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] ${
                    isCurrentPeriod
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-md ring-2 ring-blue-400/20'
                      : slot
                        ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-dashed border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Period Number and Time Range */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-black ${
                          isCurrentPeriod ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          Period {period.number}
                        </span>
                        {isCurrentPeriod && (
                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            • Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 font-mono">
                        {period.timeRange}
                      </span>
                    </div>

                    {/* Slot Details */}
                    {slot ? (
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {slot.subject}
                        </h4>

                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold">{slot.teacherName}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {slot.room}
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Class {slot.className}
                          </span>
                        </div>

                        {slot.isSubstituted && (
                          <div className="mt-2 p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                            🔄 Substituted by {slot.substituteTeacherName}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-xs font-semibold text-slate-400">Free / Study Period</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click to assign subject</p>
                      </div>
                    )}
                  </div>

                  {slot && (
                    <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlotToEdit(slot);
                          setIsAddEditSlotOpen(true);
                        }}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Edit Slot →
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSlotToDelete(slot);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="px-2 py-1 rounded-lg text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-900/50 transition-colors flex items-center gap-1 cursor-pointer"
                        title={`Delete Period ${period.number}`}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        conflict={selectedConflict}
        onAutoResolve={handleAutoResolve}
      />

      {/* Add / Edit Slot Modal */}
      <AddEditSlotModal
        isOpen={isAddEditSlotOpen}
        onClose={() => setIsAddEditSlotOpen(false)}
        slotToEdit={slotToEdit}
        teachers={teachers}
        existingSlots={timetableSlots}
        onSaveSlot={(slotData, id) => {
          if (id) {
            onUpdateSlot({ ...slotData, id });
          } else {
            onAddSlot(slotData);
          }
        }}
      />

      {/* Delete Slot Confirmation Modal */}
      <DeleteSlotConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setSlotToDelete(null);
        }}
        slot={slotToDelete}
        onConfirmDelete={(slotId) => {
          if (onDeleteSlot) {
            onDeleteSlot(slotId);
          }
          setIsDeleteConfirmOpen(false);
          setSlotToDelete(null);
        }}
      />
    </div>
  );
};
