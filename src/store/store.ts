import { create } from 'zustand';
import type { User, Habit, Achievement, SimulationState, Category, Mission } from '../types';
import { mockUser, mockActiveHabits, mockDailyChallenges, mockMission } from '../data/mockData';

interface AppState {
  user: User;
  habits: Habit[];
  dailyChallenges: Habit[];
  achievements: Achievement[];
  simulation: SimulationState;
  activeMission: Mission | null;
  
  // Actions
  completeHabit: (habitId: string) => void;
  updateUserLevel: () => void;
  updateSimulation: (updates: Partial<SimulationState>) => void;
  unlockAchievement: (achievementId: string) => void;
}

const initialAchievements: Achievement[] = [
  { id: 'a1', title: 'Zero Emission Commuter', description: 'Log 50 zero-emission commutes (bike, walk, EV).', xpReward: 500, category: 'Transport', unlocked: true, progress: 50, total: 50 },
  { id: 'a2', title: 'Public Transit Pro', description: 'Take public transportation 20 times this month.', xpReward: 300, category: 'Transport', unlocked: false, progress: 12, total: 20 },
  { id: 'a3', title: 'Plant-Based Pioneer', description: 'Eat 30 plant-based meals.', xpReward: 250, category: 'Food', unlocked: true, progress: 30, total: 30 },
  { id: 'a4', title: 'Local Locavore', description: 'Buy local produce exclusively for 2 weeks.', xpReward: 400, category: 'Food', unlocked: false, progress: 0, total: 14 },
];

export const useStore = create<AppState>((set, get) => ({
  user: {
    ...mockUser,
    email: 'sarah.j@eco-pilot.io', // Added mock email
    totalCarbonSaved: 1240, // Mock initial state
    totalActions: 342,
    achievementsEarned: 18,
  },
  habits: mockActiveHabits,
  dailyChallenges: mockDailyChallenges,
  achievements: initialAchievements,
  simulation: {
    carUsage: 120,
    meatConsumption: 4,
    energyEfficiency: 50,
    shoppingFrequency: 50,
  },
  activeMission: mockMission,

  completeHabit: (habitId: string) => set((state) => {
    let habitToComplete = state.habits.find(h => h.id === habitId);
    let isDaily = false;
    
    if (!habitToComplete) {
      habitToComplete = state.dailyChallenges.find(h => h.id === habitId);
      isDaily = true;
    }

    if (!habitToComplete || habitToComplete.completedToday) return state; // Already completed or not found

    const xpGained = habitToComplete.xpReward;
    const carbonSaved = habitToComplete.co2SavingsKg;

    // Update user stats
    const newUser = {
      ...state.user,
      xp: state.user.xp + xpGained,
      totalCarbonSaved: state.user.totalCarbonSaved + carbonSaved,
      totalActions: state.user.totalActions + 1,
      sustainabilityScore: Math.min(100, state.user.sustainabilityScore + 1)
    };

    // Update habit status
    const updatedHabit = { ...habitToComplete, completedToday: true, streak: habitToComplete.streak + 1 };
    
    const updatedHabits = isDaily ? state.habits : state.habits.map(h => h.id === habitId ? updatedHabit : h);
    const updatedDaily = isDaily ? state.dailyChallenges.map(h => h.id === habitId ? updatedHabit : h) : state.dailyChallenges;

    // Level up logic (simplified)
    if (newUser.xp >= newUser.nextLevelXp) {
      newUser.level += 1;
      newUser.xp -= newUser.nextLevelXp;
      newUser.nextLevelXp = Math.floor(newUser.nextLevelXp * 1.5);
    }

    return {
      user: newUser,
      habits: updatedHabits,
      dailyChallenges: updatedDaily,
    };
  }),

  updateUserLevel: () => set((state) => {
    if (state.user.xp >= state.user.nextLevelXp) {
      return {
        user: {
          ...state.user,
          level: state.user.level + 1,
          xp: state.user.xp - state.user.nextLevelXp,
          nextLevelXp: Math.floor(state.user.nextLevelXp * 1.5),
        }
      };
    }
    return state;
  }),

  updateSimulation: (updates) => set((state) => ({
    simulation: { ...state.simulation, ...updates }
  })),

  unlockAchievement: (achievementId: string) => set((state) => {
    const ach = state.achievements.find(a => a.id === achievementId);
    if (!ach || ach.unlocked) return state;

    return {
      achievements: state.achievements.map(a => a.id === achievementId ? { ...a, unlocked: true, progress: a.total } : a),
      user: {
        ...state.user,
        xp: state.user.xp + ach.xpReward,
        achievementsEarned: state.user.achievementsEarned + 1
      }
    };
  })
}));
