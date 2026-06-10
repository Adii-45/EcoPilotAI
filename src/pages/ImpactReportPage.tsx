import { useEffect, useState } from 'react';
import { useStore } from '../store/store';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, TreePine, Flame, Star, Share } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateWeeklySummary } from '../services/gemini';
import { getReport, saveReport } from '../services/db';

export default function ImpactReportPage() {
  const user = useStore((state) => state.user!);
  const activities = useStore((state) => state.activities);
  const [summary, setSummary] = useState<string>("Analyzing your weekly activity...");

  useEffect(() => {
    const fetchSummary = async () => {
      // Use current week start (Monday) as key
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
  }, [user.id, user.level, user.totalActions, user.totalCarbonSaved, user.streak]); // Re-run if key stats change significantly or just on mount

  const generateChartData = () => {
    const history = user?.history || [];
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const weeklyData = last7Days.map((dateStr, i) => {
      const entry = history.find(h => h.date === dateStr);
      const dayLabel = i === 6 ? 'Today' : `Day ${i + 1}`;
      return { day: dayLabel, actions: entry ? entry.actions : 0 };
    });

    const consistencyData = last7Days.map((dateStr, i) => {
      const entry = history.find(h => h.date === dateStr);
      const dayLabel = i === 6 ? 'Today' : `Day ${i + 1}`;
      return { day: dayLabel, score: entry ? entry.score : (user?.sustainabilityScore || 0) };
    });

    return { weeklyData, consistencyData };
  };

  const { weeklyData, consistencyData } = generateChartData();

  const handleShareReport = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 print:max-w-none print:m-0 print:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Impact Report</h1>
          <p className="text-on-surface-variant">Your Sustainability Journey</p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0 print:hidden" onClick={handleShareReport}>
          <Share size={18} />
          Share Report
        </Button>
      </div>

      <Card className="bg-primary-container/30 border-none relative overflow-hidden print:break-inside-avoid">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="p-8 flex items-start gap-6 relative z-10">
          <div className="bg-surface-container-lowest p-3 rounded-2xl shrink-0 shadow-sm print:border">
            <Sparkles className="text-primary" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-on-surface">AI Sustainability Summary</h2>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-primary text-white px-2 py-0.5 rounded-full print:border print:border-primary print:text-primary print:bg-transparent">Powered by AI</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      </Card>

      <div className="print:break-inside-avoid">
        <h2 className="text-xl font-bold text-on-surface mb-4">Hall of Fame</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary mb-4 print:border">
              <TrendingUp size={20} />
            </div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Total Actions</p>
            <h3 className="text-xl font-bold text-on-surface">{user.totalActions}</h3>
          </Card>
          <Card className="p-6">
            <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary mb-4 print:border">
              <TreePine size={20} />
            </div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Total Carbon Saved</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-xl font-bold text-on-surface">{user.totalCarbonSaved.toFixed(1)}</h3>
              <span className="text-sm font-medium text-on-surface-variant">kg</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="bg-error/10 w-10 h-10 rounded-xl flex items-center justify-center text-error mb-4 print:border">
              <Flame size={20} />
            </div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Longest Streak</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-xl font-bold text-on-surface">{user.streak}</h3>
              <span className="text-sm font-medium text-on-surface-variant">days</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="bg-primary-container w-10 h-10 rounded-xl flex items-center justify-center text-on-primary-container mb-4 print:border">
              <Star size={20} />
            </div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Total XP Earned</p>
            <h3 className="text-xl font-bold text-on-surface">{user.xp.toLocaleString()}</h3>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block">
        <Card className="p-6 flex flex-col h-[350px] print:mb-6 print:break-inside-avoid">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Weekly Activity</h3>
              <p className="text-sm text-on-surface-variant">Your eco-actions over the last 7 days.</p>
            </div>
          </div>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006c49" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#006c49" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e3df" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#006c49', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="actions" stroke="#006c49" strokeWidth={3} fillOpacity={1} fill="url(#colorActions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-[350px] print:break-inside-avoid">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Consistency Score</h3>
              <p className="text-sm text-on-surface-variant">Sustainability score over time.</p>
            </div>
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1 print:border">
              <TrendingUp size={12} />
              {user.sustainabilityScore}
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consistencyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e3df" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#006c49', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#006c49" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }} 
                  activeDot={{ r: 6, fill: '#006c49', stroke: 'white', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
