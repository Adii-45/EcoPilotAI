# 🌍 EcoPilot AI

> **AI-Powered Sustainability Coach**

EcoPilot AI helps users build sustainable habits through habit tracking, AI-powered coaching, eco missions, achievements, reports, simulations, streaks, and personalized sustainability insights. The project combines gamification and AI to encourage environmentally responsible behavior, making it easier than ever to track your impact and lead a greener lifestyle.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🌟 Features

### Authentication
- **User signup & login**: Secure email/password authentication
- **Session persistence**: Stay logged in across visits

### Dashboard
- **Sustainability score**: A clear metric of your overall impact
- **Daily eco missions**: Bite-sized tasks to complete every day
- **Progress tracking**: Visual charts mapping out your green journey
- **AI insights**: Context-aware recommendations on your dashboard

### AI Coach
- **Sustainability guidance**: Chat with an intelligent, Gemini-powered assistant
- **Personalized recommendations**: Advice tailored to your unique lifestyle and goals

### Habit Tracker
- **Eco-friendly habit logging**: Track your daily sustainable choices
- **Progress monitoring**: Maintain streaks and build lasting habits

### Impact Reports
- **Environmental impact summaries**: Detailed breakdowns of your carbon, water, and waste savings

### Achievements
- **Gamified rewards**: Unlock badges for hitting sustainability milestones
- **XP system**: Earn experience points for completing eco-friendly actions
- **Progress milestones**: Visually track how close you are to the next tier

### Simulator
- **Sustainability scenario simulations**: Understand the long-term impact of your daily choices

### Profile Management
- **Editable profile**: Customize your personal details
- **Profile image upload**: Seamless image hosting via Cloudinary integration

### Theme System
- **Light mode & Dark mode**: Full aesthetic support for both preferences
- **Theme persistence**: Remembers your choice on your next visit

---

## 💻 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Backend Services** | Firebase Authentication, Firestore Database |
| **Storage** | Cloudinary |
| **State Management** | Zustand |
| **AI** | Gemini API |
| **Deployment** | Production-ready |

---

## 🏗️ Project Architecture

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

---

## 🚀 Local Setup

Follow these steps to get the project running locally.

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ecopilot-ai.git
   cd ecopilot-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (See the sections below)
   Copy `.env.example` to `.env.local` and populate the fields.

4. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root of your project and add the following variables:

```env
# The API Key for the Gemini AI Coach
VITE_GEMINI_API_KEY=

# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

---

## 🔥 Firebase Setup

1. **Create Firebase project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Enable Authentication**: Navigate to Build > Authentication and enable the **Email/Password** provider.
3. **Enable Firestore**: Navigate to Build > Firestore Database and create a database.
4. **Configure rules**: Update your Firestore rules to allow read/write access for authenticated users:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
5. **Add environment variables**: Go to Project Settings > General, register a Web App, and copy the Firebase config into your `.env.local` file.

---

## ☁️ Cloudinary Setup

1. **Create Cloudinary account**: Sign up at [Cloudinary](https://cloudinary.com/).
2. **Create unsigned upload preset**: Go to Settings > Upload. Under "Upload presets", click "Add upload preset". Set the "Signing Mode" to **Unsigned**.
3. **Copy cloud name**: Find your Cloud name on your main Dashboard.
4. **Add environment variables**: Add your Cloud name and the name of the Unsigned Upload Preset to your `.env.local` file.

---

## 📜 Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`
Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview`
Locally preview the production build that was generated by `npm run build`.

---

## 🧪 Testing

The project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit and component testing.

### Running Tests

- **Run all tests:** `npm run test`
- **Run tests with UI:** `npm run test:ui`
- **Run tests with coverage:** `npm run test:coverage`

### Writing Tests

Tests should be placed in the `tests/` directory mirroring the structure of `src/`. For example, a test for `src/components/ui/Button.tsx` should be located at `tests/components/ui/Button.test.tsx`.

The setup includes `@testing-library/jest-dom` for custom DOM element matchers like `toBeInTheDocument()`.

---

## 🗺️ Roadmap

### Completed
- [x] Authentication
- [x] Dashboard
- [x] AI Coach
- [x] Dark Mode
- [x] Profile Images

### Planned
- [ ] Mobile app (React Native / Capacitor)
- [ ] Social challenges & community features
- [ ] Leaderboards
- [ ] Advanced carbon footprint analytics
- [ ] Advanced AI recommendations
- [ ] Multi-device real-time sync
- [ ] Push notifications

---

## Design Decisions & Implementation Notes

### Chosen Vertical

EcoPilot AI was developed in the sustainability and climate-tech domain to address the challenge of translating environmental awareness into consistent action. The motivation centers on helping users build sustainable habits by making abstract environmental impacts tangible. By combining gamification mechanics with AI-powered coaching, the platform is designed to encourage long-term behavior change. Sustainability tracking remains a meaningful problem for students and everyday users as it provides the necessary visibility and structure to integrate eco-friendly choices into daily routines.

### Approach and Logic

The core logic of the application centers on habit tracking as the primary data source. The product approach incorporates the following components:
- **Habit Tracking:** Serves as the foundational input for user activity.
- **Sustainability Score Calculation:** Aggregates habit data into a standardized metric representing overall environmental impact.
- **XP and Leveling System:** Incentivizes continuous engagement through gamified progression.
- **Achievement Progression:** Rewards specific behavioral milestones.
- **AI Coaching Recommendations:** Analyzes user data to deliver contextualized, actionable advice.
- **Impact Reporting and Analytics:** Synthesizes historical data to display long-term trends and savings.

The architecture is designed as a single-page application prioritizing modularity and responsiveness, ensuring that complex calculations and data visualizations remain performant and accessible for all users.

### How the Solution Works

1. User creates an account.
2. User tracks sustainable habits.
3. Habits generate XP and sustainability metrics.
4. Progress contributes to achievements and streaks.
5. AI Coach provides guidance and recommendations.
6. Impact Reports summarize progress and trends.
7. Simulator estimates future environmental impact.

### Assumptions Made

The following reasonable assumptions were made during the design and development phases:
- Users honestly record completed habits.
- Sustainability impact values are estimated indicators rather than exact scientific measurements.
- CO₂ savings are simplified educational approximations to help users gauge their relative impact.
- AI recommendations are advisory and should not be treated as professional environmental consultation.
- User engagement improves through visible progress tracking and gamification.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
