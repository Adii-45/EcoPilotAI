import { describe, it, expect } from 'vitest';
import { evaluateAchievements } from '../../src/services/achievementEngine';
import type { User, ActivityRecord } from '../../src/types';

describe('achievementEngine', () => {
  it('unlocks first_habit when user has totalActions > 0', () => {
    const user = { totalActions: 1, streak: 0, xp: 0, totalCarbonSaved: 0 } as User;
    const { newUnlocked, updatedAchievements } = evaluateAchievements(user, [], []);
    
    expect(newUnlocked.length).toBe(1);
    expect(newUnlocked[0].id).toBe('first_habit');
    expect(updatedAchievements.find(a => a.id === 'first_habit')?.unlocked).toBe(true);
  });

  it('unlocks sim_run when activities contain simulation_run', () => {
    const user = { totalActions: 0, streak: 0, xp: 0, totalCarbonSaved: 0 } as User;
    const activities = [{ type: 'simulation_run' }] as ActivityRecord[];
    const { newUnlocked } = evaluateAchievements(user, activities, []);
    
    expect(newUnlocked.some(a => a.id === 'sim_run')).toBe(true);
  });

  it('returns partial progress for incomplete achievements', () => {
    const user = { totalActions: 5, streak: 3, xp: 50, totalCarbonSaved: 10 } as User;
    const { updatedAchievements } = evaluateAchievements(user, [], []);
    
    const streak7 = updatedAchievements.find(a => a.id === 'streak_7');
    expect(streak7?.progress).toBe(3);
    expect(streak7?.unlocked).toBe(false);
    
    const xp100 = updatedAchievements.find(a => a.id === 'xp_100');
    expect(xp100?.progress).toBe(50);
  });
});
