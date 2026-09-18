import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  Overview 
} from './components/Overview';
import { 
  DietManagement 
} from './components/DietManagement';
import { 
  EmotionalWellbeing 
} from './components/EmotionalWellbeing';
import { 
  SleepPatterns 
} from './components/SleepPatterns';
import { 
  AnalyticsTrends 
} from './components/AnalyticsTrends';
import { 
  ProfessionalSupport 
} from './components/ProfessionalSupport';
import { 
  AICoachDrawer 
} from './components/AICoachDrawer';
import { 
  LogTodayModal 
} from './components/LogTodayModal';
import { 
  ProfileModal 
} from './components/ProfileModal';

import { DailyLog, UserProfile } from './types';
import { 
  INITIAL_USER_PROFILE, 
  SAMPLE_HISTORICAL_LOGS 
} from './data/menopauseResources';

export default function App() {
  // Load state from localStorage with fallbacks
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('menowell_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [logs, setLogs] = useState<DailyLog[]>(() => {
    try {
      const saved = localStorage.getItem('menowell_logs');
      return saved ? JSON.parse(saved) : SAMPLE_HISTORICAL_LOGS;
    } catch {
      return SAMPLE_HISTORICAL_LOGS;
    }
  });

  const [selectedLogId, setSelectedLogId] = useState<string>(() => {
    return logs[logs.length - 1]?.id || 'log-01';
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'diet' | 'emotions' | 'sleep' | 'trends' | 'support'>('overview');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [startBreathworkTrigger, setStartBreathworkTrigger] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('menowell_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('menowell_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  // Current active log
  const currentLog = logs.find(l => l.id === selectedLogId) || logs[logs.length - 1] || SAMPLE_HISTORICAL_LOGS[0];

  // Update current log
  const handleUpdateLog = (updatedFields: Partial<DailyLog>) => {
    setLogs(prev => prev.map(log => {
      if (log.id === currentLog.id) {
        return { ...log, ...updatedFields };
      }
      return log;
    }));
  };

  // Quick action: Add 8oz water
  const handleQuickAddWater = () => {
    handleUpdateLog({ waterOz: currentLog.waterOz + 8 });
  };

  // Quick action: Start 4-7-8 Breathwork
  const handleStartBreathwork = () => {
    setActiveTab('emotions');
    setStartBreathworkTrigger(true);
    setTimeout(() => setStartBreathworkTrigger(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-rose-50/20 text-stone-800">
      {/* App Header & Navigation */}
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => setIsLogModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        currentLog={currentLog}
      />

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <Overview
            currentLog={currentLog}
            profile={profile}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenLogModal={() => setIsLogModalOpen(true)}
            onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
            onQuickAddWater={handleQuickAddWater}
            onStartBreathwork={handleStartBreathwork}
          />
        )}

        {activeTab === 'diet' && (
          <DietManagement
            currentLog={currentLog}
            profile={profile}
            onUpdateLog={handleUpdateLog}
          />
        )}

        {activeTab === 'emotions' && (
          <EmotionalWellbeing
            currentLog={currentLog}
            profile={profile}
            onUpdateLog={handleUpdateLog}
            startBreathworkTrigger={startBreathworkTrigger}
          />
        )}

        {activeTab === 'sleep' && (
          <SleepPatterns
            currentLog={currentLog}
            profile={profile}
            onUpdateLog={handleUpdateLog}
          />
        )}

        {activeTab === 'trends' && (
          <AnalyticsTrends
            logs={logs}
            profile={profile}
            onSelectLog={(log) => {
              setSelectedLogId(log.id);
            }}
            selectedLogId={selectedLogId}
          />
        )}

        {activeTab === 'support' && (
          <ProfessionalSupport
            logs={logs}
            profile={profile}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-stone-700">
            MenoWell • Personalized Menopause Care, Diet, Emotional Resilience & Sleep Optimization
          </p>
          <p className="text-[11px] text-stone-400">
            Clinical guidelines grounded in The Menopause Society (NAMS) & British Menopause Society (BMS). Educational resource; not a substitute for formal diagnosis.
          </p>
        </div>
      </footer>

      {/* Modals & AI Drawer */}
      <LogTodayModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        currentLog={currentLog}
        onSave={handleUpdateLog}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={setProfile}
      />

      <AICoachDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        profile={profile}
        currentLog={currentLog}
      />
    </div>
  );
}
