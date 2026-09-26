import React, { useState } from 'react';
import { 
  Users, 
  Bell, 
  AlertCircle, 
  Calendar, 
  Megaphone, 
  MessageSquare, 
  TrendingUp, 
  Sparkles,
  Search,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { ParentGuardianRecord, ParentCommunicationItem, ParentActionItem, NotificationCategory, AppSection } from '../types';
import { INITIAL_PARENT_RECORDS, INITIAL_COMMUNICATION_HISTORY, createParentRecordFromStudent } from '../data/parentData';
import { getPersistentStudents } from '../services/studentPersistenceService';
import { ParentHeaderStats } from '../components/parents/ParentHeaderStats';
import { ParentDirectory } from '../components/parents/ParentDirectory';
import { ParentProfile360Modal } from '../components/parents/ParentProfile360Modal';
import { ParentNotificationCenter } from '../components/parents/ParentNotificationCenter';
import { NotificationPreviewPanel } from '../components/parents/NotificationPreviewPanel';
import { ParentActionCenter } from '../components/parents/ParentActionCenter';
import { PTMManagementCenter } from '../components/parents/PTMManagementCenter';
import { ParentCommunicationHistory } from '../components/parents/ParentCommunicationHistory';
import { ParentAnnouncements } from '../components/parents/ParentAnnouncements';
import { ParentEngagementAnalytics } from '../components/parents/ParentEngagementAnalytics';
import { AIParentCopilot } from '../components/parents/AIParentCopilot';

interface ParentManagementViewProps {
  onNavigateSection?: (section: AppSection) => void;
}

export const ParentManagementView: React.FC<ParentManagementViewProps> = ({ onNavigateSection }) => {
  const [parents, setParents] = useState<ParentGuardianRecord[]>(() => {
    try {
      const liveStudents = getPersistentStudents();
      if (liveStudents && liveStudents.length > 0) {
        return liveStudents.map((s, idx) => createParentRecordFromStudent(s, idx));
      }
    } catch (e) {
      console.error('Failed to load persistent students for parents', e);
    }
    return INITIAL_PARENT_RECORDS;
  });
  const [communications, setCommunications] = useState<ParentCommunicationItem[]>(INITIAL_COMMUNICATION_HISTORY);
  
  // Active navigation tab within Module 5
  const [activeSubTab, setActiveSubTab] = useState<
    'directory' | 'notifications' | 'actions' | 'ptm' | 'announcements' | 'history' | 'analytics'
  >('directory');

  // Selected parent for 360° inspector modal
  const [inspectedParent, setInspectedParent] = useState<ParentGuardianRecord | null>(null);

  // Quick dispatch modal state
  const [quickDispatchParent, setQuickDispatchParent] = useState<ParentGuardianRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle successful notification dispatch
  const handleDispatchedNotification = (data: {
    parent: ParentGuardianRecord;
    category: NotificationCategory;
    subject: string;
    message: string;
    channel: string;
  }) => {
    const newCommItem: ParentCommunicationItem = {
      id: `COMM-${Date.now().toString().slice(-5)}`,
      parentId: data.parent.id,
      parentName: data.parent.primaryContactName,
      studentId: data.parent.linkedStudentId,
      studentName: data.parent.linkedStudentName,
      className: data.parent.className,
      category: data.category,
      subject: data.subject,
      message: data.message,
      channel: data.channel as any,
      status: 'Sent',
      date: 'Today, 18 Sep',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCommunications(prev => [newCommItem, ...prev]);

    // Update parent's last notification
    setParents(prev => prev.map(p => {
      if (p.id === data.parent.id) {
        return {
          ...p,
          lastNotificationType: data.subject,
          lastNotificationDate: 'Today, 18 Sep',
        };
      }
      return p;
    }));

    showToast(`✓ Notification queued successfully for ${data.parent.primaryContactName} (${data.channel})`);
  };

  // Handle execution of a pending parent action
  const handleExecuteAction = (action: ParentActionItem) => {
    showToast(`✓ Action executed: ${action.actionLabel} broadcasted to ${action.affectedCount} parents`);
  };

  const handleStatCardAction = (actionKey: string) => {
    if (actionKey === 'pending') setActiveSubTab('actions');
    if (actionKey === 'ptm') setActiveSubTab('ptm');
    if (actionKey === 'attendance' || actionKey === 'transport') setActiveSubTab('notifications');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-700 dark:border-slate-200 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Statistics & Module Banner */}
      <ParentHeaderStats parents={parents} onActionClick={handleStatCardAction} />

      {/* Module Sub-Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'directory', label: 'Parent Directory', icon: Users },
          { id: 'notifications', label: 'Notification Center', icon: Bell },
          { id: 'actions', label: 'Pending Actions', icon: AlertCircle },
          { id: 'ptm', label: 'PTM Center', icon: Calendar },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'history', label: 'Communication Log', icon: MessageSquare },
          { id: 'analytics', label: 'Analytics & Copilot', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`subtab-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        {onNavigateSection && (
          <button
            onClick={() => onNavigateSection('parent_connect')}
            className="hidden sm:flex items-center gap-1.5 ml-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Parent Connect Portal</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">Mobile-First</span>
          </button>
        )}
      </div>

      {/* Sub-Tab 1: Parent Directory */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          <ParentDirectory
            parents={parents}
            onSelectParent={(p) => setInspectedParent(p)}
            onSendNotificationToParent={(p) => {
              setQuickDispatchParent(p);
              setActiveSubTab('notifications');
            }}
          />
        </div>
      )}

      {/* Sub-Tab 2: Notification Center */}
      {activeSubTab === 'notifications' && (
        <div className="space-y-6">
          <ParentNotificationCenter
            parents={parents}
            onDispatchedNotification={handleDispatchedNotification}
            onSelectParentForInspection={(p) => setInspectedParent(p)}
          />
        </div>
      )}

      {/* Sub-Tab 3: Pending Parent Action Center */}
      {activeSubTab === 'actions' && (
        <div className="space-y-6">
          <ParentActionCenter
            onExecuteAction={handleExecuteAction}
            onFilterDirectory={(filterKeyword) => {
              setActiveSubTab('directory');
            }}
          />
        </div>
      )}

      {/* Sub-Tab 4: PTM Management Center */}
      {activeSubTab === 'ptm' && (
        <div className="space-y-6">
          <PTMManagementCenter
            onInspectParentByName={(parentName) => {
              const match = parents.find(p => p.primaryContactName.toLowerCase().includes(parentName.toLowerCase()));
              if (match) setInspectedParent(match);
            }}
          />
        </div>
      )}

      {/* Sub-Tab 5: Announcements */}
      {activeSubTab === 'announcements' && (
        <div className="space-y-6">
          <ParentAnnouncements />
        </div>
      )}

      {/* Sub-Tab 6: Communication History */}
      {activeSubTab === 'history' && (
        <div className="space-y-6">
          <ParentCommunicationHistory
            communications={communications}
            onSelectParentById={(pId) => {
              const match = parents.find(p => p.id === pId);
              if (match) setInspectedParent(match);
            }}
          />
        </div>
      )}

      {/* Sub-Tab 7: Analytics & AI Copilot */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <ParentEngagementAnalytics />
          <AIParentCopilot
            parents={parents}
            communications={communications}
            onSelectParent={(p) => setInspectedParent(p)}
          />
        </div>
      )}

      {/* Parent 360° Profile Inspector Modal */}
      {inspectedParent && (
        <ParentProfile360Modal
          parent={inspectedParent}
          communications={communications}
          onClose={() => setInspectedParent(null)}
          onSendNotification={(p) => {
            setInspectedParent(null);
            setQuickDispatchParent(p);
            setActiveSubTab('notifications');
          }}
        />
      )}
    </div>
  );
};
