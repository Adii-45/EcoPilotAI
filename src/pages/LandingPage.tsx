import { Link } from "react-router-dom";
import { Leaf, Play, ShieldCheck, Trophy, Droplets, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ProgressRing } from "../components/ui/ProgressRing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Navigation */}
      <nav className="h-20 px-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Leaf className="text-primary" size={28} />
          <span className="font-bold text-xl text-on-surface">EcoPilot AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors">Features</a>
          <a href="#" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#" className="hover:text-primary transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="font-medium text-sm text-on-surface-variant hover:text-primary transition-colors">Log In</Link>
          <Link to="/dashboard">
            <Button className="rounded-full px-6">Start Free &rarr;</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <Badge variant="outline" className="mb-8 rounded-full py-1.5 px-4 bg-white/50 backdrop-blur-md text-primary border-primary/20 shadow-sm gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> EcoPilot AI 2.0 is now live
        </Badge>
        
        <h1 className="text-display-lg md:text-6xl font-bold max-w-4xl mx-auto leading-tight text-on-surface mb-6">
          Your Intelligent Sustainability <br />
          <span className="text-primary">Companion.</span>
        </h1>
        
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          <strong className="text-on-surface">Track less. Improve more.</strong> Connect with your personal AI mentor to effortlessly build sustainable habits, earn rewards, and reduce your footprint without compromising your lifestyle.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="rounded-full px-8 shadow-level-1">Start Your Eco Journey</Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full px-8 bg-white shadow-sm gap-2">
            <Play size={18} /> View Demo
          </Button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 relative max-w-5xl mx-auto w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10 bottom-0 h-1/2"></div>
          <div className="bg-white rounded-[2rem] shadow-level-2 border border-slate-100 p-8 flex gap-8 relative z-0 overflow-hidden text-left">
            {/* Mockup Left Column */}
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-1">Impact Score <ShieldCheck className="text-primary" size={20} /></h3>
                <p className="text-on-surface-variant">Level 4: Eco Pioneer</p>
              </div>
              <div className="flex items-center gap-8">
                <ProgressRing progress={75} size={160} strokeWidth={14}>
                  <span className="text-4xl font-bold text-on-surface">75</span>
                  <span className="text-on-surface-variant font-medium text-sm">/ 100</span>
                </ProgressRing>
                <div className="flex-1 space-y-3">
                  <p className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase mb-2">Today's Quests</p>
                  <div className="bg-surface rounded-xl p-3 flex items-center justify-between border border-outline-variant">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">🚲</div>
                      <div>
                        <p className="font-bold text-sm">Zero-Emission Commute</p>
                        <p className="text-xs text-on-surface-variant">+15 pts • 2h left</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-xs bg-white rounded-full">Claim</Button>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between border border-transparent opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">🍴</div>
                      <div>
                        <p className="font-bold text-sm text-on-surface-variant">Plant-Based Meal</p>
                        <p className="text-xs text-on-surface-variant">Completed</p>
                      </div>
                    </div>
                    <CheckCircle2 className="text-primary" size={20} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mockup Right Column */}
            <div className="w-72 space-y-4">
              <div className="bg-[#e6f4ef] p-5 rounded-2xl border border-[#cce8dd]">
                <div className="flex items-center gap-2 font-bold text-primary mb-3">
                  <div className="bg-primary text-white p-1 rounded-md"><Leaf size={14} /></div>
                  AI Mentor
                </div>
                <p className="text-sm text-on-surface italic bg-white p-3 rounded-xl shadow-sm mb-3">
                  "Great job on the bike commute! 🚴 If you switch to a plant-based lunch tomorrow, you'll hit Level 5."
                </p>
                <Button size="sm" className="w-full text-xs bg-primary text-white">Accept Challenge &rarr;</Button>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                <p className="text-sm font-bold flex items-center gap-2 mb-4">Recent Badges <Trophy size={14} className="text-on-surface-variant" /></p>
                <div className="flex justify-between">
                  <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full border-2 border-[#ffe699] text-[#b38600] flex items-center justify-center bg-[#fff9e6]">☕</div><span className="text-[10px] font-semibold text-on-surface-variant">Refill Hero</span></div>
                  <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full border-2 border-primary/30 text-primary flex items-center justify-center bg-primary/10">⚡</div><span className="text-[10px] font-semibold text-on-surface-variant">Energy Saver</span></div>
                  <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full border-2 border-blue-200 text-blue-600 flex items-center justify-center bg-blue-50"><Droplets size={20} /></div><span className="text-[10px] font-semibold text-on-surface-variant">Water Wise</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-white border-y border-outline-variant py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-outline-variant">
          <div className="text-center px-4">
            <p className="text-5xl font-bold text-primary mb-2">500k+</p>
            <p className="text-sm font-semibold tracking-widest text-on-surface-variant uppercase">KG CO2 Saved</p>
          </div>
          <div className="text-center px-4">
            <p className="text-5xl font-bold text-primary mb-2">2.4m</p>
            <p className="text-sm font-semibold tracking-widest text-on-surface-variant uppercase">Habits Tracked</p>
          </div>
          <div className="text-center px-4">
            <p className="text-5xl font-bold text-primary mb-2">50k+</p>
            <p className="text-sm font-semibold tracking-widest text-on-surface-variant uppercase">Active Pilots</p>
          </div>
          <div className="text-center px-4">
            <p className="text-5xl font-bold text-primary mb-2">98%</p>
            <p className="text-sm font-semibold tracking-widest text-on-surface-variant uppercase">Goal Success</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between text-sm text-on-surface-variant">
        <div className="flex items-center gap-2 font-bold text-primary text-lg mb-4 md:mb-0">
          <Leaf size={20} /> EcoPilot AI
        </div>
        <div className="flex gap-6 mb-4 md:mb-0">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
          <a href="#" className="hover:text-primary">Carbon Methodology</a>
          <a href="#" className="hover:text-primary">Contact</a>
        </div>
        <div>
          &copy; 2024 EcoPilot AI. Engineering a Greener Future.
        </div>
      </footer>
    </div>
  );
}
