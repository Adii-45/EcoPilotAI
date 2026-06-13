import { describe, it, expect } from 'vitest';
import { calculateLevel, calculateCarbonImpact, calculateSustainabilityScore } from '../../src/services/engine';
import type { Habit, SimulationState, User } from '../../src/types';

describe('engine', () => {
  describe('calculateLevel', () => {
    it('calculates correct level for large amount of XP', () => {
      const result = calculateLevel(500);
      expect(result.level).toBe(4);
      expect(result.currentLevelXp).toBe(25);
      expect(result.nextLevelXp).toBe(337);
    });
  });

  describe('calculateCarbonImpact', () => {
    it('calculates impact correctly with extreme inputs', () => {
      const simulation: SimulationState = {
        carUsage: 100,
        meatConsumption: 0,
        energyEfficiency: 80,
        shoppingFrequency: 20
      };
      
      const result = calculateCarbonImpact(simulation);
      expect(result.annualEmissions).toBeGreaterThan(0);
      expect(result.carbonReduction).toBeGreaterThan(0);
      expect(result.moneySaved).toBeGreaterThan(0);
      expect(result.treesEquivalent).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateSustainabilityScore', () => {
    it('calculates max score with high stats', () => {
      const user = { level: 20, streak: 30 } as User;
      const habits = [
        { completedToday: true },
        { completedToday: true },
        { completedToday: true },
        { completedToday: true },
        { completedToday: true }
      ] as Habit[];
      
      const result = calculateSustainabilityScore(user, habits);
      expect(result).toBe(100);
    });
  });
});
