import { saveActivity, getActivities } from './db';
import type { ActivityRecord } from '../types';

// Simple ID generator since crypto might not be available in all contexts or uuid isn't in package.json
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const logActivity = async (
  userId: string,
  type: ActivityRecord['type'],
  pointsEarned: number,
  carbonSaved: number,
  metadata?: any
): Promise<ActivityRecord> => {
  const activity: ActivityRecord = {
    id: generateId(),
    userId,
    type,
    timestamp: new Date().toISOString(),
    pointsEarned,
    carbonSaved,
    metadata
  };

  await saveActivity(userId, activity);
  return activity;
};

export const fetchUserActivities = async (userId: string): Promise<ActivityRecord[]> => {
  const activities = await getActivities(userId);
  // Sort descending by timestamp
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
