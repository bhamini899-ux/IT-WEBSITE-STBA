import React, { useState } from 'react';
import { X, GraduationCap, Check, UserCheck, Trash2, Edit2, AlertCircle, Plus } from 'lucide-react';
import { getClass10Teachers, setClass10Teacher, removeClass10Teacher } from '../../services/classTeacherService';

interface ClassTeacherManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentsUpdated?: (assignments: Record<string, string>) => void;
}

export const ClassTeacherManagementModal: React.FC<ClassTeacherManagementModalProps> = ({
  isOpen,
  onClose,
  onAssignmentsUpdated,
}) => {
  const [teachersMap, setTeachersMap] = useState<Record<string, string>>(() => getClass10Teachers());
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [inputTeacherName, setInputTeacherName] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const suggestedTeachers = [
    'Natik Kothari',
    'Chitra Jain',
    'Krishna Sharma',
    'Sanwarlal Prajapat',
    'Bhuvnesh Sir',
    'Vikramaditya Rathore',
    'Pooja Agarwal',
    'Rajesh Sharma',
    'Amit Choudhary',
    'Deepa Mathur',
    'Manisha Pareek',
    'Not Assigned',
  ];

  if (!isOpen) return null;

  const sections = ['10-A', '10-B', '10-C', '10-D', '10-E'];

  const handleStartEdit = (sec: string) => {
    setEditingSection(sec);
    const curr = teachersMap[sec];
    setInputTeacherName(curr === 'Not Assigned' ? '' : curr);
    setIsSaving(false);
  };

  const handleSaveTeacher = (sec: string) => {
    if (isSaving) return;
    setIsSaving(true);
    const updated = setClass10Teacher(sec, inputTeacherName);
    setTeachersMap({ ...updated });
    setFeedback(`✓ Class Teacher for ${sec} updated to "${inputTeacherName || 'Not Assigned'}".`);
    
    setTimeout(() => {
      setIsSaving(false);
      setEditingSection(null);
      setInputTeacherName('');
      setTimeout(() => setFeedback(null), 3000);
      if (onAssignmentsUpdated) {
        onAssignmentsUpdated(updated);
      }
    }, 300);
  };

  const handleRemove = (sec: string) => {
    if (isSaving) return;
    const updated = removeClass10Teacher(sec);
    setTeachersMap({ ...updated });
    setFeedback(`✓ Teacher assignment for ${sec} set to 'Not Assigned'.`);
    setTimeout(() => setFeedback(null), 3000);
    if (onAssignmentsUpdated) {
      onAssignmentsUpdated(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Class Teacher Management</h2>
              <p className="text-xs text-slate-400">Manage official Class Teacher allocations for Class 10 sections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="mx-6 mt-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Table Content */}
        <div className="p-6 space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Class Teacher</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {sections.map((sec) => {
                  const teacher = teachersMap[sec] || 'Not Assigned';
                  const isAssigned = teacher !== 'Not Assigned';
                  const isEditing = editingSection === sec;

                  return (
                    <tr key={sec} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono">
                          {sec}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              list="teacher-suggestions"
                              value={inputTeacherName}
                              onChange={(e) => setInputTeacherName(e.target.value)}
                              placeholder="Select or enter teacher name..."
                              className="px-2.5 py-1 text-xs rounded-lg border border-blue-400 dark:border-blue-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden min-w-[200px]"
                              autoFocus
                            />
                            <datalist id="teacher-suggestions">
                              {suggestedTeachers.map((t) => (
                                <option key={t} value={t} />
                              ))}
                            </datalist>
                            <button
                              disabled={isSaving}
                              onClick={() => handleSaveTeacher(sec)}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                                isSaving
                                  ? 'bg-emerald-400 text-white cursor-not-allowed'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                              }`}
                            >
                              {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              disabled={isSaving}
                              onClick={() => setEditingSection(null)}
                              className="px-2 py-1 text-slate-500 hover:text-slate-700 text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {isAssigned ? (
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {teacher}
                              </span>
                            ) : (
                              <span className="italic text-slate-400 dark:text-slate-500">
                                Not Assigned
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isEditing && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(sec)}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 cursor-pointer"
                            >
                              {isAssigned ? 'Change' : 'Assign'}
                            </button>
                            {isAssigned && (
                              <button
                                onClick={() => handleRemove(sec)}
                                title="Remove assignment"
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p>
              Class Teachers determine which section roster is automatically scoped when the teacher accesses the Teacher Portal, attendance roll calls, and homework modules.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
