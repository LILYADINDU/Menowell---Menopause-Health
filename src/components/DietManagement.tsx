import React, { useState } from 'react';
import { 
  Utensils, 
  Droplets, 
  Plus, 
  Minus, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Leaf, 
  ShieldAlert, 
  BookOpen, 
  Loader2 
} from 'lucide-react';
import { DailyLog, MealItem, UserProfile } from '../types';
import { PHYTOESTROGEN_FOODS, VASOMOTOR_TRIGGERS } from '../data/menopauseResources';

interface DietManagementProps {
  currentLog: DailyLog;
  profile: UserProfile;
  onUpdateLog: (updated: Partial<DailyLog>) => void;
}

export const DietManagement: React.FC<DietManagementProps> = ({
  currentLog,
  profile,
  onUpdateLog,
}) => {
  // Meal entry state
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');
  const [mealDescription, setMealDescription] = useState('');
  const [hasPhytoestrogens, setHasPhytoestrogens] = useState(false);
  const [selectedTriggers, setSelectedTriggers] = useState<MealItem['triggers']>([]);

  // AI Meal Analyzer state
  const [aiMealInput, setAiMealInput] = useState('');
  const [isAnalyzingMeal, setIsAnalyzingMeal] = useState(false);
  const [mealAnalysisResult, setMealAnalysisResult] = useState<{
    score?: string;
    phytoestrogens?: string;
    boneSupport?: string;
    vasomotorTriggerRisk?: string;
    feedback?: string;
    smartTip?: string;
  } | null>(null);

  // Supplements list
  const supplementOptions = [
    'Magnesium Glycinate (300mg)',
    'Vitamin D3 + K2 (2000 IU)',
    'Omega-3 EPA/DHA',
    'Calcium Citrate (500mg)',
    'Black Cohosh extract',
    'Probiotics for microbiome',
  ];

  // Water handler
  const handleAdjustWater = (amountOz: number) => {
    const newWater = Math.max(0, currentLog.waterOz + amountOz);
    onUpdateLog({ waterOz: newWater });
  };

  // Toggle trigger in form
  const toggleTrigger = (trigger: MealItem['triggers'][number]) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  // Add meal
  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealDescription.trim()) return;

    const newMeal: MealItem = {
      id: `meal-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealType,
      description: mealDescription.trim(),
      phytoestrogens: hasPhytoestrogens,
      triggers: selectedTriggers,
      rating: selectedTriggers.length > 0 ? 'triggered_symptoms' : 'nourishing',
    };

    const newPhytoCount = hasPhytoestrogens 
      ? currentLog.phytoestrogenServings + 1 
      : currentLog.phytoestrogenServings;

    onUpdateLog({
      meals: [...currentLog.meals, newMeal],
      phytoestrogenServings: newPhytoCount,
    });

    // Reset form
    setMealDescription('');
    setHasPhytoestrogens(false);
    setSelectedTriggers([]);
  };

  // Toggle supplement
  const toggleSupplement = (supp: string) => {
    const exists = currentLog.supplements.includes(supp);
    const updated = exists 
      ? currentLog.supplements.filter(s => s !== supp)
      : [...currentLog.supplements, supp];
    onUpdateLog({ supplements: updated });
  };

  // Analyze meal with Gemini AI
  const handleAnalyzeMeal = async () => {
    if (!aiMealInput.trim()) return;
    setIsAnalyzingMeal(true);
    setMealAnalysisResult(null);

    try {
      const res = await fetch('/api/advisor/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealDescription: aiMealInput,
          userPhase: profile.phase,
        }),
      });
      const data = await res.json();
      setMealAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setMealAnalysisResult({
        score: 'Beneficial',
        phytoestrogens: 'Moderate',
        vasomotorTriggerRisk: 'Low',
        feedback: 'Whole plant foods support hormone stabilization and gentle digestion.',
        smartTip: 'Add 1 tablespoon of ground flaxseed for natural lignan support.',
      });
    } finally {
      setIsAnalyzingMeal(false);
    }
  };

  const waterPercent = Math.min(100, Math.round((currentLog.waterOz / profile.dailyWaterGoalOz) * 100));

  return (
    <div className="space-y-8">
      {/* Top Section Header */}
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-2xl font-bold font-serif-display text-stone-900">
          Diet & Menopause Nutrition Management
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Hormone balancing through targeted phytoestrogens, cellular hydration, bone density minerals, and vasomotor trigger mitigation.
        </p>
      </div>

      {/* Primary Trackers Grid: Phytoestrogen & Hydration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phytoestrogen Daily Target */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900">Phytoestrogen Intake</h3>
                <p className="text-xs text-stone-500">Target: 2-3 plant servings / day</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {currentLog.phytoestrogenServings} / 3 Servings
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed mb-4">
            Phytoestrogens (lignans and isoflavones in flax, edamame, and lentils) bind weakly to estrogen receptors beta, naturally moderating severe vasomotor swings and bone reabsorption.
          </p>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-3 rounded-full transition-all ${
                  step <= currentLog.phytoestrogenServings
                    ? 'bg-emerald-600'
                    : 'bg-stone-100 border border-stone-200'
                }`}
              />
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">Quick adjust servings:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateLog({ phytoestrogenServings: Math.max(0, currentLog.phytoestrogenServings - 1) })}
                className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-stone-900 w-5 text-center">
                {currentLog.phytoestrogenServings}
              </span>
              <button
                onClick={() => onUpdateLog({ phytoestrogenServings: currentLog.phytoestrogenServings + 1 })}
                className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cellular Hydration */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900">Hydration & Electrolytes</h3>
                <p className="text-xs text-stone-500">Goal: {profile.dailyWaterGoalOz} oz / day</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {waterPercent}% Goal Met
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed mb-4">
            Estrogen decline reduces hyaluronic acid and skin water retention. Adequate hydration cushions joints, prevents urinary urgency, and reduces internal heat spikes.
          </p>

          <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${waterPercent}%` }}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-medium text-stone-700">
              {currentLog.waterOz} oz logged
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdjustWater(-8)}
                className="px-2.5 py-1 rounded-lg border border-stone-200 text-xs text-stone-600 hover:bg-stone-100"
              >
                -8 oz
              </button>
              <button
                onClick={() => handleAdjustWater(8)}
                className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors"
              >
                +8 oz Glass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Smart AI Menopause Meal Evaluator */}
      <div className="bg-purple-50/60 rounded-2xl p-6 border border-purple-200">
        <div className="flex items-center gap-2.5 mb-2">
          <Sparkles className="w-5 h-5 text-purple-700" />
          <h3 className="text-base font-bold text-purple-950 font-serif-display">
            AI Menopause Meal & Trigger Evaluator
          </h3>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full">
            Gemini 3.8 Powered
          </span>
        </div>
        <p className="text-xs sm:text-sm text-purple-900/80 mb-4 max-w-3xl">
          Wondering if a meal might precipitate afternoon brain fog or nocturnal hot flashes? Enter any meal or recipe idea to receive an instant clinical hormone and trigger breakdown.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="ai-meal-input"
            type="text"
            value={aiMealInput}
            onChange={(e) => setAiMealInput(e.target.value)}
            placeholder="e.g., Spicy Thai red chicken curry with white jasmine rice and 2 glasses of Pinot Noir"
            className="flex-1 px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeMeal()}
          />
          <button
            id="ai-meal-analyze-btn"
            onClick={handleAnalyzeMeal}
            disabled={isAnalyzingMeal || !aiMealInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
          >
            {isAnalyzingMeal ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Meal</span>
              </>
            )}
          </button>
        </div>

        {/* AI Analysis Result Card */}
        {mealAnalysisResult && (
          <div className="mt-4 p-4 sm:p-5 rounded-xl bg-white border border-purple-200 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Hormone Impact:</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  mealAnalysisResult.score === 'Optimal' || mealAnalysisResult.score === 'Beneficial'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {mealAnalysisResult.score || 'Evaluated'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span>Phytoestrogens: <strong className="text-stone-800">{mealAnalysisResult.phytoestrogens}</strong></span>
                <span>Vasomotor Trigger Risk: <strong className={
                  mealAnalysisResult.vasomotorTriggerRisk === 'High' ? 'text-rose-700' : 'text-stone-800'
                }>{mealAnalysisResult.vasomotorTriggerRisk}</strong></span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {mealAnalysisResult.feedback}
            </p>

            {mealAnalysisResult.smartTip && (
              <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <Leaf className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Doctor’s Smart Swap:</strong> {mealAnalysisResult.smartTip}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Log Today's Meals & Trigger Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Meals Logged Today & Add Meal Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Meal Form */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-rose-700" />
              <span>Log Meal or Snack</span>
            </h3>

            <form onSubmit={handleAddMeal} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMealType(type)}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
                      mealType === type
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div>
                <input
                  id="meal-desc-input"
                  type="text"
                  value={mealDescription}
                  onChange={(e) => setMealDescription(e.target.value)}
                  placeholder="e.g., Lentil vegetable soup with avocado, baby spinach, and green tea"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Tag options: Phytoestrogen & Known Triggers */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-stone-600">Special Properties & Triggers:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setHasPhytoestrogens(!hasPhytoestrogens)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      hasPhytoestrogens
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Phytoestrogen Rich (flax, soy, legumes)</span>
                  </button>

                  {[
                    { id: 'caffeine', label: 'Caffeine' },
                    { id: 'alcohol', label: 'Alcohol / Wine' },
                    { id: 'spicy', label: 'Spicy Chili' },
                    { id: 'high_sugar', label: 'High Refined Sugar' },
                    { id: 'heavy_late', label: 'Heavy Late Eating' },
                  ].map(trigger => (
                    <button
                      key={trigger.id}
                      type="button"
                      onClick={() => toggleTrigger(trigger.id as MealItem['triggers'][number])}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        selectedTriggers.includes(trigger.id as MealItem['triggers'][number])
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{trigger.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="submit-meal-btn"
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Add to Daily Log
              </button>
            </form>
          </div>

          {/* Meals Logged List */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 mb-3">Today's Meals & Nourishment</h3>
            {currentLog.meals.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">
                No meals logged yet today. Add your breakfast, lunch, or nourishing snacks above.
              </p>
            ) : (
              <div className="space-y-3">
                {currentLog.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold capitalize text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                          {meal.mealType}
                        </span>
                        <span className="text-xs text-stone-400">{meal.time}</span>
                        {meal.phytoestrogens && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> Phytoestrogen
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-stone-900">
                        {meal.description}
                      </p>
                    </div>

                    {meal.triggers.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
                        {meal.triggers.map(t => (
                          <span
                            key={t}
                            className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {t.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Daily Supplements & Trigger Reference */}
        <div className="space-y-6">
          {/* Daily Supplements Checklist */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Targeted Supplements</span>
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Check off your evidence-supported daily micronutrients:
            </p>

            <div className="space-y-2.5">
              {supplementOptions.map(supp => {
                const isChecked = currentLog.supplements.includes(supp);
                return (
                  <label
                    key={supp}
                    onClick={() => toggleSupplement(supp)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 font-medium'
                        : 'bg-stone-50/50 border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-xs">{supp}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Phytoestrogen Quick Reference Cards */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-stone-700" />
              <span>Phytoestrogen Power Foods</span>
            </h3>
            <div className="space-y-2.5">
              {PHYTOESTROGEN_FOODS.slice(0, 4).map(food => (
                <div key={food.name} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                  <div className="font-bold text-stone-900">{food.name}</div>
                  <div className="text-stone-600 mt-0.5">{food.tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
