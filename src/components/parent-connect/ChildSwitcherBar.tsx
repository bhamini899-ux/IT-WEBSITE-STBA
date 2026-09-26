import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ChevronDown, 
  Check, 
  PhoneCall, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ChildProfile } from '../../types/parentConnect';

interface ChildSwitcherBarProps {
  childrenList: ChildProfile[];
  selectedChild: ChildProfile;
  onSelectChild: (child: ChildProfile) => void;
  onOpenEmergency: () => void;
  unreadCount: number;
}

export const ChildSwitcherBar: React.FC<ChildSwitcherBarProps> = ({
  childrenList,
  selectedChild,
  onSelectChild,
  onOpenEmergency,
  unreadCount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sectionFilter, setSectionFilter] = useState<'all' | '10-A' | '10-B' | '10-C' | '10-D' | '10-E'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChildren = useMemo(() => {
    return childrenList.filter(c => {
      if (sectionFilter !== 'all' && c.className !== sectionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchRoll = c.rollNo.toString() === q;
        const matchId = c.id.toLowerCase().includes(q);
        return matchName || matchRoll || matchId;
      }
      return true;
    });
  }, [childrenList, sectionFilter, searchQuery]);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 sm:px-6 sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Child Profile & Switcher Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-3">
            {/* Child Avatar with live presence ring */}
            <div className="relative shrink-0">
              <img
                src={selectedChild.avatar}
                alt={selectedChild.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30 dark:ring-blue-400/20 shadow-xs"
              />
              <span 
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                  selectedChild.todayStatus === 'In School' 
                    ? 'bg-emerald-500 ring-2 ring-emerald-500/30' 
                    : selectedChild.todayStatus === 'On Approved Leave'
                    ? 'bg-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-rose-500'
                }`}
                title={`Status: ${selectedChild.todayStatus}`}
              />
            </div>

            {/* Child Info & Trigger Button */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <button
                  id="child-switcher-trigger-btn"
                  onClick={() => setIsOpen(!isOpen)}
                  className="group flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {selectedChild.name}
                  </span>
                  <div className="p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600 transition-colors">
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Parent Connection Badge */}
                {selectedChild.parentLinked ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Parent Linked</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span>Parent: Not Linked</span>
                  </span>
                )}
              </div>

              {/* Class, Roll & Live Status detail */}
              <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Class {selectedChild.className}
                </span>
                <span>•</span>
                <span>Roll #{selectedChild.rollNo}</span>
                <span>•</span>
                <span>Class Teacher: <strong>{selectedChild.classTeacher}</strong></span>
                <span>•</span>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  {selectedChild.todayStatusDetail}
                </span>
              </div>
            </div>
          </div>

          {/* Child Switcher Dropdown Menu with Section Filter & Search */}
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Select Student ({filteredChildren.length} of {childrenList.length})
                    </p>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Class 10 Roster</span>
                  </div>

                  {/* Section Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {(['all', '10-A', '10-B', '10-C', '10-D', '10-E'] as const).map(sec => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setSectionFilter(sec)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                          sectionFilter === sec
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {sec === 'all' ? 'All (219)' : sec}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, roll no, ID..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-1 max-h-72 overflow-y-auto space-y-1">
                  {filteredChildren.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching students found in this section
                    </div>
                  ) : (
                    filteredChildren.map((child) => {
                      const isCurrent = child.id === selectedChild.id;
                      return (
                        <button
                          key={child.id}
                          onClick={() => {
                            onSelectChild(child);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                            isCurrent 
                              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 font-medium' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                              {child.rollNo}
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {child.name}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                Class {child.className} • Roll #{child.rollNo} • {child.parentLinked ? '✓ Parent Linked' : 'Parent Not Linked'}
                              </p>
                            </div>
                          </div>

                          {isCurrent && (
                            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Quick Controls: Emergency SOS & Presence Badge */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{selectedChild.todayStatus}</span>
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400 hidden xl:inline">
              Entry: <strong className="text-slate-700 dark:text-slate-200">{selectedChild.entryTimeToday || '--'}</strong>
            </span>
          </div>

          {/* Emergency SOS Callout */}
          <button
            id="parent-emergency-btn"
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

