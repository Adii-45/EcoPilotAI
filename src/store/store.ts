import { create } from 'zustand';
import type { User, Habit, Achievement, SimulationState, Mission, Insight, Challenge, UserSettings, AIChatMessage, ActivityRecord, Notification } from '../types';
import { calculateLevel, calculateSustainabilityScore } from '../services/engine';
import { saveUserProgress, saveHabits, saveAchievements, saveSimulation, saveSettings, saveChatHistory, saveNotification } from '../services/db';
import { logActivity } from '../services/activityEngine';
import { evaluateAchievements } from '../services/achievementEngine';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

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
  activities: ActivityRecord[];
  notifications: Notification[];
  
  // Actions
  completeHabit: (habitId: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedToday'>) => Promise<void>;
  updateSimulation: (updates: Partial<SimulationState>) => Promise<void>;
  applySimulation: () => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addChatMessage: (msg: Omit<AIChatMessage, 'id'>) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  setInitialData: (data: Partial<AppState>) => void;
}

const initialSettings: UserSettings = {
  remindersEnabled: true,
  coachingIntensity: 'Standard',
  sustainabilityFocus: ['Transport', 'Energy']
};

export const useStore = create<AppState>((set, get) => ({
  user: null,
  settings: initialSettings,
  habits: [],
  dailyChallenges: [],
  weeklyChallenges: [],
  achievements: [],
  simulation: {
    carUsage: 0,
    meatConsumption: 0,
    energyEfficiency: 50,
    shoppingFrequency: 50,
  },
  activeMission: null,
  insights: [],
  aiMessages: [],
  activities: [],
  notifications: [],

  setInitialData: (data) => set((state) => ({ ...state, ...data })),

  addHabit: async (habitData) => {
    const state = get();
    if (!state.user) return;
    
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      streak: 0,
      completedToday: false
    };

    const updatedHabits = [...state.habits, newHabit];
    set({ habits: updatedHabits });
    await saveHabits(state.user.id, updatedHabits, state.dailyChallenges);
  },

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

    // Log Activity
    const activity = await logActivity(newUser.id, 'habit_completed', xpGained, carbonSaved, { habitId, title: habitToComplete.title });
    const newActivities = [activity, ...state.activities];

    // Evaluate Achievements
    const { newUnlocked, updatedAchievements } = evaluateAchievements(newUser, newActivities, state.achievements);
    
    let addedNotifications: Notification[] = [];
    if (newUnlocked.length > 0) {
      newUser.achievementsEarned += newUnlocked.length;
      for (const ach of newUnlocked) {
        newUser.xp += ach.xpReward;
        const notif: Notification = {
          id: generateId(),
          userId: newUser.id,
          title: 'Achievement Unlocked!',
          message: `You unlocked ${ach.title} and earned ${ach.xpReward} XP.`,
          type: 'achievement',
          read: false,
          timestamp: new Date().toISOString()
        };
        await saveNotification(newUser.id, notif);
        addedNotifications.push(notif);
        await logActivity(newUser.id, 'achievement_unlocked', ach.xpReward, 0, { achievementId: ach.id, title: ach.title });
      }
    }

    // Set state
    set({
      user: newUser,
      habits: updatedHabits,
      dailyChallenges: updatedDaily,
      achievements: updatedAchievements,
      activities: newActivities,
      notifications: [...addedNotifications, ...state.notifications]
    });

    // Sync to DB
    await saveUserProgress(newUser.id, newUser);
    await saveHabits(newUser.id, updatedHabits, updatedDaily);
    if (newUnlocked.length > 0) {
      await saveAchievements(newUser.id, updatedAchievements);
    }
  },

  updateSimulation: async (updates) => {
    const state = get();
    const newSim = { ...state.simulation, ...updates };
    set({ simulation: newSim });
    if (state.user) {
      await saveSimulation(state.user.id, newSim);
    }
  },

  applySimulation: async () => {
    const state = get();
    if (!state.user) return;
    const activity = await logActivity(state.user.id, 'simulation_run', 50, 0, { simulation: state.simulation });
    const newActivities = [activity, ...state.activities];
    
    const newUser = { ...state.user, xp: state.user.xp + 50 };
    const { newUnlocked, updatedAchievements } = evaluateAchievements(newUser, newActivities, state.achievements);
    
    let addedNotifications: Notification[] = [];
    if (newUnlocked.length > 0) {
      newUser.achievementsEarned += newUnlocked.length;
      for (const ach of newUnlocked) {
        newUser.xp += ach.xpReward;
        const notif: Notification = {
          id: generateId(),
          userId: newUser.id,
          title: 'Achievement Unlocked!',
          message: `You unlocked ${ach.title} and earned ${ach.xpReward} XP.`,
          type: 'achievement',
          read: false,
          timestamp: new Date().toISOString()
        };
        await saveNotification(newUser.id, notif);
        addedNotifications.push(notif);
        await logActivity(newUser.id, 'achievement_unlocked', ach.xpReward, 0, { achievementId: ach.id, title: ach.title });
      }
    }

    set({ user: newUser, activities: newActivities, achievements: updatedAchievements, notifications: [...addedNotifications, ...state.notifications] });
    await saveUserProgress(newUser.id, newUser);
    if (newUnlocked.length > 0) {
      await saveAchievements(newUser.id, updatedAchievements);
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
    const newUser = state.user ? { ...state.user, ...updates } : updates as User;
    set({ user: newUser });
    if (newUser.id) {
      await saveUserProgress(newUser.id, newUser);
    }
  },

  addChatMessage: async (msg) => {
    const state = get();
    const newMsg = { ...msg, id: generateId() } as AIChatMessage;
    const newHistory = [...state.aiMessages, newMsg];
    
    set({ aiMessages: newHistory });
    if (state.user) {
      await saveChatHistory(state.user.id, newHistory);
    }
  },

  markNotificationRead: async (notificationId) => {
    const state = get();
    const newNotifs = state.notifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
    set({ notifications: newNotifs });
  }
}));
