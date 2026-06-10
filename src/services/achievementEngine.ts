import type { User, Achievement, ActivityRecord } from '../types';

export const ACHIEVEMENTS_LIST: Omit<Achievement, 'unlocked' | 'progress'>[] = [
  { id: 'first_habit', title: 'First Steps', description: 'Complete your first habit.', xpReward: 50, category: 'Lifestyle', total: 1, icon: 'Seedling' },
  { id: 'streak_7', title: 'Consistency Champion', description: 'Maintain a 7 day streak.', xpReward: 400, category: 'Lifestyle', total: 7, icon: 'Flame' },
  { id: 'streak_30', title: 'Unstoppable Force', description: 'Maintain a 30 day streak.', xpReward: 1000, category: 'Lifestyle', total: 30, icon: 'Flame' },
  { id: 'xp_100', title: 'Getting Started', description: 'Earn your first 100 XP.', xpReward: 50, category: 'Lifestyle', total: 100, icon: 'Star' },
  { id: 'xp_500', title: 'Eco Warrior', description: 'Earn 500 XP.', xpReward: 100, category: 'Lifestyle', total: 500, icon: 'Star' },
  { id: 'carbon_100', title: 'Century Mark', description: 'Save 100kg of CO2.', xpReward: 500, category: 'Lifestyle', total: 100, icon: 'Cloud' },
  { id: 'sim_run', title: 'AI Explorer', description: 'Run your first simulation.', xpReward: 100, category: 'Lifestyle', total: 1, icon: 'BrainCircuit' },
  { id: 'habits_10', title: 'Habitual', description: 'Complete 10 habits in total.', xpReward: 200, category: 'Lifestyle', total: 10, icon: 'CheckCircle' },
];

export const evaluateAchievements = (
  user: User, 
  activities: ActivityRecord[], 
  currentAchievements: Achievement[]
): { newUnlocked: Achievement[], updatedAchievements: Achievement[] } => {
  const newUnlocked: Achievement[] = [];
  const updatedAchievements = [...currentAchievements];

  const getProgress = (id: string): number => {
    switch (id) {
      case 'first_habit': return user.totalActions > 0 ? 1 : 0;
      case 'streak_7': return Math.min(7, user.streak);
      case 'streak_30': return Math.min(30, user.streak);
      case 'xp_100': return Math.min(100, user.xp);
      case 'xp_500': return Math.min(500, user.xp);
      case 'carbon_100': return Math.min(100, user.totalCarbonSaved);
      case 'sim_run': return activities.some(a => a.type === 'simulation_run') ? 1 : 0;
      case 'habits_10': return Math.min(10, user.totalActions);
      default: return 0;
    }
  };

  ACHIEVEMENTS_LIST.forEach(achDef => {
    let existing = updatedAchievements.find(a => a.id === achDef.id);
    
    if (!existing) {
      existing = { ...achDef, unlocked: false, progress: 0 };
      updatedAchievements.push(existing);
    }

    if (!existing.unlocked) {
      const currentProgress = getProgress(existing.id);
      existing.progress = currentProgress;
      
      if (currentProgress >= existing.total) {
        existing.unlocked = true;
        newUnlocked.push(existing);
      }
    }
  });

  return { newUnlocked, updatedAchievements };
};
