import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from '../../src/store/store';

// Mock DB and engines
vi.mock('../../src/services/db', () => ({
  saveUserProgress: vi.fn(),
  saveHabits: vi.fn(),
  saveAchievements: vi.fn(),
  saveSimulation: vi.fn(),
  saveSettings: vi.fn(),
  saveChatHistory: vi.fn(),
  saveNotification: vi.fn(),
}));

vi.mock('../../src/services/activityEngine', () => ({
  logActivity: vi.fn().mockResolvedValue({ id: 'act-1' }),
}));

vi.mock('../../src/services/achievementEngine', () => ({
  evaluateAchievements: vi.fn().mockReturnValue({ newUnlocked: [], updatedAchievements: [] }),
}));

describe('Store Logic (Habit Tracker)', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useStore.getState();
    store.setInitialData({
      user: {
        id: 'test-user',
        name: 'Test',
        email: 'test@example.com',
        xp: 0,
        level: 1,
        nextLevelXp: 100,
        sustainabilityScore: 0,
        streak: 0,
        longestStreak: 0,
        totalCarbonSaved: 0,
        totalActions: 0,
        achievementsEarned: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        history: [],
      },
      habits: [
        {
          id: 'habit-1',
          title: 'Test Habit',
          description: 'A habit',
          categoryId: 'transport',
          difficulty: 'Easy',
          co2SavingsKg: 2,
          xpReward: 10,
          streak: 0,
          completedToday: false,
        }
      ],
      dailyChallenges: [],
      activities: [],
      notifications: [],
      achievements: [],
    });
  });

  it('completes a habit and updates XP and carbon savings', async () => {
    const store = useStore.getState();
    await store.completeHabit('habit-1');

    const updatedStore = useStore.getState();
    const updatedHabit = updatedStore.habits.find(h => h.id === 'habit-1');
    
    expect(updatedHabit?.completedToday).toBe(true);
    expect(updatedHabit?.streak).toBe(1);
    
    expect(updatedStore.user?.xp).toBe(10);
    expect(updatedStore.user?.totalCarbonSaved).toBe(2);
    expect(updatedStore.user?.totalActions).toBe(1);
  });

  it('uncompleting a habit removes XP and carbon savings', async () => {
    const store = useStore.getState();
    // Complete first
    await store.completeHabit('habit-1');
    // Uncomplete
    await store.completeHabit('habit-1');

    const updatedStore = useStore.getState();
    const updatedHabit = updatedStore.habits.find(h => h.id === 'habit-1');
    
    expect(updatedHabit?.completedToday).toBe(false);
    expect(updatedHabit?.streak).toBe(0);
    
    expect(updatedStore.user?.xp).toBe(0);
    expect(updatedStore.user?.totalCarbonSaved).toBe(0);
    expect(updatedStore.user?.totalActions).toBe(0);
  });

  it('checkDailyReset breaks streak if missed a day', async () => {
    const store = useStore.getState();
    // Set user last active to 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    store.setInitialData({
      user: {
        ...store.user!,
        streak: 5,
        longestStreak: 5,
        lastActiveDate: twoDaysAgo.toISOString().split('T')[0]
      }
    });

    await store.checkDailyReset();

    const updatedStore = useStore.getState();
    expect(updatedStore.user?.streak).toBe(0); // Streak broken
    expect(updatedStore.user?.longestStreak).toBe(5); // Longest streak preserved
    expect(updatedStore.user?.lastActiveDate).toBe(new Date().toISOString().split('T')[0]);
  });
});
