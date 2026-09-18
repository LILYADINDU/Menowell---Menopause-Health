import React, { useState } from 'react';
import { 
  Moon, 
  Thermometer, 
  ShieldCheck, 
  Flame, 
  Check, 
  Clock, 
  AlertCircle,
  Wind,
  BedDouble,
  Sliders
} from 'lucide-react';
import { DailyLog, UserProfile } from '../types';
import { WIND_DOWN_CHECKLIST_ITEMS } from '../data/menopauseResources';

interface SleepPatternsProps {
  currentLog: DailyLog;
  profile: UserProfile;
  onUpdateLog: (updated: Partial<DailyLog>) => void;
}

export const SleepPatterns: React.FC<SleepPatternsProps> = ({
  currentLog,
  profile,
  onUpdateLog,
}) => {
  const [completedHabits, setCompletedHabits] = useState<string[]>(
    WIND_DOWN_CHECKLIST_ITEMS.slice(0, 3).map(i => i.id)
  );

  const toggleHabit = (id: string) => {
    const updated = completedHabits.includes(id)
      ? completedHabits.filter(h => h !== id)
      : [...completedHabits, id];
    setCompletedHabits(updated);
    const score = Math.round((updated.length / WIND_DOWN_CHECKLIST_ITEMS.length) * 100);
    onUpdateLog({ sleepHygieneScore: score });
  };

  const disruptionOptions = [
    'Night sweat flush (drenched sheets/pajamas)',
    'Sudden 2:00 - 4:00 AM wakefulness',
    'Racing thoughts / rumination',
    'Room temperature too warm',
    'Restless legs / muscle twitches',
    'Bathroom urination urgency',
  ];

  const toggleDisruption = (item: string) => {
    const current = currentLog.sleepDisruptions || [];
    const updated = current.includes(item)
      ? current.filter(d => d !== item)
      : [...current, item];
    onUpdateLog({ sleepDisruptions: updated });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-2xl font-bold font-serif-display text-stone-900">
          Sleep Architecture & Night Sweat Management
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Progesterone promotes slow-wave deep sleep and acts as a natural GABA receptor agonist. Protect your sleep cycles against nocturnal vasomotor awakenings with thermoregulation and clinical sleep hygiene.
        </p>
      </div>

      {/* Primary Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sleep */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Duration</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold font-serif-display text-stone-900">
            {currentLog.sleepHours} hrs
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateLog({ sleepHours: Math.max(3, currentLog.sleepHours - 0.5) })}
              className="px-2 py-0.5 rounded border border-stone-200 text-xs hover:bg-stone-100"
            >
              -0.5h
            </button>
            <button
              onClick={() => onUpdateLog({ sleepHours: Math.min(12, currentLog.sleepHours + 0.5) })}
              className="px-2 py-0.5 rounded border border-stone-200 text-xs hover:bg-stone-100"
            >
              +0.5h
            </button>
            <span className="text-xs text-stone-500 ml-auto">Goal: {profile.targetSleepGoalHours}h</span>
          </div>
        </div>

        {/* Quality Rating */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Quality</span>
            <Moon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold font-serif-display text-stone-900 flex items-center gap-1">
            <span>{currentLog.sleepQuality}</span>
            <span className="text-sm font-sans font-normal text-stone-500">/ 5 stars</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onUpdateLog({ sleepQuality: star })}
                className={`flex-1 py-1 rounded text-xs font-bold border transition-all ${
                  star <= currentLog.sleepQuality
                    ? 'bg-amber-400 text-stone-900 border-amber-500'
                    : 'bg-stone-50 text-stone-400 border-stone-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Night Sweats Disruptions */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Vasomotor Awakenings</span>
            <Flame className={`w-4 h-4 ${currentLog.nightSweats ? 'text-rose-600' : 'text-stone-400'}`} />
          </div>
          <div className="text-3xl font-extrabold font-serif-display text-stone-900">
            {currentLog.nightSweats ? `${currentLog.nightSweatEpisodes} Awakenings` : 'None'}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateLog({ 
                nightSweats: !currentLog.nightSweats, 
                nightSweatEpisodes: !currentLog.nightSweats ? 1 : 0 
              })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                currentLog.nightSweats
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              {currentLog.nightSweats ? 'Night Sweats Logged' : '+ Log Night Sweats'}
            </button>
            {currentLog.nightSweats && (
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => onUpdateLog({ nightSweatEpisodes: Math.max(1, currentLog.nightSweatEpisodes - 1) })}
                  className="w-6 h-6 rounded border border-stone-200 flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="text-xs font-bold w-4 text-center">{currentLog.nightSweatEpisodes}</span>
                <button
                  onClick={() => onUpdateLog({ nightSweatEpisodes: currentLog.nightSweatEpisodes + 1 })}
                  className="w-6 h-6 rounded border border-stone-200 flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bedroom Thermoregulation Protocol */}
      <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-blue-950 font-serif-display text-lg">
                The 65°F (18°C) Thermoregulatory Standard
              </h3>
              <p className="text-xs text-blue-800">
                Clinical recommendation from The Menopause Society (NAMS)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
            Optimal: 65°F / 18°C
          </span>
        </div>

        <p className="text-xs sm:text-sm text-blue-900/90 leading-relaxed max-w-3xl">
          During perimenopause, the hypothalamus thermoneutral zone narrows dramatically. A room temperature above 68°F (20°C) tricks the autonomic nervous system into perceiving an emergency heat crisis, triggering massive adrenaline release, pounding heartbeat, and profuse drenching night sweats. Setting the thermostat to 65°F prevents 60-75% of mild-to-moderate vasomotor spikes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3 bg-white rounded-xl border border-blue-100 text-xs">
            <div className="font-bold text-stone-900">Bedding Materials</div>
            <div className="text-stone-600 mt-1">Use natural bamboo, eucalyptus, or 100% linen. Avoid polyester microfiber which traps radiant heat.</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-blue-100 text-xs">
            <div className="font-bold text-stone-900">Cold Water at Bedside</div>
            <div className="text-stone-600 mt-1">Keep an insulated flask of ice water. Sipping through a straw immediately cools the vagal trunk.</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-blue-100 text-xs">
            <div className="font-bold text-stone-900">Layering Strategy</div>
            <div className="text-stone-600 mt-1">Dual-temperature blankets or separate twin top-sheets allow micro-adjustments without waking up.</div>
          </div>
        </div>
      </div>

      {/* Bedtime Wind-down Checklist & Sleep Disruptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bedtime Wind-down Checklist */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bedtime Wind-Down Checklist</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              {completedHabits.length} / {WIND_DOWN_CHECKLIST_ITEMS.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {WIND_DOWN_CHECKLIST_ITEMS.map((item) => {
              const isChecked = completedHabits.includes(item.id);
              return (
                <label
                  key={item.id}
                  onClick={() => toggleHabit(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-xs leading-snug">{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Sleep Disruptions Log */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Logged Sleep Disruptions</span>
            </h3>
            <span className="text-xs text-stone-500">Tap to toggle</span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Correlating specific awakening patterns with your daily food, stress, and evening routine helps your physician determine if CBT-I or hormonal support is indicated.
          </p>

          <div className="space-y-2">
            {disruptionOptions.map((disruption) => {
              const isSelected = (currentLog.sleepDisruptions || []).includes(disruption);
              return (
                <button
                  key={disruption}
                  onClick={() => toggleDisruption(disruption)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {disruption}
                </button>
              );
            })}
          </div>

          {/* Morning Restorative Rating Slider */}
          <div className="pt-3 border-t border-stone-100 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-stone-800">
              <span>Morning Restorative Feeling:</span>
              <span className="font-bold">{currentLog.morningRestorativeScore} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={currentLog.morningRestorativeScore}
              onChange={(e) => onUpdateLog({ morningRestorativeScore: parseInt(e.target.value) })}
              className="w-full accent-blue-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>Groggy & Unrefreshed</span>
              <span>Fully Recharged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
