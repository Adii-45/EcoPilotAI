export interface AssessmentAnswers {
  transportation: string;
  food: string;
  shopping: string;
  energy: string;
  goals: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "transportation" | "food" | "shopping" | "energy";
}

export interface AssessmentResult {
  recommendations: Recommendation[];
  estimatedCarbonSavingsKg: number;
  weeklyActionPlan: Recommendation[];
  suggestedEcoHabits: string[];
  sustainabilityDifficultyScore: number;
  predictedMonthlyImpact: string;
  timestamp: number;
}
