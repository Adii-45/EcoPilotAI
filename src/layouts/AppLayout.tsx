import { Outlet, NavLink } from "react-router-dom";
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
  LogOut
} from "lucide-react";
import { cn } from "../utils/cn";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

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

  return (
    <div className="min-h-screen bg-surface flex text-on-surface">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-outline-variant flex flex-col fixed inset-y-0 z-10">
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
          <div className="bg-surface p-4 rounded-2xl border border-surface-container-high">
            <p className="text-sm text-on-surface-variant font-medium mb-3">Unlock advanced insights.</p>
            <Button className="w-full shadow-none bg-primary text-white">Upgrade to Pro</Button>
          </div>
          
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
        <header className="h-16 border-b border-outline-variant bg-white/70 backdrop-blur-[20px] sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search insights, actions..." 
                className="w-full bg-surface pl-10 pr-4 py-2 rounded-xl border border-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <button className="text-on-surface-variant hover:text-on-surface relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
              <img src="https://ui-avatars.com/api/?name=Alex+User&background=006c49&color=fff" alt="User" />
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
