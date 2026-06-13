import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ProgressRing } from './ui/ProgressRing';
import type { AssessmentAnswers } from '../types/assessment';
import { generateRecommendations } from '../utils/recommendationEngine';
import { useAssessment } from '../hooks/useAssessment';
import { Leaf, Car, ShoppingBag, Zap, Target, RefreshCw, CheckCircle2 } from 'lucide-react';

export function AssessmentEngine() {
  const { answers, result, saveAssessment, clearAssessment } = useAssessment();
  const [formData, setFormData] = useState<AssessmentAnswers>(answers || {
    transportation: 'car',
    food: 'mixed',
    shopping: 'frequent',
    energy: 'average',
    goals: []
  });

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResult = generateRecommendations(formData);
    saveAssessment(formData, newResult);
  };

  if (result) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Your Sustainability Profile</h2>
            <p className="text-on-surface-variant">Personalized insights based on your lifestyle.</p>
          </div>
          <Button onClick={clearAssessment} variant="outline" className="shrink-0 gap-2">
            <RefreshCw size={16} /> Retake Assessment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <Leaf size={32} />
              </div>
              <h3 className="text-3xl font-bold text-on-surface mb-1">{result.estimatedCarbonSavingsKg} kg</h3>
              <p className="text-sm text-on-surface-variant">Est. Annual CO₂ Savings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
               <div className="w-16 h-16 relative mb-2">
                 <ProgressRing progress={result.sustainabilityDifficultyScore} strokeWidth={8} colorClass="text-primary" />
                 <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                   {result.sustainabilityDifficultyScore}
                 </div>
               </div>
              <h3 className="text-lg font-bold text-on-surface">Difficulty Score</h3>
              <p className="text-xs text-on-surface-variant mt-1">1 = Easy, 100 = Hard</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4 text-secondary">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-1">{result.predictedMonthlyImpact}</h3>
              <p className="text-sm text-on-surface-variant">Monthly Impact</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle2 className="text-primary" /> Weekly Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {result.weeklyActionPlan.map(rec => (
                  <li key={rec.id} className="p-4 rounded-xl bg-surface-container border border-outline-variant">
                    <h4 className="font-semibold text-on-surface flex items-center gap-2">
                      {rec.title}
                      {rec.impact === 'high' && <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-primary/20 text-primary rounded-full">High Impact</span>}
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-1">{rec.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Leaf className="text-primary" /> Suggested Eco Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.suggestedEcoHabits.map((habit, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-surface-container rounded-lg text-sm font-medium text-on-surface border border-outline-variant">
                    {habit}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto w-full bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-on-surface">Personal Sustainability Assessment</h2>
        <p className="text-on-surface-variant mt-2">Answer a few questions to get your personalized action plan.</p>
      </div>

      <div className="space-y-6">
        {/* Transportation */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <Car size={18} className="text-primary" /> How do you usually commute?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'car', label: 'Personal Car' },
              { id: 'public', label: 'Public Transit' },
              { id: 'bike', label: 'Bike / Walk' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, transportation: opt.id }))}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  formData.transportation === opt.id 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <Leaf size={18} className="text-primary" /> What describes your diet best?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'meat', label: 'Meat Heavy' },
              { id: 'mixed', label: 'Mixed / Flexitarian' },
              { id: 'vegetarian', label: 'Vegetarian / Vegan' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, food: opt.id }))}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  formData.food === opt.id 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shopping */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" /> How often do you buy non-essentials?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'frequent', label: 'Frequently' },
              { id: 'occasional', label: 'Occasionally' },
              { id: 'rare', label: 'Rarely / Second-hand' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, shopping: opt.id }))}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  formData.shopping === opt.id 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <Zap size={18} className="text-primary" /> How would you rate your home energy efficiency?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'high', label: 'High Usage' },
              { id: 'average', label: 'Average' },
              { id: 'low', label: 'Highly Efficient' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, energy: opt.id }))}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  formData.energy === opt.id 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <Target size={18} className="text-primary" /> What are your primary goals? (Select multiple)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'reduce_carbon', label: 'Reduce Carbon' },
              { id: 'save_money', label: 'Save Money' },
              { id: 'healthier', label: 'Healthier Lifestyle' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleGoal(opt.id)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  formData.goals.includes(opt.id)
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-center">
        <Button type="submit" size="lg" className="w-full sm:w-auto px-12">
          Generate Action Plan
        </Button>
      </div>
    </form>
  );
}
