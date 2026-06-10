import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Bot, 
  CheckCircle2, 
  BarChart3, 
  Trophy, 
  Activity,
  Settings,
  HelpCircle,
  Leaf,
  LogOut,
  Bell,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "../utils/cn";
import { useAuth } from "../contexts/AuthContext";
import { useStore } from "../store/store";
import { useTheme } from "../contexts/ThemeContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Bot, label: "AI Coach", path: "/coach" },
  { icon: CheckCircle2, label: "Habit Tracker", path: "/habits" },
  { icon: BarChart3, label: "Impact Report", path: "/impact" },
  { icon: Trophy, label: "Achievements", path: "/achievements" },
  { icon: Activity, label: "Simulator", path: "/simulator" },
];

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = useStore(state => state.user!);
  const notifications = useStore(state => state.notifications);
  const markNotificationRead = useStore(state => state.markNotificationRead);
  const habits = useStore(state => state.habits);
  const achievements = useStore(state => state.achievements);
  const { theme, toggleTheme } = useTheme();

  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchResults = searchQuery.length > 1 ? [
    ...habits.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase())).map(h => ({ type: 'Habit', text: h.title, link: '/habits' })),
    ...achievements.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map(a => ({ type: 'Achievement', text: a.title, link: '/achievements' }))
  ] : [];

  return (
    <div className="min-h-screen bg-surface flex text-on-surface">
      {/* Sidebar */}
      <aside className="w-[280px] bg-surface-container-lowest border-r border-outline-variant flex flex-col fixed inset-y-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <Leaf size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-none text-on-surface">EcoPilot AI</h1>
            <p className="text-xs text-on-surface-variant mt-1 font-mono">Sustainability Coach</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <NavLink 
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors w-full",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )
              }
            >
              <Settings size={20} />
              Settings
            </NavLink>
            <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-on-surface-variant hover:bg-surface-container w-full transition-colors">
              <HelpCircle size={20} />
              Support
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 w-full transition-colors"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px] flex flex-col min-h-screen">
        <header className="h-16 border-b border-outline-variant bg-surface/70 backdrop-blur-[20px] sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search habits, achievements..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                className="w-full bg-surface pl-10 pr-4 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
            </div>
            
            {showSearch && searchQuery.length > 1 && (
              <div className="absolute top-full mt-2 w-full bg-surface-container-lowest shadow-lg rounded-xl border border-outline-variant p-2 z-50">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-on-surface-variant p-2">No results found.</p>
                ) : (
                  searchResults.map((res, i) => (
                    <div 
                      key={i} 
                      className="p-2 hover:bg-surface-container rounded-lg cursor-pointer"
                      onClick={() => {
                        navigate(res.link);
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                    >
                      <p className="font-bold text-sm text-on-surface">{res.text}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">{res.type}</p>
                    </div>
                  ))
                )}
              </div>
            )}
            {/* Click outside search overlay to close */}
            {showSearch && (
               <div className="fixed inset-0 z-[-1]" onClick={() => setShowSearch(false)}></div>
            )}
          </div>
          
          <div className="flex items-center gap-6 ml-4 relative">
            <div className="relative">
              <button 
                className="text-on-surface-variant hover:bg-surface-container rounded-full relative p-2 transition-colors duration-200"
                onClick={() => setShowNotifs(!showNotifs)}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container-highest"></span>}
              </button>
              
              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest shadow-lg border border-outline-variant rounded-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
                      <h4 className="font-bold text-on-surface">Notifications</h4>
                      {unreadCount > 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-6 text-center text-sm text-on-surface-variant">You're all caught up!</p>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            className={cn(
                              "p-4 border-b border-outline-variant/50 cursor-pointer transition-colors hover:bg-surface",
                              !n.read ? "bg-primary/5" : "bg-surface-container-lowest"
                            )}
                            onClick={() => {
                              if (!n.read) markNotificationRead(n.id);
                            }}
                          >
                            <p className="text-sm font-bold text-on-surface mb-1">{n.title}</p>
                            <p className="text-xs text-on-surface-variant">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Moon size={20} className="animate-in spin-in-90 duration-200" />
              ) : (
                <Sun size={20} className="animate-in spin-in-[-90deg] duration-200" />
              )}
            </button>
            
            <div className="flex items-center gap-3 border-l border-outline-variant pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface">{user.name}</p>
                <p className="text-xs text-primary font-bold">Level {user.level}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=006c49&color=fff`} alt={user.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
