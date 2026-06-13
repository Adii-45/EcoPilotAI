import { describe, it, expect, vi } from 'vitest';
import { logActivity, fetchUserActivities } from '../../src/services/activityEngine';
import * as db from '../../src/services/db';
import type { ActivityRecord } from '../../src/types';

vi.mock('../../src/services/db', () => ({
  saveActivity: vi.fn(),
  getActivities: vi.fn()
}));

describe('activityEngine', () => {
  it('logs an activity correctly', async () => {
    vi.spyOn(db, 'saveActivity').mockResolvedValue(undefined);
    
    const activity = await logActivity('user123', 'habit_completed', 50, 2.5);
    
    expect(activity.userId).toBe('user123');
    expect(activity.type).toBe('habit_completed');
    expect(activity.pointsEarned).toBe(50);
    expect(activity.carbonSaved).toBe(2.5);
    expect(db.saveActivity).toHaveBeenCalledWith('user123', activity);
  });

  it('fetches and sorts activities', async () => {
    const mockActivities: ActivityRecord[] = [
      { id: '1', timestamp: '2023-01-01T10:00:00.000Z', userId: 'user123', type: 'habit_completed', pointsEarned: 10, carbonSaved: 1 },
      { id: '2', timestamp: '2023-01-03T10:00:00.000Z', userId: 'user123', type: 'habit_completed', pointsEarned: 10, carbonSaved: 1 },
      { id: '3', timestamp: '2023-01-02T10:00:00.000Z', userId: 'user123', type: 'habit_completed', pointsEarned: 10, carbonSaved: 1 }
    ];
    vi.spyOn(db, 'getActivities').mockResolvedValue(mockActivities);
    
    const sorted = await fetchUserActivities('user123');
    expect(sorted[0].id).toBe('2'); // Newest first
    expect(sorted[1].id).toBe('3');
    expect(sorted[2].id).toBe('1');
  });
});
