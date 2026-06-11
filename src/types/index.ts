export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'Energy' | 'Water' | 'Transport' | 'Food' | 'Waste' | 'Lifestyle';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  photoURL?: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  sustainabilityScore: number;
  totalCarbonSaved: number;
  totalActions: number;
  achievementsEarned: number;
  history: { date: string; score: number; actions: number }[];
  lastActiveDate?: string;
  longestStreak?: number;
}

export interface ActivityRecord {
  id: string;
  userId: string;
  type: 'habit_completed' | 'mission_completed' | 'achievement_unlocked' | 'simulation_run' | 'streak_increased';
  timestamp: string; // ISO String
  pointsEarned: number;
  carbonSaved: number;
  metadata?: any;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'habit_reminder' | 'achievement' | 'report_ready' | 'streak_risk' | 'system';
  read: boolean;
  timestamp: string; // ISO string
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  co2SavingsKg: number;
  difficulty: Difficulty;
  category: Category;
  streak: number; // 0-7 indicating days completed this week
  completedToday: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  total: number;
  category: Category;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export interface Insight {
  id: string;
  text: string;
  type: 'recommendation' | 'alert' | 'praise';
  actionLabel?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Habit[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: Category;
  unlocked: boolean;
  progress: number;
  total: number;
  icon?: string;
}

export interface SimulationState {
  carUsage: number; // miles/wk
  meatConsumption: number; // days/wk
  energyEfficiency: number; // 0 (Low) to 100 (High)
  shoppingFrequency: number; // 0 (Minimal) to 100 (Frequent)
}

export interface UserSettings {
  remindersEnabled: boolean;
  coachingIntensity: 'Gentle' | 'Standard' | 'Strict';
  sustainabilityFocus: Category[];
}
