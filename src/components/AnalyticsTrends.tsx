import React, { useState } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Moon, 
  Leaf, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { DailyLog, UserProfile } from '../types';

interface AnalyticsTrendsProps {
  logs: DailyLog[];
  profile: UserProfile;
  onSelectLog: (log: DailyLog) => void;
  selectedLogId: string;
}

export const AnalyticsTrends: React.FC<AnalyticsTrendsProps> = ({
  logs,
  profile,
  onSelectLog,
  selectedLogId,
}) => {
  // Sort logs chronologically
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  // Compute key metrics
  const totalHotFlashes = sortedLogs.reduce((acc, l) => acc + (l.hotFlashCount || 0), 0);
  const avgSleepHours = (sortedLogs.reduce((acc, l) => acc + (l.sleepHours || 0), 0) / (sortedLogs.length || 1)).toFixed(1);
  const nightsWithSweats = sortedLogs.filter(l => l.nightSweats).length;
  const avgCalm = (sortedLogs.reduce((acc, l) => acc + (l.calmScore || 0), 0) / (sortedLogs.length || 1)).toFixed(1);

  // Derive correlations:
  // 1. Hot flash frequency on days with triggers vs days without
  const triggerDays = sortedLogs.filter(l => 
    l.meals.some(m => m.triggers && m.triggers.length > 0)
  );
  const cleanDays = sortedLogs.filter(l => 
    !l.meals.some(m => m.triggers && m.triggers.length > 0)
  );

  const avgFlashesTriggerDays = triggerDays.length > 0
    ? (triggerDays.reduce((acc, l) => acc + l.hotFlashCount, 0) / triggerDays.length).toFixed(1)
    : '0';

  const avgFlashesCleanDays = cleanDays.length > 0
    ? (cleanDays.reduce((acc, l) => acc + l.hotFlashCount, 0) / cleanDays.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-2xl font-bold font-serif-display text-stone-900">
          Personalized Symptom Analytics & Correlations
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Evidence reveals that menopause symptoms do not happen in isolation. Discover how nutrition, bedroom temperature, and calming habits directly alter your vasomotor and sleep patterns.
        </p>
      </div>

      {/* Top Aggregate Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">7-Day Total Hot Flashes</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-serif-display text-stone-900 mt-1 flex items-baseline gap-2">
            <span>{totalHotFlashes}</span>
            <span className="text-xs font-normal text-stone-500 font-sans">episodes</span>
          </div>
          <div className="text-xs text-rose-600 font-medium mt-1">
            Avg {(totalHotFlashes / sortedLogs.length).toFixed(1)} / day
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Average Sleep Duration</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-serif-display text-stone-900 mt-1 flex items-baseline gap-2">
            <span>{avgSleepHours}</span>
            <span className="text-xs font-normal text-stone-500 font-sans">hours</span>
          </div>
          <div className="text-xs text-blue-600 font-medium mt-1">
            Target: {profile.targetSleepGoalHours}h
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Night Sweat Awakenings</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-serif-display text-stone-900 mt-1 flex items-baseline gap-2">
            <span>{nightsWithSweats}</span>
            <span className="text-xs font-normal text-stone-500 font-sans">of {sortedLogs.length} nights</span>
          </div>
          <div className="text-xs text-amber-600 font-medium mt-1">
            {Math.round((nightsWithSweats / sortedLogs.length) * 100)}% of tracked nights
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Average Calm Score</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-serif-display text-stone-900 mt-1 flex items-baseline gap-2">
            <span>{avgCalm}</span>
            <span className="text-xs font-normal text-stone-500 font-sans">/ 10</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            Nervous system stability
          </div>
        </div>
      </div>

      {/* Key Correlative Insights Box */}
      <div className="bg-rose-50/60 rounded-2xl p-6 border border-rose-200">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-rose-700" />
          <h3 className="text-base font-bold text-rose-950 font-serif-display">
            Discovered Triggers & Protective Patterns
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-white rounded-xl border border-rose-100 space-y-1">
            <div className="font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Vasomotor Trigger Correlation: Alcohol & Late Caffeine</span>
            </div>
            <p className="text-stone-700 leading-relaxed">
              On days with logged alcohol or caffeine (such as Sept 14), you experienced an average of <strong>{avgFlashesTriggerDays} hot flashes</strong> and 3 night sweats, compared to only <strong>{avgFlashesCleanDays} hot flashes</strong> on clean days.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-rose-100 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Protective Factor: Phytoestrogens & 65°F Bedroom</span>
            </div>
            <p className="text-stone-700 leading-relaxed">
              Days with 2+ servings of ground flaxseed or legumes and an evening 65°F cooling protocol resulted in <strong>zero night sweat awakenings</strong> and an average morning restoration score of 8/10.
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Visual Progression Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hot Flash Frequency Progression */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Daily Hot Flash Frequency</span>
            </h3>
            <span className="text-xs text-stone-500">Past 7 Days</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-stone-100">
            {sortedLogs.map((log) => {
              const maxFlashes = 6;
              const heightPct = Math.max(12, (log.hotFlashCount / maxFlashes) * 100);
              const isSelected = log.id === selectedLogId;

              return (
                <div
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <span className="text-[11px] font-bold text-stone-700 group-hover:text-rose-600">
                    {log.hotFlashCount}
                  </span>
                  <div
                    className={`w-full max-w-[32px] rounded-t-lg transition-all ${
                      log.hotFlashCount >= 4
                        ? 'bg-rose-600 group-hover:bg-rose-700'
                        : log.hotFlashCount >= 2
                        ? 'bg-rose-400 group-hover:bg-rose-500'
                        : 'bg-rose-200 group-hover:bg-rose-300'
                    } ${isSelected ? 'ring-2 ring-stone-900' : ''}`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-stone-500 font-medium">
                    {new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Low (0-1)</span>
            <span>Moderate (2-3)</span>
            <span className="text-rose-600 font-semibold">Elevated (4+)</span>
          </div>
        </div>

        {/* Sleep Quality & Night Sweats Correlation */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-600" />
              <span>Sleep Hours & Night Sweats</span>
            </h3>
            <span className="text-xs text-stone-500">Past 7 Days</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-stone-100">
            {sortedLogs.map((log) => {
              const maxHours = 9;
              const heightPct = Math.max(15, (log.sleepHours / maxHours) * 100);
              const isSelected = log.id === selectedLogId;

              return (
                <div
                  key={log.id}
                  onClick={() => onSelectLog(log)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <span className="text-[11px] font-bold text-stone-700 group-hover:text-blue-600">
                    {log.sleepHours}h
                  </span>
                  <div
                    className={`w-full max-w-[32px] rounded-t-lg transition-all relative ${
                      log.nightSweats
                        ? 'bg-amber-400 group-hover:bg-amber-500'
                        : 'bg-blue-600 group-hover:bg-blue-700'
                    } ${isSelected ? 'ring-2 ring-stone-900' : ''}`}
                    style={{ height: `${heightPct}%` }}
                  >
                    {log.nightSweats && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-amber-900 font-black">
                        ⚡
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-blue-700">
              <div className="w-3 h-3 rounded-xs bg-blue-600" />
              <span>Restful Sleep</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700">
              <div className="w-3 h-3 rounded-xs bg-amber-400" />
              <span>Night Sweats Disruption (⚡)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Logs Browser */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-700" />
            <span>Daily History Log Viewer</span>
          </h3>
          <span className="text-xs text-stone-500">Tap any date to inspect details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wider border-y border-stone-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Sleep</th>
                <th className="p-3">Night Sweats</th>
                <th className="p-3">Hot Flashes</th>
                <th className="p-3">Calm / Mood</th>
                <th className="p-3">Phyto / Water</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedLogs.map((log) => {
                const isSelected = log.id === selectedLogId;
                return (
                  <tr
                    key={log.id}
                    onClick={() => onSelectLog(log)}
                    className={`hover:bg-stone-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-rose-50/60 font-semibold' : ''
                    }`}
                  >
                    <td className="p-3 font-medium text-stone-900 whitespace-nowrap">
                      {new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                    </td>
                    <td className="p-3">{log.sleepHours} hrs ({log.sleepQuality}★)</td>
                    <td className="p-3">
                      {log.nightSweats ? (
                        <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                          {log.nightSweatEpisodes}x Sweats
                        </span>
                      ) : (
                        <span className="text-emerald-700">None</span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-stone-900">
                      {log.hotFlashCount} ({log.hotFlashPeakSeverity})
                    </td>
                    <td className="p-3 capitalize">{log.mood} ({log.calmScore}/10)</td>
                    <td className="p-3">{log.phytoestrogenServings} serv / {log.waterOz} oz</td>
                    <td className="p-3">
                      <span className="text-[11px] text-stone-500 underline">
                        {isSelected ? 'Viewing' : 'Inspect'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
