import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Building, 
  HeartPulse, 
  Bus, 
  CreditCard,
  GraduationCap
} from 'lucide-react';
import { EmergencyContactInfo, ChildProfile } from '../../types/parentConnect';

interface ParentEmergencyContactsProps {
  child: ChildProfile;
  contacts: EmergencyContactInfo[];
}

export const ParentEmergencyContacts: React.FC<ParentEmergencyContactsProps> = ({
  child,
  contacts,
}) => {
  const getIconForRole = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('doctor') || r.includes('infirmary')) return <HeartPulse className="w-5 h-5 text-rose-600" />;
    if (r.includes('transport') || r.includes('fleet')) return <Bus className="w-5 h-5 text-amber-600" />;
    if (r.includes('accounts') || r.includes('fee')) return <CreditCard className="w-5 h-5 text-emerald-600" />;
    if (r.includes('principal')) return <GraduationCap className="w-5 h-5 text-blue-600" />;
    return <Building className="w-5 h-5 text-indigo-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Emergency Header Hero Card */}
      <div className="bg-gradient-to-br from-rose-600 via-rose-700 to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-rose-100 border border-white/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Campus Security & SOS Emergency Directory</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Emergency & Direct Helplines
            </h3>
            <p className="text-xs text-rose-100/90 max-w-xl">
              Instant contact numbers for medical assistance, security dispatch, transport emergency, administration, and {child.name}'s classroom faculty.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="tel:+911512204500"
              className="px-5 py-3 rounded-2xl bg-white text-rose-700 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-rose-50 transition-colors"
            >
              <Phone className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Campus SOS: +91 151 220 4500</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Seth Tolaram Bafna Academy, Nokha Road, Bikaner, Rajasthan 334001</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Campus Operational Hours: 07:30 AM - 04:30 PM (Mon-Sat)</span>
          </div>
        </div>
      </div>

      {/* Direct Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  {getIconForRole(c.department)}
                </div>
                {c.timing && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {c.timing}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {c.badge || c.department}
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {c.contactPerson}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {c.department}
              </p>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-900 dark:text-white">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{c.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <a
                href={`tel:${c.phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href={`mailto:${c.email}`}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center transition-colors"
                title="Send Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
