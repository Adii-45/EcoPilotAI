import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/store';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, TreePine, Flame, Star, Share, Zap, Trophy, Target, Download, ChevronRight, Activity, Leaf, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateWeeklySummary } from '../services/gemini';
import { getReport, saveReport } from '../services/db';
import { Link } from 'react-router-dom';

export default function ImpactReportPage() {
  const user = useStore((state) => state.user!);
  const activities = useStore((state) => state.activities);
  const habits = useStore((state) => state.habits);
  const dailyChallenges = useStore((state) => state.dailyChallenges);
  const [summary, setSummary] = useState<string>("Analyzing your sustainability data...");
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('7d');

  // Single Source of Truth for Today's Actions & Sanitize Past Actions
  const syncedHistory = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Build true net actions per day from the activities ledger to fix past toggle-spam bugs
    const trueActionsPerDay = activities
      .filter(a => a.type === 'habit_completed')
      .reduce((acc, a) => {
        const dateStr = new Date(a.timestamp).toISOString().split('T')[0];
        const change = a.metadata?.uncompleted ? -1 : 1;
        acc[dateStr] = (acc[dateStr] || 0) + change;
        return acc;
      }, {} as Record<string, number>);

    const history = [...(user?.history || [])].map(entry => {
      // Sanitize past days with the true ledger count
      if (entry.date !== todayStr && trueActionsPerDay[entry.date] !== undefined) {
        return { ...entry, actions: Math.max(0, trueActionsPerDay[entry.date]) };
      }
      return entry;
    });

    const todayIndex = history.findIndex(h => h.date === todayStr);
    const todaysActionsCount = habits.filter(h => h.completedToday).length + dailyChallenges.filter(h => h.completedToday).length;
    
    if (todayIndex >= 0) {
      history[todayIndex] = { ...history[todayIndex], actions: todaysActionsCount };
    } else if (todaysActionsCount > 0) {
      history.push({ date: todayStr, score: user?.sustainabilityScore || 0, actions: todaysActionsCount });
    }
    return history;
  }, [user?.history, habits, dailyChallenges, user?.sustainabilityScore, activities]);

  useEffect(() => {
    const fetchSummary = async () => {
      const d = new Date();
      const day = d.getDay() || 7; 
      d.setHours(-24 * (day - 1)); 
      const weekKey = d.toISOString().split('T')[0];

      const existing = await getReport(user.id, weekKey);
      if (existing) {
        setSummary(existing);
      } else {
        const generated = await generateWeeklySummary(user, activities.slice(0, 50));
        setSummary(generated);
        await saveReport(user.id, weekKey, generated);
      }
    };
    if (user.id) fetchSummary();
  }, [user.id, user.level, user.totalActions, user.totalCarbonSaved, user.streak]);

  // Derived metrics for Highlights
  const highlights = useMemo(() => {
    if (!activities || activities.length === 0) return null;
    
    // Most completed habit (Net count)
    const habitCounts = activities
      .filter(a => a.type === 'habit_completed')
      .reduce((acc, curr) => {
        const title = curr.metadata?.title || 'Unknown';
        const change = curr.metadata?.uncompleted ? -1 : 1;
        acc[title] = Math.max(0, (acc[title] || 0) + change);
        return acc;
      }, {} as Record<string, number>);
      
    const mostCompletedEntry = Object.entries(habitCounts).sort((a, b) => b[1] - a[1])[0];
    
    // Biggest carbon saving activity
    const biggestCarbon = activities.reduce((max, curr) => curr.carbonSaved > max.carbonSaved ? curr : max, activities[0]);
    
    // Highest XP activity
    const highestXp = activities.reduce((max, curr) => curr.pointsEarned > max.pointsEarned ? curr : max, activities[0]);

    if (!mostCompletedEntry && biggestCarbon.carbonSaved === 0 && highestXp.pointsEarned === 0) return null;

    return {
      mostCompleted: mostCompletedEntry ? { title: mostCompletedEntry[0], count: mostCompletedEntry[1] } : null,
      biggestCarbon: biggestCarbon.carbonSaved > 0 ? biggestCarbon : null,
      highestXp: highestXp.pointsEarned > 0 ? highestXp : null
    };
  }, [activities]);

  const kpiMetrics = useMemo(() => {
    if (timeFilter === 'all') {
      return {
        actions: user.totalActions,
        carbon: user.totalCarbonSaved,
        streak: Math.max(user.longestStreak || 0, user.streak),
        xp: user.xp,
      };
    }

    const days = timeFilter === '7d' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);
    
    // Actions and Streak from history
    const recentHistory = syncedHistory.filter(h => new Date(h.date) >= cutoffDate);
    const periodActions = recentHistory.reduce((sum, h) => sum + h.actions, 0);
    
    let maxStreak = 0;
    let currentStreak = 0;
    let prevDate: Date | null = null;
    
    const sortedHistory = [...recentHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (const h of sortedHistory) {
      if (h.actions > 0) {
        if (!prevDate) {
          currentStreak = 1;
        } else {
          const currDateObj = new Date(h.date);
          const diffDays = Math.round((currDateObj.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            currentStreak += 1;
          } else if (diffDays > 1) {
            currentStreak = 1;
          }
        }
        maxStreak = Math.max(maxStreak, currentStreak);
        prevDate = new Date(h.date);
      }
    }

    // Carbon and XP from activities
    const recentActivities = activities.filter(a => new Date(a.timestamp) >= cutoffDate);
    const periodCarbon = recentActivities.reduce((sum, a) => sum + (a.carbonSaved || 0), 0);
    const periodXp = recentActivities.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);

    return {
      actions: periodActions,
      carbon: periodCarbon,
      streak: maxStreak,
      xp: periodXp,
    };
  }, [user, activities, timeFilter, syncedHistory]);

  const generateChartData = () => {
    const history = syncedHistory;
    
    let daysToInclude = 7;
    if (timeFilter === '30d') daysToInclude = 30;
    if (timeFilter === 'all') {
      daysToInclude = history.length > 0 
        ? Math.max(7, Math.ceil((new Date().getTime() - new Date(history[0].date).getTime()) / (1000 * 3600 * 24)) + 1)
        : 7;
    }

    const dateRange = Array.from({ length: daysToInclude }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (daysToInclude - 1 - i));
      return d.toISOString().split('T')[0];
    });

    const weeklyData = dateRange.map((dateStr, i) => {
      const entry = history.find(h => h.date === dateStr);
      let dayLabel = `Day ${i + 1}`;
      if (timeFilter === '7d') dayLabel = i === 6 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(dateStr).getDay()];
      if (timeFilter === '30d') dayLabel = i % 5 === 0 || i === 29 ? `${new Date(dateStr).getDate()}/${new Date(dateStr).getMonth() + 1}` : '';
      if (timeFilter === 'all') dayLabel = i % Math.ceil(daysToInclude/6) === 0 ? `${new Date(dateStr).getDate()}/${new Date(dateStr).getMonth() + 1}` : '';
      
      return { day: dayLabel, fullDate: dateStr, actions: entry ? entry.actions : 0 };
    });

    const consistencyData = dateRange.map((dateStr, i) => {
      const entry = history.find(h => h.date === dateStr);
      let dayLabel = `Day ${i + 1}`;
      if (timeFilter === '7d') dayLabel = i === 6 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(dateStr).getDay()];
      if (timeFilter === '30d') dayLabel = i % 5 === 0 || i === 29 ? `${new Date(dateStr).getDate()}/${new Date(dateStr).getMonth() + 1}` : '';
      if (timeFilter === 'all') dayLabel = i % Math.ceil(daysToInclude/6) === 0 ? `${new Date(dateStr).getDate()}/${new Date(dateStr).getMonth() + 1}` : '';
      
      return { day: dayLabel, fullDate: dateStr, score: entry ? entry.score : (user?.sustainabilityScore || 0) };
    });

    return { chartData: weeklyData, consistencyData };
  };

  const { chartData, consistencyData } = generateChartData();

  const handleShareReport = () => {
    window.print();
  };

  const trendIsPositive = (user.history?.[user.history.length - 1]?.score || 0) >= (user.history?.[Math.max(0, user.history.length - 2)]?.score || 0);
    const emptyHistory = !syncedHistory || syncedHistory.length === 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 print:max-w-none print:m-0 print:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Impact Report</h1>
          <p className="text-on-surface-variant">Your Sustainability Journey</p>
        </div>
        <div className="flex bg-surface-container-low rounded-lg p-1 print:hidden">
          {(['7d', '30d', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeFilter === filter 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {filter === '7d' ? 'Last 7 Days' : filter === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-primary-container/40 to-surface border-primary/10 relative overflow-hidden print:break-inside-avoid">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="p-8 flex flex-col md:flex-row gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/20 p-2 rounded-xl shrink-0">
                <Sparkles className="text-primary" size={24} />
              </div>
              <h2 className="text-xl font-bold text-on-surface">AI Sustainability Summary</h2>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 print:border print:border-primary print:text-primary print:bg-transparent">Insight</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed mb-6 text-lg">
              "{summary}"
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-outline-variant text-sm font-medium text-on-surface shadow-sm">
                {trendIsPositive ? <TrendingUp size={16} className="text-primary" /> : <TrendingUp size={16} className="text-error rotate-180" />}
                {trendIsPositive ? "Upward Trend" : "Needs Focus"}
              </div>
              {user.totalCarbonSaved > 10 && (
                <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-outline-variant text-sm font-medium text-on-surface shadow-sm">
                  <TreePine size={16} className="text-primary" />
                  Eco-Champion Badge
                </div>
              )}
              {user.achievementsEarned > 0 && (
                <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-outline-variant text-sm font-medium text-on-surface shadow-sm">
                  <Trophy size={16} className="text-tertiary" />
                  {user.achievementsEarned} Achievements
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 print:break-inside-avoid">
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold text-on-surface mb-4">Impact Metrics</h2>
          <div className="grid grid-cols-2 gap-4 h-[calc(100%-2.5rem)]">
            <Card className="p-4 sm:p-5 flex flex-col justify-between hover:bg-surface-container-low transition-colors group cursor-default">
              <div className="mb-2">
                <div className="bg-green-500/10 text-green-600 dark:text-green-400 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Activity size={20} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-on-surface-variant">Total Actions</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-on-surface mb-0.5">{kpiMetrics.actions}</h3>
                <p className="text-[10px] sm:text-xs text-on-surface-variant/80">Completed actions</p>
              </div>
            </Card>
            <Card className="p-4 sm:p-5 flex flex-col justify-between hover:bg-surface-container-low transition-colors group cursor-default">
              <div className="mb-2">
                <div className="bg-teal-500/10 text-teal-600 dark:text-teal-400 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <TreePine size={20} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-on-surface-variant">Carbon Saved</p>
              </div>
              <div>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <h3 className="text-2xl sm:text-3xl font-bold text-on-surface">{kpiMetrics.carbon.toFixed(1)}</h3>
                  <span className="text-xs sm:text-sm font-bold text-on-surface-variant">kg</span>
                </div>
                <p className="text-[10px] sm:text-xs text-on-surface-variant/80">Total prevented</p>
              </div>
            </Card>
            <Card className="p-4 sm:p-5 flex flex-col justify-between hover:bg-surface-container-low transition-colors group cursor-default">
              <div className="mb-2">
                <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Flame size={20} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-on-surface-variant">Longest Streak</p>
              </div>
              <div>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <h3 className="text-2xl sm:text-3xl font-bold text-on-surface">{kpiMetrics.streak}</h3>
                  <span className="text-xs sm:text-sm font-bold text-on-surface-variant">days</span>
                </div>
                <p className="text-[10px] sm:text-xs text-on-surface-variant/80">{timeFilter === 'all' ? 'Current best streak' : 'Best in period'}</p>
              </div>
            </Card>
            <Card className="p-4 sm:p-5 flex flex-col justify-between hover:bg-surface-container-low transition-colors group cursor-default">
              <div className="mb-2">
                <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <Star size={20} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-on-surface-variant">Total XP</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-on-surface mb-0.5">{kpiMetrics.xp.toLocaleString()}</h3>
                <p className="text-[10px] sm:text-xs text-on-surface-variant/80">{timeFilter === 'all' ? 'Lifetime earned' : 'Earned in period'}</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-on-surface mb-4">Next Goal</h2>
          <Card className="p-6 h-[calc(100%-2.5rem)] flex flex-col relative overflow-hidden bg-surface-container-lowest justify-between">
            <div className="absolute -right-4 -top-4 text-on-surface opacity-[0.03] dark:text-teal-500 dark:opacity-10 pointer-events-none z-0">
              <Target size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Target size={20} />
                  </div>
                  <h3 className="font-bold text-on-surface text-lg">Level {user.level + 1}</h3>
                </div>
                {user.xp >= user.nextLevelXp && (
                   <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary px-2.5 py-1 rounded-md shadow-sm">Achieved</span>
                )}
              </div>
              <p className="text-sm text-on-surface-variant mt-3 mb-2">Complete actions and log sustainability milestones to progress.</p>
            </div>
            
            <div className="relative z-10 mt-auto pt-4">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-medium items-end">
                  <span className="text-on-surface-variant">Progress</span>
                  <span className="text-primary font-bold text-lg">
                    {Math.min(user.xp, user.nextLevelXp)} <span className="text-sm text-on-surface-variant font-medium">/ {user.nextLevelXp} XP</span>
                  </span>
                </div>
                <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, (user.xp / user.nextLevelXp) * 100))}%` }}
                  />
                </div>
              </div>
              
              <div className={`rounded-xl p-4 border ${user.xp >= user.nextLevelXp ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface border-outline-variant text-on-surface-variant'}`}>
                <p className="text-sm flex items-center justify-between font-medium">
                  {user.xp >= user.nextLevelXp ? (
                    <span className="w-full text-center">Goal Reached! Ready to level up.</span>
                  ) : (
                    <>
                      <span>XP to Next Level:</span>
                      <span className="text-primary font-bold">{user.nextLevelXp - user.xp} remaining</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block">
        <Card className="p-6 flex flex-col h-[380px] print:mb-6 print:break-inside-avoid">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Activity Trends</h3>
              <p className="text-sm text-on-surface-variant">Your eco-actions over time.</p>
            </div>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            {emptyHistory ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant bg-surface-container-lowest/50 rounded-xl border border-dashed border-outline-variant">
                <Activity size={32} className="mb-3 text-outline" />
                <p className="font-medium text-on-surface">No activity recorded yet</p>
                <p className="text-sm mt-1">Complete your first habit to generate insights.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006c49" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#006c49" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e3df" opacity={0.5} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} dy={10} minTickGap={20} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#006c49', strokeWidth: 1, strokeDasharray: '4 4' }}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate ? new Date(payload[0].payload.fullDate).toLocaleDateString() : label}
                  />
                  <Area type="monotoneX" dataKey="actions" stroke="#006c49" strokeWidth={3} fillOpacity={1} fill="url(#colorActions)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-[380px] print:break-inside-avoid">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Consistency Score</h3>
              <p className="text-sm text-on-surface-variant">Sustainability score stability.</p>
            </div>
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1 print:border">
              <TrendingUp size={12} />
              {user.sustainabilityScore}
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full relative">
            {emptyHistory ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant bg-surface-container-lowest/50 rounded-xl border border-dashed border-outline-variant">
                <TrendingUp size={32} className="mb-3 text-outline" />
                <p className="font-medium text-on-surface">No trend data available</p>
                <p className="text-sm mt-1">Consistency score builds over consecutive days.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consistencyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e3df" opacity={0.5} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} dy={10} minTickGap={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#006c49', strokeWidth: 1, strokeDasharray: '4 4' }}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate ? new Date(payload[0].payload.fullDate).toLocaleDateString() : label}
                  />
                  <Line 
                    type="monotoneX" 
                    dataKey="score" 
                    stroke="#006c49" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#006c49', stroke: 'white', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-on-surface mb-4">Impact Highlights</h2>
        {!highlights ? (
           <Card className="p-8 text-center text-on-surface-variant flex flex-col items-center justify-center border-dashed border-outline-variant">
             <Leaf size={40} className="mb-4 text-outline" />
             <p className="font-medium text-on-surface mb-1">Highlights are being prepared</p>
             <p className="text-sm">Complete more actions to see your top impact areas highlighted here.</p>
           </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 flex items-start gap-4 hover:bg-surface-container-low transition-colors group cursor-default">
              <div className="bg-primary/10 p-3 rounded-full text-primary group-hover:scale-110 transition-transform">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Most Completed Habit</p>
                <p className="font-bold text-on-surface leading-tight mb-1">{highlights.mostCompleted?.title || 'None yet'}</p>
                <p className="text-xs text-on-surface-variant">{highlights.mostCompleted?.count || 0} completions</p>
              </div>
            </Card>
            <Card className="p-5 flex items-start gap-4 hover:bg-surface-container-low transition-colors group cursor-default">
              <div className="bg-primary/10 p-3 rounded-full text-primary group-hover:scale-110 transition-transform">
                <TreePine size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Top Carbon Saver</p>
                <p className="font-bold text-on-surface leading-tight mb-1">{highlights.biggestCarbon?.metadata?.title || 'None yet'}</p>
                <p className="text-xs text-on-surface-variant">Saved {highlights.biggestCarbon?.carbonSaved.toFixed(1) || 0} kg</p>
              </div>
            </Card>
            <Card className="p-5 flex items-start gap-4 hover:bg-surface-container-low transition-colors group cursor-default">
              <div className="bg-tertiary-container text-on-tertiary-container p-3 rounded-full group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Highest XP Activity</p>
                <p className="font-bold text-on-surface leading-tight mb-1">{highlights.highestXp?.metadata?.title || 'None yet'}</p>
                <p className="text-xs text-on-surface-variant">Earned {highlights.highestXp?.pointsEarned || 0} XP</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="print:hidden">
        <h2 className="text-xl font-bold text-on-surface mb-4">Report Actions</h2>
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleShareReport} className="flex-1 gap-2 h-12 text-base">
              <Share size={18} />
              Share Report
            </Button>
            <Button variant="outline" onClick={handleShareReport} className="flex-1 gap-2 h-12 text-base">
              <Download size={18} />
              Download Summary
            </Button>
            <Link to="/achievements" className="flex-1">
              <Button variant="secondary" className="w-full gap-2 h-12 text-base">
                View Achievements
                <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
