import { useState } from "react";
import { CheckCircle2, Circle, Flame, Sparkles } from "lucide-react";
import { ProgressRing } from "../components/ui/ProgressRing";
import { Badge } from "../components/ui/Badge";
import { cn } from "../utils/cn";
import { useStore } from "../store/store";
import { CreateHabitModal } from "../components/CreateHabitModal";

export default function HabitTrackerPage() {
  const user = useStore((state) => state.user!);
  const habits = useStore((state) => state.habits);
  const completeHabit = useStore((state) => state.completeHabit);
  const weeklyChallenges = useStore((state) => state.weeklyChallenges);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleHabit = (id: string) => {
    completeHabit(id);
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const totalCount = habits.length;
  const dailyCompletion = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  
  // Basic weekly completion heuristic
  const weeklyCompletion = Math.min(100, Math.round((user.streak / 7) * 100));

  // Dynamic forest stages based on total actions
  let forestStage = "Seedling";
  let forestDesc = "Start tracking habits to plant your first tree!";
  if (user.totalActions > 10) {
    forestStage = "Young Tree";
    forestDesc = "Your consistent actions are taking root.";
  }
  if (user.totalActions > 30) {
    forestStage = "Growing Forest";
    forestDesc = "Your virtual ecosystem is expanding rapidly!";
  }
  if (user.totalActions > 75) {
    forestStage = "Thriving Ecosystem";
    forestDesc = "Keep completing habits to watch your virtual ecosystem grow. You're making a real difference.";
  }

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
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Daily Completion</p>
              <p className="text-4xl font-bold text-primary">{dailyCompletion}%</p>
            </div>
            <ProgressRing progress={dailyCompletion} size={64} strokeWidth={8} />
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Weekly Consistency</p>
              <p className="text-4xl font-bold text-primary">{weeklyCompletion}%</p>
            </div>
            <ProgressRing progress={weeklyCompletion} size={64} strokeWidth={8} />
          </div>
        </div>

        {/* Weekly Challenges (Fallback to Empty State if None) */}
        {weeklyChallenges.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Weekly Challenges</h2>
            <div className="grid grid-cols-2 gap-4">
              {weeklyChallenges.map(challenge => (
                <div key={challenge.id} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
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
        )}

        {/* Active Habits */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Active Habits</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-bold text-primary hover:text-primary-container transition-colors"
            >
              + New Habit
            </button>
          </div>
          <div className="space-y-3">
            {habits.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-2xl text-on-surface-variant">
                You have no habits yet. Click "+ New Habit" to get started!
              </div>
            ) : (
              habits.map(habit => (
                <div 
                  key={habit.id}
                  className={cn(
                    "p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                    habit.completedToday 
                      ? "bg-surface-container-low border-primary/20" 
                      : "bg-surface-container-lowest border-outline-variant hover:border-primary/50 shadow-sm"
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
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-[#fff9e6] text-[#b38600] border-none py-0.5 gap-1">
                          <AwardIcon /> +{habit.xpReward} XP
                        </Badge>
                        <Badge variant="secondary" className="bg-surface-dim border-none py-0.5">
                          {habit.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <Flame key={i} size={20} className={i < habit.streak ? "text-[#ff9900] fill-[#ff9900]" : "text-outline-variant/30"} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Ecosystem */}
      <div className="w-80">
        <div className="bg-gradient-to-b from-white to-surface-container-highest rounded-[2rem] p-8 border border-surface-container-highest shadow-level-1 text-center sticky top-24">
          <div className="absolute top-6 right-6 text-[#ffb300]">
            <Sparkles size={24} />
          </div>
          
          <div className="w-48 h-48 mx-auto bg-surface-container-lowest rounded-full flex items-center justify-center shadow-sm mb-8 border border-surface-container-highest relative">
             <div className="absolute inset-0 bg-primary/5 rounded-full"></div>
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary fill-primary">
                <path d="M12 22v-9" strokeWidth="2"/>
                <path d="M12 15C8 15 5 12 5 8c4 0 7 3 7 7z" />
                <path d="M12 15c4 0 7-3 7-7-4 0-7 3-7 7z" />
             </svg>
          </div>

          <h3 className="text-2xl font-bold mb-3">{forestStage}</h3>
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
            {forestDesc}
          </p>

          {totalCount > 0 && (
            <div>
              <div className="h-3 bg-surface/50 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${dailyCompletion}%` }}></div>
              </div>
              <p className="text-xs font-semibold text-on-surface-variant">
                {completedCount}/{totalCount} Habits Completed Today
              </p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && <CreateHabitModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function AwardIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>
  );
}
