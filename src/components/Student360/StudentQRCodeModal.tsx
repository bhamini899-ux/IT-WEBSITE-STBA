import React, { useState } from 'react';
import { X, QrCode, Download, CheckCircle2, ScanLine } from 'lucide-react';
import { Student } from '../../types';

interface StudentQRCodeModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulateTap?: (studentId: string) => void;
}

export const StudentQRCodeModal: React.FC<StudentQRCodeModalProps> = ({
  student,
  isOpen,
  onClose,
  onSimulateTap,
}) => {
  const [tapSuccess, setTapSuccess] = useState(false);

  if (!isOpen || !student) return null;

  const handleSimulateScan = () => {
    if (onSimulateTap) {
      onSimulateTap(student.id);
    }
    setTapSuccess(true);
    setTimeout(() => setTapSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-center">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-black">Smart Campus Access QR Pass</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          <img
            src={student.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 shadow-md mb-2"
          />
          <h4 className="text-base font-black text-slate-900 dark:text-white">{student.name}</h4>
          <p className="text-xs text-slate-500">
            Class {student.className} • Roll #{student.rollNo || '1'} • {student.id}
          </p>

          {/* QR Container */}
          <div className="my-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner flex flex-col items-center">
            <div className="w-44 h-44 bg-white p-3 rounded-xl shadow-xs flex items-center justify-center border border-slate-200">
              <QrCode className="w-36 h-36 text-slate-900" />
            </div>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2">
              UID: {student.id}-AUTH-CBSE26
            </p>
          </div>

          {tapSuccess && (
            <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Gate Turnstile Simulated: Tap Verified & Present Marked!</span>
            </div>
          )}

          <div className="w-full flex flex-col gap-2">
            <button
              onClick={handleSimulateScan}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>Simulate Turnstile / Library Scan</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
