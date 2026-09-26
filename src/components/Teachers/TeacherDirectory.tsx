import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  Phone, 
  Download, 
  UserPlus, 
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Edit2,
  Trash2,
  BookOpen,
  GraduationCap,
  Users
} from 'lucide-react';
import { Teacher } from '../../types';

interface TeacherDirectoryProps {
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
  onEditTeacher?: (teacher: Teacher) => void;
  onDeleteTeacher?: (teacher: Teacher) => void;
  onOpenTimetable?: (teacherId: string) => void;
  onAddTeacher?: () => void;
  onExportList?: () => void;
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({
  teachers,
  onSelectTeacher,
  onEditTeacher,
  onDeleteTeacher,
  onOpenTimetable,
  onAddTeacher,
  onExportList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filter teachers by name, subject, designation, phone, or class
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        t.name.toLowerCase().includes(query) ||
        (t.employeeId && t.employeeId.toLowerCase().includes(query)) ||
        (t.subjects && t.subjects.some(s => s.toLowerCase().includes(query))) ||
        (t.designation && t.designation.toLowerCase().includes(query)) ||
        (t.phone && t.phone.toLowerCase().includes(query)) ||
        (t.classes && t.classes.some(c => c.toLowerCase().includes(query)));

      const matchesDesig = selectedDesignation === 'All' || t.designation === selectedDesignation;

      return matchesSearch && matchesDesig;
    });
  }, [teachers, searchQuery, selectedDesignation]);

  const totalPages = Math.ceil(filteredTeachers.length / pageSize) || 1;
  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTeachers.slice(start, start + pageSize);
  }, [filteredTeachers, currentPage, pageSize]);

  const getDesignationBadge = (designation: string) => {
    switch (designation) {
      case 'Head of Department':
      case 'HOD':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Coordinator':
        return 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Senior Teacher':
      case 'PGT':
        return 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="search-faculty-input"
              type="text"
              placeholder="Search faculty by name, subject, designation, class, or contact..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Controls: Filter, View Toggle, Add Teacher */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              id="filter-designation-select"
              value={selectedDesignation}
              onChange={(e) => {
                setSelectedDesignation(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Designations</option>
              <option value="Teacher">Teacher</option>
              <option value="Senior Teacher">Senior Teacher</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Head of Department">Head of Department</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                id="btn-view-mode-cards"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'cards' 
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Cards View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="btn-view-mode-table"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' 
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Teacher Action */}
            {onAddTeacher && (
              <button
                type="button"
                id="btn-add-teacher-main"
                onClick={onAddTeacher}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Teacher</span>
              </button>
            )}

            {onExportList && teachers.length > 0 && (
              <button
                type="button"
                id="btn-export-teachers"
                onClick={onExportList}
                className="p-2 sm:px-3 sm:py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Export Faculty CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 8. EMPTY STATE: When no teachers have been added yet */}
      {teachers.length === 0 ? (
        <div 
          id="teacher-empty-state"
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-10 sm:p-14 text-center shadow-xs max-w-xl mx-auto my-6 space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              No teachers added yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Add your school's teachers to build your faculty directory.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              id="btn-empty-add-teacher"
              onClick={onAddTeacher}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Teacher</span>
            </button>
          </div>
        </div>
      ) : filteredTeachers.length === 0 ? (
        /* Empty search results state */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No teachers found matching "{searchQuery}"
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedDesignation('All'); }}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Results count header */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {filteredTeachers.length} of {teachers.length} faculty member{teachers.length !== 1 ? 's' : ''}
            </span>
            {totalPages > 1 && (
              <span>Page {currentPage} of {totalPages}</span>
            )}
          </div>

          {/* 5. TEACHER CARDS VIEW (Clean, professional card layout) */}
          {viewMode === 'cards' ? (
            <div 
              id="teachers-cards-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {paginatedTeachers.map(teacher => {
                const subjectName = teacher.subjects?.[0] || 'General';
                const classList = teacher.classes && teacher.classes.length > 0 ? teacher.classes.join(', ') : 'Not assigned';

                return (
                  <div
                    key={teacher.id}
                    id={`teacher-card-${teacher.id}`}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header: Photo & Designation Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="relative">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs group-hover:scale-[1.02] transition-transform"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Fallback if image load fails
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(teacher.name)}&backgroundColor=092248&textColor=ffffff`;
                            }}
                          />
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getDesignationBadge(teacher.designation)}`}>
                          {teacher.designation || 'Teacher'}
                        </span>
                      </div>

                      {/* Teacher Details */}
                      <div className="mt-3.5 space-y-1.5">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base tracking-tight leading-snug">
                          {teacher.name}
                        </h4>

                        {/* Subject */}
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                          <BookOpen className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{subjectName}</span>
                        </div>

                        {/* Class / Section */}
                        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 pt-0.5">
                          <span className="font-semibold text-slate-400 dark:text-slate-500">Class:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                            {classList}
                          </span>
                        </div>

                        {/* Contact Number */}
                        {teacher.phone && (
                          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <a 
                              href={`tel:${teacher.phone}`} 
                              onClick={(e) => e.stopPropagation()}
                              className="font-mono text-[11px] hover:text-emerald-600 transition-colors"
                            >
                              {teacher.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: View | Edit | Delete */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        id={`btn-view-teacher-${teacher.id}`}
                        onClick={() => onSelectTeacher(teacher)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="View teacher profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {onEditTeacher && (
                          <button
                            type="button"
                            id={`btn-edit-teacher-${teacher.id}`}
                            onClick={() => onEditTeacher(teacher)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-amber-200/80 dark:border-amber-800"
                            title="Edit teacher"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}

                        {onDeleteTeacher && (
                          <button
                            type="button"
                            id={`btn-delete-teacher-${teacher.id}`}
                            onClick={() => onDeleteTeacher(teacher)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-rose-200/80 dark:border-rose-800"
                            title="Delete teacher"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div 
              id="teachers-table-container"
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-700/80">
                    <tr>
                      <th className="py-3.5 px-4">Faculty Member</th>
                      <th className="py-3.5 px-3">Subject</th>
                      <th className="py-3.5 px-3">Designation</th>
                      <th className="py-3.5 px-3">Class / Section</th>
                      <th className="py-3.5 px-3">Contact</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedTeachers.map(teacher => {
                      const subjectName = teacher.subjects?.[0] || 'General';
                      const classList = teacher.classes && teacher.classes.length > 0 ? teacher.classes.join(', ') : 'Not assigned';

                      return (
                        <tr 
                          key={teacher.id} 
                          id={`teacher-row-${teacher.id}`}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* Teacher Photo & Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={teacher.avatar} 
                                alt={teacher.name}
                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(teacher.name)}&backgroundColor=092248&textColor=ffffff`;
                                }}
                              />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white text-xs">{teacher.name}</p>
                                <span className="text-[11px] font-mono text-slate-400">{teacher.employeeId}</span>
                              </div>
                            </div>
                          </td>

                          {/* Subject */}
                          <td className="py-3 px-3 font-semibold text-emerald-700 dark:text-emerald-400">
                            {subjectName}
                          </td>

                          {/* Designation */}
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${getDesignationBadge(teacher.designation)}`}>
                              {teacher.designation || 'Teacher'}
                            </span>
                          </td>

                          {/* Class / Section */}
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                            {classList}
                          </td>

                          {/* Contact */}
                          <td className="py-3 px-3">
                            {teacher.phone ? (
                              <a 
                                href={`tel:${teacher.phone}`}
                                className="font-mono text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-[11px] flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{teacher.phone}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Simple Actions: View | Edit | Delete */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                id={`btn-table-view-teacher-${teacher.id}`}
                                onClick={() => onSelectTeacher(teacher)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                                title="View"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>

                              {onEditTeacher && (
                                <button
                                  type="button"
                                  id={`btn-table-edit-teacher-${teacher.id}`}
                                  onClick={() => onEditTeacher(teacher)}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 border border-amber-200 dark:border-amber-800"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                              )}

                              {onDeleteTeacher && (
                                <button
                                  type="button"
                                  id={`btn-table-delete-teacher-${teacher.id}`}
                                  onClick={() => onDeleteTeacher(teacher)}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 border border-rose-200 dark:border-rose-800"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <span className="text-slate-500 font-medium">
                Page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
