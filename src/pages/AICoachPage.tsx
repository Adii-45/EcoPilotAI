import { useState } from "react";
import { Send, Zap, GraduationCap, Sun, BarChart3, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";
import { useStore } from "../store/store";
import { generateCoachResponse } from "../services/gemini";

const suggestions = [
  { icon: Zap, title: "Quick Impact", text: "How can I reduce my footprint this week?", color: "text-primary" },
  { icon: GraduationCap, title: "Student Life", text: "Suggest eco-friendly habits for students.", color: "text-primary" },
  { icon: Sun, title: "Action Today", text: "What's the most impactful change I can make today?", color: "text-primary" },
];

export default function AICoachPage() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
    <div className="flex h-[calc(100vh-8rem)] gap-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Suggestions Sidebar */}
      <div className="w-72 flex flex-col space-y-6">
        <h2 className="text-2xl font-bold text-on-surface">Suggestions</h2>
        <div className="space-y-4">
          {suggestions.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => setInput(item.text)} 
              className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:border-[#10B981] hover:scale-[1.02] cursor-pointer transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-2 font-semibold text-on-surface">
                <item.icon size={18} className={cn("transition-transform group-hover:scale-110", item.color)} />
                {item.title}
              </div>
              <p className="text-sm text-on-surface-variant">"{item.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-transparent relative overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 space-y-8 pb-[260px] scroll-smooth">
          
          {/* AI Identity Header */}
          <div className="flex flex-col items-center justify-center py-10 mb-4 border-b border-outline-variant/30">
            <div className="relative w-16 h-16 group cursor-default mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6FFBBE] via-[#4EDEA3] to-[#10B981] rounded-full blur-md opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-[#6FFBBE] via-[#4EDEA3] to-[#10B981] rounded-full shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_2px_10px_rgba(16,185,129,0.4)] flex items-center justify-center animate-orb-pulse group-hover:scale-105 transition-transform duration-500">
                <div className="absolute top-2 left-2.5 w-5 h-5 bg-white/60 rounded-full blur-[2px]"></div>
              </div>
              <div className="absolute inset-[-6px] animate-[spin_6s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 bg-on-surface rounded-full shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">EcoPilot AI Coach</h1>
            <p className="text-on-surface-variant font-medium mt-2">Your personal sustainability mentor</p>
          </div>

          {messages.length === 0 ? (
             <div className="flex justify-start w-full">
               <div className="flex gap-4 max-w-[85%] items-start">
                 <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm mt-1">
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
                  <div className="flex gap-4 max-w-[85%] items-end justify-end">
                    <div className="bg-gradient-to-br from-[#10B981] to-[#006c49] text-white px-6 py-4 rounded-[1rem] rounded-br-sm shadow-md hover:shadow-lg transition-all">
                      <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex items-center justify-center shadow-sm">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=006c49&color=fff`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-start w-full">
                  <div className="flex gap-4 max-w-[85%] items-start">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm mt-1">
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
             <div className="flex justify-start w-full">
               <div className="flex gap-4 items-start">
                 <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm mt-1">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                 </div>
                 <div className="bg-surface-container-lowest px-6 py-5 rounded-[1rem] rounded-tl-sm shadow-md border border-outline-variant/50 flex gap-2 items-center h-[60px]">
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 pt-6 pb-6 px-4 lg:px-8 glass-overlay border-t border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4 justify-center">
             <Button variant="outline" onClick={() => window.location.href='/impact'} className="rounded-full bg-surface-container-lowest text-sm h-9 shadow-sm hover:border-[#10B981] transition-colors"><BarChart3 size={16} className="mr-2"/> View Impact</Button>
             <Button variant="outline" onClick={() => window.location.href='/habits'} className="rounded-full bg-surface-container-lowest text-sm h-9 shadow-sm hover:border-[#10B981] transition-colors"><CheckCircle2 size={16} className="mr-2"/> Track Habit</Button>
             <Button variant="outline" onClick={() => setInput("Give me some more habit ideas.")} className="rounded-full bg-surface-container-lowest text-sm h-9 shadow-sm hover:border-[#10B981] transition-colors"><Zap size={16} className="mr-2"/> More ideas</Button>
          </div>
          <div className="relative max-w-4xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <button className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your sustainability mentor for advice, goals, or inspiration..." 
                className="w-full bg-surface-container-lowest shadow-sm pl-16 pr-6 py-4 rounded-2xl border border-outline-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              />
            </div>
            <button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()} 
              className="bg-primary text-white px-6 rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md flex items-center justify-center shrink-0"
            >
              <Send size={22} />
            </button>
          </div>
          <p className="text-center text-xs text-on-surface-variant mt-4 font-mono">Empowering you to make greener choices. AI suggestions should be verified.</p>
        </div>
      </div>
    </div>
  );
}
