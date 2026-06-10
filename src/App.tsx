import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AICoachPage from "./pages/AICoachPage";
import HabitTrackerPage from "./pages/HabitTrackerPage";
import ImpactReportPage from "./pages/ImpactReportPage";
import SimulatorPage from "./pages/SimulatorPage";
import AchievementsPage from "./pages/AchievementsPage";
import SettingsPage from "./pages/SettingsPage";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/coach" element={<AICoachPage />} />
          <Route path="/habits" element={<HabitTrackerPage />} />
          <Route path="/impact" element={<ImpactReportPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
