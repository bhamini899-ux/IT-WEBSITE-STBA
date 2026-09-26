import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Receipt,
  X,
  Lock
} from 'lucide-react';
import { ChildFeeSummary, ChildProfile } from '../../types/parentConnect';

interface ChildFeesSectionProps {
  child: ChildProfile;
  feeSummary: ChildFeeSummary;
  onPayFee: (installmentId: string, amount: number) => void;
  onViewReceipt: (receiptNo: string) => void;
}

export const ChildFeesSection: React.FC<ChildFeesSectionProps> = ({
  child,
  feeSummary,
  onPayFee,
  onViewReceipt,
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(
    feeSummary.installments.find(i => i.status === 'Pending') || feeSummary.installments[0]
  );
  const [paymentMode, setPaymentMode] = useState<'upi' | 'netbanking' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const percentPaid = Math.round((feeSummary.paidAmount / feeSummary.totalAnnualFee) * 100);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentModalOpen(false);
      onPayFee(selectedInstallment.id, selectedInstallment.amount);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 4 Core Fee Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Annual Fees</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹{feeSummary.totalAnnualFee.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Session {feeSummary.academicYear}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Paid</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            ₹{feeSummary.paidAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {percentPaid}% Cleared
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Due</span>
          <p className={`text-xl sm:text-2xl font-black mt-2 ${
            feeSummary.pendingAmount > 0 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-slate-900 dark:text-white'
          }`}>
            ₹{feeSummary.pendingAmount.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {feeSummary.pendingAmount > 0 ? 'Due soon' : 'All terms cleared'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Next Due Date</span>
          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-2 truncate">
            {feeSummary.nextDueDate}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Official Treasury Schedule
          </p>
        </div>
      </div>

      {/* Clearance Progress Bar Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Annual Fee Clearance Progress
          </span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
            {percentPaid}% Completed
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-700" 
            style={{ width: `${percentPaid}%` }}
          />
        </div>
      </div>

      {/* Installments & Pay Action */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Fee Structure & Installments
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prescribed term payments for tuition, laboratory, and digital campus access
            </p>
          </div>

          {feeSummary.pendingAmount > 0 && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Pending Fees Online</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {feeSummary.installments.map((inst) => (
            <div
              key={inst.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {inst.term}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    inst.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {inst.status}
                  </span>
                </div>

                <p className="text-slate-500 dark:text-slate-400">
                  Due Date: {inst.dueDate} {inst.paidDate && `• Cleared on: ${inst.paidDate}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-mono font-extrabold text-slate-900 dark:text-white">
                  ₹{inst.amount.toLocaleString('en-IN')}
                </span>

                {inst.status === 'Paid' && inst.receiptNo && (
                  <button
                    onClick={() => onViewReceipt(inst.receiptNo!)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                )}

                {inst.status === 'Pending' && (
                  <button
                    onClick={() => {
                      setSelectedInstallment(inst);
                      setIsPaymentModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History & Electronic Receipts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          Payment Transactions & Tax Receipts
        </h4>

        <div className="space-y-3 text-xs">
          {feeSummary.paymentHistory.map((item) => (
            <div
              key={item.receiptNo}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="font-mono">{item.receiptNo}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.paymentMode}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>

                <button
                  onClick={() => onViewReceipt(item.receiptNo)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prototype Payment Simulator Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Demo Fee Payment Gateway
                </h4>
              </div>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prototype Disclaimer Banner */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 mb-4 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Prototype / Demo Functionality:</strong> This payment flow is a simulated demonstration for competition judges. No actual bank transfer will occur.
              </span>
            </div>

            <form onSubmit={handleSimulatePayment} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Installment</span>
                  <strong className="text-slate-900 dark:text-white">{selectedInstallment.term}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Amount Due</span>
                  <span className="text-lg font-mono font-black text-blue-600 dark:text-blue-400">
                    ₹{selectedInstallment.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Payment Method (Simulated)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('upi')}
                    className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                      paymentMode === 'upi'
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('netbanking')}
                    className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                      paymentMode === 'netbanking'
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    NetBanking
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('card')}
                    className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                      paymentMode === 'card'
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Credit / Debit
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>256-bit SSL Simulated Treasury Gateway • Seth Tolaram Bafna Academy</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isProcessing ? 'Processing Transaction...' : `Confirm Demo Payment (₹${selectedInstallment.amount.toLocaleString('en-IN')})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
