import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Eye, 
  Send,
  X,
  FileText
} from 'lucide-react';
import { SchoolAnnouncement } from '../../types';
import { INITIAL_ANNOUNCEMENTS } from '../../data/parentData';

export const ParentAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New announcement form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Important' | 'Academic' | 'Events' | 'Transport' | 'Examination' | 'General'>('Important');
  const [newAudience, setNewAudience] = useState('All Parents');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newContent, setNewContent] = useState('');

  const handleCreateAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: SchoolAnnouncement = {
      id: `ANN-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      category: newCategory,
      date: 'Today, 18 Sep 2026',
      priority: newPriority,
      audience: newAudience,
      readCount: 0,
      totalTarget: newAudience === 'All Parents' ? 520 : 90,
      content: newContent,
      author: 'Principal Secretariat'
    };

    setAnnouncements(prev => [created, ...prev]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <span>School Announcements to Parents</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official institutional circulars, academic notices, and emergency advisories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-create-announcement"
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast Circular</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        {['all', 'Important', 'Academic', 'Events', 'Transport', 'Examination', 'General'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Bulletins' : cat}
          </button>
        ))}
      </div>

      {/* Announcement Cards List */}
      <div className="space-y-3">
        {filteredAnnouncements.map((ann) => {
          const totalTarget = ann.totalTarget ?? 520;
          const readCount = ann.readCount ?? Math.round(((ann.readPercentage ?? 85) / 100) * totalTarget);
          const readPercentage = ann.readPercentage ?? Math.round((readCount / totalTarget) * 100);
          return (
            <div
              key={ann.id}
              id={`announcement-card-${ann.id}`}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ann.priority === 'High'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
                  }`}>
                    {ann.priority} Priority
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {ann.category}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{ann.date}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Audience: <strong>{ann.audience}</strong></span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {ann.content}
                </p>
              </div>

              {/* Read Status Progress Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${readPercentage}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {readCount} of {totalTarget} ({readPercentage}% Read)
                  </span>
                </div>

                <span className="text-slate-400">
                  Dispatched by {ann.author}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Broadcast Parent Circular
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Schedule for Annual Sports Meet..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Important">Important</option>
                    <option value="Academic">Academic</option>
                    <option value="Events">Events</option>
                    <option value="Transport">Transport</option>
                    <option value="Examination">Examination</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Audience</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="All Parents">All Parents (520)</option>
                    <option value="Classes 10 & 12">Classes 10 & 12</option>
                    <option value="Bus Route 4 Guardians">Bus Route 4 Guardians</option>
                    <option value="Primary School Parents">Primary School Parents</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Announcement Body</label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Type circular notice content..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAnnouncement}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
