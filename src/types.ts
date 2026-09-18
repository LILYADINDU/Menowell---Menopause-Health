export type MenopausePhase = 'perimenopause' | 'menopause' | 'postmenopause' | 'unsure';

export interface UserProfile {
  name: string;
  age: number;
  phase: MenopausePhase;
  yearsInPhase: number;
  primaryConcerns: string[];
  hormoneTherapyStatus: 'none' | 'prescribed_hrt' | 'natural_supplements' | 'considering';
  dailyWaterGoalOz: number;
  targetSleepGoalHours: number;
}

export interface MealItem {
  id: string;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  phytoestrogens: boolean;
  triggers: ('caffeine' | 'alcohol' | 'spicy' | 'high_sugar' | 'heavy_late')[];
  rating: 'nourishing' | 'neutral' | 'triggered_symptoms';
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  // Diet
  meals: MealItem[];
  waterOz: number;
  phytoestrogenServings: number;
  calciumServings: number;
  supplements: string[];
  dietNotes: string;
  
  // Emotional Well-being
  mood: 'radiant' | 'calm' | 'balanced' | 'foggy' | 'anxious' | 'irritable' | 'exhausted';
  calmScore: number; // 1 - 10
  anxietyScore: number; // 0 - 10
  brainFogSeverity: number; // 0 - 5 (0 = sharp, 5 = intense fog)
  gratitudeNote: string;
  mindfulnessMinutes: number;
  emotionalReflection: string;

  // Sleep Patterns
  bedTime: string; // "22:30"
  wakeTime: string; // "06:45"
  sleepHours: number;
  sleepQuality: number; // 1 - 5
  nightSweats: boolean;
  nightSweatEpisodes: number;
  sleepDisruptions: string[];
  sleepHygieneScore: number; // 0 - 100 based on checklist
  morningRestorativeScore: number; // 1 - 10
  sleepNotes: string;

  // Physical & Vasomotor
  hotFlashCount: number;
  hotFlashPeakSeverity: 'none' | 'mild' | 'moderate' | 'severe';
  energyLevel: number; // 1 - 10
  jointAches: number; // 0 - 5
}

export interface ProfessionalResource {
  id: string;
  category: 'clinical' | 'directory' | 'cbt_insomnia' | 'medication' | 'community' | 'support_lines';
  title: string;
  organization: string;
  description: string;
  badge?: string;
  linkText: string;
  url: string;
  phone?: string;
  isHotline?: boolean;
}

export interface DoctorDiscussionItem {
  category: string;
  observation: string;
  clinicalQuestion: string;
}
