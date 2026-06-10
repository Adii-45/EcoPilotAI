import type { User, Habit, Challenge, Mission, Insight } from '../types';

export const mockUser: User = {
  id: 'u1',
  name: 'Alex',
  level: 7,
  xp: 350,
  nextLevelXp: 500,
  streak: 7,
  sustainabilityScore: 72,
};

export const mockInsights: Insight[] = [
  {
    id: 'i1',
    text: 'Your transportation habits contribute the highest emissions. Replacing just two car trips with public transport each week could reduce your annual footprint by ~90 kg CO₂.',
    type: 'recommendation',
    actionLabel: 'Accept Challenge'
  }
];

export const mockMission: Mission = {
  id: 'm1',
  title: 'Go Meatless for Dinner',
  description: 'Choose a plant-based meal tonight to significantly reduce your daily emissions.',
  xpReward: 50,
  completed: false,
};

export const mockDailyChallenges: Habit[] = [
  {
    id: 'dc1',
    title: 'Used reusable water bottle',
    description: '',
    xpReward: 20,
    co2SavingsKg: 0.1,
    difficulty: 'Easy',
    category: 'Water',
    streak: 0,
    completedToday: true,
  },
  {
    id: 'dc2',
    title: 'Walked instead of driving',
    description: '',
    xpReward: 20,
    co2SavingsKg: 0.5,
    difficulty: 'Medium',
    category: 'Transport',
    streak: 0,
    completedToday: true,
  },
  {
    id: 'dc3',
    title: 'Unplug inactive electronics',
    description: '',
    xpReward: 15,
    co2SavingsKg: 0.2,
    difficulty: 'Easy',
    category: 'Energy',
    streak: 0,
    completedToday: false,
  },
  {
    id: 'dc4',
    title: 'Air-dry laundry',
    description: '',
    xpReward: 30,
    co2SavingsKg: 1.2,
    difficulty: 'Medium',
    category: 'Energy',
    streak: 0,
    completedToday: false,
  }
];

export const mockWeeklyChallenges: Challenge[] = [
  {
    id: 'wc1',
    title: 'Public Transit Pro',
    description: 'Take public transport 5 days this week.',
    xpReward: 100,
    progress: 3,
    total: 5,
    category: 'Transport'
  },
  {
    id: 'wc2',
    title: 'Hydration Hero',
    description: 'Use your reusable bottle 7 days straight.',
    xpReward: 50,
    progress: 7,
    total: 7,
    category: 'Water'
  }
];

export const mockActiveHabits: Habit[] = [
  {
    id: 'h1',
    title: 'Carry reusable bottle',
    description: '',
    xpReward: 20,
    co2SavingsKg: 0.1,
    difficulty: 'Easy',
    category: 'Water',
    streak: 5,
    completedToday: true,
  },
  {
    id: 'h2',
    title: 'Walk 5k steps',
    description: '',
    xpReward: 30,
    co2SavingsKg: 0.8,
    difficulty: 'Medium',
    category: 'Transport',
    streak: 3,
    completedToday: false,
  },
  {
    id: 'h3',
    title: 'Use public transport',
    description: '',
    xpReward: 50,
    co2SavingsKg: 2.5,
    difficulty: 'Hard',
    category: 'Transport',
    streak: 7,
    completedToday: true,
  }
];
