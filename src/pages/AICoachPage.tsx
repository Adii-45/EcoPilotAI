import { useState } from "react";
import { Send, Zap, GraduationCap, Sun, BarChart3, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";
import { useStore } from "../store/store";
import { generateCoachResponse } from "../services/gemini";
import { AssessmentEngine } from "../components/AssessmentEngine";

const suggestions = [
  { icon: Zap, title: "Quick Impact", text: "How can I reduce my footprint this week?", color: "text-primary" },
  { icon: GraduationCap, title: "Student Life", text: "Suggest eco-friendly habits for students.", color: "text-primary" },
  { icon: Sun, title: "Action Today", text: "What's the most impactful change I can make today?", color: "text-primary" },
];

export default function AICoachPage() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const user = useStore(state => state.user!);
  const habits = useStore(state => state.habits);
  const messages = useStore(state => state.aiMessages);
  const addChatMessage = useStore(state => state.addChatMessage);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = { role: 'user' as const, content: input };
    addChatMessage(userMsg);
    setInput("");
    setIsTyping(true);
    
    const newHistory = [...messages, userMsg];
    const responseText = await generateCoachResponse(newHistory, user, habits);
    
    addChatMessage({ role: 'assistant', content: responseText });
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] min-h-[500px] gap-4 lg:gap-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Suggestions Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-72 flex-col space-y-6 shrink-0" aria-label="Suggestions Sidebar">
        <h2 className="text-lg lg:text-2xl font-bold text-on-surface">Suggestions</h2>
        <div className="flex lg:flex-col gap-3 lg:gap-4 overflow-x-auto pb-2 lg:pb-0 snap-x hide-scrollbar" role="list">
          {suggestions.map((item, idx) => (
            <button 
              key={idx} 
              type="button"
              onClick={() => setInput(item.text)} 
              className="w-full text-left bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:border-[#10B981] hover:scale-[1.02] cursor-pointer transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              role="listitem"
            >
              <div className="flex items-center gap-2 mb-2 font-semibold text-on-surface text-base">
                <item.icon size={18} className={cn("transition-transform group-hover:scale-110", item.color)} aria-hidden="true" />
                {item.title}
              </div>
              <p className="text-sm text-on-surface-variant">"{item.text}"</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col bg-transparent relative overflow-hidden" aria-label="Chat Area">
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 space-y-8 pb-[260px] scroll-smooth" aria-live="polite">
          
          {/* AI Identity Header */}
          <div className="flex flex-col items-center justify-center py-6 lg:py-10 mb-2 lg:mb-4 border-b border-outline-variant/30">
            <div className="relative w-12 h-12 lg:w-16 lg:h-16 group cursor-default mb-3 lg:mb-4" aria-hidden="true">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6FFBBE] via-[#4EDEA3] to-[#10B981] rounded-full blur-md opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-[#6FFBBE] via-[#4EDEA3] to-[#10B981] rounded-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_2px_10px_rgba(16,185,129,0.4)] flex items-center justify-center animate-orb-pulse group-hover:scale-105 transition-transform duration-500">
                <div className="absolute top-2 left-2.5 w-5 h-5 bg-white/60 rounded-full blur-[2px]"></div>
              </div>
              <div className="absolute inset-[-6px] animate-[spin_6s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 bg-on-surface rounded-full shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">EcoPilot AI Coach</h1>
            <p className="text-sm lg:text-base text-on-surface-variant font-medium mt-1 lg:mt-2">Your personal sustainability mentor</p>
            <Button 
              onClick={() => setShowAssessment(!showAssessment)} 
              variant="outline" 
              className="mt-4 rounded-full text-xs lg:text-sm font-semibold hover:border-primary transition-all"
            >
              {showAssessment ? "Return to Chat" : "Take Sustainability Assessment"}
            </Button>
          </div>

          {showAssessment ? (
            <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-[100px] scroll-smooth">
              <AssessmentEngine />
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
             <div className="flex justify-start w-full">
               <div className="flex gap-4 max-w-[90%] md:max-w-[85%] items-start">
                 <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm mt-1" aria-hidden="true">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                 </div>
                 <div className="bg-surface-container-lowest px-6 py-5 rounded-[1rem] rounded-tl-sm shadow-md border border-outline-variant/50 hover:shadow-lg transition-all text-on-surface leading-relaxed text-lg">
                   Hello! I'm your EcoPilot AI coach. How can I help you reduce your carbon footprint today?
                 </div>
               </div>
             </div>
          ) : (
            messages.map(msg => (
              msg.role === 'user' ? (
                <div key={msg.id} className="flex justify-end w-full">
                  <div className="flex gap-4 max-w-[90%] md:max-w-[85%] items-end justify-end">
                    <div className="bg-gradient-to-br from-[#10B981] to-[#006c49] text-white px-6 py-4 rounded-[1rem] rounded-br-sm shadow-md hover:shadow-lg transition-all">
                      <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex items-center justify-center shadow-sm">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=006c49&color=fff`} alt={`${user.name}'s profile picture`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-start w-full">
                  <div className="flex gap-4 max-w-[90%] md:max-w-[85%] items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm mt-1" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                    </div>
                    <div className="bg-surface-container-lowest px-6 py-5 rounded-[1rem] rounded-tl-sm shadow-md border border-outline-variant/50 hover:shadow-lg transition-all text-on-surface leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                </div>
              )
            ))
          )}

          {isTyping && (
             <div className="flex justify-start w-full" aria-label="AI is typing...">
               <div className="flex gap-4 items-start">
                 <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm mt-1" aria-hidden="true">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                 </div>
                 <div className="bg-surface-container-lowest px-6 py-5 rounded-[1rem] rounded-tl-sm shadow-md border border-outline-variant/50 flex gap-2 items-center h-[60px]" aria-hidden="true">
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
             </div>
          )}

          {/* Mobile Suggestions (Below Chat) */}
          <div className="lg:hidden mt-8 pt-4 border-t border-outline-variant/30 space-y-4">
            <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Quick Suggestions</h2>
            <div className="flex flex-col gap-3" role="list">
              {suggestions.map((item, idx) => (
                <button 
                  key={idx} 
                  type="button"
                  onClick={() => setInput(item.text)} 
                  className="w-full text-left bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm active:scale-[0.98] transition-transform cursor-pointer flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  role="listitem"
                >
                  <div className="p-2 bg-surface rounded-xl text-primary shrink-0">
                    <item.icon size={18} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-on-surface text-sm mb-0.5">{item.title}</div>
                    <p className="text-xs text-on-surface-variant truncate">"{item.text}"</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
            </>
          )}
        </div>

        {/* Input Area (Only visible when chat is active) */}
        {!showAssessment && (
          <div className="absolute bottom-0 left-0 right-0 pt-4 lg:pt-6 pb-4 lg:pb-6 px-4 lg:px-8 glass-overlay border-t border-outline-variant/30">
          <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-4 justify-center">
             <Button variant="outline" onClick={() => window.location.href='/impact'} className="rounded-full bg-surface-container-lowest text-xs lg:text-sm h-8 lg:h-9 shadow-sm hover:border-[#10B981] transition-colors"><BarChart3 size={14} className="mr-1.5 lg:mr-2" aria-hidden="true"/> View Impact</Button>
             <Button variant="outline" onClick={() => window.location.href='/habits'} className="rounded-full bg-surface-container-lowest text-xs lg:text-sm h-8 lg:h-9 shadow-sm hover:border-[#10B981] transition-colors"><CheckCircle2 size={14} className="mr-1.5 lg:mr-2" aria-hidden="true"/> Track Habit</Button>
             <Button variant="outline" onClick={() => setInput("Give me some more habit ideas.")} className="rounded-full bg-surface-container-lowest text-xs lg:text-sm h-8 lg:h-9 shadow-sm hover:border-[#10B981] transition-colors"><Zap size={14} className="mr-1.5 lg:mr-2" aria-hidden="true"/> More ideas</Button>
          </div>
          <div className="relative max-w-4xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <button type="button" aria-label="Add media" className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full p-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </button>
              <label htmlFor="coach-input" className="sr-only">Ask for advice</label>
              <input 
                id="coach-input"
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for advice..." 
                className="w-full bg-surface-container-lowest shadow-sm pl-14 lg:pl-16 pr-4 lg:pr-6 py-3 lg:py-4 rounded-2xl border border-outline-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-base lg:text-lg"
              />
            </div>
            <button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()} 
              className="bg-primary text-white px-6 rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Send message"
            >
              <Send size={22} aria-hidden="true" />
            </button>
          </div>
          <p className="text-center text-xs text-on-surface-variant mt-4 font-mono">Empowering you to make greener choices. AI suggestions should be verified.</p>
        </div>
        )}
      </main>
    </div>
  );
}
