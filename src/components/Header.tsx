import React from 'react';
import { Sparkles, Calendar, HeartPulse, User, Stethoscope } from 'lucide-react';
import { UserProfile, DailyLog } from '../types';

interface HeaderProps {
  profile: UserProfile;
  activeTab: 'overview' | 'diet' | 'emotions' | 'sleep' | 'trends' | 'support';
  setActiveTab: (tab: 'overview' | 'diet' | 'emotions' | 'sleep' | 'trends' | 'support') => void;
  onOpenLogModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAiDrawer: () => void;
  currentLog: DailyLog;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onOpenLogModal,
  onOpenProfileModal,
  onOpenAiDrawer,
  currentLog,
}) => {
  const phaseLabels: Record<UserProfile['phase'], string> = {
    perimenopause: 'Perimenopause',
    menopause: 'Menopause',
    postmenopause: 'Postmenopause',
    unsure: 'Menopause Journey',
  };

  const navItems = [
    { id: 'overview', label: 'Today & Overview' },
    { id: 'diet', label: 'Diet & Nutrition' },
    { id: 'emotions', label: 'Emotional Well-Being' },
    { id: 'sleep', label: 'Sleep & Night Sweats' },
    { id: 'trends', label: 'Trends & Insights' },
    { id: 'support', label: 'Clinical & Support' },
  ] as const;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-serif-display text-stone-900 tracking-tight">
                  MenoWell
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {phaseLabels[profile.phase]}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Personalized Menopause Health, Nutrition & Sleep
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Specialist Button */}
            <button
              id="header-ai-consult-btn"
              onClick={onOpenAiDrawer}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors shadow-xs"
              title="Consult with Dr. Sophia Vance, AI Menopause Specialist"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Ask AI Specialist</span>
            </button>

            {/* Quick Log Button */}
            <button
              id="header-quick-log-btn"
              onClick={onOpenLogModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Log Today</span>
            </button>

            {/* Profile / Settings Button */}
            <button
              id="header-profile-btn"
              onClick={onOpenProfileModal}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
              title="Edit Health Profile & Goals"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2 border-t border-stone-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {item.id === 'support' && <Stethoscope className="w-3.5 h-3.5" />}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
