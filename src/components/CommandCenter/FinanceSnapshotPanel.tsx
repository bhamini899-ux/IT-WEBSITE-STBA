import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  FileText, 
  IndianRupee, 
  CreditCard, 
  AlertCircle 
} from 'lucide-react';
import { FinanceSnapshot, AppSection } from '../../types';

interface FinanceSnapshotPanelProps {
  finance: FinanceSnapshot;
  onNavigate: (section: AppSection) => void;
  onOpenReportModal?: () => void;
}

export const FinanceSnapshotPanel: React.FC<FinanceSnapshotPanelProps> = ({
  finance,
  onNavigate,
  onOpenReportModal,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Fee Revenue & Finance Snapshot</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Fee gateway, collections & institutional ledger</p>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200/50">
            {finance.collectionTargetPct}% Target Reached
          </span>
        </div>

        {/* 3 Major Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Today's Inflow</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              ₹{finance.todayCollection.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              34 transactions logged
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Monthly Total</span>
            <div className="text-lg font-black text-emerald-800 dark:text-emerald-200 mt-0.5">
              ₹{finance.monthlyCollectionLakhs} Lakhs
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Expenses: ₹{finance.monthlyExpensesLakhs}L
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <span className="text-[10px] text-rose-700 dark:text-rose-400 uppercase font-semibold">Overdue Dues</span>
            <div className="text-lg font-black text-rose-800 dark:text-rose-200 mt-0.5">
              ₹{finance.outstandingLakhs} Lakhs
            </div>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
              {finance.overdueAccountsCount} student accounts
            </span>
          </div>
        </div>

        {/* Weekly Trend Mini Bars */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 my-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            <span>Daily Collection Trend (₹ in Thousands)</span>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Net Balance: ₹{finance.netBalanceLakhs}L
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2 items-end h-16 pt-1">
            {finance.dailyTrend.map((d, idx) => (
              <div key={`${d.day}-${idx}`} className="flex flex-col items-center gap-1 group">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-12 flex items-end overflow-hidden">
                  <div 
                    className="w-full bg-emerald-600 dark:bg-emerald-500 rounded transition-all duration-300 group-hover:bg-emerald-400"
                    style={{ height: `${Math.min(100, (d.amountThousands / 350) * 100)}%` }}
                    title={`${d.day}: ₹${d.amountThousands}K`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={onOpenReportModal}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Financial Audit Report</span>
        </button>
        <button
          onClick={() => onNavigate('finance')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <span>View Finance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
