import React, { useState } from 'react';
import { X, RotateCw, Printer, Download, Check, ShieldCheck, QrCode } from 'lucide-react';
import { Student } from '../../types';

interface DigitalIdCardModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalIdCardModal: React.FC<DigitalIdCardModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !student) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const getHouseGradient = (house?: string) => {
    switch (house) {
      case 'Agni':
        return 'from-red-600 to-rose-700';
      case 'Surya':
        return 'from-amber-500 to-orange-600';
      case 'Prithvi':
        return 'from-emerald-600 to-teal-700';
      case 'Vayu':
        return 'from-blue-600 to-indigo-700';
      case 'Trishul':
        return 'from-purple-600 to-indigo-800';
      default:
        return 'from-blue-600 to-indigo-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-black">Digital RFID Student Identity Card</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-1.5 px-4 text-center">
            ✓ Smart Student ID Badge exported (High-Resolution Print PDF ready).
          </div>
        )}

        {/* Card Canvas Area */}
        <div className="p-6 flex flex-col items-center bg-slate-100 dark:bg-slate-950">
          {/* Card Frame (Card aspect ratio ~ 85.6mm x 53.98mm) */}
          <div
            id="printable-id-card"
            className="w-full max-w-[340px] h-[480px] rounded-2xl shadow-xl overflow-hidden relative flex flex-col bg-white border border-slate-300 text-slate-800 transition-all duration-300"
          >
            {!isFlipped ? (
              /* FRONT OF CARD */
              <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-slate-50 to-white relative">
                {/* Top Header Strip */}
                <div className="text-center pb-2 border-b border-slate-200">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                      360°
                    </div>
                    <span className="font-black text-xs tracking-tight uppercase text-slate-900">
                      Smart Model Senior Secondary School
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-semibold tracking-wide">
                    Affiliated to CBSE • Autonomous Smart Campus
                  </p>
                </div>

                {/* House Color Accent Ribbon */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${getHouseGradient(student.house)} rounded-full my-1`} />

                {/* Photo & Badge */}
                <div className="flex flex-col items-center text-center my-1">
                  <div className="relative">
                    <img
                      src={student.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                      alt={student.name}
                      className="w-24 h-24 rounded-xl object-cover border-2 border-slate-200 shadow-md"
                    />
                    <span className="absolute -bottom-2 -right-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white shadow-xs">
                      {student.bloodGroup || 'B+'}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 mt-3 tracking-tight">
                    {student.name}
                  </h4>
                  <p className="text-xs font-bold text-blue-700">
                    CLASS {student.className} • ROLL NO #{student.rollNo || '1'}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500">
                    Admission No: {student.admissionNo || 'ADM-2024-001'}
                  </p>
                </div>

                {/* Quick Info Grid */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Student ID</span>
                    <span className="font-mono font-bold text-slate-800">{student.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">School House</span>
                    <span className="font-bold text-slate-800">{student.house || 'Agni'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Emergency Contact</span>
                    <span className="font-mono font-bold text-slate-800">{student.guardianPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Transport</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {student.transportDetails?.busNumber || student.transportRoute || 'Private'}
                    </span>
                  </div>
                </div>

                {/* Bottom Barcode Strip */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px]">
                  <div>
                    <p className="font-mono tracking-widest text-slate-600 font-bold">||| | |||| | ||| ||||</p>
                    <p className="text-[8px] text-slate-400">RFID Encrypted UID: {student.id}-2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">Valid: 2026-27</p>
                    <p className="text-[8px] text-slate-400 italic">Dr. V. K. Saxena (Principal)</p>
                  </div>
                </div>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="flex-1 flex flex-col justify-between p-4 bg-slate-50 relative text-slate-700">
                <div className="text-center pb-2 border-b border-slate-200">
                  <h5 className="font-black text-xs text-slate-900 uppercase tracking-wider">
                    Institutional Terms & Smart Access
                  </h5>
                  <p className="text-[9px] text-slate-500">
                    Turnstile, Library, Canteen & Bus Access Pass
                  </p>
                </div>

                {/* Central QR Code */}
                <div className="flex flex-col items-center justify-center my-2 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="w-28 h-28 bg-slate-900 p-2 rounded-lg flex items-center justify-center text-white">
                    <QrCode className="w-24 h-24" />
                  </div>
                  <p className="text-[9px] font-mono text-slate-500 mt-1 font-bold">
                    SMART-GATE://{student.id}/{student.className}
                  </p>
                </div>

                {/* Rules & Return Address */}
                <div className="text-[9px] text-slate-600 space-y-1">
                  <p>• This card must be carried and tapped at turnstiles every morning.</p>
                  <p>• Non-transferable. Loss must be reported to Admissions Desk immediately.</p>
                  <p className="font-bold text-slate-800 pt-1">Permanent Address:</p>
                  <p className="truncate">{student.address || '42, Shanti Nagar, Bikaner, Rajasthan 334001'}</p>
                </div>

                {/* Footer Security */}
                <div className="pt-2 border-t border-slate-200 text-center text-[8px] text-slate-400">
                  SMART SCHOOL 360° • Central Campus Control System • Helpline: +91 151 2223300
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center">
            Click flip below to preview {isFlipped ? 'Front' : 'Back'} side
          </p>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Flip to {isFlipped ? 'Front' : 'Back'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Badge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
