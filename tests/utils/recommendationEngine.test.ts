import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../../src/utils/recommendationEngine';
import type { AssessmentAnswers } from '../../src/types/assessment';

describe('recommendationEngine', () => {
  it('generates high impact recommendations for car and meat users', () => {
    const answers: AssessmentAnswers = {
      transportation: 'car',
      food: 'meat',
      shopping: 'frequent',
      energy: 'high',
      goals: ['reduce_carbon']
    };

    const result = generateRecommendations(answers);
    
    expect(result.estimatedCarbonSavingsKg).toBeGreaterThan(100);
    expect(result.recommendations.some(r => r.category === 'transportation')).toBe(true);
    expect(result.sustainabilityDifficultyScore).toBeLessThan(40);
  });

  it('generates low impact recommendations for already eco-friendly users', () => {
    const answers: AssessmentAnswers = {
      transportation: 'bike',
      food: 'vegetarian',
      shopping: 'rare',
      energy: 'low',
      goals: []
    };

    const result = generateRecommendations(answers);
    
    expect(result.estimatedCarbonSavingsKg).toBe(0);
    expect(result.sustainabilityDifficultyScore).toBe(100);
  });

  it('generates recommendations for mixed diet, average energy, occasional shopping', () => {
    const answers: AssessmentAnswers = {
      transportation: 'public',
      food: 'mixed',
      shopping: 'occasional',
      energy: 'average',
      goals: ['save_money', 'healthier']
    };

    const result = generateRecommendations(answers);
    
    // Check for specific branches triggered
    expect(result.recommendations.some(r => r.title.includes('cycling'))).toBe(true);
    expect(result.recommendations.some(r => r.title.includes('plant-based'))).toBe(true);
    expect(result.recommendations.some(r => r.title.includes('second-hand'))).toBe(true);
    expect(result.recommendations.some(r => r.title.includes('cold'))).toBe(true);
    
    // Check goals triggers
    expect(result.recommendations.some(r => r.title.includes('tire pressure'))).toBe(true);
    expect(result.recommendations.some(r => r.title.includes('Cook more meals'))).toBe(true);
  });
});
