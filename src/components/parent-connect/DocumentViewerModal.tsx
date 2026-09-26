import React from 'react';
import { X, Download, Printer, ShieldCheck, School, Award, FileText, CheckCircle2 } from 'lucide-react';
import { ParentSchoolDocument, ChildProfile } from '../../types/parentConnect';

interface DocumentViewerModalProps {
  document: ParentSchoolDocument | null;
  child: ChildProfile;
  onClose: () => void;
  onDownload: (doc: ParentSchoolDocument) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  child,
  onClose,
  onDownload,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {document.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official Document • {document.format} • {document.fileSize}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Content View */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50 dark:bg-slate-950/50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm">
            {/* School Header */}
            <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-2 shadow-sm">
                <School className="w-6 h-6" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif uppercase tracking-wide">
                Seth Tolaram Bafna Academy
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                Affiliated to CBSE, New Delhi (Affiliation No: 1730248) • Nokha Road, Bikaner, Rajasthan 334001
              </p>
              <div className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {document.category}
              </div>
            </div>

            {/* Document Body Dependent on Category */}
            {document.category === 'Report Card' && (
              <div className="mt-6 space-y-5">
                {/* Student Info Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Student Name</span>
                    <strong className="text-slate-800 dark:text-slate-200">{child.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Class & Sec</span>
                    <strong className="text-slate-800 dark:text-slate-200">{child.className}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Roll No</span>
                    <strong className="text-slate-800 dark:text-slate-200">#{child.rollNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Admission No</span>
                    <strong className="text-slate-800 dark:text-slate-200">{child.admissionNo}</strong>
                  </div>
                </div>

                {/* Score Summary Table */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5 text-center">Max</th>
                        <th className="p-2.5 text-center">Obtained</th>
                        <th className="p-2.5 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="p-2.5 font-medium">Mathematics</td>
                        <td className="p-2.5 text-center text-slate-400">100</td>
                        <td className="p-2.5 text-center font-bold text-slate-900 dark:text-white">98</td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">A1</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Science (Theory + Practical)</td>
                        <td className="p-2.5 text-center text-slate-400">100</td>
                        <td className="p-2.5 text-center font-bold text-slate-900 dark:text-white">94</td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">A1</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Social Science</td>
                        <td className="p-2.5 text-center text-slate-400">100</td>
                        <td className="p-2.5 text-center font-bold text-slate-900 dark:text-white">91</td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">A1</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">English Communicative</td>
                        <td className="p-2.5 text-center text-slate-400">100</td>
                        <td className="p-2.5 text-center font-bold text-slate-900 dark:text-white">92</td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">A1</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Computer Science & AI</td>
                        <td className="p-2.5 text-center text-slate-400">100</td>
                        <td className="p-2.5 text-center font-bold text-slate-900 dark:text-white">99</td>
                        <td className="p-2.5 text-center font-bold text-emerald-600">A1</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Hindi Course A</td>
                        <td className="p-2.5 text-center text-slate-400">100</td>
                        <td className="p-2.5 text-center font-bold text-slate-900 dark:text-white">86</td>
                        <td className="p-2.5 text-center font-bold text-blue-600">A2</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-blue-50 dark:bg-blue-950/40 font-bold border-t border-slate-200 dark:border-slate-700">
                      <tr>
                        <td className="p-2.5 text-blue-900 dark:text-blue-200">Aggregate Total</td>
                        <td className="p-2.5 text-center text-slate-400">600</td>
                        <td className="p-2.5 text-center text-blue-700 dark:text-blue-300 font-extrabold">560 (93.3%)</td>
                        <td className="p-2.5 text-center text-emerald-600 font-extrabold">Distinction (Rank 2)</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Principal Remarks: </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    Aarav exhibits outstanding academic discipline, stellar analytical acuity in STEM disciplines, and exemplary conduct. Highly recommended for National Science Olympiad training.
                  </span>
                </div>
              </div>
            )}

            {document.category === 'Fee Receipt' && (
              <div className="mt-6 space-y-4 text-xs">
                <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-bold">Official Payment Clearance Receipt</p>
                      <p className="text-[11px] opacity-80">Electronic Record Validated</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm">₹36,000.00</span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Receipt No</span>
                    <strong className="text-slate-800 dark:text-slate-200">REC-2026-2490</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Transaction Date</span>
                    <strong className="text-slate-800 dark:text-slate-200">10 August 2026 • 04:12 PM</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Student Name</span>
                    <strong className="text-slate-800 dark:text-slate-200">{child.name} ({child.className})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Payment Mode</span>
                    <strong className="text-slate-800 dark:text-slate-200">NetBanking (HDFC ref #881924)</strong>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Term 2 Tuition & Faculty Fee</span>
                    <span>₹24,000.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Science & Computer Lab Maintenance</span>
                    <span>₹6,000.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Digital Smart Classroom & Library Digital Fee</span>
                    <span>₹4,000.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Activity, Sports & Co-Curricular Fund</span>
                    <span>₹2,000.00</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Total Amount Paid</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">₹36,000.00</span>
                  </div>
                </div>
              </div>
            )}

            {document.category !== 'Report Card' && document.category !== 'Fee Receipt' && (
              <div className="mt-6 space-y-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                    {document.category === 'Certificate' && <Award className="w-4 h-4 text-amber-500" />}
                    {document.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {document.description}
                  </p>
                </div>

                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px] text-blue-800 dark:text-blue-300 font-medium">
                      Digitally Authenticated by Seth Tolaram Bafna Academy Records Office
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Issued: {document.issueDate}</span>
                </div>
              </div>
            )}

            {/* Signature & Seal Footer */}
            <div className="mt-8 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">Mrs. Neha Verma</p>
                <p className="text-[10px]">Class Teacher (10-A)</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-blue-400/60 flex items-center justify-center text-[9px] font-bold text-blue-600 rotate-[-12deg] mx-auto uppercase">
                  Academy<br />Seal
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-700 dark:text-slate-300">Dr. S. K. Jain</p>
                <p className="text-[10px]">Principal & Director</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Document ID: {document.id}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => onDownload(document)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
