import { Leaf, Calendar, CheckCircle2, Circle, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { ProgressRing } from "../components/ui/ProgressRing";
import { Badge } from "../components/ui/Badge";
import { cn } from "../utils/cn";
import { useStore } from "../store/store";
import { useMemo } from "react";

export default function DashboardPage() {
  const user = useStore((state) => state.user!);
  const habits = useStore((state) => state.habits);
  const completeHabit = useStore((state) => state.completeHabit);
  const simulation = useStore((state) => state.simulation);

  const displayHabits = habits;

  const totalEarned = useMemo(() => displayHabits.filter(c => c.completedToday).reduce((acc, curr) => acc + curr.xpReward, 0), [displayHabits]);

  const toggleHabit = (id: string) => {
    completeHabit(id);
  };

  const dynamicInsight = useMemo(() => {
    if (!simulation) return "Welcome to EcoPilot AI! Let's start tracking your habits.";
    if (simulation.carUsage > 150) return "Transportation contributes most of your footprint. Try taking public transit!";
    if (simulation.meatConsumption > 5) return "Reducing meat consumption could significantly lower emissions.";
    if (user.streak > 3) return `Great job maintaining a ${user.streak}-day streak! Your sustainability score is growing.`;
    return "Every small action counts. Log a habit today to boost your score!";
  }, [simulation, user.streak]);

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Dynamic Mission
  const activeMission = useMemo(() => {
    return {
      title: "Daily Eco Warrior",
      description: "Complete at least one habit today to maintain your streak.",
      xpReward: 50
    };
  }, []);

  const hasCompletedMission = useMemo(() => displayHabits.some(h => h.completedToday), [displayHabits]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-display-lg font-bold text-on-surface tracking-tight">Good morning, {user.name}!</h1>
          <p className="text-body-lg text-on-surface-variant mt-2">Ready to make a positive impact today?</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant shadow-sm">
          <Calendar size={20} className="text-primary" aria-hidden="true" />
          <span className="font-semibold text-sm">{today}</span>
        </div>
      </div>

      {/* Insights Banner */}
      <div className="bg-surface-container-highest rounded-[1.5rem] p-6 border border-surface-container-highest relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-surface/40 rounded-full blur-3xl" aria-hidden="true"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative w-12 h-12 group cursor-default" aria-hidden="true">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6FFBBE] via-[#4EDEA3] to-[#10B981] rounded-full blur-md opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500"></div>
              
              {/* Orb Core */}
              <div className="relative w-full h-full bg-gradient-to-br from-[#6FFBBE] via-[#4EDEA3] to-[#10B981] rounded-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_2px_10px_rgba(16,185,129,0.4)] flex items-center justify-center animate-orb-pulse group-hover:scale-105 transition-transform duration-500">
                {/* Inner highlight for 3D effect */}
                <div className="absolute top-1.5 left-2 w-4 h-4 bg-white/60 rounded-full blur-[2px]"></div>
              </div>

              {/* Orbiting Particle Wrapper */}
              <div className="absolute inset-[-6px] animate-[spin_6s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-on-surface rounded-full shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
              </div>
            </div>
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              EcoPilot AI Insights <Badge className="bg-primary/20 text-primary uppercase text-[10px] tracking-wider">Live</Badge>
            </h2>
          </div>
          <p className="text-on-surface font-medium leading-relaxed max-w-4xl flex items-start gap-2" aria-live="polite">
            <Leaf className="text-primary mt-1 shrink-0" size={18} aria-hidden="true" />
            <span>
              <strong>EcoPilot AI says:</strong> <span className="sr-only">EcoPilot AI says:</span> {dynamicInsight}
            </span>
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        
        {/* Sustainability Score */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sustainability Score</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center pt-4">
            <ProgressRing progress={user.sustainabilityScore} size={200} strokeWidth={16} className="mb-8">
              <span className="text-5xl font-bold tracking-tighter text-on-surface">{user.sustainabilityScore}</span>
              <span className="text-on-surface-variant font-medium">/100</span>
            </ProgressRing>
            <div className="w-full bg-primary/10 text-primary p-4 rounded-xl flex items-center gap-3 font-medium">
              <Award className="shrink-0" aria-hidden="true" />
              <p>Your current level is <strong>{user.level}</strong> with {user.totalCarbonSaved.toFixed(1)}kg CO2 saved.</p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Eco Mission */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="text-primary" aria-hidden="true">⚑</span> Today's Eco Mission
            </CardTitle>
            <Badge className="bg-error/10 text-error gap-1 py-1">
              {user.streak} Day Streak!
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center relative z-10">
                <div className="flex gap-4 items-start flex-1">
                  <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 border border-outline-variant shadow-sm text-primary" aria-hidden="true">
                    {hasCompletedMission ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{activeMission.title}</h3>
                    <p className="text-on-surface-variant mt-1 text-sm md:text-base">{activeMission.description}</p>
                  </div>
                </div>
                <div className="bg-primary text-white font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm shrink-0" aria-label={`Reward: ${activeMission.xpReward} XP`}>
                  +{activeMission.xpReward} XP
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-2">
              <div className="h-4 bg-surface-container rounded-full overflow-hidden flex" role="progressbar" aria-valuenow={hasCompletedMission ? 100 : 0} aria-valuemin={0} aria-valuemax={100} aria-label="Mission Progress">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: hasCompletedMission ? '100%' : '0%' }}></div>
              </div>
              <div className="flex justify-between text-sm font-medium text-on-surface-variant" aria-hidden="true">
                <span>Mission Progress</span>
                <span>{hasCompletedMission ? '1' : '0'}/1 Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Habits */}
      <section>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-2xl font-bold">Your Habits</h2>
            <p className="text-on-surface-variant">Complete actions to earn XP and level up!</p>
          </div>
          <Badge className="bg-primary/20 text-primary py-1.5 px-4 text-sm">
            Total Earned Today: {totalEarned} XP
          </Badge>
        </div>
        
        {displayHabits.length === 0 ? (
           <div className="text-center py-8 text-on-surface-variant bg-surface rounded-2xl border border-outline-variant" role="status">
             No habits created yet. Go to the Habit Tracker to create your first habit!
           </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {displayHabits.map(habit => (
              <li key={habit.id}>
                <button 
                  type="button"
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    habit.completedToday 
                      ? "bg-surface border-transparent" 
                      : "bg-surface-container-lowest border-outline-variant hover:border-primary/50"
                  )}
                  onClick={() => toggleHabit(habit.id)}
                  aria-pressed={habit.completedToday}
                  aria-label={`${habit.title}, ${habit.difficulty} difficulty, saves ${habit.co2SavingsKg} kg CO2, earns ${habit.xpReward} XP`}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={cn(
                      "shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                      habit.completedToday ? "text-primary bg-primary/10" : "text-outline-variant"
                    )} aria-hidden="true">
                      {habit.completedToday ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("font-bold text-base md:text-lg truncate", habit.completedToday && "text-on-surface-variant line-through decoration-2 decoration-on-surface-variant/30")}>
                        {habit.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] bg-surface-container-lowest border border-outline-variant shadow-sm py-0.5">
                          💨 -{habit.co2SavingsKg} kg CO₂
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] bg-surface-dim border-none py-0.5">
                          {habit.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-on-surface-variant self-end sm:self-auto pl-10 sm:pl-0 shrink-0">
                    +{habit.xpReward} XP
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
