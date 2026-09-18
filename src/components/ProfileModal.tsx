import React, { useState } from 'react';
import { X, Check, User } from 'lucide-react';
import { UserProfile, MenopausePhase } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [phase, setPhase] = useState<MenopausePhase>(profile.phase);
  const [yearsInPhase, setYearsInPhase] = useState(profile.yearsInPhase);
  const [hrtStatus, setHrtStatus] = useState(profile.hormoneTherapyStatus);
  const [waterGoal, setWaterGoal] = useState(profile.dailyWaterGoalOz);
  const [sleepGoal, setSleepGoal] = useState(profile.targetSleepGoalHours);
  const [concerns, setConcerns] = useState<string[]>(profile.primaryConcerns);

  if (!isOpen) return null;

  const concernOptions = [
    'Night sweats',
    'Daytime hot flashes',
    'Sleep disruptions',
    'Brain fog & memory',
    'Anxiety & palpitations',
    'Weight & metabolism shifts',
    'Joint pain & stiffness',
    'Vaginal dryness / discomfort',
  ];

  const toggleConcern = (concern: string) => {
    setConcerns(prev => 
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      name,
      age,
      phase,
      yearsInPhase,
      hormoneTherapyStatus: hrtStatus,
      dailyWaterGoalOz: waterGoal,
      targetSleepGoalHours: sleepGoal,
      primaryConcerns: concerns,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif-display text-stone-900">
                Health Profile & Goals
              </h3>
              <p className="text-xs text-stone-500">Personalize recommendations for your phase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Age:</label>
              <input
                type="number"
                min="35"
                max="85"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 45)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Current Phase:</label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value as MenopausePhase)}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            >
              <option value="perimenopause">Perimenopause (Irregular cycles, onset of vasomotor flashes)</option>
              <option value="menopause">Menopause (12 consecutive months without cycle)</option>
              <option value="postmenopause">Postmenopause (Long-term health, bone & heart preservation)</option>
              <option value="unsure">Unsure / Exploring symptoms</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Hormone Therapy Status:</label>
            <select
              value={hrtStatus}
              onChange={(e) => setHrtStatus(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            >
              <option value="none">No hormone therapy</option>
              <option value="prescribed_hrt">Prescribed HRT / MHT (Estrogen/Progesterone)</option>
              <option value="natural_supplements">Herbal / Phytoestrogen supplements</option>
              <option value="considering">Considering / Discussing with doctor</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Daily Water Goal (oz):</label>
              <input
                type="number"
                step="8"
                value={waterGoal}
                onChange={(e) => setWaterGoal(parseInt(e.target.value) || 64)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Sleep Goal (hours):</label>
              <input
                type="number"
                step="0.5"
                value={sleepGoal}
                onChange={(e) => setSleepGoal(parseFloat(e.target.value) || 8)}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-stone-700">Primary Symptoms to Manage:</label>
            <div className="flex flex-wrap gap-1.5">
              {concernOptions.map(concern => (
                <button
                  key={concern}
                  type="button"
                  onClick={() => toggleConcern(concern)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    concerns.includes(concern)
                      ? 'bg-rose-100 text-rose-900 border-rose-300 font-semibold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              id="save-profile-btn"
              type="submit"
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
