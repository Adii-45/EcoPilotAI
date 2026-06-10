import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Car, Utensils, Zap, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/store';
import { Button } from '../components/ui/Button';

const steps = [
  {
    id: 'transportation',
    title: 'How do you usually get around?',
    icon: Car,
    options: [
      { label: 'Mostly drive a car', value: 200, score: 10 },
      { label: 'Public transport', value: 50, score: 30 },
      { label: 'Bike', value: 10, score: 40 },
      { label: 'Walk', value: 0, score: 50 },
    ],
  },
  {
    id: 'diet',
    title: 'What does your diet typically look like?',
    icon: Utensils,
    options: [
      { label: 'Meat heavy (every day)', value: 7, score: 10 },
      { label: 'Mixed (few times a week)', value: 3, score: 25 },
      { label: 'Vegetarian', value: 0, score: 40 },
      { label: 'Vegan', value: 0, score: 50 },
    ],
  },
  {
    id: 'energy',
    title: 'How energy efficient is your home?',
    icon: Zap,
    options: [
      { label: 'Needs improvement', value: 30, score: 10 },
      { label: 'Average', value: 50, score: 25 },
      { label: 'Good (Energy star appliances, LED)', value: 75, score: 40 },
      { label: 'Excellent (Solar panels, highly insulated)', value: 100, score: 50 },
    ],
  },
  {
    id: 'shopping',
    title: 'How often do you buy new non-essential items?',
    icon: ShoppingBag,
    options: [
      { label: 'Frequently', value: 80, score: 10 },
      { label: 'Sometimes', value: 50, score: 25 },
      { label: 'Rarely', value: 20, score: 40 },
      { label: 'Only second-hand or essential', value: 5, score: 50 },
    ],
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { value: number, score: number }>>({});
  const navigate = useNavigate();
  
  const updateUser = useStore(state => state.updateUser);
  const updateSimulation = useStore(state => state.updateSimulation);

  const handleSelect = (option: { value: number, score: number }) => {
    setAnswers({ ...answers, [steps[currentStep].id]: option });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    // Calculate initial sustainability score based on answers
    let totalScore = 0;
    Object.values(answers).forEach(ans => { totalScore += ans.score; });
    const avgScore = Math.round(totalScore / steps.length);

    // Update User Profile
    updateUser({
      sustainabilityScore: avgScore,
      // basic starting points
      xp: 10,
      level: 1,
      nextLevelXp: 100,
    });

    // Update Simulation with realistic starting points
    updateSimulation({
      carUsage: answers.transportation?.value || 120,
      meatConsumption: answers.diet?.value || 4,
      energyEfficiency: answers.energy?.value || 50,
      shoppingFrequency: answers.shopping?.value || 50,
    });

    // Redirect to dashboard
    navigate('/dashboard');
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-6">
      <div className="max-w-2xl w-full bg-white p-10 rounded-3xl shadow-sm border border-outline-variant animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Leaf className="text-primary" size={24} />
            <span className="font-bold text-xl text-on-surface">EcoPilot AI</span>
          </div>
          <div className="text-sm font-medium text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="mb-10">
          <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center text-primary mb-6">
            <Icon size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{step.title}</h1>
          <p className="text-slate-500">Help us customize your baseline footprint estimate.</p>
        </div>

        <div className="space-y-4">
          {step.options.map((opt, idx) => {
            const isSelected = answers[step.id]?.value === opt.value;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' 
                    : 'border-slate-100 hover:border-slate-300 text-slate-700 font-medium'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="mt-12 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="rounded-xl px-8"
          >
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!answers[step.id]}
            className="rounded-xl px-8 shadow-sm"
          >
            {currentStep === steps.length - 1 ? 'Finish & Start' : 'Next'}
          </Button>
        </div>

      </div>
    </div>
  );
}
