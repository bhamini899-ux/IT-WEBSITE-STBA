import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  User, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  Phone, 
  Check, 
  AlertCircle,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { Teacher, TeacherDesignation } from '../../types';

interface AddEditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacherData: Partial<Teacher>) => void;
  teacherToEdit?: Teacher | null;
}

const DESIGNATION_OPTIONS: { label: string; value: TeacherDesignation }[] = [
  { label: 'Teacher', value: 'Teacher' },
  { label: 'Senior Teacher', value: 'Senior Teacher' },
  { label: 'Coordinator', value: 'Coordinator' },
  { label: 'Head of Department', value: 'Head of Department' }
];

const PRESET_CLASSES = [
  '1-A', '2-A', '3-A', '4-A', '5-A', 
  '6-A', '6-B', '7-A', '7-B', '8-A', 
  '8-B', '9-A', '9-B', '10-A', '10-B', 
  '11-A', '11-B', '12-A', '12-B'
];

export const AddEditTeacherModal: React.FC<AddEditTeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacherToEdit
}) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [designation, setDesignation] = useState<TeacherDesignation>('Teacher');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [customClassInput, setCustomClassInput] = useState('');
  const [phone, setPhone] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  
  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; subject?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (teacherToEdit) {
      setName(teacherToEdit.name || '');
      setSubject(teacherToEdit.subjects?.[0] || '');
      setDesignation(teacherToEdit.designation || 'Teacher');
      setSelectedClasses(teacherToEdit.classes || []);
      setPhone(teacherToEdit.phone || '');
      setPhotoPreview(teacherToEdit.avatar || '');
    } else {
      setName('');
      setSubject('');
      setDesignation('Teacher');
      setSelectedClasses([]);
      setCustomClassInput('');
      setPhone('');
      setPhotoPreview('');
    }
    setErrors({});
  }, [teacherToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Please select a valid JPG, JPEG, or PNG image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleClass = (cls: string) => {
    setSelectedClasses(prev => 
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };

  const handleAddCustomClass = () => {
    const trimmed = customClassInput.trim().toUpperCase();
    if (trimmed && !selectedClasses.includes(trimmed)) {
      setSelectedClasses(prev => [...prev, trimmed]);
      setCustomClassInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; subject?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Teacher full name is required';
    }
    if (!subject.trim()) {
      newErrors.subject = 'Subject taught is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Default avatar if not uploaded
    const fallbackAvatar = photoPreview || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=092248,10b981,f59e0b&textColor=ffffff`;

    onSave({
      name: name.trim(),
      subjects: [subject.trim()],
      designation,
      classes: selectedClasses.length > 0 ? selectedClasses : ['General'],
      phone: phone.trim() || undefined,
      avatar: fallbackAvatar,
    });

    onClose();
  };

  return (
    <div 
      id="add-teacher-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="add-teacher-modal-card"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with STBA color accents (navy and amber/emerald accents) */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold border border-amber-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {teacherToEdit ? 'Edit Teacher' : 'Add Teacher'}
              </h2>
              <p className="text-xs text-slate-500">
                Seth Tolaram Bafna Academy • Faculty Directory
              </p>
            </div>
          </div>
          <button 
            id="btn-close-add-teacher-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Teacher Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Teacher Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="relative group w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  id="teacher-photo-input"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImageFileChange}
                  className="hidden" 
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-upload-teacher-photo"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                  </button>
                  {photoPreview && (
                    <button
                      type="button"
                      id="btn-remove-teacher-photo"
                      onClick={handleRemovePhoto}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Supported formats: JPG, JPEG, PNG
                </p>
              </div>
            </div>
          </div>

          {/* 2. Teacher Name */}
          <div>
            <label 
              htmlFor="teacher-name-input"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Teacher Name <span className="text-rose-500">*</span>
            </label>
            <input 
              id="teacher-name-input"
              type="text" 
              placeholder="e.g. Meenakshi Purohit"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                errors.name 
                  ? 'border-rose-300 focus:ring-rose-500/20' 
                  : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* 3. Subject */}
          <div>
            <label 
              htmlFor="teacher-subject-input"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Subject <span className="text-rose-500">*</span>
            </label>
            <input 
              id="teacher-subject-input"
              type="text" 
              placeholder="e.g. Mathematics, English, Physics, Social Science"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors(prev => ({ ...prev, subject: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${
                errors.subject 
                  ? 'border-rose-300 focus:ring-rose-500/20' 
                  : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.subject}
              </p>
            )}
          </div>

          {/* 4. Designation */}
          <div>
            <label 
              htmlFor="teacher-designation-select"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Designation
            </label>
            <select
              id="teacher-designation-select"
              value={designation}
              onChange={(e) => setDesignation(e.target.value as TeacherDesignation)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {DESIGNATION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Class / Section (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Class / Section <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              {selectedClasses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedClasses([])}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              {PRESET_CLASSES.map(cls => {
                const isSelected = selectedClasses.includes(cls);
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => toggleClass(cls)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-emerald-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{cls}</span>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Class input */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Or type class e.g. 11-C, Nursery"
                value={customClassInput}
                onChange={(e) => setCustomClassInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomClass();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddCustomClass}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* 6. Contact Number (Optional) */}
          <div>
            <label 
              htmlFor="teacher-phone-input"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Contact Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                id="teacher-phone-input"
                type="tel" 
                placeholder="e.g. +91 98290 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Action Buttons: Cancel and Save Teacher */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="btn-cancel-teacher"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-teacher"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{teacherToEdit ? 'Confirm & Save Changes' : 'Confirm & Add Teacher'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
