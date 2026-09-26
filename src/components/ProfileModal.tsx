import React from 'react';
import { 
  User, 
  ShieldCheck, 
  School, 
  Mail, 
  Phone, 
  Award, 
  CheckCircle, 
  X,
  MapPin
} from 'lucide-react';
import { SCHOOL_PROFILE } from '../data/schoolProfile';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Administrator Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 mb-3">
            AD
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Chief Administrator
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Seth Tolaram Bafna Academy • Academic Session 2026-27
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Full System Super-Admin Access</span>
          </div>
        </div>

        <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Official Email:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{SCHOOL_PROFILE.adminEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Central Office:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{SCHOOL_PROFILE.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5" /> Affiliation:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{SCHOOL_PROFILE.affiliationText}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Location:
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{SCHOOL_PROFILE.city}, {SCHOOL_PROFILE.state}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
