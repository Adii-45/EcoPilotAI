export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'Energy' | 'Water' | 'Transport' | 'Food' | 'Waste';

export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  sustainabilityScore: number;
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
