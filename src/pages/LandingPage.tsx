import { Link } from "react-router-dom";
import { 
  Leaf, Play, ShieldCheck, Trophy, Droplets, CheckCircle2, 
  BrainCircuit, CalendarDays, Award, BarChart3, Target, 
  FastForward, ArrowRight, Sparkles, Sprout, Compass, Globe
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ProgressRing } from "../components/ui/ProgressRing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="h-20 px-6 md:px-8 flex items-center justify-between max-w-7xl mx-auto w-full relative z-20">
        <div className="flex items-center gap-2">
          <Leaf className="text-primary" size={28} />
          <span className="font-bold text-xl text-on-surface">EcoPilot AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-on-surface-variant">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#gamification" className="hover:text-primary transition-colors">Journey</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="hidden sm:block font-medium text-sm text-on-surface-variant hover:text-primary transition-colors">Log In</Link>
          <Link to="/dashboard">
            <Button className="rounded-full px-6">Start Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 md:pt-20 md:pb-24 max-w-5xl mx-auto w-full z-10">
        <Badge variant="outline" className="mb-6 rounded-full py-1.5 px-4 bg-surface/80 backdrop-blur-md text-primary border-primary/20 shadow-sm gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> EcoPilot AI 2.0 is now live
        </Badge>
        
        <h1 className="text-display-md md:text-7xl font-extrabold leading-tight text-on-surface mb-6 tracking-tight">
          Your Intelligent <br className="hidden sm:block" />
          Sustainability <span className="text-primary relative inline-block">
            Companion.
            <svg className="absolute -bottom-2 left-0 w-full text-primary/30" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 10C50 2 150 2 198 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
          </span>
        </h1>
        
        <p className="text-body-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
          <strong className="text-on-surface font-semibold">Track less. Improve more.</strong> Connect with your personal AI mentor to effortlessly build sustainable habits, earn rewards, and reduce your footprint without compromising your lifestyle.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="rounded-full px-8 shadow-level-2 w-full sm:w-auto text-base h-14">Start Your Eco Journey</Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full px-8 bg-surface-container-lowest border-outline-variant shadow-sm gap-2 w-full sm:w-auto text-base h-14 hover:bg-surface-container-low transition-colors">
            <Play size={18} /> View Demo
          </Button>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="relative w-full max-w-6xl mx-auto px-4 pb-20 md:pb-32 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10 rounded-3xl blur-3xl opacity-50"></div>
        <div className="bg-surface-container-lowest rounded-3xl md:rounded-[2.5rem] shadow-level-3 border border-outline-variant/50 p-2 sm:p-4 md:p-8 relative overflow-hidden text-left mx-auto">
          {/* Glassmorphism Top Bar to simulate an app window */}
          <div className="flex items-center gap-2 mb-4 md:mb-6 px-2 md:px-0">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Mockup Left Column */}
            <div className="flex-1 space-y-6 md:space-y-8 bg-surface-container-low/30 p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-outline-variant/30">
              <div>
                <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-1">Impact Score <ShieldCheck className="text-primary" size={20} /></h3>
                <p className="text-on-surface-variant font-medium">Level 4: Eco Pioneer</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
                <div className="shrink-0 bg-surface rounded-full p-2 shadow-sm border border-outline-variant/20">
                  <ProgressRing progress={75} size={140} strokeWidth={12}>
                    <span className="text-3xl font-bold text-on-surface">75</span>
                    <span className="text-on-surface-variant font-medium text-xs">/ 100</span>
                  </ProgressRing>
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-2">Today's Quests</p>
                  <div className="bg-surface rounded-xl p-3 md:p-4 flex items-center justify-between border border-outline-variant/50 shadow-sm transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg md:text-xl">🚲</div>
                      <div>
                        <p className="font-bold text-sm md:text-base text-on-surface">Zero-Emission Commute</p>
                        <p className="text-xs font-medium text-primary">+15 XP <span className="text-on-surface-variant font-normal">• 2h left</span></p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 md:h-9 px-3 text-xs md:text-sm bg-surface-container-lowest rounded-full font-semibold border-primary/20 text-primary hover:bg-primary/5">Claim</Button>
                  </div>
                  <div className="bg-surface-container-lowest rounded-xl p-3 md:p-4 flex items-center justify-between border border-transparent opacity-75">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-lg md:text-xl grayscale">🍴</div>
                      <div>
                        <p className="font-bold text-sm md:text-base text-on-surface-variant line-through decoration-on-surface-variant/30">Plant-Based Meal</p>
                        <p className="text-xs font-medium text-on-surface-variant">Completed</p>
                      </div>
                    </div>
                    <CheckCircle2 className="text-primary" size={22} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mockup Right Column */}
            <div className="w-full lg:w-80 space-y-4 md:space-y-6">
              <div className="bg-gradient-to-br from-[#e6f4ef] to-[#f0f9f5] p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-[#cce8dd] shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10 text-primary">
                  <BrainCircuit size={100} />
                </div>
                <div className="flex items-center gap-2 font-bold text-primary mb-4 relative z-10 text-lg">
                  <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm"><Sparkles size={16} /></div>
                  AI Mentor
                </div>
                <div className="bg-surface/80 backdrop-blur-sm p-4 rounded-xl shadow-sm mb-4 relative z-10 border border-white/50">
                  <p className="text-sm md:text-base text-on-surface font-medium leading-relaxed">
                    "Great job on the bike commute! 🚴 If you switch to a plant-based lunch tomorrow, you'll hit Level 5."
                  </p>
                </div>
                <Button size="sm" className="w-full text-sm h-10 bg-primary text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all relative z-10">Accept Challenge &rarr;</Button>
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant/50 p-5 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm">
                <p className="text-sm md:text-base font-bold flex items-center gap-2 mb-4 md:mb-5 text-on-surface">Recent Badges <Trophy size={16} className="text-amber-500" /></p>
                <div className="flex justify-between px-2">
                  <div className="flex flex-col items-center gap-2 transition-transform hover:scale-105 cursor-default">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-amber-200 text-amber-600 flex items-center justify-center bg-amber-50 shadow-sm text-xl md:text-2xl">☕</div>
                    <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant">Refill Hero</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 transition-transform hover:scale-105 cursor-default">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary/30 text-primary flex items-center justify-center bg-primary/10 shadow-sm text-xl md:text-2xl">⚡</div>
                    <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant">Energy Saver</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 transition-transform hover:scale-105 cursor-default">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-blue-200 text-blue-600 flex items-center justify-center bg-blue-50 shadow-sm"><Droplets size={20} className="md:w-6 md:h-6" /></div>
                    <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant">Water Wise</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Redesigned) */}
      <section className="bg-surface border-y border-outline-variant/30 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center p-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 hover:border-primary/20 transition-colors">
            <p className="text-4xl md:text-5xl font-extrabold text-primary mb-2">500k<span className="text-2xl md:text-3xl text-primary/70">+</span></p>
            <p className="text-xs md:text-sm font-bold tracking-wider text-on-surface-variant uppercase">KG CO2 Saved</p>
          </div>
          <div className="text-center p-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 hover:border-primary/20 transition-colors">
            <p className="text-4xl md:text-5xl font-extrabold text-primary mb-2">2.4m</p>
            <p className="text-xs md:text-sm font-bold tracking-wider text-on-surface-variant uppercase">Habits Tracked</p>
          </div>
          <div className="text-center p-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 hover:border-primary/20 transition-colors">
            <p className="text-4xl md:text-5xl font-extrabold text-primary mb-2">50k<span className="text-2xl md:text-3xl text-primary/70">+</span></p>
            <p className="text-xs md:text-sm font-bold tracking-wider text-on-surface-variant uppercase">Active Pilots</p>
          </div>
          <div className="text-center p-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 hover:border-primary/20 transition-colors">
            <p className="text-4xl md:text-5xl font-extrabold text-primary mb-2">98%</p>
            <p className="text-xs md:text-sm font-bold tracking-wider text-on-surface-variant uppercase">Goal Success</p>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-20 md:py-32 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Core Features</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-on-surface mb-6">Everything you need to <br className="hidden md:block"/>make a real impact.</h3>
          <p className="text-lg text-on-surface-variant">A powerful suite of tools designed to guide, track, and reward your sustainability journey every day.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: BrainCircuit, title: "AI Coach", desc: "Get personalized, context-aware recommendations based on your unique lifestyle and goals." },
            { icon: CalendarDays, title: "Habit Tracker", desc: "Effortlessly log daily eco-actions and watch your consistent efforts turn into lasting habits." },
            { icon: Award, title: "Achievements", desc: "Earn badges, level up, and unlock rewards as you hit significant sustainability milestones." },
            { icon: BarChart3, title: "Impact Reports", desc: "Visualize your footprint reduction over time with detailed, easy-to-understand analytics." },
            { icon: Target, title: "Eco Missions", desc: "Participate in curated challenges designed to push your boundaries and maximize your impact." },
            { icon: FastForward, title: "Future Simulator", desc: "See the long-term environmental effects of your daily choices decades into the future." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 shadow-sm hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <feature.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-on-surface mb-3">{feature.title}</h4>
              <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-surface-container-lowest border-y border-outline-variant/30 py-20 md:py-32 px-6">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">How It Works</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-on-surface">Three steps to a greener you.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 -z-10"></div>
            
            {[
              { step: "01", title: "Track Sustainable Habits", desc: "Log simple actions like taking public transit, eating plant-based, or saving energy at home." },
              { step: "02", title: "Earn XP & Insights", desc: "Gain points for every action and receive smart AI insights on how to optimize your routine." },
              { step: "03", title: "Reduce Your Impact", desc: "Watch your carbon footprint shrink and contribute to global sustainability goals." }
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-surface shadow-level-2 flex items-center justify-center mb-8 border-4 border-surface-container-lowest z-10 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 m-1"></div>
                  <span className="text-3xl font-extrabold text-primary">{item.step}</span>
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-4">{item.title}</h4>
                <p className="text-on-surface-variant leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Coach Showcase */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">AI-Powered Guidance</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-on-surface mb-6 leading-tight">Your personal mentor for sustainable living.</h3>
              <p className="text-lg text-on-surface-variant">EcoPilot's AI analyzes your habits and provides timely, actionable advice tailored specifically to your lifestyle and goals.</p>
            </div>
            
            <div className="space-y-4">
              {[
                "Personalized daily recommendations",
                "Context-aware sustainability insights",
                "Gentle nudges to keep you on track"
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-on-surface font-medium">{text}</span>
                </div>
              ))}
            </div>
            
            <Button className="rounded-full px-8 gap-2">Meet Your Coach <ArrowRight size={18} /></Button>
          </div>
          
          <div className="flex-1 w-full max-w-md lg:max-w-none relative">
            {/* Background blob */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10 transform scale-110"></div>
            
            <div className="space-y-4">
              {/* AI Recommendation Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-level-2 border border-outline-variant/30 transform transition-transform hover:-translate-y-1 z-20 relative mr-8 md:mr-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Sparkles size={18} /></div>
                  <span className="font-bold text-sm text-on-surface">Smart Recommendation</span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  "You've been driving to work 3 days this week. Switching to the train tomorrow will save <strong className="text-primary">4.2kg CO2</strong> and earn you a <strong className="text-amber-600">Transit Badge</strong>!"
                </p>
              </div>

              {/* AI Insight Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-level-2 border border-outline-variant/30 transform transition-transform hover:-translate-y-1 ml-8 md:ml-12 z-10 relative opacity-95">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><Leaf size={18} /></div>
                  <span className="font-bold text-sm text-on-surface">Weekly Insight</span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  "Your home energy usage dropped by 15% compared to last week. That's equivalent to planting <strong className="text-emerald-600">2 trees</strong>. Keep it up!"
                </p>
              </div>

              {/* Progress Guidance Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-level-2 border border-outline-variant/30 transform transition-transform hover:-translate-y-1 z-0 relative mr-4 md:mr-20 opacity-90">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Target size={18} /></div>
                  <span className="font-bold text-sm text-on-surface">Progress Update</span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  "You are only <strong className="text-purple-600">120 XP</strong> away from reaching Level 5. Try completing the 'Meatless Monday' mission today!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey / Gamification */}
      <section id="gamification" className="bg-surface border-y border-outline-variant/30 py-20 md:py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Progression System</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-on-surface mb-6">Level up your impact.</h3>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">Turn sustainable living into a rewarding adventure. Climb the ranks and showcase your dedication to the planet.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative">
            {/* Desktop Path Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-outline-variant/40 -z-10 -translate-y-1/2"></div>
            
            {[
              { level: 1, name: "Seedling", icon: Sprout, color: "text-emerald-500", bg: "bg-emerald-100", border: "border-emerald-200" },
              { level: 10, name: "Eco Explorer", icon: Compass, color: "text-blue-500", bg: "bg-blue-100", border: "border-blue-200" },
              { level: 25, name: "Eco Pioneer", icon: Leaf, color: "text-primary", bg: "bg-primary/20", border: "border-primary/30" },
              { level: 50, name: "Planet Guardian", icon: Globe, color: "text-purple-500", bg: "bg-purple-100", border: "border-purple-200" }
            ].map((rank, idx) => (
              <div key={idx} className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 text-center shadow-sm border border-outline-variant/50 relative group hover:shadow-level-2 transition-all">
                <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full ${rank.bg} ${rank.color} flex items-center justify-center mb-6 border-4 border-surface shadow-sm group-hover:scale-110 transition-transform`}>
                  <rank.icon size={32} className="md:w-10 md:h-10" />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-on-surface mb-2">{rank.name}</h4>
                <p className="text-xs md:text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Level {rank.level}+</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-primary/5 -z-10"></div>
        <div className="absolute w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></div>
        
        <h2 className="text-4xl md:text-6xl font-extrabold text-on-surface mb-6 max-w-3xl leading-tight">
          Ready to Build Sustainable Habits?
        </h2>
        <p className="text-xl text-on-surface-variant mb-10 max-w-xl">
          Join thousands of EcoPilots making a real difference. Start tracking, earning, and improving today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="rounded-full px-10 shadow-level-2 w-full sm:w-auto text-lg h-14">Start Free</Button>
          </Link>
          <Link to="#features" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="rounded-full px-10 bg-surface-container-lowest border-outline-variant shadow-sm w-full sm:w-auto text-lg h-14 hover:bg-surface-container-low transition-colors">Learn More</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between text-sm text-on-surface-variant border-t border-outline-variant/30 mt-auto">
        <div className="flex items-center gap-2 font-bold text-primary text-xl mb-6 md:mb-0">
          <Leaf size={24} /> EcoPilot AI
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0 font-medium">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Carbon Methodology</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <div className="font-medium text-center md:text-left">
          &copy; {new Date().getFullYear()} EcoPilot AI. Engineering a Greener Future.
        </div>
      </footer>
    </div>
  );
}
