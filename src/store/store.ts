import { create } from 'zustand';
import type { User, Habit, Achievement, SimulationState, Mission, Insight, Challenge, UserSettings, AIChatMessage } from '../types';
import { calculateLevel, calculateSustainabilityScore } from '../services/engine';
import { saveUserProgress, saveHabits, saveAchievements, saveSimulation, saveSettings, saveChatHistory } from '../services/db';

interface AppState {
  user: User | null;
  settings: UserSettings;
  habits: Habit[];
  dailyChallenges: Habit[];
  weeklyChallenges: Challenge[];
  achievements: Achievement[];
  simulation: SimulationState;
  activeMission: Mission | null;
  insights: Insight[];
  aiMessages: AIChatMessage[];
  
  // Actions
  completeHabit: (habitId: string) => Promise<void>;
  updateSimulation: (updates: Partial<SimulationState>) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addChatMessage: (msg: Omit<AIChatMessage, 'id'>) => Promise<void>;
  setInitialData: (data: Partial<AppState>) => void;
}

const initialAchievements: Achievement[] = [
  { id: 'a1', title: 'Zero Emission Commuter', description: 'Log 50 zero-emission commutes (bike, walk, EV).', xpReward: 500, category: 'Transport', unlocked: true, progress: 50, total: 50, icon: 'Bike' },
  { id: 'a2', title: 'Public Transit Pro', description: 'Take public transportation 20 times this month.', xpReward: 300, category: 'Transport', unlocked: false, progress: 12, total: 20, icon: 'Train' },
  { id: 'a3', title: 'Plant-Based Pioneer', description: 'Eat 30 plant-based meals.', xpReward: 250, category: 'Food', unlocked: true, progress: 30, total: 30, icon: 'Leaf' },
  { id: 'a4', title: 'Consistency Champion', description: 'Maintain a 7 day streak.', xpReward: 400, category: 'Lifestyle', unlocked: false, progress: 0, total: 7, icon: 'Flame' },
];

const initialSettings: UserSettings = {
  remindersEnabled: true,
  coachingIntensity: 'Standard',
  sustainabilityFocus: ['Transport', 'Energy']
};

const initialDailyChallenges: Habit[] = [
  { id: 'dc1', title: 'Used reusable water bottle', description: '', xpReward: 20, co2SavingsKg: 0.1, difficulty: 'Easy', category: 'Water', streak: 0, completedToday: true },
  { id: 'dc2', title: 'Walked instead of driving', description: '', xpReward: 20, co2SavingsKg: 0.5, difficulty: 'Medium', category: 'Transport', streak: 0, completedToday: true },
  { id: 'dc3', title: 'Unplug inactive electronics', description: '', xpReward: 15, co2SavingsKg: 0.2, difficulty: 'Easy', category: 'Energy', streak: 0, completedToday: false },
  { id: 'dc4', title: 'Air-dry laundry', description: '', xpReward: 30, co2SavingsKg: 1.2, difficulty: 'Medium', category: 'Energy', streak: 0, completedToday: false }
];

const initialActiveHabits: Habit[] = [
  { id: 'h1', title: 'Carry reusable bottle', description: '', xpReward: 20, co2SavingsKg: 0.1, difficulty: 'Easy', category: 'Water', streak: 5, completedToday: true },
  { id: 'h2', title: 'Walk 5k steps', description: '', xpReward: 30, co2SavingsKg: 0.8, difficulty: 'Medium', category: 'Transport', streak: 3, completedToday: false },
  { id: 'h3', title: 'Use public transport', description: '', xpReward: 50, co2SavingsKg: 2.5, difficulty: 'Hard', category: 'Transport', streak: 7, completedToday: true }
];

const initialWeeklyChallenges: Challenge[] = [
  { id: 'wc1', title: 'Public Transit Pro', description: 'Take public transport 5 days this week.', xpReward: 100, progress: 3, total: 5, category: 'Transport' },
  { id: 'wc2', title: 'Hydration Hero', description: 'Use your reusable bottle 7 days straight.', xpReward: 50, progress: 7, total: 7, category: 'Water' }
];

const initialInsights: Insight[] = [
  { id: 'i1', text: 'Your transportation habits contribute the highest emissions. Replacing just two car trips with public transport each week could reduce your annual footprint by ~90 kg CO₂.', type: 'recommendation', actionLabel: 'Accept Challenge' }
];

const initialMission: Mission = {
  id: 'm1', title: 'Go Meatless for Dinner', description: 'Choose a plant-based meal tonight to significantly reduce your daily emissions.', xpReward: 50, completed: false,
};

export const useStore = create<AppState>((set, get) => ({
  user: null,
  settings: initialSettings,
  habits: initialActiveHabits,
  dailyChallenges: initialDailyChallenges,
  weeklyChallenges: initialWeeklyChallenges,
  achievements: initialAchievements,
  simulation: {
    carUsage: 120,
    meatConsumption: 4,
    energyEfficiency: 50,
    shoppingFrequency: 50,
  },
  activeMission: initialMission,
  insights: initialInsights,
  aiMessages: [],

  setInitialData: (data) => set((state) => ({ ...state, ...data })),

  completeHabit: async (habitId: string) => {
    const state = get();
    if (!state.user) return;

    let habitToComplete = state.habits.find(h => h.id === habitId);
    let isDaily = false;
    
    if (!habitToComplete) {
      habitToComplete = state.dailyChallenges.find(h => h.id === habitId);
      isDaily = true;
    }

    if (!habitToComplete || habitToComplete.completedToday) return;

    const xpGained = habitToComplete.xpReward;
    const carbonSaved = habitToComplete.co2SavingsKg;

    const updatedHabit = { ...habitToComplete, completedToday: true, streak: habitToComplete.streak + 1 };
    const updatedHabits = isDaily ? state.habits : state.habits.map(h => h.id === habitId ? updatedHabit : h);
    const updatedDaily = isDaily ? state.dailyChallenges.map(h => h.id === habitId ? updatedHabit : h) : state.dailyChallenges;

    const { level, nextLevelXp } = calculateLevel(state.user.xp + xpGained);

    const newUser = {
      ...state.user,
      xp: state.user.xp + xpGained,
      level,
      nextLevelXp,
      totalCarbonSaved: state.user.totalCarbonSaved + carbonSaved,
      totalActions: state.user.totalActions + 1,
    };

    // Recalculate score
    newUser.sustainabilityScore = calculateSustainabilityScore(newUser, [...updatedHabits, ...updatedDaily]);

    // Check for achievements
    const newAchievements = [...state.achievements];
    const consistencyAch = newAchievements.find(a => a.id === 'a4');
    if (consistencyAch && !consistencyAch.unlocked && newUser.streak >= consistencyAch.total) {
      consistencyAch.unlocked = true;
      consistencyAch.progress = consistencyAch.total;
      newUser.achievementsEarned += 1;
      newUser.xp += consistencyAch.xpReward;
    }

    // Update daily history
    const todayStr = new Date().toISOString().split('T')[0];
    const newHistory = [...(newUser.history || [])];
    const todayIndex = newHistory.findIndex(h => h.date === todayStr);
    
    if (todayIndex >= 0) {
      newHistory[todayIndex] = {
        date: todayStr,
        score: newUser.sustainabilityScore,
        actions: newHistory[todayIndex].actions + 1
      };
    } else {
      newHistory.push({
        date: todayStr,
        score: newUser.sustainabilityScore,
        actions: 1
      });
    }
    newUser.history = newHistory;

    // Set state locally first for snappy UI
    set({
      user: newUser,
      habits: updatedHabits,
      dailyChallenges: updatedDaily,
      achievements: newAchievements
    });

    // Sync to DB
    await saveUserProgress(state.user.id, newUser);
    await saveHabits(state.user.id, updatedHabits, updatedDaily);
    await saveAchievements(state.user.id, newAchievements);
  },

  updateSimulation: async (updates) => {
    const state = get();
    const newSim = { ...state.simulation, ...updates };
    set({ simulation: newSim });
    if (state.user) {
      await saveSimulation(state.user.id, newSim);
    }
  },

  unlockAchievement: async (achievementId: string) => {
    const state = get();
    if (!state.user) return;

    const ach = state.achievements.find(a => a.id === achievementId);
    if (!ach || ach.unlocked) return;

    const newAchievements = state.achievements.map(a => a.id === achievementId ? { ...a, unlocked: true, progress: a.total } : a);
    const newUser = {
      ...state.user,
      xp: state.user.xp + ach.xpReward,
      achievementsEarned: state.user.achievementsEarned + 1
    };

    set({ achievements: newAchievements, user: newUser });
    await saveAchievements(state.user.id, newAchievements);
    await saveUserProgress(state.user.id, newUser);
  },

  updateSettings: async (updates) => {
    const state = get();
    const newSettings = { ...state.settings, ...updates };
    set({ settings: newSettings });
    if (state.user) {
      await saveSettings(state.user.id, newSettings);
    }
  },

  updateUser: async (updates) => {
    const state = get();
    // Handles initial user load or manual updates
    const newUser = state.user ? { ...state.user, ...updates } : updates as User;
    set({ user: newUser });
    if (newUser.id) {
      await saveUserProgress(newUser.id, newUser);
    }
  },

  addChatMessage: async (msg) => {
    const state = get();
    const newMsg = { ...msg, id: Date.now().toString() } as AIChatMessage;
    const newHistory = [...state.aiMessages, newMsg];
    
    set({ aiMessages: newHistory });
    if (state.user) {
      await saveChatHistory(state.user.id, newHistory);
    }
  }
}));
