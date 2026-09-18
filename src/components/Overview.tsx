import React from 'react';
import { 
  Sparkles, 
  Moon, 
  Utensils, 
  Heart, 
  Flame, 
  Droplets, 
  ShieldCheck, 
  ChevronRight,
  Wind,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DailyLog, UserProfile } from '../types';

interface OverviewProps {
  currentLog: DailyLog;
  profile: UserProfile;
  onNavigateTab: (tab: 'diet' | 'emotions' | 'sleep' | 'trends' | 'support') => void;
  onOpenLogModal: () => void;
  onOpenAiDrawer: () => void;
  onQuickAddWater: () => void;
  onStartBreathwork: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  currentLog,
  profile,
  onNavigateTab,
  onOpenLogModal,
  onOpenAiDrawer,
  onQuickAddWater,
  onStartBreathwork,
}) => {
  // Calculate a composite wellness score (0 - 100)
  const sleepFactor = (currentLog.sleepQuality / 5) * 35;
  const hydrationFactor = Math.min(1, currentLog.waterOz / profile.dailyWaterGoalOz) * 25;
  const calmFactor = (currentLog.calmScore / 10) * 25;
  const phytoFactor = Math.min(1, currentLog.phytoestrogenServings / 2) * 15;
  const wellnessScore = Math.round(sleepFactor + hydrationFactor + calmFactor + phytoFactor);

  // Dynamic daily clinical insight
  const getDynamicInsight = () => {
    if (currentLog.nightSweats || currentLog.hotFlashCount >= 3) {
      return {
        title: "Vasomotor Symptom Alert: Thermoregulation Focus",
        desc: "You experienced vasomotor awakenings or multiple hot flashes. Consider cooling your bedroom to 65°F (18°C), adding 1-2 tbsp ground flaxseed at lunch, and avoiding red wine or late caffeine today.",
        type: "warning",
      };
    }
    if (currentLog.calmScore < 5 || currentLog.anxietyScore >= 5) {
      return {
        title: "Progesterone Rhythm & Nervous System Reset",
        desc: "Hormone fluctuations can trigger acute cortisol spikes and sudden anxiety. A 3-minute 4-7-8 parasympathetic breathwork session can help down-regulate heart rate and tension.",
        type: "alert",
      };
    }
    return {
      title: "Balanced Hormonal Equilibrium",
      desc: "Your sleep architecture and calming practices are providing steady support. Keep prioritizing consistent hydration, anti-inflammatory whole foods, and a predictable wind-down routine.",
      type: "optimal",
    };
  };

  const insight = getDynamicInsight();

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Score */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                Daily Check-In • {new Date(currentLog.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900">
              Good day, {profile.name}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
              Tracking your symptoms empowers you to identify triggers, protect your sleep, and have evidence-grounded conversations with your medical provider.
            </p>
          </div>

          {/* Daily Composite Wellness Gauge */}
          <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 self-start md:self-auto min-w-[220px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="text-stone-200 stroke-current"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="text-rose-600 stroke-current"
                  strokeWidth="5"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 - (163.36 * wellnessScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-lg font-bold text-stone-900">
                {wellnessScore}
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Wellness Index
              </div>
              <div className="text-sm font-semibold text-stone-900">
                {wellnessScore >= 80 ? 'Optimal Flow' : wellnessScore >= 60 ? 'Balanced Support' : 'Needs Care & Rest'}
              </div>
              <div className="text-xs text-stone-500">Based on 4 key metrics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Clinical Insight Banner */}
      <div className={`rounded-xl p-4 sm:p-5 border flex items-start gap-3.5 transition-all ${
        insight.type === 'warning'
          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
          : insight.type === 'alert'
          ? 'bg-rose-50/70 border-rose-200 text-rose-900'
          : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
      }`}>
        <div className="mt-0.5 shrink-0">
          {insight.type === 'optimal' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-sm font-bold flex items-center gap-2">
            <span>{insight.title}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {insight.desc}
          </p>
        </div>
        <button
          id="overview-ai-consult-inline-btn"
          onClick={onOpenAiDrawer}
          className="shrink-0 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-purple-200 transition-colors shadow-2xs"
        >
          Discuss with AI
        </button>
      </div>

      {/* 4 Core Pillars Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Diet & Nutrition */}
        <div 
          onClick={() => onNavigateTab('diet')}
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {currentLog.phytoestrogenServings} Phyto servings
            </span>
          </div>
          <h3 className="text-base font-bold text-stone-900 group-hover:text-rose-700 transition-colors">
            Diet & Nutrition
          </h3>
          <div className="mt-2 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Water:</span>
              <span className="font-semibold text-stone-800">{currentLog.waterOz} / {profile.dailyWaterGoalOz} oz</span>
            </div>
            <div className="flex justify-between">
              <span>Meals logged:</span>
              <span className="font-semibold text-stone-800">{currentLog.meals.length} items</span>
            </div>
            <div className="flex justify-between">
              <span>Supplements:</span>
              <span className="font-semibold text-stone-800">{currentLog.supplements.length} taken</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>Manage diet</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* 2. Emotional Well-being */}
        <div 
          onClick={() => onNavigateTab('emotions')}
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded capitalize">
              {currentLog.mood}
            </span>
          </div>
          <h3 className="text-base font-bold text-stone-900 group-hover:text-rose-700 transition-colors">
            Emotional Balance
          </h3>
          <div className="mt-2 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Calm score:</span>
              <span className="font-semibold text-stone-800">{currentLog.calmScore} / 10</span>
            </div>
            <div className="flex justify-between">
              <span>Brain fog level:</span>
              <span className="font-semibold text-stone-800">{currentLog.brainFogSeverity} / 5</span>
            </div>
            <div className="flex justify-between">
              <span>Mindfulness:</span>
              <span className="font-semibold text-stone-800">{currentLog.mindfulnessMinutes} mins</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>Mindfulness & Mood</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* 3. Sleep & Night Sweats */}
        <div 
          onClick={() => onNavigateTab('sleep')}
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              currentLog.nightSweats ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {currentLog.nightSweats ? `${currentLog.nightSweatEpisodes} Night Sweats` : 'No Night Sweats'}
            </span>
          </div>
          <h3 className="text-base font-bold text-stone-900 group-hover:text-rose-700 transition-colors">
            Sleep Patterns
          </h3>
          <div className="mt-2 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Total sleep:</span>
              <span className="font-semibold text-stone-800">{currentLog.sleepHours} hrs</span>
            </div>
            <div className="flex justify-between">
              <span>Quality rating:</span>
              <span className="font-semibold text-stone-800">{currentLog.sleepQuality} / 5 stars</span>
            </div>
            <div className="flex justify-between">
              <span>Restoration:</span>
              <span className="font-semibold text-stone-800">{currentLog.morningRestorativeScore} / 10</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>Sleep hygiene</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* 4. Vasomotor & Physical Symptoms */}
        <div 
          onClick={() => onNavigateTab('trends')}
          className="bg-white p-5 rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded capitalize">
              {currentLog.hotFlashPeakSeverity} severity
            </span>
          </div>
          <h3 className="text-base font-bold text-stone-900 group-hover:text-rose-700 transition-colors">
            Vasomotor Symptoms
          </h3>
          <div className="mt-2 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Hot flashes today:</span>
              <span className="font-semibold text-stone-800">{currentLog.hotFlashCount} episodes</span>
            </div>
            <div className="flex justify-between">
              <span>Energy level:</span>
              <span className="font-semibold text-stone-800">{currentLog.energyLevel} / 10</span>
            </div>
            <div className="flex justify-between">
              <span>Joint comfort:</span>
              <span className="font-semibold text-stone-800">{5 - currentLog.jointAches} / 5</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>View correlations</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold font-serif-display text-white">
              Instant Wellness Actions
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              One-click tools to soothe symptoms in the moment.
            </p>
          </div>
          <button
            id="overview-full-log-btn"
            onClick={onOpenLogModal}
            className="text-xs font-semibold text-stone-300 hover:text-white underline underline-offset-4"
          >
            Update full daily entry →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="quick-action-water-btn"
            onClick={onQuickAddWater}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-900/60 text-blue-300 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">+8 oz Water</div>
              <div className="text-[11px] text-stone-400">{currentLog.waterOz} oz total</div>
            </div>
          </button>

          <button
            id="quick-action-breathwork-btn"
            onClick={onStartBreathwork}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">4-7-8 Breath</div>
              <div className="text-[11px] text-stone-400">Calm vasomotor flush</div>
            </div>
          </button>

          <button
            id="quick-action-meal-btn"
            onClick={() => onNavigateTab('diet')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-900/60 text-emerald-300 flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Log Meal</div>
              <div className="text-[11px] text-stone-400">Analyze triggers</div>
            </div>
          </button>

          <button
            id="quick-action-doctor-brief-btn"
            onClick={() => onNavigateTab('support')}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-900/60 text-rose-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Doctor Brief</div>
              <div className="text-[11px] text-stone-400">Prep appointment</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
