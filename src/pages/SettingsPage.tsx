import { useState, useRef } from 'react';
import { useStore } from '../store/store';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Save, Bell, LineChart, Bot, Edit2, CheckCircle2, Loader2, Moon } from 'lucide-react';
import { uploadProfileImage } from '../services/cloudinary';

export default function SettingsPage() {
  const user = useStore((state) => state.user!);
  const settings = useStore((state) => state.settings);
  const updateUser = useStore((state) => state.updateUser);
  const updateSettings = useStore((state) => state.updateSettings);
  
  const { theme, toggleTheme } = useTheme();
  
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [remindersEnabled, setRemindersEnabled] = useState(settings.remindersEnabled);
  const [coachingIntensity, setCoachingIntensity] = useState(
    settings.coachingIntensity === 'Gentle' ? "0" : settings.coachingIntensity === 'Standard' ? "50" : "100"
  );
  
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error'|'success'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'error'|'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File is too large. Maximum size is 5MB.', 'error');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Invalid file format. Please upload JPG, PNG, or WEBP.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadProfileImage(file);
      await updateUser({ photoURL: url });
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast('Profile picture updated successfully!', 'success');
    } catch {
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateUser({ name, email });
    const intensity = coachingIntensity === "0" ? 'Gentle' : coachingIntensity === "50" ? 'Standard' : 'Strict';
    updateSettings({
      remindersEnabled,
      coachingIntensity: intensity
    });
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white z-50 transition-opacity ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`} role="alert" aria-live="assertive">
          {toast.message}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Sustainability Passport</h1>
          <p className="text-on-surface-variant">Your eco-journey, account details, and preferences.</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={handleSave} aria-label="Save Settings">
          <Save size={18} aria-hidden="true" />
          Save Changes
        </Button>
      </div>

      {/* Lifetime Stats Banner */}
      <section aria-label="Lifetime Statistics">
        <Card className="p-6 bg-surface-container border-none shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-8">
            <div>
              <h2 className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1 m-0 p-0">Lifetime Carbon Saved</h2>
              <p className="text-xl font-bold text-primary">{user.totalCarbonSaved.toLocaleString()} kg</p>
            </div>
            <div>
              <h2 className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1 m-0 p-0">Total Eco Actions</h2>
              <p className="text-xl font-bold text-primary">{user.totalActions.toLocaleString()}</p>
            </div>
            <div>
              <h2 className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1 m-0 p-0">Achievements Earned</h2>
              <p className="text-xl font-bold text-primary">{user.achievementsEarned}</p>
            </div>
            <div>
              <h2 className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1 m-0 p-0">Longest Streak</h2>
              <p className="text-xl font-bold text-primary">{user.streak} Days</p>
            </div>
            <div>
              <h2 className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1 m-0 p-0">Current Rank</h2>
              <p className="text-xl font-bold text-primary flex items-center gap-2">
                <Bell size={16} aria-hidden="true" /> Eco Guardian
              </p>
            </div>
          </div>
        </Card>
      </section>

      <div className="space-y-8">
          {/* User Profile */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-4">User Profile</h3>
            
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="relative group flex flex-col items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  id="profile-picture-upload"
                  aria-label="Upload profile picture"
                />
                <div 
                  className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden border-4 border-surface-container-highest shadow-md relative cursor-pointer group-hover:opacity-90 transition-opacity"
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  aria-hidden="true"
                >
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                      <Loader2 className="text-white animate-spin" size={24} />
                    </div>
                  )}
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=006c49&color=fff&size=200`} 
                    alt={`${user.name}'s profile picture`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  disabled={isUploading}
                  aria-label="Edit Profile Picture"
                  className="absolute top-16 right-[-8px] p-2 bg-surface-container-lowest rounded-full shadow-md text-on-surface border border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-50 z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Edit2 size={14} aria-hidden="true" />
                </button>
              </div>
              
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="user-name" className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">Full Name</label>
                    <input 
                      id="user-name"
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="user-email" className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">Email Address</label>
                    <input 
                      id="user-email"
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="user-habit" className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">Favorite Sustainable Habit</label>
                  <input 
                    id="user-habit"
                    type="text" 
                    defaultValue="Biking to work twice a week"
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                
                <div className="bg-surface-container p-4 rounded-xl flex items-center justify-between border border-outline-variant mt-6">
                  <div>
                    <h4 className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase mb-1 m-0 p-0">Sustainability Score (30 Days)</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-primary">{user.sustainabilityScore}</span>
                      <span className="text-sm font-medium text-on-surface-variant">/ 100</span>
                    </div>
                  </div>
                  <LineChart className="text-primary w-16 h-8 opacity-50" aria-hidden="true" />
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
                  <h4 className="font-bold text-on-surface mb-1 flex items-center gap-2" id="label-dark-mode">
                    <Moon size={18} className="text-primary" aria-hidden="true" />
                    Dark Mode
                  </h4>
                  <p className="text-sm text-on-surface-variant">Switch to a darker, low-light friendly aesthetic.</p>
                </div>
                <div className="relative inline-block w-12 h-6 mt-1">
                  <input type="checkbox" className="peer sr-only" id="dark-mode" aria-labelledby="label-dark-mode" checked={theme === 'dark'} onChange={toggleTheme} />
                  <label htmlFor="dark-mode" aria-hidden="true" className="block w-12 h-6 bg-surface-container-high rounded-full cursor-pointer peer-checked:bg-primary transition-colors before:content-[''] before:absolute before:top-1 before:left-1 before:bg-surface-container-lowest before:w-4 before:h-4 before:rounded-full before:transition-transform peer-checked:before:translate-x-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"></label>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-on-surface mb-1" id="label-daily-reminders">Daily Reminders</h4>
                  <p className="text-sm text-on-surface-variant">Receive a quick morning nudge to stay on track with your daily eco-goals.</p>
                </div>
                <div className="relative inline-block w-12 h-6 mt-1">
                  <input type="checkbox" className="peer sr-only" id="daily-reminders" aria-labelledby="label-daily-reminders" checked={remindersEnabled} onChange={(e) => setRemindersEnabled(e.target.checked)} />
                  <label htmlFor="daily-reminders" aria-hidden="true" className="block w-12 h-6 bg-surface-container-high rounded-full cursor-pointer peer-checked:bg-primary transition-colors before:content-[''] before:absolute before:top-1 before:left-1 before:bg-surface-container-lowest before:w-4 before:h-4 before:rounded-full before:transition-transform peer-checked:before:translate-x-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"></label>
                </div>
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-on-surface mb-1" id="label-weekly-reports">Weekly Impact Reports</h4>
                  <p className="text-sm text-on-surface-variant">Celebrate your wins! Get a comprehensive email summary of your carbon savings every Sunday.</p>
                </div>
                <div className="relative inline-block w-12 h-6 mt-1">
                  <input type="checkbox" className="peer sr-only" id="weekly-reports" aria-labelledby="label-weekly-reports" defaultChecked />
                  <label htmlFor="weekly-reports" aria-hidden="true" className="block w-12 h-6 bg-surface-container-high rounded-full cursor-pointer peer-checked:bg-primary transition-colors before:content-[''] before:absolute before:top-1 before:left-1 before:bg-surface-container-lowest before:w-4 before:h-4 before:rounded-full before:transition-transform peer-checked:before:translate-x-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"></label>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Coaching Profile */}
          <Card className="p-8 border-none shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-on-surface border-b border-outline-variant pb-4 flex justify-between items-center">
              AI Coaching Profile
              <Bot className="text-primary" size={20} aria-hidden="true" />
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="font-bold text-on-surface mb-1" id="label-coaching-intensity">Coaching Intensity</h4>
                  <p className="text-sm text-on-surface-variant">Adjust how the AI challenges and encourages you to build new habits.</p>
                </div>
                <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{settings.coachingIntensity}</span>
              </div>
              
              <div className="py-4">
                <input 
                  type="range" 
                  min="0" max="100" step="50"
                  value={coachingIntensity}
                  onChange={(e) => setCoachingIntensity(e.target.value)}
                  aria-labelledby="label-coaching-intensity"
                  className="w-full accent-primary h-2 bg-surface-container rounded-lg appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
                <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase mt-2" aria-hidden="true">
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
              <h4 className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase m-0 p-0">Carbon Calculation Methodology</h4>
              <p className="text-sm text-on-surface-variant mb-4">Select the baseline standard used to calculate your emission savings.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Calculation Methodology">
                <button type="button" role="radio" aria-checked="true" className="w-full text-left border-2 border-primary bg-primary/5 rounded-xl p-4 cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors">
                  <div className="absolute top-4 right-4 text-primary" aria-hidden="true">
                    <CheckCircle2 size={20} />
                  </div>
                  <h4 className="font-bold text-on-surface mb-2 pr-8">EPA Standard (US)</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Recommended for North American users. Based on standard EPA emission factors.</p>
                </button>
                
                <button type="button" role="radio" aria-checked="false" className="w-full text-left border-2 border-transparent bg-surface hover:bg-surface-container border-outline-variant rounded-xl p-4 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                  <h4 className="font-bold text-on-surface mb-2">DEFRA Standard (UK/EU)</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Recommended for European users. Based on UK government conversion factors.</p>
                </button>
              </div>
            </div>
          </Card>
          
      </div>
    </div>
  );
}
