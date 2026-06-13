<div align="center">
  
  # 🌍 EcoPilot AI

  **AI-Powered Sustainability Coach & Gamified Habit Tracker**

  [Report Bug](https://github.com/your-username/ecopilot-ai/issues) · [Request Feature](https://github.com/your-username/ecopilot-ai/issues)

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
  ![Zustand](https://img.shields.io/badge/Zustand-4A3E3D?style=for-the-badge&logo=react&logoColor=white)
  ![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)

</div>

---

## 📖 Project Overview

**EcoPilot AI** is a production-ready, gamified web application that helps users build sustainable habits. By blending an intuitive habit tracker with an intelligent AI coach powered by the Gemini API, EcoPilot AI translates abstract environmental concepts into tangible, actionable insights. Whether you're tracking daily eco-friendly choices, simulating long-term environmental impacts, or competing for green achievements, EcoPilot AI makes sustainable living engaging and measurable.

---

## 🎯 Challenge Context

**Why EcoPilot AI?**
Translating environmental awareness into consistent action is a profound challenge. While many individuals want to reduce their carbon footprint, the impact of daily choices often feels abstract and disconnected. EcoPilot AI addresses this by providing immediate visibility and structure. By integrating gamification mechanics (XP, leveling, streaks) with AI-powered personalized coaching, the platform bridges the gap between intention and action, encouraging long-term behavioral change in sustainability.

---

## ✨ Features

- 🔐 **Secure Authentication**: Robust email/password flow and session management via Firebase.
- 📊 **Dynamic Dashboard**: Visualize your sustainability score, daily eco missions, and progress charts.
- 🤖 **AI Coach (Gemini API)**: Chat with an intelligent, context-aware assistant for personalized sustainability guidance.
- 🧠 **AI-Powered Sustainability Recommendation Engine**: Take a personalized lifestyle assessment and receive an actionable, offline-capable sustainability report with estimated CO₂ savings, difficulty scores, and a weekly action plan.
- 🌿 **Gamified Habit Tracker**: Log daily eco-friendly choices, maintain streaks, and build lasting habits.
- 📈 **Impact Reports**: Detailed visual breakdowns of your carbon, water, and waste savings.
- 🏆 **Achievements & XP**: Earn experience points, level up, and unlock distinct visual badges.
- 🔮 **Sustainability Simulator**: Simulate the long-term environmental impact of different lifestyle scenarios.
- 🎨 **Modern Theming**: Seamless Light/Dark mode support with persistent user preferences.
- 👤 **Profile Management**: Customizable user profiles with cloud-hosted avatars (Cloudinary).

---

## 🏗️ Architecture

EcoPilot AI follows a modular, scalable React architecture. State is managed globally via Zustand and contexts, while Firebase handles backend services.

```text
src/
├── components/   # Reusable UI components (buttons, cards, layout elements)
├── contexts/     # React context providers for global state (Auth)
├── data/         # Static data and mock configurations
├── hooks/        # Custom React hooks for shared logic
├── layouts/      # Page layout wrappers (sidebar, navbar integration)
├── pages/        # Main application views (Dashboard, Coach, Tracker, etc.)
├── services/     # External API integrations (Firebase, Gemini, Cloudinary)
├── store/        # Global state management using Zustand (Theme, App State)
├── types/        # TypeScript type definitions and interfaces
└── utils/        # Helper functions, formatting, and constants
```

### Recommendation Engine Architecture
The AI-Powered Sustainability Recommendation Engine operates entirely client-side using a rule-based intelligence system (`src/utils/recommendationEngine.ts`). It assesses user lifestyle data (transportation, food, shopping, energy) to dynamically calculate carbon savings, difficulty scores, and personalized action plans without requiring backend or external API calls. Assessment state is persistently managed via `localStorage` with a custom React hook (`src/hooks/useAssessment.ts`).

---

## 💻 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite |
| **Language** | TypeScript |
| **Styling & UI** | Tailwind CSS, Lucide React (Icons) |
| **Backend & DB** | Firebase Authentication, Cloud Firestore |
| **Image Hosting** | Cloudinary |
| **State Management** | Zustand, React Context |
| **AI Integration** | Google Gemini API |
| **Testing** | Vitest, React Testing Library |

---

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ecopilot-ai.git
   cd ecopilot-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example environment file and populate it with your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### 🧠 Using the Recommendation Engine
1. Navigate to the **AI Coach** page.
2. Click **"Take Sustainability Assessment"** below the header.
3. Complete the form regarding your daily habits and goals.
4. Review your personalized action plan, estimated CO₂ savings, and sustainability score.
5. Your results are automatically saved and will be available next time you visit.

---

## 📸 Screenshots

*(Placeholder for UI screenshots: Dashboard, AI Coach, and the new Sustainability Recommendation Assessment)*

---

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

```env
# Gemini AI Coach
VITE_GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

---

## 🧪 Testing Guide

EcoPilot AI leverages **Vitest** and **React Testing Library** to ensure component reliability and application stability.

- **Run all unit & component tests:** 
  ```bash
  npm run test
  ```
- **Run tests with a visual UI:** 
  ```bash
  npm run test:ui
  ```
- **Generate test coverage report:** 
  ```bash
  npm run test:coverage
  ```

*Testing Strategy:* Tests mirror the `src/` directory structure. Custom DOM matchers (`@testing-library/jest-dom`) are used to assert UI states effectively.

---

## ♿ Accessibility Features

EcoPilot AI is engineered to be inclusive, adhering to **WCAG AA standards** to ensure accessibility for all users:

- **Semantic HTML & ARIA:** Comprehensive use of semantic elements, `aria-labels`, and `aria-live` regions for dynamic updates.
- **Keyboard Navigation:** Full focus management using `tabindex` and distinct `:focus-visible` styling for predictable keyboard traversal.
- **Screen Reader Support:** Screen reader-only text classes (`.sr-only`) used to articulate charts, graphs, and complex visual states.
- **Accessible Forms & Controls:** Semantic form associations and accessible custom controls (switches, sliders, radio groups).

---

## ⚡ Performance Optimizations

To deliver a premium, snappy user experience, the application includes multiple performance optimizations:

- **Code Splitting & Lazy Loading:** React's `lazy` and `Suspense` are utilized for route-based code splitting, drastically reducing initial load times.
- **Memoization:** Strategic use of `useMemo` and `useCallback` to prevent unnecessary re-renders in complex dashboards and impact charts.
- **Asset Optimization:** Next-gen image formats and deferred loading strategies. Vite optimizes the production bundle efficiently.
- **Efficient State:** Zustand minimizes boilerplate and avoids the React Context re-render pitfalls for rapidly changing global state (like Theme and App State).

---

## 🗺️ Future Roadmap

- **Mobile App:** Cross-platform mobile deployment via React Native or Capacitor.
- **Social Features:** Community leaderboards, friends lists, and social eco-challenges.
- **Advanced Analytics:** Deeper, more granular carbon footprint parsing and historical data export.
- **Push Notifications:** Reminders for daily habits and streaks to boost user retention.
- **Wearable Integration:** Syncing step data and physical activity to eco metrics.

---

<div align="center">
  <p>Built with 💚 for a sustainable future!!</p>
  <p>
    <a href="https://github.com/your-username/ecopilot-ai/blob/main/LICENSE">License (MIT)</a>
  </p>
</div>
