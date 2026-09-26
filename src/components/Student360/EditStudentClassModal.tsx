import React, { useState, useEffect } from 'react';
import { X, Check, GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';
import { Student } from '../../types';

interface EditStudentClassModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
}

export const EditStudentClassModal: React.FC<EditStudentClassModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !student) return null;

  const [targetClass, setTargetClass] = useState('10');
  const [targetSection, setTargetSection] = useState('B');
  const [rollNo, setRollNo] = useState(student.rollNo?.toString() || '1');
  const [status, setStatus] = useState(student.status || 'Active');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (student) {
      // Parse current class and section
      const cName = student.className || '10';
      if (cName.includes('-')) {
        const parts = cName.split('-');
        setTargetClass(parts[0]);
        setTargetSection(parts[1]);
      } else {
        setTargetClass(cName);
        setTargetSection(student.section || 'B');
      }
      setRollNo(student.rollNo?.toString() || '1');
      setStatus(student.status || 'Active');
      setIsSaving(false);
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || isSaving) return;

    setIsSaving(true);
    const fullClassName = `${targetClass}-${targetSection}`;

    const updated: Student = {
      ...student,
      className: fullClassName,
      class: targetClass,
      section: targetSection,
      rollNo: parseInt(rollNo) || student.rollNo || 1,
      rollNumber: parseInt(rollNo) || student.rollNumber || 1,
      status: status as any
    };

    onSave(updated);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 300);
  };

  const currentFormatted = student.section 
    ? `${student.className}-${student.section}` 
    : student.className;
  const newFormatted = `${targetClass}-${targetSection}`;
  const isChanged = currentFormatted !== newFormatted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reassign Class & Section
              </h3>
              <p className="text-xs text-slate-500">
                {student.name} • ID: {student.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Class Transfer Comparison Strip */}
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Current Class</span>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{currentFormatted}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-500" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Target Class</span>
              <span className="font-bold text-sm text-blue-600 dark:text-blue-400">{newFormatted}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Class Grade
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                disabled
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-sm font-medium focus:outline-blue-500 cursor-not-allowed opacity-90"
              >
                <option value="10">Class 10 (Strict System Scope)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Section
              </label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
              >
                <option value="A">Section 10-A</option>
                <option value="B">Section 10-B</option>
                <option value="C">Section 10-C</option>
                <option value="D">Section 10-D</option>
                <option value="E">Section 10-E</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Roll Number
              </label>
              <input
                type="number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Enrollment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-blue-500"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Transferred">Transferred</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">System Data Consistency:</span> Reassigning this student immediately updates their portal timetable, homework, and exams. Teachers of their former section will no longer see this student in attendance or roll call.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 ${
                isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Update Class Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
