import { useState, useMemo } from 'react';
import { useStore } from '../store/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Car, Utensils, Zap, ShoppingBag, RotateCcw, TreePine, 
  Leaf, Coins, ArrowRight, Sparkles, Home, ShieldAlert,
  Activity
} from 'lucide-react';
import { calculateCarbonImpact } from '../services/engine';
import type { SimulationState } from '../types';

const SCENARIOS: Record<string, SimulationState> = {
  '🌱 Eco Beginner': { carUsage: 150, meatConsumption: 4, energyEfficiency: 50, shoppingFrequency: 50 },
  '🚲 Car-Free': { carUsage: 0, meatConsumption: 3, energyEfficiency: 60, shoppingFrequency: 40 },
  '🌍 Champion': { carUsage: 20, meatConsumption: 1, energyEfficiency: 90, shoppingFrequency: 20 },
  '🏠 Remote Worker': { carUsage: 40, meatConsumption: 5, energyEfficiency: 70, shoppingFrequency: 80 }
};

export default function SimulatorPage() {
  const simulation = useStore((state) => state.simulation);
  const updateSimulation = useStore((state) => state.updateSimulation);
  
  // Local state for smooth slider interaction without constant store updates
  const [localSim, setLocalSim] = useState<SimulationState | null>(simulation);
  const [prevSimStore, setPrevSimStore] = useState<SimulationState | null>(simulation);
  
  if (simulation !== prevSimStore) {
    setPrevSimStore(simulation);
    setLocalSim(simulation);
  }

  const { annualEmissions, carbonReduction, moneySaved, treesEquivalent } = useMemo(() => {
    if (!localSim) return { annualEmissions: 0, carbonReduction: 0, moneySaved: 0, treesEquivalent: 0 };
    return calculateCarbonImpact(localSim);
  }, [localSim]);

  const handleRecalculate = () => {
    if (localSim) {
      updateSimulation(localSim);
    }
  };

  const applyScenario = (scenarioKey: string) => {
    setLocalSim(SCENARIOS[scenarioKey]);
  };

  if (!simulation || !localSim) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <div className="bg-surface-container p-6 rounded-full mb-6">
          <ShieldAlert size={48} className="text-on-surface-variant" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Simulation Data Unavailable</h2>
        <p className="text-on-surface-variant max-w-md">
          Please set up your initial profile or complete the onboarding to use the future impact simulator.
        </p>
      </div>
    );
  }

  const baseEmissions = annualEmissions + carbonReduction;
  const reductionPercentage = baseEmissions > 0 ? Math.round((carbonReduction / baseEmissions) * 100) : 0;
  
  // Dynamically calculated equivalents based on engine.ts logic
  // 0.4 kg CO2 per mile -> miles = reduction / 0.4
  const milesAvoided = Math.floor(carbonReduction / 0.4);
  // ~10 kg CO2 per day of worst-case home energy -> days = reduction / 10
  const homeEnergyDays = Math.floor(carbonReduction / 10);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header & Scenarios */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">Future Impact Simulator</h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-xl">
            Forecast your environmental impact. Adjust your lifestyle parameters or try a quick scenario to see your potential reduction.
          </p>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block" id="quick-scenarios-label">Quick Scenarios</span>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="quick-scenarios-label">
            {Object.keys(SCENARIOS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => applyScenario(key)}
                className="px-4 py-2 bg-surface hover:bg-surface-container border border-outline-variant hover:border-primary/50 text-sm font-medium text-on-surface rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Controls */}
        <section aria-label="Lifestyle Controls">
          <Card className="p-6 flex flex-col h-full border-2 border-outline-variant/50 shadow-sm lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-primary/10 text-primary p-2 rounded-lg" aria-hidden="true">
                <Activity size={20} />
              </div>
              <h2 className="text-xl font-bold text-on-surface">Lifestyle Variables</h2>
            </div>

            <div className="space-y-8 flex-1">
              {/* Car Usage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface font-medium" id="label-car-usage">
                    <Car size={18} className="text-on-surface-variant" aria-hidden="true" />
                    <span>Car Usage</span>
                  </div>
                  <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full" aria-live="polite">
                    {localSim.carUsage} miles/wk
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" max="300" step="10"
                  value={localSim.carUsage}
                  onChange={(e) => setLocalSim({...localSim, carUsage: parseInt(e.target.value)})}
                  aria-labelledby="label-car-usage"
                  className="w-full accent-primary h-3 md:h-2 bg-surface-container rounded-lg appearance-none cursor-pointer my-2 md:my-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                <div className="flex justify-between text-xs font-medium text-on-surface-variant" aria-hidden="true">
                  <span>0</span>
                  <span>300+</span>
                </div>
              </div>

              {/* Meat Consumption */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface font-medium" id="label-meat-consumption">
                    <Utensils size={18} className="text-on-surface-variant" aria-hidden="true" />
                    <span>Meat Consumption</span>
                  </div>
                  <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full" aria-live="polite">
                    {localSim.meatConsumption} days/wk
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" max="7" step="1"
                  value={localSim.meatConsumption}
                  onChange={(e) => setLocalSim({...localSim, meatConsumption: parseInt(e.target.value)})}
                  aria-labelledby="label-meat-consumption"
                  className="w-full accent-primary h-3 md:h-2 bg-surface-container rounded-lg appearance-none cursor-pointer my-2 md:my-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                <div className="flex justify-between text-xs font-medium text-on-surface-variant" aria-hidden="true">
                  <span>Vegan</span>
                  <span>Daily</span>
                </div>
              </div>

              {/* Energy Efficiency */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface font-medium" id="label-energy-efficiency">
                    <Zap size={18} className="text-on-surface-variant" aria-hidden="true" />
                    <span>Energy Efficiency</span>
                  </div>
                  <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full" aria-live="polite">
                    {localSim.energyEfficiency > 75 ? 'High' : localSim.energyEfficiency > 30 ? 'Moderate' : 'Low'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" step="10"
                  value={localSim.energyEfficiency}
                  onChange={(e) => setLocalSim({...localSim, energyEfficiency: parseInt(e.target.value)})}
                  aria-labelledby="label-energy-efficiency"
                  className="w-full accent-primary h-3 md:h-2 bg-surface-container rounded-lg appearance-none cursor-pointer my-2 md:my-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                <div className="flex justify-between text-xs font-medium text-on-surface-variant" aria-hidden="true">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              {/* Shopping Frequency */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface font-medium" id="label-shopping-frequency">
                    <ShoppingBag size={18} className="text-on-surface-variant" aria-hidden="true" />
                    <span>Shopping Frequency</span>
                  </div>
                  <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full" aria-live="polite">
                    {localSim.shoppingFrequency > 75 ? 'Frequent' : localSim.shoppingFrequency > 30 ? 'Average' : 'Minimal'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" step="10"
                  value={localSim.shoppingFrequency}
                  onChange={(e) => setLocalSim({...localSim, shoppingFrequency: parseInt(e.target.value)})}
                  aria-labelledby="label-shopping-frequency"
                  className="w-full accent-primary h-3 md:h-2 bg-surface-container rounded-lg appearance-none cursor-pointer my-2 md:my-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                <div className="flex justify-between text-xs font-medium text-on-surface-variant" aria-hidden="true">
                  <span>Minimal</span>
                  <span>Frequent</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-10">
              <Button 
                className="w-full py-6" 
                variant="outline"
                onClick={handleRecalculate}
                disabled={localSim === simulation}
              >
                Save Simulation
              </Button>
              <Button 
                className="w-full py-6 font-bold" 
                onClick={async () => {
                  await handleRecalculate();
                  await useStore.getState().applySimulation();
                  alert("Scenario Applied! Your dashboard and profile have been updated.");
                }}
              >
                Apply to Profile
              </Button>
            </div>
          </Card>
        </section>

        {/* Right Column: Visualization & Impact */}
        <section className="lg:col-span-2 space-y-6" aria-label="Simulation Results">
          
          {/* Comparison Experience */}
          <Card className="p-8 bg-surface-container/30 border-none relative overflow-hidden">
            {/* Background Bug Fix: Constrained size, z-index 0, pointer-events-none, low opacity */}
            <Leaf className="absolute -right-8 -top-8 text-primary w-64 h-64 opacity-5 pointer-events-none z-0 object-contain" aria-hidden="true" />
            
            <div className="relative z-10">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6 m-0 p-0">Emissions Comparison</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Current State */}
                <div className="flex-1 w-full bg-surface p-6 rounded-2xl border border-outline-variant text-center shadow-sm">
                  <div className="text-on-surface-variant font-medium mb-3 flex items-center justify-center gap-2">
                    <RotateCcw size={18} aria-hidden="true" /> Current State
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-on-surface transition-all duration-500" aria-live="polite">
                    {baseEmissions.toLocaleString()}<span className="text-sm md:text-base text-on-surface-variant font-normal ml-1">kg CO₂</span>
                  </div>
                </div>

                {/* Arrow / Reduction */}
                <div className="flex flex-col items-center">
                  <div className="bg-primary/20 text-primary p-4 rounded-full mb-2 shadow-sm" aria-hidden="true">
                    <ArrowRight size={28} className="rotate-90 md:rotate-0" />
                  </div>
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full" aria-label={`Reduction of ${reductionPercentage} percent`}>
                    -{reductionPercentage}%
                  </span>
                </div>

                {/* Future State */}
                <div className="flex-1 w-full bg-primary/10 p-6 rounded-2xl border border-primary/20 text-center shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" aria-hidden="true"></div>
                  <div className="text-primary font-bold mb-3 flex items-center justify-center gap-2">
                    <Sparkles size={18} aria-hidden="true" /> Future State
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-primary transition-all duration-500" aria-live="polite">
                    {annualEmissions.toLocaleString()}<span className="text-sm md:text-base text-primary/70 font-normal ml-1">kg CO₂</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Impact Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col items-center justify-center text-center shadow-sm group hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                <Leaf size={28} />
              </div>
              <div className="text-2xl md:text-3xl font-black text-on-surface mb-1 transition-all duration-500" aria-live="polite">
                {(carbonReduction / 1000).toFixed(1)}t
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant m-0 p-0">CO₂ Prevented</h4>
            </Card>
            
            <Card className="p-6 flex flex-col items-center justify-center text-center shadow-sm group hover:shadow-md transition-shadow">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                <TreePine size={28} />
              </div>
              <div className="text-2xl md:text-3xl font-black text-on-surface mb-1 transition-all duration-500" aria-live="polite">
                {treesEquivalent}
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant m-0 p-0">Trees Grown</h4>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center text-center shadow-sm group hover:shadow-md transition-shadow border border-secondary/20 bg-secondary/5">
              <div className="bg-secondary/10 text-secondary p-4 rounded-full mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                <Coins size={28} />
              </div>
              <div className="text-2xl md:text-3xl font-black text-secondary mb-1 transition-all duration-500" aria-live="polite">
                ${moneySaved}
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary/70 m-0 p-0">Money Saved</h4>
            </Card>
          </div>

          {/* Equivalents Section */}
          <Card className="p-6 bg-surface-container/20 border-none shadow-sm">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-5">Real World Equivalents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-5 bg-surface p-5 rounded-2xl border border-outline-variant shadow-sm hover:border-primary/30 transition-colors">
                <div className="bg-primary/20 text-primary p-4 rounded-2xl" aria-hidden="true"><Car size={28} /></div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-on-surface transition-all duration-500" aria-live="polite">
                    {milesAvoided.toLocaleString()}
                  </div>
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1 m-0 p-0">Miles Avoided</h4>
                </div>
              </div>
              
              <div className="flex items-center gap-5 bg-surface p-5 rounded-2xl border border-outline-variant shadow-sm hover:border-secondary/30 transition-colors">
                <div className="bg-secondary/20 text-secondary p-4 rounded-2xl" aria-hidden="true"><Home size={28} /></div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-on-surface transition-all duration-500" aria-live="polite">
                    {homeEnergyDays.toLocaleString()}
                  </div>
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1 m-0 p-0">Days Home Energy</h4>
                </div>
              </div>
            </div>
          </Card>

        </section>
      </div>
    </div>
  );
}
