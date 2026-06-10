import { useState } from 'react';
import { useStore } from '../store/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trophy, Users, Bike, Leaf, Zap, ShoppingBag, Lock, Medal } from 'lucide-react';
import { cn } from '../utils/cn';

const categories = ['All Categories', 'Transportation', 'Energy', 'Food', 'Lifestyle'];

const mockLeaderboard = [
  { id: '1', name: 'Jane Doe', level: 6, title: 'Eco Master', score: '45 Days', initials: 'JD' },
  { id: '2', name: 'Alex Smith', level: 5, title: 'Guardian', score: '38 Days', initials: 'AS' },
];

export default function AchievementsPage() {
  const user = useStore((state) => state.user!);
  const achievements = useStore((state) => state.achievements);
  const [activeCategory, setActiveCategory] = useState('All Categories');

  const filteredAchievements = activeCategory === 'All Categories' 
    ? achievements 
    : achievements.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase() || (activeCategory === 'Transportation' && a.category === 'Transport'));

  const groupedAchievements = filteredAchievements.reduce((acc, curr) => {
    const cat = curr.category === 'Transport' ? 'Transportation' : curr.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {} as Record<string, typeof achievements>);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-on-surface">Your Achievements</h1>

      {/* Current Status */}
      <Card className="p-8 bg-primary/5 border-none relative overflow-hidden flex items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 w-24 h-24 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg text-white">
          <Medal size={40} />
        </div>
        <div className="flex-1 relative z-10">
          <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase mb-1">Current Status</p>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-3xl font-black text-primary">Level {user.level}: Eco Warrior</h2>
            <div className="text-right">
              <span className="text-2xl font-bold text-on-surface">{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden mb-2">
            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}></div>
          </div>
          <div className="flex justify-between text-sm font-medium text-on-surface-variant">
            <span>Level {user.level}</span>
            <span>{user.nextLevelXp - user.xp} XP to Level {user.level + 1}</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">Badge Collection</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all",
                    activeCategory === cat 
                      ? "bg-primary text-white" 
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(groupedAchievements).map(([category, achs]) => (
              <div key={category} className="space-y-4">
                <h4 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  {category === 'Transportation' && <Bike className="text-primary" />}
                  {category === 'Food' && <Leaf className="text-primary" />}
                  {category === 'Energy' && <Zap className="text-primary" />}
                  {category === 'Lifestyle' && <ShoppingBag className="text-primary" />}
                  {category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achs.map(ach => (
                    <Card key={ach.id} className={cn("p-6 relative", !ach.unlocked && "bg-surface-container/30 border-dashed")}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                          ach.unlocked ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
                        )}>
                          {!ach.unlocked && <Lock size={24} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="font-bold text-on-surface pr-2">{ach.title}</h5>
                            <span className={cn(
                              "text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap",
                              ach.unlocked ? "bg-primary/20 text-primary" : "bg-surface-container text-on-surface-variant"
                            )}>
                              +{ach.xpReward} XP
                            </span>
                          </div>
                          {ach.unlocked && <p className="text-xs font-bold text-primary mt-1">Unlocked!</p>}
                        </div>
                      </div>
                      <p className="text-sm text-on-surface-variant mb-6">{ach.description}</p>
                      
                      <div>
                        <div className="flex justify-between text-xs font-bold text-on-surface-variant mb-2">
                          <span>{ach.progress} / {ach.total}</span>
                          <span>{Math.round((ach.progress / ach.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full rounded-full",
                            ach.unlocked ? "bg-primary" : "bg-on-surface-variant/30"
                          )} style={{ width: `${(ach.progress / ach.total) * 100}%` }}></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <Trophy className="text-primary" />
              Leaderboard
            </h3>
            <Card className="overflow-hidden border-none shadow-md">
              <div className="bg-surface-container p-3 text-xs font-bold tracking-wider text-on-surface-variant uppercase text-center">Top Eco Streaks</div>
              <div className="divide-y divide-outline-variant">
                {mockLeaderboard.map((person, i) => (
                  <div key={person.id} className="p-4 flex items-center gap-4 hover:bg-surface-container/50 transition-colors">
                    <span className="font-black text-on-surface-variant w-4 text-center">{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface text-sm">
                      {person.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h6 className="font-bold text-on-surface truncate">{person.name}</h6>
                      <p className="text-xs text-on-surface-variant">Level {person.level} {person.title}</p>
                    </div>
                    <div className="font-bold text-primary text-sm whitespace-nowrap">{person.score}</div>
                  </div>
                ))}
                
                {/* Current User Row */}
                <div className="p-4 flex items-center gap-4 bg-primary/5">
                  <span className="font-black text-on-surface w-4 text-center">3</span>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm">
                    You
                  </div>
                  <div className="flex-1 min-w-0">
                    <h6 className="font-bold text-on-surface truncate">You</h6>
                    <p className="text-xs text-on-surface-variant">Level {user.level} Warrior</p>
                  </div>
                  <div className="font-bold text-on-surface text-sm whitespace-nowrap">{user.streak} Days</div>
                </div>
              </div>
              <div className="p-4 bg-surface-container/30 text-center">
                <button className="text-sm font-bold text-primary hover:text-primary/80">View Full Leaderboard</button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <Users className="text-primary" />
              Friends Impact
            </h3>
            <Card className="p-6 border-none shadow-md">
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                Together, you and your friends are making a real difference this month.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary/5 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-on-surface mb-1">124</div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Trees Planted</p>
                </div>
                <div className="bg-surface-container p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-on-surface mb-1">850</div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">kg CO2 Saved</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full">Invite More Friends</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
