import React, { useState } from 'react';
import { X, Check, Utensils, Heart, Moon, Flame } from 'lucide-react';
import { DailyLog } from '../types';

interface LogTodayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLog: DailyLog;
  onSave: (updated: Partial<DailyLog>) => void;
}

export const LogTodayModal: React.FC<LogTodayModalProps> = ({
  isOpen,
  onClose,
  currentLog,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'sleep' | 'diet' | 'emotions'>('sleep');

  // Local state
  const [sleepHours, setSleepHours] = useState(currentLog.sleepHours);
  const [sleepQuality, setSleepQuality] = useState(currentLog.sleepQuality);
  const [nightSweats, setNightSweats] = useState(currentLog.nightSweats);
  const [nightSweatEpisodes, setNightSweatEpisodes] = useState(currentLog.nightSweatEpisodes);
  const [hotFlashCount, setHotFlashCount] = useState(currentLog.hotFlashCount);
  const [hotFlashPeakSeverity, setHotFlashPeakSeverity] = useState(currentLog.hotFlashPeakSeverity);

  const [waterOz, setWaterOz] = useState(currentLog.waterOz);
  const [phytoestrogenServings, setPhytoestrogenServings] = useState(currentLog.phytoestrogenServings);

  const [mood, setMood] = useState(currentLog.mood);
  const [calmScore, setCalmScore] = useState(currentLog.calmScore);
  const [anxietyScore, setAnxietyScore] = useState(currentLog.anxietyScore);
  const [brainFogSeverity, setBrainFogSeverity] = useState(currentLog.brainFogSeverity);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      sleepHours,
      sleepQuality,
      nightSweats,
      nightSweatEpisodes: nightSweats ? nightSweatEpisodes : 0,
      hotFlashCount,
      hotFlashPeakSeverity,
      waterOz,
      phytoestrogenServings,
      mood,
      calmScore,
      anxietyScore,
      brainFogSeverity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-lg font-bold font-serif-display text-stone-900">
              Daily Wellness Check-In
            </h3>
            <p className="text-xs text-stone-500">
              {new Date(currentLog.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-stone-200 px-5 pt-3 gap-2 bg-stone-50/50">
          {[
            { id: 'sleep', label: 'Sleep & Flashes', icon: <Moon className="w-4 h-4" /> },
            { id: 'diet', label: 'Diet & Water', icon: <Utensils className="w-4 h-4" /> },
            { id: 'emotions', label: 'Mood & Fog', icon: <Heart className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'sleep' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Hours Slept:</label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    max="14"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Quality (1-5 stars):</label>
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  >
                    <option value={5}>5 - Deep & Restorative</option>
                    <option value={4}>4 - Good Sleep</option>
                    <option value={3}>3 - Fair / Mild Interruptions</option>
                    <option value={2}>2 - Fragmented / Restless</option>
                    <option value={1}>1 - Severe Insomnia</option>
                  </select>
                </div>
              </div>

              {/* Night Sweats */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nightSweats}
                    onChange={(e) => setNightSweats(e.target.checked)}
                    className="rounded accent-rose-700 w-4 h-4"
                  />
                  <span>Did you wake up with night sweats or hot flushes?</span>
                </label>
                {nightSweats && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-stone-600">Episodes count:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={nightSweatEpisodes}
                      onChange={(e) => setNightSweatEpisodes(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border rounded-lg text-center"
                    />
                  </div>
                )}
              </div>

              {/* Daytime Hot Flashes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Daytime Hot Flashes:</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={hotFlashCount}
                    onChange={(e) => setHotFlashCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Peak Severity:</label>
                  <select
                    value={hotFlashPeakSeverity}
                    onChange={(e) => setHotFlashPeakSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  >
                    <option value="none">None</option>
                    <option value="mild">Mild (Warm flush)</option>
                    <option value="moderate">Moderate (Perspiration)</option>
                    <option value="severe">Severe (Drenching / Palpitations)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diet' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Water Intake (oz):</label>
                  <input
                    type="number"
                    step="8"
                    min="0"
                    max="200"
                    value={waterOz}
                    onChange={(e) => setWaterOz(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Phytoestrogen Servings:</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={phytoestrogenServings}
                    onChange={(e) => setPhytoestrogenServings(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                  <span className="text-[11px] text-stone-400">Target: 2-3 (flax, edamame, lentils)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emotions' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Overall Mood:</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl text-sm capitalize"
                >
                  <option value="radiant">Radiant & Energized</option>
                  <option value="calm">Calm & Grounded</option>
                  <option value="balanced">Balanced</option>
                  <option value="foggy">Brain Fogged</option>
                  <option value="anxious">Anxious / Edgy</option>
                  <option value="irritable">Irritable</option>
                  <option value="exhausted">Exhausted</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-stone-700">
                  <span>Calm Score:</span>
                  <span>{calmScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={calmScore}
                  onChange={(e) => setCalmScore(parseInt(e.target.value))}
                  className="w-full accent-rose-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-stone-700">
                  <span>Brain Fog (0 = Sharp, 5 = Severe):</span>
                  <span>Level {brainFogSeverity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={brainFogSeverity}
                  onChange={(e) => setBrainFogSeverity(parseInt(e.target.value))}
                  className="w-full accent-purple-700"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 flex justify-end gap-3 bg-stone-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200/50 rounded-xl"
          >
            Cancel
          </button>
          <button
            id="save-log-modal-btn"
            onClick={handleSave}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Save Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
