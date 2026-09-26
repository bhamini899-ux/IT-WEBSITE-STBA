import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Calendar, 
  AlertCircle, 
  Smartphone,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { PARENT_360_STATS } from '../../data/parentData';

export const ParentEngagementAnalytics: React.FC = () => {
  const metrics = [
    {
      id: 'delivery-rate',
      label: 'Notification Delivery Rate',
      value: '98.4%',
      target: 'Target: >95%',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
      icon: CheckCircle2,
      subtext: '512 of 520 guardians reached reliably via SMS & Mobile App push'
    },
    {
      id: 'read-rate',
      label: 'Notification Read Rate',
      value: '89.2%',
      target: 'Target: >85%',
      color: 'bg-blue-500',
      textColor: 'text-blue-700 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50',
      icon: Smartphone,
      subtext: 'Average acknowledgment within 14 minutes of dispatch'
    },
    {
      id: 'response-rate',
      label: 'Parent Response Rate',
      value: '76.5%',
      target: 'Target: >70%',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
      icon: MessageSquare,
      subtext: 'Interactive RSVP and consent forms electronically returned'
    },
    {
      id: 'ptm-participation',
      label: 'PTM Participation',
      value: '84.1%',
      target: 'Target: >80%',
      color: 'bg-purple-500',
      textColor: 'text-purple-700 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50',
      icon: Calendar,
      subtext: '28 confirmed slots for upcoming Term 1 consultation meetings'
    },
    {
      id: 'attendance-ack',
      label: 'Attendance Alert Acknowledgement',
      value: '91.0%',
      target: 'Target: >88%',
      color: 'bg-amber-500',
      textColor: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
      icon: AlertCircle,
      subtext: 'Same-day parental confirmation for unexcused absences or late arrival'
    },
    {
      id: 'announcement-eng',
      label: 'Announcement Engagement',
      value: '87.6%',
      target: 'Target: >80%',
      color: 'bg-teal-500',
      textColor: 'text-teal-700 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900/50',
      icon: BarChart3,
      subtext: 'Official circulars read and viewed within 24 hours of broadcast'
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Parent Engagement Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key operational health indicators measuring communication delivery, engagement, and parental responsiveness.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          Institution Rating: Excellent (91.2/100)
        </span>
      </div>

      {/* Analytics Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          const numericValue = parseFloat(item.value);
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border ${item.bg} space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.textColor}`} />
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {item.target}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${numericValue}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {item.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
