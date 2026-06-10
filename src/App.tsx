import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AICoachPage from "./pages/AICoachPage";
import HabitTrackerPage from "./pages/HabitTrackerPage";
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
