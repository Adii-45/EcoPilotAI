import { useStore } from '../store/store';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, TreePine, Flame, Star, Share } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const weeklyData = [
  { day: 'Mon', actions: 2 },
  { day: 'Tue', actions: 4 },
  { day: 'Wed', actions: 3 },
  { day: 'Thu', actions: 6 },
  { day: 'Fri', actions: 5 },
  { day: 'Sat', actions: 8 },
  { day: 'Sun', actions: 7 },
];

const consistencyData = [
  { day: 'Mon', score: 60 },
  { day: 'Tue', score: 65 },
  { day: 'Wed', score: 62 },
  { day: 'Thu', score: 75 },
  { day: 'Fri', score: 85 },
  { day: 'Sat', score: 82 },
  { day: 'Sun', score: 90 },
];

export default function ImpactReportPage() {
  const user = useStore((state) => state.user);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Impact Report</h1>
          <p className="text-on-surface-variant">Oct 21 - Oct 27</p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0">
          <Share size={18} />
          Share Report
        </Button>
      </div>

      <Card className="bg-primary-container/30 border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="p-8 flex items-start gap-6 relative z-10">
          <div className="bg-white p-3 rounded-2xl shrink-0 shadow-sm">
            <Sparkles className="text-primary" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-on-surface">AI Sustainability Summary</h2>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-primary text-white px-2 py-0.5 rounded-full">Powered by AI</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              This week you completed {user.totalActions} eco-actions and improved your sustainability score by 12%. Your dedication to reducing single-use plastics has made the biggest impact. Keep up the great momentum!
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-on-surface mb-4">Hall of Fame</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary mb-4">
              <TrendingUp size={20} />
            </div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Most Improved Habit</p>
            <h3 className="text-xl font-bold text-on-surface">Transit</h3>
          </Card>
          <Card className="p-6">
            <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary mb-4">
              <TreePine size={20} />
            </div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Biggest Carbon Saver</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-xl font-bold text-on-surface">15</h3>
              <span className="text-sm font-medium text-on-surface-variant">kg</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="bg-error/10 w-10 h-10 rounded-xl flex items-center justify-center text-error mb-4">
              <Flame size={20} />
            </div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Longest Streak</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-xl font-bold text-on-surface">{user.streak}</h3>
              <span className="text-sm font-medium text-on-surface-variant">days</span>
            </div>
          </Card>
          <Card className="p-6">
            <div className="bg-primary-container w-10 h-10 rounded-xl flex items-center justify-center text-on-primary-container mb-4">
              <Star size={20} />
            </div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Total XP Earned</p>
            <h3 className="text-xl font-bold text-on-surface">{user.xp.toLocaleString()}</h3>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Weekly Activity</h3>
              <p className="text-sm text-on-surface-variant">You're building solid momentum towards the weekend.</p>
            </div>
            <span className="text-xs font-medium bg-surface-container px-2 py-1 rounded-md text-on-surface-variant">Oct 21-27</span>
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

        <Card className="p-6 flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Consistency Score</h3>
              <p className="text-sm text-on-surface-variant">Trending up! You've stayed above baseline for 4 days.</p>
            </div>
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1">
              <TrendingUp size={12} />
              +5%
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consistencyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e3df" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737571' }} domain={['dataMin - 10', 'dataMax + 10']} />
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
