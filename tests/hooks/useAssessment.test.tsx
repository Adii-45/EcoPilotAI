import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAssessment } from '../../src/hooks/useAssessment';

describe('useAssessment hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with null values', () => {
    const { result } = renderHook(() => useAssessment());
    expect(result.current.answers).toBeNull();
    expect(result.current.result).toBeNull();
  });

  it('should save and retrieve assessment data', () => {
    const { result } = renderHook(() => useAssessment());

    const mockAnswers = {
      transportation: 'car',
      food: 'mixed',
      shopping: 'rare',
      energy: 'low',
      goals: []
    };

    const mockResult = {
      recommendations: [],
      estimatedCarbonSavingsKg: 10,
      weeklyActionPlan: [],
      suggestedEcoHabits: [],
      sustainabilityDifficultyScore: 50,
      predictedMonthlyImpact: '40 kg',
      timestamp: 12345
    };

    act(() => {
      result.current.saveAssessment(mockAnswers, mockResult as any);
    });

    expect(result.current.answers).toEqual(mockAnswers);
    expect(result.current.result).toEqual(mockResult);

    const stored = JSON.parse(localStorage.getItem('ecopilot_assessment') || '{}');
    expect(stored.answers).toEqual(mockAnswers);
  });

  it('should clear assessment data', () => {
    const { result } = renderHook(() => useAssessment());
    
    act(() => {
      result.current.saveAssessment({} as any, {} as any);
      result.current.clearAssessment();
    });

    expect(result.current.answers).toBeNull();
    expect(result.current.result).toBeNull();
  });
});
