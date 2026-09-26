import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  PlusCircle, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  BookmarkCheck, 
  Clock, 
  X,
  Sparkles,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Book, BorrowRecord } from '../types';
import { StatCard } from '../components/StatCard';

interface LibraryViewProps {
  books: Book[];
  borrowRecords: BorrowRecord[];
  onIssueBook: (newRecord: Omit<BorrowRecord, 'id'>) => { success: boolean; error?: string };
  onReturnBook: (recordId: string) => { success: boolean; fine?: number; error?: string };
  openIssueModalDirectly?: boolean;
  onCloseDirectIssueModal?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  borrowRecords,
  onIssueBook,
  onReturnBook,
  openIssueModalDirectly = false,
  onCloseDirectIssueModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(openIssueModalDirectly);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnRecordId, setSelectedReturnRecordId] = useState<string>('');
  const [validationError, setValidationError] = useState('');

  // Issue Book Form State
  const [issueStudentId, setIssueStudentId] = useState('STU-1021');
  const [issueStudentName, setIssueStudentName] = useState('Aarav Sharma');
  const [issueBookId, setIssueBookId] = useState(books[0]?.id || '');
  const [issueDate, setIssueDate] = useState('2026-09-17');
  const [dueDate, setDueDate] = useState('2026-10-01');

  React.useEffect(() => {
    if (openIssueModalDirectly) {
      setIsIssueModalOpen(true);
    }
  }, [openIssueModalDirectly]);

  const categories = [
    'All',
    'Science',
    'Mathematics',
    'Literature',
    'History',
    'Computer Science',
    'General Knowledge',
    'Fiction',
  ];

  // Dynamic calculations
  const totalBooks = 4860;
  const availableBooks = books.reduce((acc, b) => acc + b.availableCopies, 0) + (1248 - 52);
  const issuedBooks = 3412 + (borrowRecords.filter(r => r.status === 'Issued').length - 3);
  const overdueCount = borrowRecords.filter(r => r.status === 'Overdue').length + (42 - 1);
  const membersCount = 612;

  // Filter books
  const filteredBooks = books.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesQuery =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!issueStudentId.trim() || !issueStudentName.trim() || !issueBookId) {
      setValidationError('Please complete all required fields.');
      return;
    }

    const targetBook = books.find(b => b.id === issueBookId);
    if (!targetBook || targetBook.availableCopies <= 0) {
      setValidationError('This book is currently unavailable.');
      return;
    }

    const res = onIssueBook({
      studentId: issueStudentId,
      studentName: issueStudentName,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      issueDate,
      dueDate,
      status: 'Issued',
      overdueDays: 0,
      fineAmount: 0,
    });

    if (res.success) {
      setIsIssueModalOpen(false);
      setValidationError('');
      if (onCloseDirectIssueModal) onCloseDirectIssueModal();
    } else if (res.error) {
      setValidationError(res.error);
    }
  };

  const handleOpenReturnModal = (recordId?: string) => {
    if (recordId) {
      setSelectedReturnRecordId(recordId);
    } else {
      const activeFirst = borrowRecords.find(r => r.status !== 'Returned');
      setSelectedReturnRecordId(activeFirst ? activeFirst.id : '');
    }
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = () => {
    if (!selectedReturnRecordId) return;
    const res = onReturnBook(selectedReturnRecordId);
    if (res.success) {
      setIsReturnModalOpen(false);
    }
  };

  const selectedReturnRecord = borrowRecords.find(r => r.id === selectedReturnRecordId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            Smart Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Find, issue and manage books effortlessly.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            id="btn-return-book-header"
            onClick={() => handleOpenReturnModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>Return Book</span>
          </button>
          <button
            id="btn-issue-book-header"
            onClick={() => setIsIssueModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue Book</span>
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS (Section 15) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Books"
          value={totalBooks.toLocaleString()}
          subtitle="Cataloged in library"
          icon={BookOpen}
          iconColorClass="text-slate-600 dark:text-slate-300"
          iconBgClass="bg-slate-100 dark:bg-slate-800"
        />
        <StatCard
          title="Available"
          value={availableBooks.toLocaleString()}
          subtitle="On book shelves"
          badge={{ text: 'Ready', variant: 'emerald' }}
          icon={BookmarkCheck}
          iconColorClass="text-emerald-600 dark:text-emerald-400"
          iconBgClass="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <StatCard
          title="Issued"
          value={issuedBooks.toLocaleString()}
          subtitle="Active student loans"
          badge={{ text: '32 today', variant: 'sky' }}
          icon={BookOpen}
          iconColorClass="text-sky-600 dark:text-sky-400"
          iconBgClass="bg-sky-50 dark:bg-sky-950/60"
        />
        <StatCard
          title="Overdue"
          value={overdueCount.toString()}
          subtitle="Fine calculated (₹5/d)"
          badge={{ text: 'Action req.', variant: 'rose' }}
          icon={AlertCircle}
          iconColorClass="text-rose-600 dark:text-rose-400"
          iconBgClass="bg-rose-50 dark:bg-rose-950/60"
        />
        <StatCard
          title="Members"
          value={membersCount.toString()}
          subtitle="Students & teachers"
          badge={{ text: 'Active', variant: 'emerald' }}
          icon={Users}
          iconColorClass="text-indigo-600 dark:text-indigo-400"
          iconBgClass="bg-indigo-50 dark:bg-indigo-950/60"
        />
      </div>

      {/* BOOK SEARCH & CATEGORY FILTER (Section 16) */}
      <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="book-search-input"
            type="text"
            placeholder="Search by book title, author, ISBN or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] shrink-0 mr-1">
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* BOOK INVENTORY TABLE (Section 17) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Book Inventory & Availability
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredBooks.length} book titles in catalog
            </p>
          </div>
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            + Issue A Book
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Total Copies</th>
                <th className="py-3 px-4 text-right">Available</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBooks.map((b) => {
                let statusLabel = 'Available';
                let statusBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';

                if (b.availableCopies === 0) {
                  statusLabel = 'Issued';
                  statusBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
                } else if (b.availableCopies <= 3) {
                  statusLabel = 'Limited';
                  statusBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
                }

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div>
                        <p>{b.title}</p>
                        <p className="text-[11px] text-slate-400 font-normal">ISBN: {b.isbn}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{b.author}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {b.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">{b.totalCopies}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {b.availableCopies}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setIssueBookId(b.id);
                          setIsIssueModalOpen(true);
                        }}
                        disabled={b.availableCopies === 0}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {b.availableCopies === 0 ? 'Waitlist' : 'Issue Book'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* BORROWING HISTORY TABLE (Section 20) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Borrowing & Loan Records
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track student issues, upcoming returns, and simulated overdue fines
            </p>
          </div>
          <button
            onClick={() => handleOpenReturnModal()}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Process Return
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Fine / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {borrowRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{r.studentName}</p>
                    <p className="text-[11px] text-slate-400">{r.studentId}</p>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {r.bookTitle}
                  </td>
                  <td className="py-3 px-4 text-xs">{r.issueDate}</td>
                  <td className="py-3 px-4 text-xs font-medium">{r.dueDate}</td>
                  <td className="py-3 px-4 text-center">
                    {r.status === 'Returned' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        🟢 Returned
                      </span>
                    )}
                    {r.status === 'Issued' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                        🔵 Issued
                      </span>
                    )}
                    {r.status === 'Overdue' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        🔴 Overdue
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {r.status !== 'Returned' ? (
                      <div className="inline-flex items-center gap-2">
                        {r.overdueDays > 0 && (
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                            Fine: ₹{r.fineAmount}
                          </span>
                        )}
                        <button
                          onClick={() => handleOpenReturnModal(r.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold cursor-pointer border border-blue-200 dark:border-blue-800"
                        >
                          Return
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* LIBRARY ANALYTICS (Section 21) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Most Borrowed Books */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Most Borrowed Books
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Top circulation titles in current term
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Circulation Volume
            </span>
          </div>

          <div className="space-y-3">
            {books.slice(0, 5).map((b) => (
              <div key={b.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-900 dark:text-white">{b.title} ({b.category})</span>
                  <span className="text-slate-500 dark:text-slate-400">{b.borrowedCount} times</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(b.borrowedCount / 160) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Circulation & Active Readers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Library Metrics & Readers
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Books issued this week</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">148</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Books returned this week</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">132</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">Active Overdue Books</span>
              <span className="text-sm font-bold text-rose-700 dark:text-rose-400">42 titles</span>
            </div>

            <div className="pt-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Most Active Readers
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">Aarav Sharma (10-A)</span>
                  <span>14 books read</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">Riya Gupta (10-A)</span>
                  <span>12 books read</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">Myra Agarwal (9-A)</span>
                  <span>11 books read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ISSUE BOOK MODAL (Section 18) */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Issue Library Book
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Register loan to student with automated return period
                </p>
              </div>
              <button
                onClick={() => {
                  setIsIssueModalOpen(false);
                  setValidationError('');
                  if (onCloseDirectIssueModal) onCloseDirectIssueModal();
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {validationError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleIssueSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={issueStudentId}
                    onChange={(e) => setIssueStudentId(e.target.value)}
                    placeholder="e.g. STU-1021"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={issueStudentName}
                    onChange={(e) => setIssueStudentName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Select Book *
                </label>
                <select
                  value={issueBookId}
                  onChange={(e) => setIssueBookId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies === 0}>
                      {b.title} — ({b.availableCopies} available of {b.totalCopies}) {b.availableCopies === 0 ? '[OUT OF STOCK]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Due Return Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsIssueModalOpen(false);
                    setValidationError('');
                    if (onCloseDirectIssueModal) onCloseDirectIssueModal();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-issue-book"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Issue Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RETURN BOOK MODAL (Section 19) */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Return Library Book
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select active student loan to process return
                </p>
              </div>
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Issued Book Loan
                </label>
                <select
                  value={selectedReturnRecordId}
                  onChange={(e) => setSelectedReturnRecordId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {borrowRecords
                    .filter(r => r.status !== 'Returned')
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.studentName} — {r.bookTitle} ({r.status})
                      </option>
                    ))}
                </select>
              </div>

              {selectedReturnRecord ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Student:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedReturnRecord.studentName} ({selectedReturnRecord.studentId})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Book:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedReturnRecord.bookTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Issue Date:</span>
                    <span>{selectedReturnRecord.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Due Date:</span>
                    <span className="font-medium">{selectedReturnRecord.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                    <span className={`font-bold ${selectedReturnRecord.status === 'Overdue' ? 'text-rose-600 dark:text-rose-400' : 'text-sky-600'}`}>
                      {selectedReturnRecord.status}
                    </span>
                  </div>

                  {selectedReturnRecord.overdueDays > 0 && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 mt-2">
                      <p className="font-bold">⚠️ Overdue by {selectedReturnRecord.overdueDays} days</p>
                      <p className="text-[11px] mt-0.5">
                        Fine rate: ₹5 / day • Total Calculated Fine: <strong className="underline">₹{selectedReturnRecord.fineAmount}</strong>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No active issued books found.</p>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-return-book"
                  type="button"
                  disabled={!selectedReturnRecord}
                  onClick={handleConfirmReturn}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  Return Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
