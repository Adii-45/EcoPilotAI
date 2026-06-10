import type { Habit, SimulationState, User } from '../types';

export const calculateLevel = (totalXp: number) => {
  let level = 1;
  let nextLevelXp = 100;
  let remainingXp = totalXp;

  while (remainingXp >= nextLevelXp) {
    remainingXp -= nextLevelXp;
    level += 1;
    nextLevelXp = Math.floor(nextLevelXp * 1.5);
  }

  return { level, currentLevelXp: remainingXp, nextLevelXp };
};

export const calculateCarbonImpact = (simulation: SimulationState) => {
  // Simplified realistic formulas
  const annualCarEmissions = simulation.carUsage * 52 * 0.4; // 0.4 kg CO2 per mile
  const annualMeatEmissions = simulation.meatConsumption * 52 * 2.5; // 2.5 kg CO2 per day of meat
  const dailyEnergyEmissions = 10 - (simulation.energyEfficiency / 100) * 8;
  const annualEnergyEmissions = dailyEnergyEmissions * 365;
  const annualShoppingEmissions = (simulation.shoppingFrequency / 100) * 5 * 52;
  
  const totalAnnualEmissionsKg = annualCarEmissions + annualMeatEmissions + annualEnergyEmissions + annualShoppingEmissions;
  
  // Baseline (worst case scenario)
  const baselineCar = 300 * 52 * 0.4;
  const baselineMeat = 7 * 52 * 2.5;
  const baselineEnergy = 10 * 365;
  const baselineShopping = 5 * 52;
  const baselineTotal = baselineCar + baselineMeat + baselineEnergy + baselineShopping;
  
  const carbonReduction = Math.max(0, baselineTotal - totalAnnualEmissionsKg);
  const moneySaved = carbonReduction * 0.15; // Rough estimate: $0.15 per kg saved
  const treesEquivalent = Math.floor(carbonReduction / 21); // ~21 kg CO2 absorbed per tree per year
  
  return {
    annualEmissions: Math.round(totalAnnualEmissionsKg),
    carbonReduction: Math.round(carbonReduction),
    moneySaved: Math.round(moneySaved),
    treesEquivalent
  };
};

export const calculateSustainabilityScore = (user: User, habits: Habit[]) => {
  let score = 40; 
  score += Math.min(25, user.level * 2);
  score += Math.min(20, user.streak * 2);
  const completedHabits = habits.filter(h => h.completedToday).length;
  score += Math.min(15, completedHabits * 3);
  return Math.min(100, Math.round(score));
};
