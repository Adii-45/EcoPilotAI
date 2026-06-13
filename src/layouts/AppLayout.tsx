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
  Leaf,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
  X
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
  const handleLogout = async () => {
    try {
      navigate("/");
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const user = useStore(state => state.user!);
  const notifications = useStore(state => state.notifications);
  const markNotificationRead = useStore(state => state.markNotificationRead);
  const habits = useStore(state => state.habits);
  const achievements = useStore(state => state.achievements);
  const { theme, toggleTheme } = useTheme();

  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchResults = searchQuery.length > 1 ? [
    ...habits.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase())).map(h => ({ type: 'Habit', text: h.title, link: '/habits' })),
    ...achievements.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map(a => ({ type: 'Achievement', text: a.title, link: '/achievements' }))
  ] : [];

  return (
    <div className="min-h-screen bg-surface flex text-on-surface supports-[min-height:100dvh]:min-h-[100dvh]">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-[280px] bg-surface-container-lowest border-r border-outline-variant flex flex-col fixed inset-y-0 z-50 transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary shrink-0">
            <Leaf size={24} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-xl leading-none text-on-surface">EcoPilot AI</h1>
            <p className="text-xs text-on-surface-variant mt-1 font-mono">Sustainability Coach</p>
          </div>
          <button 
            className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )
              }
            >
              <item.icon size={20} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <NavLink 
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )
              }
            >
              <Settings size={20} aria-hidden="true" />
              Settings
            </NavLink>

            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 w-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Log out"
            >
              <LogOut size={20} aria-hidden="true" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[280px] flex flex-col min-h-screen max-w-full w-full overflow-x-hidden">
        <header className="h-16 border-b border-outline-variant bg-surface/70 backdrop-blur-[20px] sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center lg:hidden mr-3 shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Open menu"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 max-w-xl relative flex items-center">
            <div className="relative w-full">
              <label htmlFor="global-search" className="sr-only">Search habits and achievements</label>
              <input 
                id="global-search"
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                className="w-full bg-surface pl-10 pr-4 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
            </div>
            
            {showSearch && searchQuery.length > 1 && (
              <div className="absolute top-full mt-2 w-[280px] sm:w-full right-0 sm:right-auto sm:left-0 bg-surface-container-lowest shadow-lg rounded-xl border border-outline-variant p-2 z-50">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-on-surface-variant p-2" role="status">No results found.</p>
                ) : (
                  searchResults.map((res, i) => (
                    <button 
                      key={i} 
                      className="w-full text-left p-2 hover:bg-surface-container rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={() => {
                        navigate(res.link);
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                    >
                      <p className="font-bold text-sm text-on-surface">{res.text}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase">{res.type}</p>
                    </button>
                  ))
                )}
              </div>
            )}
            {/* Click outside search overlay to close */}
            {showSearch && (
               <div className="fixed inset-0 z-[-1]" onClick={() => setShowSearch(false)} role="presentation"></div>
            )}
          </div>
          
          <div className="flex items-center gap-2 lg:gap-6 ml-2 lg:ml-4 relative shrink-0">
            <div className="relative">
              <button 
                className="text-on-surface-variant hover:bg-surface-container rounded-full relative p-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => setShowNotifs(!showNotifs)}
                aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
              >
                <Bell size={20} aria-hidden="true" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container-highest"></span>}
              </button>
              
              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} role="presentation"></div>
                  <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest shadow-lg border border-outline-variant rounded-2xl z-50 overflow-hidden" role="dialog" aria-label="Notifications">
                    <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
                      <h4 className="font-bold text-on-surface">Notifications</h4>
                      {unreadCount > 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-6 text-center text-sm text-on-surface-variant">You're all caught up!</p>
                      ) : (
                        notifications.map(n => (
                          <button 
                            key={n.id} 
                            className={cn(
                              "w-full text-left p-4 border-b border-outline-variant/50 cursor-pointer transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              !n.read ? "bg-primary/5" : "bg-surface-container-lowest"
                            )}
                            onClick={() => {
                              if (!n.read) markNotificationRead(n.id);
                            }}
                          >
                            <p className="text-sm font-bold text-on-surface mb-1">{n.title}</p>
                            <p className="text-xs text-on-surface-variant">{n.message}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-full p-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <Moon size={20} className="animate-in spin-in-90 duration-200" aria-hidden="true" />
              ) : (
                <Sun size={20} className="animate-in spin-in-[-90deg] duration-200" aria-hidden="true" />
              )}
            </button>
            
            <div className="flex items-center gap-3 border-l border-outline-variant pl-2 lg:pl-6 ml-1 lg:ml-0">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface">{user.name}</p>
                <p className="text-xs text-primary font-bold">Level {user.level}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=006c49&color=fff`} alt={`${user.name}'s profile picture`} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
