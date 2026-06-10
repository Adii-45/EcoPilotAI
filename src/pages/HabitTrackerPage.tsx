import { useState } from "react";
import { CheckCircle2, Circle, Flame, Sparkles } from "lucide-react";
import { ProgressRing } from "../components/ui/ProgressRing";
import { Badge } from "../components/ui/Badge";
import { mockWeeklyChallenges, mockActiveHabits } from "../data/mockData";
import { cn } from "../utils/cn";

export default function HabitTrackerPage() {
  const [habits, setHabits] = useState(mockActiveHabits);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completedToday: !h.completedToday } : h
    ));
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const totalCount = habits.length;

  return (
    <div className="max-w-7xl mx-auto flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Column */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight">Your Sustainable Habits</h1>
          <p className="text-body-lg text-on-surface-variant mt-2">Track your daily actions and watch your impact grow.</p>
        </div>

        {/* Completion Stats */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Daily Completion</p>
              <p className="text-4xl font-bold text-primary">60%</p>
            </div>
            <ProgressRing progress={60} size={64} strokeWidth={8} />
          </div>
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Weekly Completion</p>
              <p className="text-4xl font-bold text-primary">85%</p>
            </div>
            <ProgressRing progress={85} size={64} strokeWidth={8} />
          </div>
        </div>

        {/* Weekly Challenges */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Weekly Challenges</h2>
          <div className="grid grid-cols-2 gap-4">
            {mockWeeklyChallenges.map(challenge => (
              <div key={challenge.id} className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold flex items-center gap-2">
                      <span className="text-xl">{challenge.category === 'Transport' ? '🚆' : '💧'}</span>
                      {challenge.title}
                    </div>
                    <Badge variant="outline" className="bg-[#fff9e6] text-[#b38600] border-[#ffe699] gap-1 px-2">
                      <AwardIcon /> {challenge.xpReward} XP
                    </Badge>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-6">{challenge.description}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-on-surface-variant mb-2">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.total} Days</span>
                  </div>
                  <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      challenge.category === 'Transport' ? "bg-[#ff7a33]" : "bg-primary"
                    )} style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Habits */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Active Habits</h2>
            <button className="text-sm font-bold text-primary hover:text-primary-container transition-colors">+ New Habit</button>
          </div>
          <div className="space-y-3">
            {habits.map(habit => (
              <div 
                key={habit.id}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                  habit.completedToday 
                    ? "bg-surface-container-low border-primary/20" 
                    : "bg-white border-outline-variant hover:border-primary/50 shadow-sm"
                )}
                onClick={() => toggleHabit(habit.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "shrink-0 transition-colors",
                    habit.completedToday ? "text-primary" : "text-outline-variant"
                  )}>
                    {habit.completedToday ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{habit.title}</h4>
                    <Badge variant="secondary" className="mt-1 bg-[#fff9e6] text-[#b38600] border-none py-0.5 gap-1">
                      <AwardIcon /> +{habit.xpReward} XP
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <Flame key={i} size={20} className={i < habit.streak ? "text-[#ff9900] fill-[#ff9900]" : "text-outline-variant/30"} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Ecosystem */}
      <div className="w-80">
        <div className="bg-gradient-to-b from-white to-surface-container-highest rounded-[2rem] p-8 border border-white shadow-level-1 text-center sticky top-24">
          <div className="absolute top-6 right-6 text-[#ffb300]">
            <Sparkles size={24} />
          </div>
          
          <div className="w-48 h-48 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-8 border border-white relative">
             <div className="absolute inset-0 bg-primary/5 rounded-full"></div>
             {/* Simple plant visual using SVG since we don't have the image asset */}
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary fill-primary">
                <path d="M12 22v-9" strokeWidth="2"/>
                <path d="M12 15C8 15 5 12 5 8c4 0 7 3 7 7z" />
                <path d="M12 15c4 0 7-3 7-7-4 0-7 3-7 7z" />
             </svg>
          </div>

          <h3 className="text-2xl font-bold mb-3">Your Forest is Thriving!</h3>
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
            Keep completing habits to watch your virtual ecosystem grow. You're making a real difference.
          </p>

          <div>
            <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(completedCount/totalCount)*100}%` }}></div>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant">
              {completedCount}/{totalCount} Habits Completed Today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AwardIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>
  );
}
