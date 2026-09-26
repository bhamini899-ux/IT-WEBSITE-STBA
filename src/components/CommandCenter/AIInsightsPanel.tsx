import React from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  Zap, 
  Bus, 
  BookOpen, 
  Wrench, 
  ArrowUpRight 
} from 'lucide-react';
import { SchoolAIInsight, AppSection } from '../../types';

interface AIInsightsPanelProps {
  insights: SchoolAIInsight[];
  onNavigate: (section: AppSection) => void;
  onApplyAction?: (insightId: string) => void;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  onNavigate,
  onApplyAction,
}) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'attendance':
        return <UserCheck className="w-3.5 h-3.5 text-blue-500" />;
      case 'energy':
        return <Zap className="w-3.5 h-3.5 text-emerald-500" />;
      case 'transport':
        return <Bus className="w-3.5 h-3.5 text-amber-500" />;
      case 'library':
        return <BookOpen className="w-3.5 h-3.5 text-purple-500" />;
      case 'maintenance':
      default:
        return <Wrench className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
      case 'low':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Predictive AI Insights</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pattern detection & prescriptive administrative actions</p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {insights.length} Actionable
          </span>
        </div>

        {/* Insights Cards List */}
        <div className="space-y-3 mt-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
          {insights.map((ins) => (
            <div 
              key={ins.id}
              className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-700 shadow-2xs border border-slate-200/60 dark:border-slate-600">
                    {getCategoryIcon(ins.category)}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{ins.title}</span>
                </div>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getSeverityBadge(ins.severity)}`}>
                  {ins.severity} priority
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {ins.explanation}
              </p>

              {/* Action Box */}
              <div className="mt-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  <strong className="text-blue-600 dark:text-blue-400">Suggested Action: </strong>
                  {ins.suggestedAction}
                </span>

                <button
                  onClick={() => onNavigate(ins.targetSection)}
                  className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold transition-colors cursor-pointer shrink-0 self-end sm:self-auto flex items-center gap-1"
                >
                  <span>Resolve in Module</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Continuous neural pattern scanning</span>
        <button
          onClick={() => onNavigate('smart_insights')}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          View Full Intelligence Hub
        </button>
      </div>
    </div>
  );
};
