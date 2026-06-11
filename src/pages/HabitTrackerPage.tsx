import { useState } from "react";
import { CheckCircle2, Flame, Sparkles, Leaf, Award, Activity, CalendarDays } from "lucide-react";
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

        {/* Completion Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-on-surface-variant mb-3">
              <Activity size={18} className="text-primary" />
              <p className="text-xs font-bold uppercase tracking-wider">Completion</p>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-primary">{dailyCompletion}%</p>
              <ProgressRing progress={dailyCompletion} size={40} strokeWidth={6} />
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-on-surface-variant mb-3">
              <Flame size={18} className="text-orange-500" />
              <p className="text-xs font-bold uppercase tracking-wider">Active Streak</p>
            </div>
            <p className="text-3xl font-black text-on-surface">{user.streak} <span className="text-base font-medium text-on-surface-variant tracking-normal">Days</span></p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-on-surface-variant mb-3">
              <Award size={18} className="text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-wider">Total XP</p>
            </div>
            <p className="text-3xl font-black text-on-surface">{user.xp}</p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-on-surface-variant mb-3">
              <CalendarDays size={18} className="text-blue-500" />
              <p className="text-xs font-bold uppercase tracking-wider">Active Habits</p>
            </div>
            <p className="text-3xl font-black text-on-surface">{totalCount}</p>
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
          <div className="space-y-4">
            {habits.length === 0 ? (
              <div className="text-center p-12 bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Leaf size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">No Habits Yet</h3>
                <p className="text-on-surface-variant mb-6 max-w-sm">Start your sustainability journey by creating your first eco-friendly habit.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-sm active:scale-95"
                >
                  + Create Habit
                </button>
              </div>
            ) : (
              habits.map(habit => (
                <div 
                  key={habit.id}
                  className={cn(
                    "p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group",
                    habit.completedToday 
                      ? "bg-primary/5 border-primary/30 shadow-sm" 
                      : "bg-surface-container-lowest border-outline-variant hover:border-primary/40 hover:shadow-md"
                  )}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <div className="flex items-center gap-5">
                    {/* Checkmark Circle Animation */}
                    <div className={cn(
                      "shrink-0 transition-all duration-300 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2",
                      habit.completedToday 
                        ? "bg-primary border-primary text-white scale-110" 
                        : "border-outline-variant text-transparent group-hover:border-primary/50"
                    )}>
                      <CheckCircle2 size={24} className={cn("transition-opacity duration-300", habit.completedToday ? "opacity-100" : "opacity-0")} />
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-bold text-base md:text-lg transition-colors duration-300",
                        habit.completedToday ? "text-on-surface-variant line-through decoration-primary/30" : "text-on-surface"
                      )}>{habit.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge variant="secondary" className="bg-[#fff9e6] text-[#b38600] border-none py-0.5 gap-1 shadow-sm text-[10px] md:text-xs">
                          <AwardIcon /> +{habit.xpReward} XP
                        </Badge>
                        <Badge variant="secondary" className="bg-surface-dim border-none py-0.5 text-on-surface-variant text-[10px] md:text-xs">
                          {habit.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Streak Badge */}
                  <div className="flex items-center">
                    <div className={cn(
                      "px-2 md:px-3 py-1 md:py-1.5 rounded-xl flex items-center gap-1 md:gap-1.5 text-xs md:text-sm font-bold transition-colors",
                      habit.streak > 0 
                        ? "bg-orange-500/10 text-orange-600" 
                        : "bg-surface-container text-on-surface-variant/50"
                    )}>
                      <Flame size={16} className={cn(habit.streak > 0 && "fill-orange-600")} />
                      <span className="hidden md:inline">{habit.streak} Day{habit.streak !== 1 && 's'}</span>
                      <span className="md:hidden">{habit.streak}</span>
                    </div>
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
