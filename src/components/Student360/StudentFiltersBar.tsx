import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  ArrowUpDown, 
  Bookmark, 
  RotateCcw,
  Check
} from 'lucide-react';
import { StudentHouse, StudentStatus } from '../../types';

export interface StudentFilterOptions {
  searchQuery: string;
  selectedClass: string;
  selectedHouse: string;
  selectedAttendanceRange: string; // 'all' | '<75' | '75-90' | '>90'
  selectedFeeStatus: string; // 'all' | 'Paid' | 'Pending' | 'Overdue'
  selectedLibraryStatus: string; // 'all' | 'issued' | 'overdue' | 'clean'
  selectedTransport: string; // 'all' | 'Bus 01' | 'Bus 02' | 'Bus 03' | 'Bus 04' | 'Private'
  selectedStudentStatus: string; // 'all' | 'Active' | 'On Leave' | 'Transferred' | 'Archived'
  onlyNewAdmissions: boolean;
  onlyAttentionNeeded: boolean;
  sortBy: 'name_asc' | 'name_desc' | 'roll_asc' | 'attendance_asc' | 'attendance_desc' | 'academic_desc' | 'fee_due';
}

interface StudentFiltersBarProps {
  filters: StudentFilterOptions;
  onChangeFilters: (newFilters: StudentFilterOptions) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalStudents: number;
}

export const StudentFiltersBar: React.FC<StudentFiltersBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalFiltered,
  totalStudents,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const naturalLanguageChips = [
    { label: 'Attendance < 75%', query: 'below 75% attendance' },
    { label: 'Overdue Books', query: 'overdue books' },
    { label: 'Pending / Overdue Fees', query: 'pending fee' },
    { label: 'Route 01 Bus', query: 'Route 01' },
    { label: 'New Admissions', query: 'new admissions' },
    { label: '10-B Students', query: '10-B' },
  ];

  const handleChipClick = (query: string) => {
    onChangeFilters({
      ...filters,
      searchQuery: query,
    });
  };

  const handleSavedView = (viewName: string) => {
    switch (viewName) {
      case 'attention':
        onChangeFilters({
          ...filters,
          searchQuery: '',
          selectedAttendanceRange: '<75',
          onlyAttentionNeeded: true,
          selectedFeeStatus: 'all',
          selectedClass: 'all',
        });
        break;
      case 'fee_overdue':
        onChangeFilters({
          ...filters,
          searchQuery: '',
          selectedFeeStatus: 'Overdue',
          selectedAttendanceRange: 'all',
          onlyAttentionNeeded: false,
        });
        break;
      case 'overdue_books':
        onChangeFilters({
          ...filters,
          searchQuery: '',
          selectedLibraryStatus: 'overdue',
          selectedAttendanceRange: 'all',
        });
        break;
      case 'route_01':
        onChangeFilters({
          ...filters,
          searchQuery: '',
          selectedTransport: 'Bus 01',
        });
        break;
      case 'house_agni':
        onChangeFilters({
          ...filters,
          searchQuery: '',
          selectedHouse: 'Agni',
        });
        break;
      default:
        onResetFilters();
        break;
    }
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.selectedClass !== 'all' ||
    filters.selectedHouse !== 'all' ||
    filters.selectedAttendanceRange !== 'all' ||
    filters.selectedFeeStatus !== 'all' ||
    filters.selectedLibraryStatus !== 'all' ||
    filters.selectedTransport !== 'all' ||
    filters.selectedStudentStatus !== 'all' ||
    filters.onlyNewAdmissions ||
    filters.onlyAttentionNeeded;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-3.5 space-y-3">
      {/* Top Search & Preset View Strip */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Natural Language / Deep Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="student-search-input"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search by student name, ID, roll no, parent phone, bus stop, or type natural query..."
            className="w-full pl-10 pr-9 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Toggle & Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showAdvanced || hasActiveFilters
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            )}
          </button>

          {/* Sort selector */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              id="student-sort-select"
              value={filters.sortBy}
              onChange={(e) => onChangeFilters({ ...filters, sortBy: e.target.value as any })}
              className="pl-7 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="roll_asc">Roll Number</option>
              <option value="attendance_desc">Highest Attendance</option>
              <option value="attendance_asc">Lowest Attendance</option>
              <option value="academic_desc">Top Academic Rank</option>
              <option value="fee_due">Fee Status</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Natural Language Prompt Chips */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mr-1 shrink-0">
          <Sparkles className="w-3 h-3" />
          <span>Smart Prompts:</span>
        </div>
        {naturalLanguageChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip.query)}
            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Advanced Filter Collapsible Area */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {/* Class / Section */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Class / Section
            </label>
            <select
              value={filters.selectedClass}
              onChange={(e) => onChangeFilters({ ...filters, selectedClass: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Class 10</option>
              <option value="10-A">Class 10-A</option>
              <option value="10-B">Class 10-B</option>
              <option value="10-C">Class 10-C</option>
              <option value="10-D">Class 10-D</option>
              <option value="10-E">Class 10-E</option>
            </select>
          </div>

          {/* House */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              School House
            </label>
            <select
              value={filters.selectedHouse}
              onChange={(e) => onChangeFilters({ ...filters, selectedHouse: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Houses</option>
              <option value="Agni">Agni (Red)</option>
              <option value="Surya">Surya (Gold)</option>
              <option value="Prithvi">Prithvi (Green)</option>
              <option value="Vayu">Vayu (Blue)</option>
              <option value="Trishul">Trishul (Purple)</option>
            </select>
          </div>

          {/* Attendance Threshold */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Attendance %
            </label>
            <select
              value={filters.selectedAttendanceRange}
              onChange={(e) => onChangeFilters({ ...filters, selectedAttendanceRange: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Attendance</option>
              <option value="<75">&lt; 75% (Attention)</option>
              <option value="75-90">75% - 90% (Moderate)</option>
              <option value=">90">&gt; 90% (Exemplary)</option>
            </select>
          </div>

          {/* Fee Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Fee Status
            </label>
            <select
              value={filters.selectedFeeStatus}
              onChange={(e) => onChangeFilters({ ...filters, selectedFeeStatus: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Fee Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Transport Route */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Transport
            </label>
            <select
              value={filters.selectedTransport}
              onChange={(e) => onChangeFilters({ ...filters, selectedTransport: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Transport</option>
              <option value="Bus 01">Bus 01 (Route 01)</option>
              <option value="Bus 02">Bus 02 (Route 02)</option>
              <option value="Bus 03">Bus 03 (Route 03)</option>
              <option value="Bus 04">Bus 04 (Route 04)</option>
              <option value="Private">Private / Self</option>
            </select>
          </div>

          {/* Library Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Library Status
            </label>
            <select
              value={filters.selectedLibraryStatus}
              onChange={(e) => onChangeFilters({ ...filters, selectedLibraryStatus: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Library States</option>
              <option value="issued">Books Issued</option>
              <option value="overdue">Overdue Books</option>
              <option value="clean">Clean / No Loans</option>
            </select>
          </div>
        </div>
      )}

      {/* Saved View Shortcuts & Count summary */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold flex items-center gap-1 text-slate-400">
            <Bookmark className="w-3 h-3" />
            Quick Views:
          </span>
          <button
            onClick={() => handleSavedView('all')}
            className="hover:text-blue-600 font-medium cursor-pointer"
          >
            All Students
          </button>
          <span>•</span>
          <button
            onClick={() => handleSavedView('attention')}
            className="hover:text-rose-600 font-medium cursor-pointer"
          >
            Attendance &lt; 75%
          </button>
          <span>•</span>
          <button
            onClick={() => handleSavedView('fee_overdue')}
            className="hover:text-amber-600 font-medium cursor-pointer"
          >
            Fee Overdue
          </button>
          <span>•</span>
          <button
            onClick={() => handleSavedView('overdue_books')}
            className="hover:text-purple-600 font-medium cursor-pointer"
          >
            Library Overdue
          </button>
          <span>•</span>
          <button
            onClick={() => handleSavedView('route_01')}
            className="hover:text-blue-600 font-medium cursor-pointer"
          >
            Bus 01 Riders
          </button>
        </div>

        <div className="font-semibold text-slate-700 dark:text-slate-300">
          Showing <span className="text-blue-600 dark:text-blue-400 font-bold">{totalFiltered}</span> of {totalStudents} students
        </div>
      </div>
    </div>
  );
};
