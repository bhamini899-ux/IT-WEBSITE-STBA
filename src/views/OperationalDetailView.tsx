import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Lightbulb, 
  Megaphone, 
  DoorOpen, 
  Wrench, 
  DollarSign, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { AppSection } from '../types';

interface OperationalDetailViewProps {
  section: AppSection;
  onNavigate: (section: AppSection) => void;
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const OperationalDetailView: React.FC<OperationalDetailViewProps> = ({
  section,
  onNavigate,
  onShowToast,
}) => {
  const getSectionMetadata = () => {
    switch (section) {
      case 'timetable':
        return {
          title: 'Master Academic Timetable',
          subtitle: 'Active schedules, room assignments, faculty periods & substitutions',
          icon: Clock,
          color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
          stats: [
            { label: 'Periods Today', val: '8 Periods' },
            { label: 'Rooms Active', val: '31 Classrooms' },
            { label: 'Faculty Active', val: '142 Teachers' },
            { label: 'Substitutions', val: '6 Covered' }
          ]
        };
      case 'smart_alerts':
        return {
          title: 'Smart Alerts & Incident Response',
          subtitle: 'Autonomous cross-system priority dispatch & safety logs',
          icon: AlertTriangle,
          color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60',
          stats: [
            { label: 'Active Alerts', val: '5 Priority' },
            { label: 'Critical Level', val: '1 Medical' },
            { label: 'Average SLA', val: '4.2 Minutes' },
            { label: 'Resolved Today', val: '18 Incidents' }
          ]
        };
      case 'smart_insights':
        return {
          title: 'Institutional Intelligence & AI Insights',
          subtitle: 'Predictive modeling for attendance retention, energy waste & bus routing',
          icon: Lightbulb,
          color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
          stats: [
            { label: 'Active Patterns', val: '5 Insights' },
            { label: 'Accuracy Score', val: '98.4%' },
            { label: 'Suggested Fixes', val: '5 Prescribed' },
            { label: 'CO₂ Avoided', val: '1.7 Tons' }
          ]
        };
      case 'calendar':
        return {
          title: 'School Master Calendar',
          subtitle: 'Institutional academic fixtures, examinations, PTMs & holidays',
          icon: Calendar,
          color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
          stats: [
            { label: 'Term Events', val: '24 Scheduled' },
            { label: 'Exams Upcoming', val: 'CBSE Unit 2' },
            { label: 'Sports Meets', val: 'Annual Athletic' },
            { label: 'PTM Schedule', val: 'Confirmed' }
          ]
        };
      case 'announcements':
        return {
          title: 'Campus Public Broadcasts',
          subtitle: 'Official broadcasts sent to mobile apps, student portals & campus displays',
          icon: Megaphone,
          color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
          stats: [
            { label: 'Active Notices', val: '3 Broadcasts' },
            { label: 'Audience Reach', val: '219 Parents' },
            { label: 'Delivery Rate', val: '99.1%' },
            { label: 'Channel Priority', val: 'High Active' }
          ]
        };
      case 'classrooms':
        return {
          title: 'Classroom & Space Occupancy',
          subtitle: 'IoT PIR motion detection, temperature regulation & room utilization',
          icon: DoorOpen,
          color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
          stats: [
            { label: 'Total Rooms', val: '42 Rooms' },
            { label: 'Occupied', val: '31 Active' },
            { label: 'Available', val: '9 Free' },
            { label: 'HVAC Eco Mode', val: 'Engaged' }
          ]
        };
      case 'maintenance':
        return {
          title: 'Campus Facility & Equipment Maintenance',
          subtitle: 'Facility servicing, breakdown tickets, preventive maintenance & technician logs',
          icon: Wrench,
          color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60',
          stats: [
            { label: 'Open Tickets', val: '12 Active' },
            { label: 'Critical Level', val: '1 Pending' },
            { label: 'Completed Today', val: '8 Tickets' },
            { label: 'Average Fix Time', val: '1.4 Hours' }
          ]
        };
      case 'finance':
        return {
          title: 'Fee Gateway & Institutional Finance',
          subtitle: 'Collection targets, pending student dues, ledger reconciliation & daily inflow',
          icon: DollarSign,
          color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
          stats: [
            { label: "Today's Inflow", val: '₹1,84,500' },
            { label: 'Month Collection', val: '₹42.8 Lakhs' },
            { label: 'Target Completion', val: '91% Achieved' },
            { label: 'Net Balance', val: '₹23.6 Lakhs' }
          ]
        };
      default:
        return {
          title: `${section.charAt(0).toUpperCase() + section.slice(1).replace('_', ' ')} Management`,
          subtitle: 'Enterprise school management operational interface',
          icon: Users,
          color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
          stats: [
            { label: 'Status', val: 'Optimal' },
            { label: 'Audited', val: 'Real-time' },
            { label: 'Telemetry', val: 'Synchronized' },
            { label: 'Access', val: 'Administrator' }
          ]
        };
    }
  };

  const meta = getSectionMetadata();
  const Icon = meta.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Return to School Command Center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Command Center Sub-Module
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">Live Operating Record</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
              <span>{meta.title}</span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs shadow-xs cursor-pointer"
        >
          <span>Command Center Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {meta.stats.map((st) => (
          <div key={st.label} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">{st.label}</span>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              {st.val}
            </div>
          </div>
        ))}
      </div>

      {/* Main Operational Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${meta.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active System Console</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{meta.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onShowToast) {
                onShowToast('Record Refreshed', 'Telemetry re-synchronized with central server.', 'info');
              }
            }}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Re-sync Data
          </button>
        </div>

        {/* Live Operational Status Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Autonomous Service Broker connected • Zero transmission errors</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">PORT 3000 • NGINX ROUTE</span>
        </div>

        {/* Quick Operational Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Changes made in this operational console automatically propagate to the main School Command Center and related smart modules.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Return to Command Center
          </button>
        </div>
      </div>
    </div>
  );
};
