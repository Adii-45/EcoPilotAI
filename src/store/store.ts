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
  checkDailyReset: () => Promise<void>;
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

    if (!habitToComplete) return;

    const isUncompleting = habitToComplete.completedToday;
    const xpChange = isUncompleting ? -habitToComplete.xpReward : habitToComplete.xpReward;
    const carbonChange = isUncompleting ? -habitToComplete.co2SavingsKg : habitToComplete.co2SavingsKg;
    const actionChange = isUncompleting ? -1 : 1;
    const streakChange = isUncompleting ? -1 : 1;

    const updatedHabit = { 
      ...habitToComplete, 
      completedToday: !isUncompleting, 
      streak: Math.max(0, habitToComplete.streak + streakChange) 
    };
    const updatedHabits = isDaily ? state.habits : state.habits.map(h => h.id === habitId ? updatedHabit : h);
    const updatedDaily = isDaily ? state.dailyChallenges.map(h => h.id === habitId ? updatedHabit : h) : state.dailyChallenges;

    const { level, nextLevelXp } = calculateLevel(Math.max(0, state.user.xp + xpChange));

    const newUser = {
      ...state.user,
      xp: Math.max(0, state.user.xp + xpChange),
      level,
      nextLevelXp,
      totalCarbonSaved: Math.max(0, state.user.totalCarbonSaved + carbonChange),
      totalActions: Math.max(0, state.user.totalActions + actionChange),
    };

    // Recalculate score
    newUser.sustainabilityScore = calculateSustainabilityScore(newUser, [...updatedHabits, ...updatedDaily]);

    // Single Source of Truth for Today's Actions
    const todaysActionsCount = updatedHabits.filter(h => h.completedToday).length + updatedDaily.filter(h => h.completedToday).length;

    // Update daily history
    const todayStr = new Date().toISOString().split('T')[0];
    const newHistory = [...(newUser.history || [])];
    const todayIndex = newHistory.findIndex(h => h.date === todayStr);
    
    if (todayIndex >= 0) {
      newHistory[todayIndex] = {
        date: todayStr,
        score: newUser.sustainabilityScore,
        actions: todaysActionsCount
      };
    } else if (todaysActionsCount > 0) {
      newHistory.push({
        date: todayStr,
        score: newUser.sustainabilityScore,
        actions: todaysActionsCount
      });
    }
    newUser.history = newHistory;

    // Log Activity (negative if uncompleting, to offset)
    const activity = await logActivity(newUser.id, 'habit_completed', xpChange, carbonChange, { habitId, title: habitToComplete.title, uncompleted: isUncompleting });
    const newActivities = [activity, ...state.activities];

    // Evaluate Achievements (only evaluate new if completing)
    const { newUnlocked, updatedAchievements } = isUncompleting 
      ? { newUnlocked: [], updatedAchievements: state.achievements } 
      : evaluateAchievements(newUser, newActivities, state.achievements);
    
    const addedNotifications: Notification[] = [];
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
    
    const addedNotifications: Notification[] = [];
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
  },

  checkDailyReset: async () => {
    const state = get();
    if (!state.user) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastActive = state.user.lastActiveDate;

    if (lastActive && lastActive !== todayStr) {
      const todayDate = new Date(todayStr);
      const lastActiveDate = new Date(lastActive);
      const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let userStreak = state.user.streak;
      const history = state.user.history || [];
      const yesterdayStr = new Date(todayDate.getTime() - 86400000).toISOString().split('T')[0];
      const yesterdayHistory = history.find(h => h.date === yesterdayStr);

      // If they didn't do any actions yesterday, or it's been more than 1 day, break the streak
      if (diffDays > 1 || !yesterdayHistory || yesterdayHistory.actions === 0) {
        userStreak = 0;
      } else if (yesterdayHistory && yesterdayHistory.actions > 0 && lastActive === yesterdayStr) {
        userStreak += 1;
      }

      const longestStreak = Math.max(state.user.longestStreak || 0, userStreak);

      const updatedUser = { 
        ...state.user, 
        lastActiveDate: todayStr,
        streak: userStreak,
        longestStreak
      };

      const resetHabits = state.habits.map(h => ({
        ...h,
        completedToday: false,
        streak: userStreak === 0 ? 0 : h.streak
      }));

      const resetDaily = state.dailyChallenges.map(h => ({
        ...h,
        completedToday: false,
        streak: userStreak === 0 ? 0 : h.streak
      }));

      set({ 
        user: updatedUser,
        habits: resetHabits,
        dailyChallenges: resetDaily
      });

      await saveUserProgress(updatedUser.id, updatedUser);
      await saveHabits(updatedUser.id, resetHabits, resetDaily);
    } else if (!lastActive) {
      const updatedUser = { ...state.user, lastActiveDate: todayStr, longestStreak: state.user.longestStreak || state.user.streak };
      set({ user: updatedUser });
      await saveUserProgress(updatedUser.id, updatedUser);
    }
  }
}));
