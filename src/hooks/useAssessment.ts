import { useState, useEffect } from 'react';
import type { AssessmentAnswers, AssessmentResult } from '../types/assessment';

const STORAGE_KEY = 'ecopilot_assessment';

interface AssessmentStorageData {
  answers: AssessmentAnswers | null;
  result: AssessmentResult | null;
}

export function useAssessment() {
  const [data, setData] = useState<AssessmentStorageData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse assessment data", e);
      }
    }
    return { answers: null, result: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const saveAssessment = (answers: AssessmentAnswers, result: AssessmentResult) => {
    setData({ answers, result });
  };

  const clearAssessment = () => {
    setData({ answers: null, result: null });
  };

  return {
    answers: data.answers,
    result: data.result,
    saveAssessment,
    clearAssessment
  };
}
