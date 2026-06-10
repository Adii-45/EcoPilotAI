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
            <div key={idx} onClick={() => setInput(item.text)} className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm hover:border-primary/40 cursor-pointer transition-colors group">
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
      <div className="flex-1 flex flex-col bg-transparent relative">
        <div className="flex-1 overflow-y-auto pr-4 space-y-8 pb-32">
          
          {messages.length === 0 ? (
             <div className="flex justify-start">
               <div className="bg-white px-8 py-8 rounded-[1.5rem] rounded-tl-none max-w-3xl shadow-level-1 border border-slate-100 relative">
                 <div className="absolute -left-12 -top-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white border-2 border-white shadow-sm">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                 </div>
                 <p className="text-on-surface leading-relaxed text-lg">
                   Hello! I'm your EcoPilot AI coach. How can I help you reduce your carbon footprint today?
                 </p>
               </div>
             </div>
          ) : (
            messages.map(msg => (
              msg.role === 'user' ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-surface-container-high text-on-surface px-6 py-4 rounded-2xl rounded-tr-none max-w-lg shadow-sm border border-surface-container-high relative">
                    <p>{msg.content}</p>
                    <div className="absolute -right-10 -top-2 w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
                      <img src="https://ui-avatars.com/api/?name=User&background=006c49&color=fff" alt="User" />
                    </div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-start">
                  <div className="bg-white px-8 py-8 rounded-[1.5rem] rounded-tl-none max-w-3xl shadow-level-1 border border-slate-100 relative">
                    <div className="absolute -left-12 -top-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white border-2 border-white shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                    </div>
                    <p className="text-on-surface leading-relaxed text-lg whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              )
            ))
          )}

          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white px-6 py-4 rounded-[1.5rem] rounded-tl-none max-w-xs shadow-sm border border-slate-100 flex gap-2">
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 pt-8 pb-4 bg-gradient-to-t from-surface via-surface to-transparent">
          <div className="flex items-center gap-3 mb-4 justify-center">
             <Button variant="outline" onClick={() => window.location.href='/impact'} className="rounded-full bg-white text-sm h-9 shadow-sm"><BarChart3 size={16} className="mr-2"/> View Impact</Button>
             <Button variant="outline" onClick={() => window.location.href='/habits'} className="rounded-full bg-white text-sm h-9 shadow-sm"><CheckCircle2 size={16} className="mr-2"/> Track Habit</Button>
             <Button variant="outline" onClick={() => setInput("Give me some more habit ideas.")} className="rounded-full bg-white text-sm h-9 shadow-sm"><Zap size={16} className="mr-2"/> More ideas</Button>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask your sustainability mentor for advice, goals, or inspiration..." 
              className="w-full bg-white shadow-level-1 pl-14 pr-16 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
            />
            <button onClick={handleSend} disabled={isTyping} className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-2.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm">
              <Send size={20} className="ml-0.5" />
            </button>
          </div>
          <p className="text-center text-xs text-on-surface-variant mt-4 font-mono">Empowering you to make greener choices. AI suggestions should be verified.</p>
        </div>
      </div>
    </div>
  );
}
