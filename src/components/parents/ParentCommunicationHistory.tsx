import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Mail, 
  Smartphone, 
  CheckCheck, 
  Clock, 
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ParentCommunicationItem } from '../../types';

interface ParentCommunicationHistoryProps {
  communications: ParentCommunicationItem[];
  onSelectParentById?: (parentId: string) => void;
}

export const ParentCommunicationHistory: React.FC<ParentCommunicationHistoryProps> = ({
  communications,
  onSelectParentById,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCommunications = useMemo(() => {
    return communications.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !q ||
        item.parentName.toLowerCase().includes(q) ||
        item.studentName.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.className.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (selectedChannel !== 'all' && item.channel !== selectedChannel) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      return true;
    });
  }, [communications, searchQuery, selectedChannel, selectedStatus, selectedCategory]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Read':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            <CheckCheck className="w-3 h-3 text-blue-600" />
            Read
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            <Clock className="w-3 h-3 text-slate-500" />
            Sent
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Parent Communication History</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-channel delivery log tracking all automated and administrative alerts sent to guardians.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {filteredCommunications.length} logged transmissions
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="history-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parent, student, or subject..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Delivery Channels</option>
              <option value="Email">Email</option>
              <option value="App">App Push</option>
              <option value="SMS">SMS</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Communication Types</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="BUS">Transport</option>
              <option value="ACADEMICS">Academics</option>
              <option value="FEES">Fees</option>
              <option value="EVENTS">Events / PTM</option>
              <option value="EXAMS">Exams</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Transmission Statuses</option>
              <option value="Read">Read / Acknowledged</option>
              <option value="Delivered">Delivered</option>
              <option value="Sent">Sent</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Parent / Guardian</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Subject & Message</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {filteredCommunications.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No communication records matching filters.
                </td>
              </tr>
            ) : (
              filteredCommunications.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{item.date}</div>
                    <div className="text-[10px] text-slate-400">{item.time}</div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {onSelectParentById ? (
                      <button
                        onClick={() => onSelectParentById(item.parentId)}
                        className="text-left hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {item.parentName}
                      </button>
                    ) : (
                      item.parentName
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{item.studentName}</div>
                    <div className="text-[10px] text-slate-400">{item.className}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {item.subject}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.message}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                    {item.channel}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden p-3 divide-y divide-slate-100 dark:divide-slate-800">
        {filteredCommunications.map((item) => (
          <div key={item.id} className="py-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">{item.parentName}</span>
              {getStatusBadge(item.status)}
            </div>
            <p className="font-semibold text-xs text-blue-600 dark:text-blue-400">{item.subject}</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">{item.message}</p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>{item.studentName} ({item.className})</span>
              <span>{item.date} • {item.channel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
