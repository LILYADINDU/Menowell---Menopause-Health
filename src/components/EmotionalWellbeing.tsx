import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Wind, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  Smile, 
  Frown, 
  Meh, 
  HelpCircle,
  BrainCircuit,
  CheckCircle
} from 'lucide-react';
import { DailyLog, UserProfile } from '../types';
import { calmingChime } from '../utils/audio';

interface EmotionalWellbeingProps {
  currentLog: DailyLog;
  profile: UserProfile;
  onUpdateLog: (updated: Partial<DailyLog>) => void;
  startBreathworkTrigger?: boolean;
}

export const EmotionalWellbeing: React.FC<EmotionalWellbeingProps> = ({
  currentLog,
  profile,
  onUpdateLog,
  startBreathworkTrigger,
}) => {
  // 4-7-8 Breathwork Engine State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'ready'>('ready');
  const [countdown, setCountdown] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Journaling state
  const [gratitudeInput, setGratitudeInput] = useState(currentLog.gratitudeNote || '');
  const [reflectionInput, setReflectionInput] = useState(currentLog.emotionalReflection || '');
  const [journalSaved, setJournalSaved] = useState(false);

  // Auto-start breathwork if triggered from parent quick action
  useEffect(() => {
    if (startBreathworkTrigger && !isBreathingActive) {
      handleStartBreathing();
    }
  }, [startBreathworkTrigger]);

  // Breathing Loop with 4-7-8 timing
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isBreathingActive) {
      setBreathPhase('ready');
      setCountdown(4);
      return;
    }

    // Run phase progression
    let currentPhase: 'inhale' | 'hold' | 'exhale' = breathPhase === 'ready' ? 'inhale' : breathPhase;
    let secondsLeft = countdown;

    timerRef.current = setInterval(() => {
      secondsLeft -= 1;

      if (secondsLeft <= 0) {
        if (currentPhase === 'inhale') {
          currentPhase = 'hold';
          secondsLeft = 7;
          if (soundEnabled) calmingChime.playHold();
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          secondsLeft = 8;
          if (soundEnabled) calmingChime.playExhale();
        } else {
          // Finished 1 full cycle
          currentPhase = 'inhale';
          secondsLeft = 4;
          setCompletedCycles(prev => {
            const updated = prev + 1;
            // update mindfulness minutes: 19s per cycle ~ 0.33 min
            const currentMins = currentLog.mindfulnessMinutes || 0;
            onUpdateLog({ mindfulnessMinutes: Math.round(currentMins + (19 / 60)) });
            return updated;
          });
          if (soundEnabled) calmingChime.playInhale();
        }
        setBreathPhase(currentPhase);
      }

      setCountdown(secondsLeft);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBreathingActive, breathPhase, soundEnabled]);

  const handleStartBreathing = () => {
    setIsBreathingActive(true);
    setBreathPhase('inhale');
    setCountdown(4);
    if (soundEnabled) calmingChime.playInhale();
  };

  const handleStopBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('ready');
    setCountdown(4);
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLog({
      gratitudeNote: gratitudeInput,
      emotionalReflection: reflectionInput,
    });
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 3000);
  };

  const moodOptions: { id: DailyLog['mood']; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'radiant', label: 'Radiant', icon: <Smile className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { id: 'calm', label: 'Calm & Grounded', icon: <Smile className="w-4 h-4" />, color: 'bg-teal-50 text-teal-800 border-teal-300' },
    { id: 'balanced', label: 'Balanced', icon: <Meh className="w-4 h-4" />, color: 'bg-stone-50 text-stone-800 border-stone-300' },
    { id: 'foggy', label: 'Brain Fog', icon: <HelpCircle className="w-4 h-4" />, color: 'bg-amber-50 text-amber-800 border-amber-300' },
    { id: 'anxious', label: 'Anxious / Edgy', icon: <Frown className="w-4 h-4" />, color: 'bg-rose-50 text-rose-800 border-rose-300' },
    { id: 'irritable', label: 'Irritable', icon: <Frown className="w-4 h-4" />, color: 'bg-orange-50 text-orange-800 border-orange-300' },
    { id: 'exhausted', label: 'Exhausted', icon: <Meh className="w-4 h-4" />, color: 'bg-slate-50 text-slate-800 border-slate-300' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-2xl font-bold font-serif-display text-stone-900">
          Emotional Well-Being & Nervous System Care
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Hormonal shifts alter neurotransmitters like serotonin and GABA. Learn to soothe vasomotor anxiety, acknowledge brain fog without shame, and restore nervous system calm.
        </p>
      </div>

      {/* Interactive 4-7-8 Breathing Calming Sphere */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-stone-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Instructions and Controls */}
          <div className="space-y-4 max-w-md text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-900/60 text-rose-200 border border-rose-700">
                Parasympathetic Reset
              </span>
              <span className="text-xs text-stone-400">Dr. Andrew Weil 4-7-8 Method</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
              Instant Hot Flash & Anxiety Soother
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              When a vasomotor flush or sudden surge of panic begins, prolonged exhalations stimulate the vagus nerve, lowering cardiac output and normalizing hypothalamic thermal sensitivity.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {!isBreathingActive ? (
                <button
                  id="start-breathwork-btn"
                  onClick={handleStartBreathing}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-md transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Begin Guided Breathing</span>
                </button>
              ) : (
                <button
                  id="stop-breathwork-btn"
                  onClick={handleStopBreathing}
                  className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 border border-stone-600 transition-all"
                >
                  <Square className="w-4 h-4" />
                  <span>End Session</span>
                </button>
              )}

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 transition-colors"
                title={soundEnabled ? "Mute audio chimes" : "Enable 432Hz audio chimes"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <span className="text-xs text-stone-400 ml-2">
                Cycles completed: <strong className="text-white">{completedCycles}</strong>
              </span>
            </div>
          </div>

          {/* Animated Respiration Sphere */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div 
                className={`absolute inset-0 rounded-full border border-rose-500/30 transition-all duration-1000 ${
                  isBreathingActive && breathPhase === 'inhale' ? 'scale-110 opacity-80' : 'scale-95 opacity-30'
                }`}
              />

              {/* Main Resonant Sphere */}
              <div
                className={`rounded-full flex flex-col items-center justify-center transition-all shadow-2xl border ${
                  breathPhase === 'inhale'
                    ? 'w-44 h-44 sm:w-52 sm:h-52 bg-rose-600/30 border-rose-400 text-rose-100 duration-[4000ms] ease-out'
                    : breathPhase === 'hold'
                    ? 'w-44 h-44 sm:w-52 sm:h-52 bg-indigo-600/40 border-indigo-400 text-indigo-100 duration-500'
                    : breathPhase === 'exhale'
                    ? 'w-28 h-28 sm:w-32 sm:h-32 bg-stone-800 border-stone-600 text-stone-300 duration-[8000ms] ease-in-out'
                    : 'w-36 h-36 bg-stone-800/80 border-stone-700 text-stone-400'
                }`}
              >
                <Wind className="w-6 h-6 mb-1 opacity-80" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {breathPhase === 'ready' ? 'Ready' : breathPhase}
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold font-serif-display mt-0.5">
                  {isBreathingActive ? countdown : 4}
                </span>
                <span className="text-[10px] opacity-70 mt-0.5">
                  {breathPhase === 'inhale' ? 'Inhale 4s through nose' : breathPhase === 'hold' ? 'Gently hold 7s' : breathPhase === 'exhale' ? 'Slow whoosh out 8s' : 'Press Begin'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Check-In & Brain Fog Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood & Calm Score Gauge */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-700" />
              <span>Today's Emotional State</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 capitalize">
              {currentLog.mood}
            </span>
          </div>

          {/* Mood Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {moodOptions.map(option => {
              const isSelected = currentLog.mood === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onUpdateLog({ mood: option.id })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    isSelected
                      ? `${option.color} ring-2 ring-stone-900 shadow-xs`
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Calmness Slider */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold text-stone-700">
              <span>Nervous System Calm Score:</span>
              <span className="text-stone-900 font-bold">{currentLog.calmScore} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={currentLog.calmScore}
              onChange={(e) => onUpdateLog({ calmScore: parseInt(e.target.value) })}
              className="w-full accent-rose-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>Agitated / Tense</span>
              <span>Deeply Peaceful</span>
            </div>
          </div>

          {/* Anxiety Level Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-stone-700">
              <span>Acute Anxiety / Palpitations:</span>
              <span className="text-stone-900 font-bold">{currentLog.anxietyScore} / 10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={currentLog.anxietyScore}
              onChange={(e) => onUpdateLog({ anxietyScore: parseInt(e.target.value) })}
              className="w-full accent-indigo-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>None / Relaxed</span>
              <span>Intense Anxiety Surge</span>
            </div>
          </div>
        </div>

        {/* Brain Fog & Neuroprotection Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-700" />
              <span>Cognitive Clarity & Brain Fog</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
              Level {currentLog.brainFogSeverity} of 5
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Brain fog is not early dementia. Estrogen fuels glucose metabolism in the hippocampus and frontal cortex. During hormonal troughs, brain energy temporarily stutters.
          </p>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold text-stone-700">
              <span>Brain Fog Rating:</span>
              <span className="text-stone-900">
                {currentLog.brainFogSeverity === 0 ? 'Sharp & Lucid' : currentLog.brainFogSeverity <= 2 ? 'Mild word-finding pauses' : 'Thick fog / memory fatigue'}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onUpdateLog({ brainFogSeverity: lvl })}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    currentLog.brainFogSeverity === lvl
                      ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
            <div className="font-bold">Clinical Neuro-Protocols:</div>
            <ul className="list-disc list-inside space-y-0.5 text-purple-800">
              <li>Take 1000mg Omega-3 DHA/EPA with breakfast to insulate neural myelin.</li>
              <li>A 10-minute brisk walk in morning daylight boosts cerebral blood flow.</li>
              <li>Avoid multi-tasking when progesterone drops; focus on single-tasking.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Daily Reframing & Gratitude Journal */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-700" />
            <h3 className="font-bold text-stone-900 font-serif-display text-lg">
              Daily Self-Compassion & Cognitive Reframing
            </h3>
          </div>
          {journalSaved && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Saved to today's log
            </span>
          )}
        </div>

        <form onSubmit={handleSaveJournal} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">
              One thing my body did to support me today (Gratitude):
            </label>
            <input
              type="text"
              value={gratitudeInput}
              onChange={(e) => setGratitudeInput(e.target.value)}
              placeholder="e.g., Grateful for my legs carrying me on a walk, and resting when I needed it."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">
              Emotional reflection or boundary I set today:
            </label>
            <textarea
              rows={2}
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              placeholder="e.g., I said no to an unnecessary evening errand to preserve my sleep wind-down."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Save Reflections
          </button>
        </form>
      </div>
    </div>
  );
};
