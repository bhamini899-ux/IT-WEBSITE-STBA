import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Bot, 
  Lightbulb, 
  CheckCircle2, 
  ShieldCheck,
  AlertTriangle,
  Clock,
  Calendar
} from 'lucide-react';
import { AppSection, Teacher, SubstitutionRecord, TimetableSlot } from '../../types';
import { generateLiveDailyBriefing } from '../../utils/aiSchoolCopilot';

interface AIDailyBriefingPanelProps {
  onNavigate: (section: AppSection) => void;
  onOpenAIAssistant?: () => void;
  teachers?: Teacher[];
  substitutions?: SubstitutionRecord[];
  timetableSlots?: TimetableSlot[];
}

export const AIDailyBriefingPanel: React.FC<AIDailyBriefingPanelProps> = ({
  onNavigate,
  onOpenAIAssistant,
  teachers = [],
  substitutions = [],
  timetableSlots = []
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dynamically compute live briefing from current school state!
  const liveBriefing = generateLiveDailyBriefing(teachers, substitutions, timetableSlots);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(k => k + 1);
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-md border border-indigo-800/60 relative overflow-hidden flex flex-col justify-between">
      {/* Background Decorative Glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-800/40 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI School Operations Daily Briefing</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30 uppercase tracking-wide">
                  Gemini Synthesis
                </span>
              </div>
              <p className="text-xs text-indigo-200/70">Seth Tolaram Bafna Academy • Live Multi-System Synthesis</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Regenerate Live Briefing"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* AI Headline Summary */}
        <div className="my-3.5 p-3 rounded-xl bg-white/5 border border-white/10 relative z-10">
          <p className="text-sm font-semibold text-blue-100 leading-relaxed">
            "{liveBriefing.headline}"
          </p>
        </div>

        {/* Dynamic Multi-Section Intelligence Bullet Points */}
        <div className="space-y-2 relative z-10 text-xs">
          {liveBriefing.keyPoints.map((pt, i) => (
            <div key={i} className="flex items-start gap-2 text-indigo-100/90 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <span>{pt}</span>
            </div>
          ))}
        </div>

        {/* Immediate Action Bar if actions exist */}
        {liveBriefing.actionsRequired.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-1.5 text-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{liveBriefing.actionsRequired[0]}</span>
            </div>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-[11px] font-bold text-rose-300 hover:text-white underline shrink-0 cursor-pointer"
            >
              Resolve Now →
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-3 border-t border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <button
          onClick={handleRefresh}
          className="text-xs font-semibold text-indigo-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Sync Real-Time Data</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenAIAssistant && (
            <button
              onClick={onOpenAIAssistant}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer border border-white/10 flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-blue-300" />
              <span>Ask AI Copilot</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('timetable')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <span>Timetable Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
