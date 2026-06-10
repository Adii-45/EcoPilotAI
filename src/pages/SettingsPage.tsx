import { useState } from 'react';
import { useStore } from '../store/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Save, Bell, LineChart, Bot, Edit2, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Sustainability Passport</h1>
          <p className="text-on-surface-variant">Your eco-journey, account details, and preferences.</p>
        </div>
        <Button className="gap-2 shrink-0">
          <Save size={18} />
          Save Changes
        </Button>
      </div>

      {/* Lifetime Stats Banner */}
      <Card className="p-6 bg-surface-container border-none shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Lifetime Carbon Saved</p>
            <p className="text-xl font-bold text-primary">{user.totalCarbonSaved.toLocaleString()} kg</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Total Eco Actions</p>
            <p className="text-xl font-bold text-primary">{user.totalActions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Achievements Earned</p>
            <p className="text-xl font-bold text-primary">{user.achievementsEarned}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Longest Streak</p>
            <p className="text-xl font-bold text-primary">{user.streak} Days</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Current Rank</p>
            <p className="text-xl font-bold text-primary flex items-center gap-2">
              <Bell size={16} /> Eco Guardian
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {[
            { id: 'profile', label: 'User Profile' },
            { id: 'preferences', label: 'Preferences' },
            { id: 'ai', label: 'AI Coaching Settings' },
            { id: 'data', label: 'Data Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-on-surface hover:bg-surface-container"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* User Profile */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-4">User Profile</h3>
            
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden border-4 border-white shadow-md">
                  <img src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=006c49&color=fff&size=200`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-on-surface border border-outline-variant hover:bg-surface-container transition-colors">
                  <Edit2 size={14} />
                </button>
              </div>
              
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">Favorite Sustainable Habit</label>
                  <input 
                    type="text" 
                    defaultValue="Biking to work twice a week"
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                
                <div className="bg-surface-container p-4 rounded-xl flex items-center justify-between border border-outline-variant mt-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1">Sustainability Score (30 Days)</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-primary">{user.sustainabilityScore}</span>
                      <span className="text-sm font-medium text-on-surface-variant">/ 100</span>
                    </div>
                  </div>
                  <LineChart className="text-primary w-16 h-8 opacity-50" />
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-4">Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-on-surface mb-1">Daily Reminders</h4>
                  <p className="text-sm text-on-surface-variant">Receive a quick morning nudge to stay on track with your daily eco-goals.</p>
                </div>
                <div className="relative inline-block w-12 h-6 mt-1">
                  <input type="checkbox" className="peer sr-only" id="daily-reminders" defaultChecked />
                  <label htmlFor="daily-reminders" className="block w-12 h-6 bg-surface-container-high rounded-full cursor-pointer peer-checked:bg-primary transition-colors before:content-[''] before:absolute before:top-1 before:left-1 before:bg-white before:w-4 before:h-4 before:rounded-full before:transition-transform peer-checked:before:translate-x-6"></label>
                </div>
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-on-surface mb-1">Weekly Impact Reports</h4>
                  <p className="text-sm text-on-surface-variant">Celebrate your wins! Get a comprehensive email summary of your carbon savings every Sunday.</p>
                </div>
                <div className="relative inline-block w-12 h-6 mt-1">
                  <input type="checkbox" className="peer sr-only" id="weekly-reports" defaultChecked />
                  <label htmlFor="weekly-reports" className="block w-12 h-6 bg-surface-container-high rounded-full cursor-pointer peer-checked:bg-primary transition-colors before:content-[''] before:absolute before:top-1 before:left-1 before:bg-white before:w-4 before:h-4 before:rounded-full before:transition-transform peer-checked:before:translate-x-6"></label>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Coaching Profile */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-4 flex justify-between items-center">
              AI Coaching Profile
              <Bot className="text-primary" size={20} />
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="font-bold text-on-surface mb-1">Coaching Intensity</h4>
                  <p className="text-sm text-on-surface-variant">Adjust how the AI challenges and encourages you to build new habits.</p>
                </div>
                <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">Balanced</span>
              </div>
              
              <div className="py-4">
                <input 
                  type="range" 
                  min="0" max="100" defaultValue="50" step="50"
                  className="w-full accent-primary h-2 bg-surface-container rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase mt-2">
                  <span className="text-left w-20">Supportive<br/><span className="normal-case font-medium opacity-70">(Gentle Nudges)</span></span>
                  <span className="text-center w-20 text-primary">Balanced<br/><span className="normal-case font-medium opacity-70">(Standard)</span></span>
                  <span className="text-right w-20">Challenging<br/><span className="normal-case font-medium opacity-70">(Aggressive Goals)</span></span>
                </div>
              </div>
            </div>
          </Card>

          {/* Data & Methodology */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-4">Data & Methodology</h3>
            
            <div className="space-y-4">
              <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">Carbon Calculation Methodology</p>
              <p className="text-sm text-on-surface-variant mb-4">Select the baseline standard used to calculate your emission savings.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 border-primary bg-primary/5 rounded-xl p-4 cursor-pointer relative">
                  <div className="absolute top-4 right-4 text-primary">
                    <CheckCircle2 size={20} />
                  </div>
                  <h4 className="font-bold text-on-surface mb-2 pr-8">EPA Standard (US)</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Recommended for North American users. Based on standard EPA emission factors.</p>
                </div>
                
                <div className="border-2 border-transparent bg-surface hover:bg-surface-container border-outline-variant rounded-xl p-4 cursor-pointer transition-colors">
                  <h4 className="font-bold text-on-surface mb-2">DEFRA Standard (UK/EU)</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Recommended for European users. Based on UK government conversion factors.</p>
                </div>
              </div>
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
