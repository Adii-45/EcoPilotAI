import type { AssessmentAnswers, AssessmentResult, Recommendation } from '../types/assessment';

const generateId = () => Math.random().toString(36).substring(2, 9);

export function generateRecommendations(answers: AssessmentAnswers): AssessmentResult {
  const recommendations: Recommendation[] = [];
  let savings = 0;
  let difficulty = 40; // Base score

  // Transportation Rules
  if (answers.transportation === 'car') {
    recommendations.push({
      id: generateId(),
      title: "Carpool or take public transit twice a week",
      description: "Replacing just two days of driving with public transit can significantly reduce emissions.",
      impact: "high",
      category: "transportation"
    });
    savings += 50;
    difficulty -= 10;
  } else if (answers.transportation === 'public') {
    recommendations.push({
      id: generateId(),
      title: "Try cycling for short trips",
      description: "For trips under 5km, consider a bike to completely eliminate transport emissions.",
      impact: "medium",
      category: "transportation"
    });
    savings += 10;
    difficulty += 15;
  } else {
    difficulty += 25; // Already biking/walking
  }

  // Food Rules
  if (answers.food === 'meat') {
    recommendations.push({
      id: generateId(),
      title: "Adopt Meatless Mondays",
      description: "Skipping meat one day a week saves roughly 3-4 kg of CO₂ equivalent.",
      impact: "high",
      category: "food"
    });
    savings += 30;
    difficulty -= 10;
  } else if (answers.food === 'mixed') {
    recommendations.push({
      id: generateId(),
      title: "Switch to plant-based milk",
      description: "Oat or almond milk has a fraction of the carbon footprint of dairy.",
      impact: "medium",
      category: "food"
    });
    savings += 15;
    difficulty += 5;
  } else {
    difficulty += 20;
  }

  // Shopping Rules
  if (answers.shopping === 'frequent') {
    recommendations.push({
      id: generateId(),
      title: "30-Day 'No New Items' Challenge",
      description: "Buy only essentials for a month. Reduces packaging waste and shipping footprint.",
      impact: "high",
      category: "shopping"
    });
    savings += 40;
    difficulty -= 10;
  } else if (answers.shopping === 'occasional') {
    recommendations.push({
      id: generateId(),
      title: "Shop second-hand first",
      description: "Before buying new clothes or electronics, check local thrift or refurbished options.",
      impact: "medium",
      category: "shopping"
    });
    savings += 20;
    difficulty += 5;
  } else {
    difficulty += 15;
  }

  // Energy Rules
  if (answers.energy === 'high') {
    recommendations.push({
      id: generateId(),
      title: "Audit home vampire energy",
      description: "Unplug electronics when not in use or use smart power strips.",
      impact: "high",
      category: "energy"
    });
    savings += 35;
    difficulty -= 5;
  } else if (answers.energy === 'average') {
    recommendations.push({
      id: generateId(),
      title: "Wash clothes on cold",
      description: "Heating water uses 90% of a washing machine's energy.",
      impact: "medium",
      category: "energy"
    });
    savings += 15;
    difficulty += 5;
  } else {
    difficulty += 15;
  }

  // Goals Rules (add specific tips based on user motivation)
  if (answers.goals.includes('save_money')) {
    recommendations.push({
      id: generateId(),
      title: "Check tire pressure monthly",
      description: "Properly inflated tires improve gas mileage by up to 3%, saving money and emissions.",
      impact: "low",
      category: "transportation"
    });
  }

  if (answers.goals.includes('healthier')) {
    recommendations.push({
      id: generateId(),
      title: "Cook more meals at home",
      description: "Reduces takeout packaging waste and gives you control over ingredients.",
      impact: "medium",
      category: "food"
    });
  }

  // Ensure difficulty is between 1 and 100
  difficulty = Math.max(1, Math.min(100, difficulty));

  return {
    recommendations,
    estimatedCarbonSavingsKg: savings,
    weeklyActionPlan: recommendations.slice(0, 3), // Top 3 actions for the week
    suggestedEcoHabits: recommendations.map(r => r.title),
    sustainabilityDifficultyScore: difficulty,
    predictedMonthlyImpact: `You could save around ${savings * 4} kg of CO₂ this month!`,
    timestamp: Date.now()
  };
}
