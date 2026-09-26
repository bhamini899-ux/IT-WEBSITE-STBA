import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Send, 
  UserCheck, 
  Phone, 
  Mail, 
  AlertCircle, 
  Eye, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { ParentGuardianRecord } from '../../types';

interface ParentDirectoryProps {
  parents: ParentGuardianRecord[];
  onSelectParent: (parent: ParentGuardianRecord) => void;
  onSendNotificationToParent: (parent: ParentGuardianRecord) => void;
}

export const ParentDirectory: React.FC<ParentDirectoryProps> = ({
  parents,
  onSelectParent,
  onSendNotificationToParent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedCommStatus, setSelectedCommStatus] = useState('all');
  const [selectedActionFilter, setSelectedActionFilter] = useState('all');
  const [selectedAccountStatus, setSelectedAccountStatus] = useState('all');

  // Extract unique classes
  const classesList = useMemo(() => {
    const set = new Set(parents.map(p => p.className));
    return Array.from(set).sort();
  }, [parents]);

  // Filtered parents
  const filteredParents = useMemo(() => {
    return parents.filter(p => {
      // Search matches
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.primaryContactName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.linkedStudentName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.className.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Class filter
      if (selectedClass !== 'all' && p.className !== selectedClass) return false;

      // Communication status filter
      if (selectedCommStatus !== 'all' && p.communicationStatus !== selectedCommStatus) return false;

      // Account status filter
      if (selectedAccountStatus !== 'all' && p.accountStatus !== selectedAccountStatus) return false;

      // Pending action filter
      if (selectedActionFilter === 'pending' && p.pendingActionCount === 0) return false;
      if (selectedActionFilter === 'none' && p.pendingActionCount > 0) return false;

      return true;
    });
  }, [parents, searchQuery, selectedClass, selectedCommStatus, selectedAccountStatus, selectedActionFilter]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      {/* Directory Title & Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Parent & Guardian Directory</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {filteredParents.length} {filteredParents.length === 1 ? 'record' : 'records'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any guardian to inspect comprehensive 360° academic, attendance, transport, and communication history.
            </p>
          </div>
        </div>

        {/* Clean Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="parent-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by parent, student, phone, or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              id="parent-class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">All Classes & Sections</option>
              {classesList.map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>

          {/* Communication Status Filter */}
          <div>
            <select
              id="parent-comm-filter"
              value={selectedCommStatus}
              onChange={(e) => setSelectedCommStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">All Channels</option>
              <option value="App Verified">App Verified</option>
              <option value="Opted In">WhatsApp / Opted In</option>
              <option value="SMS Only">SMS Only</option>
              <option value="Active">Active</option>
            </select>
          </div>

          {/* Pending Actions Filter */}
          <div>
            <select
              id="parent-action-filter"
              value={selectedActionFilter}
              onChange={(e) => setSelectedActionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">All Action Statuses</option>
              <option value="pending">Needs Action (Pending)</option>
              <option value="none">No Pending Actions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View (Hidden on mobile < 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3 px-4">Parent & ID</th>
              <th className="py-3 px-4">Linked Student</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Channel & Status</th>
              <th className="py-3 px-4">Last Notification</th>
              <th className="py-3 px-4">Pending Actions</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {filteredParents.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No matching parent records found
                    </p>
                    <p className="text-xs">Try adjusting your search criteria or clearing filter dropdowns.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredParents.map((parent) => (
                <tr
                  key={parent.id}
                  id={`parent-row-${parent.id}`}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectParent(parent)}
                >
                  {/* Parent Name & ID */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{parent.primaryContactName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                        {parent.relationship}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                      {parent.id}
                    </div>
                  </td>

                  {/* Linked Student */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={parent.studentPhotoUrl}
                        alt={parent.linkedStudentName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {parent.linkedStudentName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Roll #{parent.rollNo}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Class / Section */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50">
                      {parent.className}
                    </span>
                  </td>

                  {/* Contact Info */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                      {parent.phone}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {parent.email}
                    </div>
                  </td>

                  {/* Channel & Status */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        parent.communicationStatus === 'App Verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : parent.communicationStatus === 'Opted In'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}>
                        {parent.communicationStatus}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Pref: {parent.preferredChannel}
                    </div>
                  </td>

                  {/* Last Notification */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[150px]">
                      {parent.lastNotificationType}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {parent.lastNotificationDate}
                    </div>
                  </td>

                  {/* Pending Actions */}
                  <td className="py-3.5 px-4">
                    {parent.pendingActionCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        {parent.pendingActionCount} {parent.pendingActionCount === 1 ? 'action' : 'actions'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Resolved
                      </span>
                    )}
                  </td>

                  {/* Row Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        id={`btn-notify-parent-${parent.id}`}
                        onClick={() => onSendNotificationToParent(parent)}
                        title="Send Notification"
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`btn-inspect-parent-${parent.id}`}
                        onClick={() => onSelectParent(parent)}
                        title="Inspect 360° Profile"
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (Visible on screens < 768px) */}
      <div className="block md:hidden p-3 divide-y divide-slate-100 dark:divide-slate-800">
        {filteredParents.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No parent records matching criteria.
          </div>
        ) : (
          filteredParents.map((parent) => (
            <div
              key={parent.id}
              id={`parent-card-mobile-${parent.id}`}
              onClick={() => onSelectParent(parent)}
              className="py-3.5 first:pt-1 last:pb-1 space-y-2.5 active:bg-slate-50 dark:active:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={parent.studentPhotoUrl}
                    alt={parent.linkedStudentName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{parent.primaryContactName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {parent.relationship}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <span>Student: <strong className="text-slate-700 dark:text-slate-200">{parent.linkedStudentName}</strong></span>
                      <span>•</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{parent.className}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  parent.communicationStatus === 'App Verified'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {parent.preferredChannel}
                </span>
              </div>

              {/* Contacts & Pending badges */}
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {parent.phone}
                  </span>
                </div>
                {parent.pendingActionCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {parent.pendingActionCount} Pending
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Up to date
                  </span>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
                  <span>Last: {parent.lastNotificationType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSendNotificationToParent(parent)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Notify</span>
                  </button>
                  <button
                    onClick={() => onSelectParent(parent)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
