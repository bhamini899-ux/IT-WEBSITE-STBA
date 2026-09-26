import React from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  Award, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { AppSection } from '../../types';

interface LibraryMiniCardProps {
  onNavigate: (section: AppSection) => void;
  totalBooks?: number;
  availableBooks?: number;
  issuedBooks?: number;
  overdueBooks?: number;
  reservationsCount?: number;
}

export const LibraryMiniCard: React.FC<LibraryMiniCardProps> = ({
  onNavigate,
  totalBooks = 18642,
  availableBooks = 14238,
  issuedBooks = 4102,
  overdueBooks = 302,
  reservationsCount = 87,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Library Pulse</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Digital catalog & circulation status</p>
            </div>
          </div>

          <span className="text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-200/50">
            RFID Scan Active
          </span>
        </div>

        {/* 4 Primary Library Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Catalog</div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {totalBooks.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">Available</div>
            <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
              {availableBooks.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <div className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold uppercase">Issued</div>
            <div className="text-base sm:text-lg font-black text-blue-700 dark:text-blue-300 mt-0.5">
              {issuedBooks.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <div className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold uppercase">Overdue</div>
            <div className="text-base sm:text-lg font-black text-rose-700 dark:text-rose-300 mt-0.5">
              {overdueBooks}
            </div>
          </div>
        </div>

        {/* Circulation Insights Spotlight */}
        <div className="space-y-2.5 my-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Most Borrowed Category</span>
                <p className="text-[11px] text-slate-500">STEM & Robotics Volumes</p>
              </div>
            </div>
            <span className="font-extrabold text-purple-600 dark:text-purple-400 text-sm">
              34% of Loans
            </span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Top Reader of the Term</span>
                <p className="text-[11px] text-slate-500">Kabir Jain • Grade 10-A</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              14 Books Read
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Reservations queued: <strong>{reservationsCount} titles</strong>
        </span>
        <button
          onClick={() => onNavigate('library')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <span>View Library</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
