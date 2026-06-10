import { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import { Card } from '../components/ui/Card';
import { Trophy, Users, Bike, Leaf, Zap, ShoppingBag, Lock, Medal } from 'lucide-react';
import { cn } from '../utils/cn';
import { getGlobalLeaderboard } from '../services/db';
import type { User } from '../types';

const categories = ['All Categories', 'Transportation', 'Energy', 'Food', 'Lifestyle'];

export default function AchievementsPage() {
  const user = useStore((state) => state.user!);
  const achievements = useStore((state) => state.achievements);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [leaderboard, setLeaderboard] = useState<Partial<User>[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getGlobalLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      }
    };
    fetchLeaderboard();
  }, []);

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
            {Object.keys(groupedAchievements).length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-2xl text-on-surface-variant">
                No achievements found in this category. Complete habits to unlock them!
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <Trophy className="text-primary" />
              Global Leaderboard
            </h3>
            <Card className="overflow-hidden border-none shadow-md">
              <div className="bg-surface-container p-3 text-xs font-bold tracking-wider text-on-surface-variant uppercase text-center">Top Eco Warriors (By XP)</div>
              <div className="divide-y divide-outline-variant">
                {leaderboard.length === 0 ? (
                  <div className="p-4 text-center text-sm text-on-surface-variant">Loading leaderboard...</div>
                ) : (
                  leaderboard.map((person, i) => (
                    <div key={person.id} className={cn(
                      "p-4 flex items-center gap-4 hover:bg-surface-container/50 transition-colors",
                      person.id === user.id && "bg-primary/5"
                    )}>
                      <span className="font-black text-on-surface-variant w-4 text-center">{i + 1}</span>
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                        person.id === user.id ? "bg-primary text-white" : "bg-surface-container-high text-on-surface"
                      )}>
                        {person.name?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6 className="font-bold text-on-surface truncate">
                          {person.id === user.id ? 'You' : person.name || 'Anonymous User'}
                        </h6>
                        <p className="text-xs text-on-surface-variant">Level {person.level || 1}</p>
                      </div>
                      <div className="font-bold text-primary text-sm whitespace-nowrap">{person.xp?.toLocaleString() || 0} XP</div>
                    </div>
                  ))
                )}
                
                {/* Ensure current user is shown if not in top 10 */}
                {leaderboard.length > 0 && !leaderboard.find(p => p.id === user.id) && (
                  <div className="p-4 flex items-center gap-4 bg-primary/5 border-t-2 border-primary/20">
                    <span className="font-black text-on-surface w-4 text-center">-</span>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h6 className="font-bold text-on-surface truncate">You</h6>
                      <p className="text-xs text-on-surface-variant">Level {user.level}</p>
                    </div>
                    <div className="font-bold text-primary text-sm whitespace-nowrap">{user.xp.toLocaleString()} XP</div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <Users className="text-primary" />
              Community Impact
            </h3>
            <Card className="p-6 border-none shadow-md">
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                Together, the EcoPilot community is making a real difference globally.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary/5 p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-on-surface mb-1">
                    {leaderboard.reduce((acc, curr) => acc + (curr.totalCarbonSaved || 0), 0).toFixed(0)}
                  </div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Top Users kg CO2 Saved</p>
                </div>
                <div className="bg-surface-container p-4 rounded-xl text-center">
                  <div className="text-2xl font-black text-on-surface mb-1">
                    {leaderboard.reduce((acc, curr) => acc + (curr.totalActions || 0), 0)}
                  </div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Actions Taken</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
