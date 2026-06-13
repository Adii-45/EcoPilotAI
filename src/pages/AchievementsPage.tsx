import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/store';
import { Card } from '../components/ui/Card';
import { Trophy, Users, Bike, Leaf, Zap, ShoppingBag, Lock, Medal, Flame, Star, Target, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { getGlobalLeaderboard } from '../services/db';
import type { User } from '../types';

export default function AchievementsPage() {
  const user = useStore((state) => state.user!);
  const achievements = useStore((state) => state.achievements);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [leaderboard, setLeaderboard] = useState<Partial<User>[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getGlobalLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Performance Optimization: Memoize calculations
  const unlockedCount = useMemo(() => achievements.filter(a => a.unlocked).length, [achievements]);
  
  const nextAchievements = useMemo(() => {
    return achievements
      .filter(a => !a.unlocked && a.progress > 0)
      .sort((a, b) => (b.progress / b.total) - (a.progress / a.total))
      .slice(0, 3);
  }, [achievements]);

  const availableCategories = useMemo(() => {
    const cats = new Set(achievements.map(a => a.category === 'Transport' ? 'Transportation' : a.category));
    return ['All Categories', ...Array.from(cats)];
  }, [achievements]);

  const groupedAchievements = useMemo(() => {
    const filtered = activeCategory === 'All Categories'
      ? achievements
      : achievements.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase() || (activeCategory === 'Transportation' && a.category === 'Transport'));

    return filtered.reduce((acc, curr) => {
      const cat = curr.category === 'Transport' ? 'Transportation' : curr.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(curr);
      return acc;
    }, {} as Record<string, typeof achievements>);
  }, [achievements, activeCategory]);

  const communityStats = useMemo(() => {
    if (leaderboard.length === 0) return null;
    return {
      totalCarbonSaved: leaderboard.reduce((acc, curr) => acc + (curr.totalCarbonSaved || 0), 0),
      totalActions: leaderboard.reduce((acc, curr) => acc + (curr.totalActions || 0), 0),
      activeUsers: leaderboard.length,
      totalXp: leaderboard.reduce((acc, curr) => acc + (curr.xp || 0), 0)
    };
  }, [leaderboard]);

  const getRankTitle = (level: number) => {
    if (level >= 20) return "Eco Master";
    if (level >= 10) return "Eco Guardian";
    if (level >= 5) return "Eco Warrior";
    return "Eco Pioneer";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transportation': return <Bike className="text-primary" />;
      case 'Food': return <Leaf className="text-primary" />;
      case 'Energy': return <Zap className="text-primary" />;
      case 'Lifestyle': return <ShoppingBag className="text-primary" />;
      default: return <Star className="text-primary" />;
    }
  };

  const renderLeaderboard = () => (
    <div className="space-y-5">
      <h3 className="text-2xl font-black text-on-surface flex items-center gap-2">
        <Trophy className="text-primary" size={26} aria-hidden="true" />
        Global Leaderboard
      </h3>
      
      {loadingLeaderboard ? (
        <Card className="p-8 border-none shadow-md bg-surface-container-lowest text-center space-y-4" aria-live="polite">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" aria-hidden="true"></div>
          <p className="text-sm font-bold text-on-surface-variant">Loading rankings...</p>
        </Card>
      ) : leaderboard.length > 0 ? (
        <Card className="overflow-hidden border-none shadow-md bg-surface-container-lowest">
          <div className="bg-surface-container/50 p-4 border-b border-outline-variant/30 flex justify-between items-center">
            <span className="text-xs font-black tracking-wider text-on-surface-variant uppercase">Top Eco Warriors</span>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Top 10</span>
          </div>
          <div className="divide-y divide-outline-variant/30" role="list">
            {leaderboard.map((person, i) => (
              <div key={person.id} className={cn(
                "p-4 flex items-center gap-4 hover:bg-surface-container/50 transition-colors",
                person.id === user.id && "bg-primary/5"
              )} role="listitem">
                <span className={cn(
                  "font-black w-6 text-center text-lg",
                  i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : "text-on-surface-variant"
                )} aria-label={`Rank ${i + 1}`}>{i + 1}</span>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner",
                  person.id === user.id ? "bg-primary text-white" : "bg-surface-container-high text-on-surface"
                )} aria-hidden="true">
                  {person.name?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="font-bold text-on-surface truncate text-sm">
                    {person.id === user.id ? 'You' : person.name || 'Anonymous'}
                  </h6>
                  <p className="text-[11px] font-bold text-on-surface-variant">Level {person.level || 1}</p>
                </div>
                <div className="font-black text-primary text-sm whitespace-nowrap" aria-label={`${person.xp?.toLocaleString() || 0} Experience Points`}>{person.xp?.toLocaleString() || 0} XP</div>
              </div>
            ))}
            
            {/* Ensure current user is shown if not in top 10 */}
            {!leaderboard.find(p => p.id === user.id) && (
              <div className="p-4 flex items-center gap-4 bg-primary/10 border-t-2 border-primary/20" role="listitem">
                <span className="font-black text-on-surface w-6 text-center" aria-hidden="true">-</span>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm shadow-md" aria-hidden="true">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="font-bold text-on-surface truncate text-sm">You</h6>
                  <p className="text-[11px] font-bold text-primary/80">Level {user.level}</p>
                </div>
                <div className="font-black text-primary text-sm whitespace-nowrap" aria-label={`${user.xp.toLocaleString()} Experience Points`}>{user.xp.toLocaleString()} XP</div>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-8 border-none shadow-md bg-surface-container-lowest text-center space-y-4">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant mx-auto mb-2" aria-hidden="true">
            <Users size={32} />
          </div>
          <h4 className="text-lg font-bold text-on-surface">No data available</h4>
          <p className="text-sm text-on-surface-variant">Community rankings will appear as more users join EcoPilot.</p>
        </Card>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* SECTION 1 - ACHIEVEMENT HERO */}
      <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-surface-container-low to-surface-container flex flex-col md:flex-row items-center p-8 md:p-12 gap-8 md:gap-12" aria-label="User Level and Experience">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none" aria-hidden="true"></div>
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-2xl shadow-primary/30 text-white border-4 border-surface" aria-hidden="true">
          <Trophy size={64} className="drop-shadow-md" />
          <div className="absolute -bottom-4 bg-surface text-on-surface font-black px-4 py-1.5 rounded-full text-sm shadow-lg border border-outline-variant">
            Lvl {user.level}
          </div>
        </div>
        
        <div className="relative z-10 flex-1 w-full text-center md:text-left">
          <p className="text-sm font-bold tracking-widest text-primary uppercase mb-2">{getRankTitle(user.level)}</p>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight">Your Journey</h1>
            <div className="text-right flex flex-col items-center md:items-end">
              <span className="text-3xl font-black text-on-surface">{user.xp.toLocaleString()} <span className="text-xl text-on-surface-variant font-bold">XP</span></span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold text-on-surface-variant">
              <span>{user.xp.toLocaleString()} XP</span>
              <span>{user.nextLevelXp.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-primary to-emerald-400 h-full rounded-full transition-all duration-1000 relative" style={{ width: `${Math.min(100, (user.xp / user.nextLevelXp) * 100)}%` }}>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs font-bold text-on-surface-variant text-right">
              {(user.nextLevelXp - user.xp).toLocaleString()} XP to Level {user.level + 1}
            </p>
          </div>
        </div>
      </Card>

      {/* SECTION 2 - ACHIEVEMENT SUMMARY CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" aria-label="Achievement Summary">
        <Card className="p-4 md:p-5 flex flex-col justify-center items-center text-center space-y-2 border-none shadow-md hover:shadow-lg transition-shadow bg-surface-container-lowest">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-1" aria-hidden="true">
            <Trophy size={20} />
          </div>
          <p className="text-[10px] md:text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Unlocked</p>
          <p className="text-xl md:text-2xl font-black text-on-surface" aria-live="polite">{unlockedCount > 0 ? unlockedCount : "No data yet"}</p>
        </Card>
        <Card className="p-4 md:p-5 flex flex-col justify-center items-center text-center space-y-2 border-none shadow-md hover:shadow-lg transition-shadow bg-surface-container-lowest">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-1" aria-hidden="true">
            <Flame size={20} />
          </div>
          <p className="text-[10px] md:text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Longest Streak</p>
          <p className="text-xl md:text-2xl font-black text-on-surface" aria-live="polite">{user.streak > 0 ? `${user.streak} Days` : "No data yet"}</p>
        </Card>
        <Card className="p-4 md:p-5 flex flex-col justify-center items-center text-center space-y-2 border-none shadow-md hover:shadow-lg transition-shadow bg-surface-container-lowest">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1" aria-hidden="true">
            <Leaf size={20} />
          </div>
          <p className="text-[10px] md:text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">CO₂ Saved</p>
          <p className="text-xl md:text-2xl font-black text-on-surface" aria-live="polite">{user.totalCarbonSaved > 0 ? `${user.totalCarbonSaved.toFixed(1)} kg` : "No data yet"}</p>
        </Card>
        <Card className="p-4 md:p-5 flex flex-col justify-center items-center text-center space-y-2 border-none shadow-md hover:shadow-lg transition-shadow bg-surface-container-lowest">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-1" aria-hidden="true">
            <Zap size={20} />
          </div>
          <p className="text-[10px] md:text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Total XP</p>
          <p className="text-xl md:text-2xl font-black text-on-surface" aria-live="polite">{user.xp > 0 ? user.xp.toLocaleString() : "No data yet"}</p>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* SECTION 9 - ACHIEVEMENT PROGRESSION */}
          {nextAchievements.length > 0 && (
            <div className="space-y-5" aria-label="Next Achievements">
              <h3 className="text-2xl font-black text-on-surface flex items-center gap-2">
                <Target className="text-primary" size={26} aria-hidden="true" />
                Next Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nextAchievements.map(ach => (
                  <Card key={ach.id} className="p-5 flex flex-col h-full border-none shadow-md bg-surface-container-lowest relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      {getCategoryIcon(ach.category)}
                    </div>
                    <div className="flex-1 mb-4">
                      <h5 className="font-bold text-on-surface text-lg leading-tight mb-1 pr-6">{ach.title}</h5>
                      <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">+{ach.xpReward} XP</span>
                    </div>
                    <div className="space-y-2 mt-auto relative z-10">
                      <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                        <span>{Math.round((ach.progress / ach.total) * 100)}% Complete</span>
                      </div>
                      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${(ach.progress / ach.total) * 100}%` }}></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Leaderboard */}
          <div className="block lg:hidden">
            {renderLeaderboard()}
          </div>

          {/* SECTION 4 - ACHIEVEMENT CATEGORIES */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-on-surface flex items-center gap-2">
              <Medal className="text-primary" size={26} aria-hidden="true" />
              Badge Collection
            </h3>
            
            <nav className="flex overflow-x-auto hide-scrollbar gap-3 pb-4 snap-x" aria-label="Achievement Categories">
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm shrink-0 snap-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    activeCategory === cat 
                      ? "bg-primary text-white scale-105 shadow-primary/30" 
                      : "bg-surface-container-low text-on-surface hover:bg-surface-container-high hover:scale-105"
                  )}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* SECTION 3 - BETTER BADGE SYSTEM & SECTION 5 - EMPTY STATES */}
            <div className="space-y-8 animate-in fade-in duration-300">
              {Object.entries(groupedAchievements).map(([category, achs]) => (
                <div key={category} className="space-y-4 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30">
                  <h4 className="text-xl font-black text-on-surface flex items-center gap-3 border-b border-outline-variant/50 pb-4">
                    <div className="p-2 bg-surface-container rounded-xl" aria-hidden="true">
                      {getCategoryIcon(category)}
                    </div>
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {achs.map(ach => (
                      <Card 
                        key={ach.id} 
                        className={cn(
                          "p-6 relative overflow-hidden transition-all duration-300",
                          ach.unlocked 
                            ? "bg-gradient-to-br from-surface-container-lowest to-surface-container-low border-none shadow-md hover:shadow-lg" 
                            : "bg-surface-container-lowest/50 border border-dashed border-outline-variant/50 opacity-80"
                        )}
                      >
                        {ach.unlocked && <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" aria-hidden="true"></div>}
                        
                        <div className="flex items-start gap-4 mb-4 relative z-10">
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                            ach.unlocked 
                              ? "bg-primary text-white shadow-primary/20" 
                              : "bg-surface-container-high text-on-surface-variant"
                          )} aria-hidden="true">
                            {ach.unlocked ? <CheckCircle2 size={28} /> : <Lock size={24} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-2">
                              <h5 className={cn("font-bold text-lg leading-tight", ach.unlocked ? "text-on-surface" : "text-on-surface-variant")}>
                                {ach.title}
                              </h5>
                              <span className={cn(
                                "text-xs font-black px-2.5 py-1 rounded-full whitespace-nowrap",
                                ach.unlocked ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"
                              )}>
                                +{ach.xpReward} XP
                              </span>
                            </div>
                            {ach.unlocked && <p className="text-xs font-black text-primary mt-1.5 uppercase tracking-wider">Unlocked!</p>}
                          </div>
                        </div>
                        
                        <p className={cn("text-sm mb-6 line-clamp-2", ach.unlocked ? "text-on-surface-variant" : "text-on-surface-variant/70")}>
                          {ach.description}
                        </p>
                        
                        <div className="relative z-10">
                          <div className="flex justify-between text-xs font-bold text-on-surface-variant mb-2">
                            {ach.unlocked ? (
                              <span className="text-primary">Completed</span>
                            ) : (
                              <span>{ach.progress} / {ach.total} remaining</span>
                            )}
                            <span className={ach.unlocked ? "text-primary" : ""}>{Math.round((ach.progress / ach.total) * 100)}%</span>
                          </div>
                          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                            <div className={cn(
                              "h-full rounded-full transition-all duration-500",
                              ach.unlocked ? "bg-primary" : "bg-primary/40"
                            )} style={{ width: `${(ach.progress / ach.total) * 100}%` }}></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedAchievements).length === 0 && (
                <Card className="text-center py-16 border-none shadow-md bg-surface-container-lowest flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant mb-2" aria-hidden="true">
                    <Medal size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-on-surface">No achievements available yet</h4>
                  <p className="text-on-surface-variant max-w-sm">Complete more eco actions to unlock achievements in this category.</p>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          
          {/* SECTION 6 - LEADERBOARD REWORK */}
          <div className="hidden lg:block">
            {renderLeaderboard()}
          </div>

          {/* SECTION 7 - COMMUNITY IMPACT REWORK */}
          <section className="space-y-5" aria-label="Community Impact">
            <h3 className="text-2xl font-black text-on-surface flex items-center gap-2">
              <Users className="text-primary" size={26} aria-hidden="true" />
              Community Impact
            </h3>
            
            {communityStats ? (
              <Card className="p-6 border-none shadow-md bg-surface-container-lowest">
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed font-medium">
                  Together, the EcoPilot community is making a measurable difference globally.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="bg-primary/10 p-3 sm:p-5 rounded-2xl text-center shadow-inner">
                    <div className="text-2xl font-black text-primary mb-1">
                      {communityStats.totalCarbonSaved.toFixed(0)} <span className="text-sm">kg</span>
                    </div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total CO₂ Saved</p>
                  </div>
                  <div className="bg-surface-container-low p-3 sm:p-5 rounded-2xl text-center shadow-inner border border-outline-variant/30">
                    <div className="text-2xl font-black text-on-surface mb-1">
                      {communityStats.totalActions.toLocaleString()}
                    </div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Eco Actions</p>
                  </div>
                  <div className="bg-surface-container-low p-3 sm:p-5 rounded-2xl text-center shadow-inner border border-outline-variant/30">
                    <div className="text-2xl font-black text-on-surface mb-1">
                      {communityStats.activeUsers.toLocaleString()}
                    </div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Users</p>
                  </div>
                  <div className="bg-surface-container-low p-3 sm:p-5 rounded-2xl text-center shadow-inner border border-outline-variant/30">
                    <div className="text-2xl font-black text-on-surface mb-1">
                      {communityStats.totalXp > 1000 ? `${(communityStats.totalXp / 1000).toFixed(1)}k` : communityStats.totalXp}
                    </div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total XP Earned</p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 border-none shadow-md bg-surface-container-lowest text-center space-y-4">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant mx-auto mb-2" aria-hidden="true">
                  <Leaf size={32} />
                </div>
                <h4 className="text-lg font-bold text-on-surface">Awaiting Impact Data</h4>
                <p className="text-sm text-on-surface-variant">Community statistics will appear once more data is available.</p>
              </Card>
            )}
          </section>
          
        </div>
      </div>
    </div>
  );
}
