import { Leaf, Calendar, CheckCircle2, Circle, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { ProgressRing } from "../components/ui/ProgressRing";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { cn } from "../utils/cn";
import { useStore } from "../store/store";

export default function DashboardPage() {
  const user = useStore((state) => state.user!);
  const challenges = useStore((state) => state.dailyChallenges);
  const completeHabit = useStore((state) => state.completeHabit);
  const insights = useStore((state) => state.insights);
  const activeMission = useStore((state) => state.activeMission);

  const totalEarned = challenges.filter(c => c.completedToday).reduce((acc, curr) => acc + curr.xpReward, 0);

  const toggleChallenge = (id: string) => {
    completeHabit(id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight">Good morning, {user.name}!</h1>
          <p className="text-body-lg text-on-surface-variant mt-2">Ready to make a positive impact today?</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-outline-variant shadow-sm">
          <Calendar size={20} className="text-primary" />
          <span className="font-semibold text-sm">Oct 24, 2024</span>
        </div>
      </div>

      {/* Insights Banner */}
      <div className="bg-surface-container-highest rounded-[1.5rem] p-6 border border-surface-container-highest relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center relative shadow-sm">
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-surface-container-highest"></span>
            </div>
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              EcoPilot AI Insights <Badge className="bg-primary/20 text-primary uppercase text-[10px] tracking-wider">New</Badge>
            </h2>
          </div>
          <p className="text-on-surface font-medium leading-relaxed max-w-4xl flex items-start gap-2">
            <Leaf className="text-primary mt-1 shrink-0" size={18} />
            <span>
              <strong>EcoPilot AI says:</strong> {insights[0]?.text}
            </span>
          </p>
          <div className="mt-5 flex gap-3">
            <Button className="bg-primary text-white shadow-sm">{insights[0]?.actionLabel}</Button>
            <Button variant="outline" className="bg-white border-white/40 shadow-sm">Show More Insights</Button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
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
              <Award className="shrink-0" />
              <p>You're performing better than <strong>68%</strong> of users this week.</p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Eco Mission */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="text-primary">⚑</span> Today's Eco Mission
            </CardTitle>
            <Badge className="bg-error/10 text-error gap-1 py-1">
              {user.streak} Day Streak!
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-outline-variant shadow-sm text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl">{activeMission?.title}</h3>
                  <p className="text-on-surface-variant mt-1">{activeMission?.description}</p>
                </div>
                <div className="bg-primary text-white font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm">
                  +{activeMission?.xpReward} XP
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-2">
              <div className="h-4 bg-surface-container rounded-full overflow-hidden flex">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '50%' }}></div>
              </div>
              <div className="flex justify-between text-sm font-medium text-on-surface-variant">
                <span>Mission Progress</span>
                <span>1/2 Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Daily Challenges</h2>
            <p className="text-on-surface-variant">Complete actions to earn XP and level up!</p>
          </div>
          <Badge className="bg-primary/20 text-primary py-1.5 px-4 text-sm">
            Total Earned: {totalEarned} XP
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map(challenge => (
            <div 
              key={challenge.id} 
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                challenge.completedToday 
                  ? "bg-surface border-transparent" 
                  : "bg-white border-outline-variant hover:border-primary/50"
              )}
              onClick={() => toggleChallenge(challenge.id)}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                  challenge.completedToday ? "text-primary bg-primary/10" : "text-outline-variant"
                )}>
                  {challenge.completedToday ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div>
                  <h4 className={cn("font-bold text-lg", challenge.completedToday && "text-on-surface-variant line-through decoration-2 decoration-on-surface-variant/30")}>
                    {challenge.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px] bg-white border border-outline-variant shadow-sm py-0.5">
                      💨 -{challenge.co2SavingsKg} kg CO₂
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] bg-surface-dim border-none py-0.5">
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="font-bold text-on-surface-variant">
                +{challenge.xpReward} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
