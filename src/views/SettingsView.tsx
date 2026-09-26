import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  Sliders, 
  Shield, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  Globe, 
  Radio, 
  Key,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';

interface SettingsViewProps {
  onSaveSettings: () => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onSaveSettings,
  onResetDemoData,
}) => {
  const [schoolName, setSchoolName] = useState('Seth Tolaram Bafna Academy');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [principalName, setPrincipalName] = useState('Dr. S. Ramanathan');
  const [parentSmsEnabled, setParentSmsEnabled] = useState(true);
  const [whatsAppBroadcast, setWhatsAppBroadcast] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [iotInterval, setIotInterval] = useState('30s');
  const [gpsInterval, setGpsInterval] = useState('10s');
  const [attendanceCutoff, setAttendanceCutoff] = useState('08:45 AM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
          Platform Settings & Configuration
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage institution details, IoT telemetry gateways, and notification rules.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Profile */}
        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Institution Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                School identification details displayed across parent notices and reports
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                School Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Academic Session
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Head of School / Principal
              </label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Morning Roll-Call Cutoff Time
              </label>
              <input
                type="text"
                value={attendanceCutoff}
                onChange={(e) => setAttendanceCutoff(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Notification Gateways */}
        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Parent Broadcast Channels
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure real-time automated delivery protocols
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Instant SMS Gateway</p>
                  <p className="text-[11px] text-slate-400">Send critical roll-call absence alerts</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={parentSmsEnabled}
                onChange={(e) => setParentSmsEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Parent WhatsApp API</p>
                  <p className="text-[11px] text-slate-400">Live transport pickup & library return notices</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={whatsAppBroadcast}
                onChange={(e) => setWhatsAppBroadcast(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Daily Principal Digest</p>
                  <p className="text-[11px] text-slate-400">Evening academy performance snapshot email</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* IoT & Telemetry Polling */}
        <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                IoT Sensor Telematics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synchronization frequencies for smart energy meters and bus GPS
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Classroom Energy Meter Polling
              </label>
              <select
                value={iotInterval}
                onChange={(e) => setIotInterval(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="10s">10 Seconds (High Precision)</option>
                <option value="30s">30 Seconds (Recommended)</option>
                <option value="60s">60 Seconds (Low Bandwidth)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fleet Bus GPS Telematics
              </label>
              <select
                value={gpsInterval}
                onChange={(e) => setGpsInterval(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="5s">5 Seconds (Real-time)</option>
                <option value="10s">10 Seconds (Standard Fleet)</option>
                <option value="30s">30 Seconds</option>
              </select>
            </div>
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetDemoData}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            id="btn-save-settings"
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
