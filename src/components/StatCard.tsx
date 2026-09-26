import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'emerald' | 'amber' | 'sky' | 'rose' | 'slate';
  };
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  iconColorClass = 'text-blue-600 dark:text-blue-400',
  iconBgClass = 'bg-blue-50 dark:bg-blue-950/50',
  onClick,
}) => {
  const badgeColors = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
    sky: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800/50',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 group' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1.5 font-sans">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${iconBgClass}`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass}`} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap text-xs">
        {subtitle && (
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {subtitle}
          </span>
        )}
        {badge && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold border ${
              badgeColors[badge.variant || 'emerald']
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
};
