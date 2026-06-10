import { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Car, Utensils, Zap, ShoppingBag, RotateCcw, TreePine, Leaf, Coins } from 'lucide-react';
import { calculateCarbonImpact } from '../services/engine';

export default function SimulatorPage() {
  const simulation = useStore((state) => state.simulation);
  const updateSimulation = useStore((state) => state.updateSimulation);
  
  // Local state for smooth slider interaction without constant store updates
  const [localSim, setLocalSim] = useState(simulation);
  
  useEffect(() => {
    setLocalSim(simulation);
  }, [simulation]);

  const handleRecalculate = () => {
    updateSimulation(localSim);
  };

  const { annualEmissions: futureEmissions, carbonReduction: totalReduction, moneySaved, treesEquivalent } = calculateCarbonImpact(localSim);
  const baseEmissions = futureEmissions + totalReduction;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">Future Impact Simulator: Visualize Your Future</h1>
        <p className="text-on-surface-variant max-w-2xl">
          Adjust the parameters below to see how small lifestyle changes compound over time to reduce your carbon footprint.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lifestyle Variables Form */}
        <Card className="p-6 row-span-2 flex flex-col h-full border-2 border-outline-variant/50 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-surface-container p-2 rounded-lg text-on-surface">
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Lifestyle Variables</h2>
          </div>

          <div className="space-y-8 flex-1">
            {/* Car Usage */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <Car size={18} className="text-on-surface-variant" />
                  <span>Car Usage</span>
                </div>
                <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {localSim.carUsage} miles/wk
                </span>
              </div>
              <input 
                type="range" 
                min="0" max="300" step="10"
                value={localSim.carUsage}
                onChange={(e) => setLocalSim({...localSim, carUsage: parseInt(e.target.value)})}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>0</span>
                <span>300+</span>
              </div>
            </div>

            {/* Meat Consumption */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <Utensils size={18} className="text-on-surface-variant" />
                  <span>Meat Consumption</span>
                </div>
                <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {localSim.meatConsumption} days/wk
                </span>
              </div>
              <input 
                type="range" 
                min="0" max="7" step="1"
                value={localSim.meatConsumption}
                onChange={(e) => setLocalSim({...localSim, meatConsumption: parseInt(e.target.value)})}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>Vegan</span>
                <span>Daily</span>
              </div>
            </div>

            {/* Energy Efficiency */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <Zap size={18} className="text-on-surface-variant" />
                  <span>Energy Efficiency</span>
                </div>
                <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {localSim.energyEfficiency > 75 ? 'High' : localSim.energyEfficiency > 30 ? 'Moderate' : 'Low'}
                </span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="10"
                value={localSim.energyEfficiency}
                onChange={(e) => setLocalSim({...localSim, energyEfficiency: parseInt(e.target.value)})}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Shopping Frequency */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <ShoppingBag size={18} className="text-on-surface-variant" />
                  <span>Shopping Frequency</span>
                </div>
                <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {localSim.shoppingFrequency > 75 ? 'Frequent' : localSim.shoppingFrequency > 30 ? 'Average' : 'Minimal'}
                </span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="10"
                value={localSim.shoppingFrequency}
                onChange={(e) => setLocalSim({...localSim, shoppingFrequency: parseInt(e.target.value)})}
                className="w-full accent-primary h-2 bg-surface-container rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>Minimal</span>
                <span>Frequent</span>
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-8" 
            onClick={handleRecalculate}
            disabled={localSim === simulation}
          >
            Recalculate Projection
          </Button>
        </Card>

        {/* Current & Future Results */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-8 relative overflow-hidden flex flex-col justify-center">
            <RotateCcw className="absolute -right-4 -top-4 text-surface-container w-48 h-48 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-on-surface-variant font-medium mb-6">
                <div className="border border-outline p-1.5 rounded-full"><RotateCcw size={16} /></div>
                Current Lifestyle
              </div>
              <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase mb-2">Annual Emissions</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-on-surface tracking-tighter">{baseEmissions.toLocaleString()}</span>
                <span className="text-lg font-medium text-on-surface-variant">kg CO₂</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-primary-container/40 border-primary/20 relative overflow-hidden flex flex-col justify-center">
            <Leaf className="absolute -right-4 -top-4 text-primary/10 w-48 h-48" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary font-bold mb-6">
                <div className="bg-primary/20 p-1.5 rounded-full"><Leaf size={16} /></div>
                Future Lifestyle
              </div>
              <p className="text-xs font-bold tracking-wider text-primary uppercase mb-2">Annual Emissions</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-primary tracking-tighter transition-all duration-500">{futureEmissions.toLocaleString()}</span>
                <span className="text-lg font-medium text-primary/70">kg CO₂</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-primary/70 uppercase mb-1">Potential Reduction</p>
                  <p className="text-xl font-bold text-primary">{totalReduction.toLocaleString()} <span className="text-xs">kg CO₂</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-primary/70 uppercase mb-1">Money Saved</p>
                  <p className="text-xl font-bold text-primary">${moneySaved} <span className="text-xs">/yr</span></p>
                </div>
                <div className="col-span-2 pt-2 mt-2 border-t border-primary/20">
                  <p className="text-[10px] font-bold tracking-wider text-primary/70 uppercase mb-1">Trees Equivalent</p>
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <TreePine size={18} />
                    {treesEquivalent} trees
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Aggregated Impact */}
        <Card className="lg:col-span-2 p-8 h-full flex flex-col justify-center border-none shadow-md">
          <h3 className="text-xl font-bold text-on-surface mb-2">If you continue these habits for one year...</h3>
          <p className="text-on-surface-variant mb-8">Your cumulative positive impact on the environment</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-outline-variant">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                <Leaf size={28} />
              </div>
              <div className="text-4xl font-black text-on-surface mb-1">{(totalReduction / 1000).toFixed(1)}t</div>
              <p className="text-sm font-medium text-on-surface-variant">CO₂ Prevented</p>
              <div className="w-full bg-surface-container h-1.5 rounded-full mt-6 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (totalReduction/2000)*100)}%` }}></div>
              </div>
            </div>
            
            <div className="bg-surface p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-outline-variant">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                <TreePine size={28} />
              </div>
              <div className="text-4xl font-black text-on-surface mb-1">{treesEquivalent}</div>
              <p className="text-sm font-medium text-on-surface-variant">Trees Grown</p>
              <div className="w-full bg-surface-container h-1.5 rounded-full mt-6 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (treesEquivalent/100)*100)}%` }}></div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-outline-variant">
              <div className="bg-secondary/10 text-secondary p-4 rounded-full mb-4">
                <Coins size={28} />
              </div>
              <div className="text-4xl font-black text-secondary mb-1">${moneySaved}</div>
              <p className="text-sm font-medium text-on-surface-variant">Money Saved</p>
              <div className="w-full bg-surface-container h-1.5 rounded-full mt-6 overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: `${Math.min(100, (moneySaved/1000)*100)}%` }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
