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
});
