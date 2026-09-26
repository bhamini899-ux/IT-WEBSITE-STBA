import React, { useState } from 'react';
import { 
  Award, 
  FileText, 
  CheckCircle2, 
  Send, 
  Search, 
  Filter, 
  Eye, 
  RefreshCw,
  Sparkles,
  CheckCircle,
  Clock,
  Printer
} from 'lucide-react';
import { ReportCardItem } from '../../types';
import { INITIAL_REPORT_CARDS } from '../../data/academicData';
import { ReportCardPreviewModal } from './ReportCardPreviewModal';

export const ReportCardCenter: React.FC = () => {
  const [reportCards, setReportCards] = useState<ReportCardItem[]>(INITIAL_REPORT_CARDS);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Generated' | 'Pending Review' | 'Reviewed' | 'Published'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportCard, setSelectedReportCard] = useState<ReportCardItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateBatch = () => {
    setReportCards(prev => prev.map(rc => ({
      ...rc,
      status: rc.status === 'Pending Review' ? 'Reviewed' : rc.status
    })));
    showToast('✓ Report cards generated successfully for all evaluated terms.');
  };

  const handlePublishAll = () => {
    setReportCards(prev => prev.map(rc => ({
      ...rc,
      status: 'Published'
    })));
    showToast('✓ Report cards published to Parent Portal & Student 360°.');
  };

  const handlePublishSingle = (id: string) => {
    setReportCards(prev => prev.map(rc => rc.id === id ? { ...rc, status: 'Published' } : rc));
    if (selectedReportCard && selectedReportCard.id === id) {
      setSelectedReportCard(prev => prev ? { ...prev, status: 'Published' } : null);
    }
    showToast('✓ Report card published to Parent Portal.');
  };

  const filteredCards = reportCards.filter(rc => {
    const matchesClass = selectedClass === 'all' || rc.className === selectedClass;
    const matchesStatus = statusFilter === 'all' || rc.status === statusFilter;
    const matchesSearch = rc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rc.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rc.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesStatus && matchesSearch;
  });

  const publishedCount = reportCards.filter(r => r.status === 'Published').length;
  const pendingReviewCount = reportCards.filter(r => r.status === 'Pending Review').length;
  const reviewedCount = reportCards.filter(r => r.status === 'Reviewed').length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Action Buttons */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Report Card Center
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">
              CBSE Secondary & Sr. Secondary
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate, review, approve and publish automated comprehensive evaluation dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-generate-report-cards"
            onClick={handleGenerateBatch}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Report Cards</span>
          </button>
          <button
            id="btn-publish-report-cards"
            onClick={handlePublishAll}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish to Parent Portal</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Class 10 Enrolled</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">219</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sections 10-A to 10-E</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending Review</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingReviewCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Awaiting teacher sign-off</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Reviewed & Approved</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{reviewedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Ready for publication</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Published to Parents</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{publishedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Visible on Parent 360°</div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['all', '8-A', '9-A', '10-A', '10-B', '11-A', '12-A'].map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedClass === cls
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {cls === 'all' ? 'All Classes' : `Class ${cls}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Generated">Generated</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>

        {/* Report Cards Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Term</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">CBSE Grade</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCards.map((rc) => (
                <tr key={rc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{rc.studentName}</div>
                    <div className="text-[10px] text-slate-400">Roll: #{rc.rollNo} • ID: {rc.studentId}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    Class {rc.className}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {rc.term}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      {rc.overallPercentage ?? rc.percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {rc.grade ?? rc.academicStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {rc.attendancePercentage}%
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      rc.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : rc.status === 'Reviewed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {rc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      id={`btn-preview-report-${rc.id}`}
                      onClick={() => {
                        setSelectedReportCard(rc);
                        setIsPreviewOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      <ReportCardPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        reportCard={selectedReportCard}
        onPublishSingle={handlePublishSingle}
      />
    </div>
  );
};
