import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck,
  Building2
} from 'lucide-react';

interface MasterLandingExperienceProps {
  onSelectRole: (role: 'Parent' | 'Teacher' | 'Administrator') => void;
}

export const MasterLandingExperience: React.FC<MasterLandingExperienceProps> = ({
  onSelectRole
}) => {
  // Screen state: 1 = Landing Screen, 2 = Role Selection Screen
  const [currentScreen, setCurrentScreen] = useState<1 | 2>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handleEnterPlatform = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(2);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 180);
  };

  const handleBackToLanding = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(1);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 180);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden">
      {/* Subtle top branding indicator with school's gold & emerald accents */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-700 via-amber-500 to-emerald-600" />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-5xl mx-auto">
          {/* ============================================================
              SCREEN 1: MASTER LANDING EXPERIENCE
              ============================================================ */}
          {currentScreen === 1 && (
            <div 
              id="landing-screen-1"
              className={`transition-opacity duration-200 ${
                isTransitioning ? 'opacity-0' : 'opacity-100 animate-screen-fade'
              }`}
            >
              {/* Centered Landing Content */}
              <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8 py-8 sm:py-16">
                {/* School Name & Platform Identity Container */}
                <div className="space-y-2 sm:space-y-3 flex flex-col items-center">
                  {/* Primary Heading: School Name */}
                  <h1 
                    id="school-primary-heading"
                    className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight font-sans"
                    style={{
                      animation: 'textEntrance 500ms cubic-bezier(0.16, 1, 0.3, 1) 140ms forwards',
                      opacity: 0
                    }}
                  >
                    Seth Tolaram Bafna Academy
                  </h1>

                  {/* Secondary Heading: Product / Platform Identity */}
                  <div
                    style={{
                      animation: 'textEntrance 500ms cubic-bezier(0.16, 1, 0.3, 1) 260ms forwards',
                      opacity: 0
                    }}
                  >
                    <h2 
                      id="platform-heading"
                      className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-emerald-800"
                    >
                      Smart School 360°
                    </h2>
                  </div>

                  {/* Tagline */}
                  <p 
                    id="platform-tagline"
                    className="text-base sm:text-lg text-slate-600 font-normal pt-1 max-w-xl text-center"
                    style={{
                      animation: 'textEntrance 500ms cubic-bezier(0.16, 1, 0.3, 1) 380ms forwards',
                      opacity: 0
                    }}
                  >
                    One School. One Connected Digital Experience.
                  </p>
                </div>

                {/* PRIMARY CTA — Minimalist, Clean, High Contrast */}
                <div
                  style={{
                    animation: 'textEntrance 500ms cubic-bezier(0.16, 1, 0.3, 1) 500ms forwards',
                    opacity: 0
                  }}
                  className="pt-2 sm:pt-4"
                >
                  <button
                    id="enter-smart-school-btn"
                    onClick={handleEnterPlatform}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-medium text-base shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 cursor-pointer"
                    aria-label="Enter Smart School 360° digital platform"
                  >
                    <span>Enter Smart School 360°</span>
                    <ArrowRight className="w-4 h-4 text-emerald-200 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              SCREEN 2: ROLE SELECTION
              ============================================================ */}
          {currentScreen === 2 && (
            <div 
              id="role-selection-screen-2"
              className={`transition-opacity duration-200 max-w-3xl mx-auto ${
                isTransitioning ? 'opacity-0' : 'opacity-100 animate-screen-fade'
              }`}
            >
              {/* Back Control */}
              <div className="mb-6 sm:mb-8">
                <button
                  id="back-to-landing-btn"
                  onClick={handleBackToLanding}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 rounded-md px-2 py-1 -ml-2 cursor-pointer"
                  aria-label="Back to landing screen"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>

              {/* Role Selection Header */}
              <div className="text-center mb-8 sm:mb-10 space-y-2">
                <h1 
                  id="role-selection-heading"
                  className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 font-sans"
                >
                  Welcome to Smart School 360°
                </h1>
                <p 
                  id="role-selection-subheading"
                  className="text-sm sm:text-base text-slate-600"
                >
                  Choose how you would like to continue.
                </p>
              </div>

              {/* Exactly TWO Main Roles with Equal Visual Importance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* ROLE 1 — PARENT PORTAL */}
                <div 
                  id="role-card-parent"
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    {/* Role Icon */}
                    <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-5">
                      <Users className="w-5 h-5 text-slate-700" />
                    </div>

                    {/* Role Title */}
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                      Parent Portal
                    </h2>

                    {/* Short Description */}
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      Stay connected with your child's school journey.
                    </p>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    id="continue-parent-btn"
                    onClick={() => onSelectRole('Parent')}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-700 cursor-pointer"
                  >
                    <span>Continue as Parent</span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>

                {/* ROLE 2 — TEACHER PORTAL */}
                <div 
                  id="role-card-teacher"
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    {/* Role Icon */}
                    <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-5">
                      <GraduationCap className="w-5 h-5 text-slate-700" />
                    </div>

                    {/* Role Title */}
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                      Teacher Portal
                    </h2>

                    {/* Short Description */}
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      Manage teaching, attendance, academics and classroom activities.
                    </p>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    id="continue-teacher-btn"
                    onClick={() => onSelectRole('Teacher')}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-700 cursor-pointer"
                  >
                    <span>Continue as Teacher</span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>

              {/* Discrete Administrative Access Option */}
              <div className="mt-8 text-center">
                <button
                  id="enter-command-center-link"
                  onClick={() => onSelectRole('Administrator')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer py-1.5 px-3 rounded-md hover:bg-slate-100/70"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>School Administrator or Staff? Enter Command Center →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Minimalist Professional Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-4 px-4 sm:px-6 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p className="font-medium text-slate-600">
            Seth Tolaram Bafna Academy • Smart School 360°
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>CBSE Affiliated Senior Secondary School</span>
            <span>•</span>
            <span>Bikaner, Rajasthan</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
