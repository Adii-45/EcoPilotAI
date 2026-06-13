# EcoPilot AI Accessibility Audit & Fixes

This document outlines the accessibility improvements made across the EcoPilot AI application to ensure WCAG AA compliance while maintaining the original visual design, layout, and functionality.

## Core Principles Applied

1. **Semantic HTML:** Replaced generic `<div>` elements used as buttons with actual `<button>` elements, or added proper `role` and keyboard interaction attributes where replacing the tag would break complex styling.
2. **Keyboard Navigation:** 
   - Ensured all interactive elements are focusable via `tabindex="0"`.
   - Added standardized `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` to buttons, links, and custom controls to provide clear, consistent focus states.
3. **Screen Reader Support:**
   - Added `aria-label` to icon-only buttons and complex controls.
   - Added `aria-hidden="true"` to purely decorative icons (e.g., Lucide-react icons used for visual flair).
   - Added `aria-live="polite"` to dynamically updating regions (e.g., loading states, impact calculators).
   - Used `sr-only` class to hide text visually while keeping it available for screen readers.
4. **Form Controls:** 
   - Mapped `<label>` elements to their respective `<input>` elements using `htmlFor` and `id`.
   - Addressed complex custom form elements (like radio groups) with proper `role="radiogroup"` and `role="radio"`.
5. **Aria States:** 
   - Managed stateful attributes like `aria-expanded`, `aria-selected`, `aria-checked`, and `aria-pressed`.

## Pages Updated

- **DashboardPage:** Improved focus states, added `aria-label` to widgets, and ensured smooth keyboard navigation through cards.
- **HabitTrackerPage:** Fixed custom checkbox elements by implementing proper `<button role="switch">` or semantic checkboxes.
- **AICoachPage:** Improved the chat interface by adding `aria-live` to the message region and labeling inputs correctly.
- **ImpactReportPage:** Added screen reader text for charts and graphical data using `.sr-only` regions.
- **SettingsPage:** Corrected form labels and fixed custom tab controls with `role="tablist"` and `role="tab"`.
- **SimulatorPage:** Replaced custom div-based sliders with semantic `<input type="range">` and added live regions for real-time impact readouts.
- **AchievementsPage:** Added `aria-label` to progress bars and hid decorative achievement badges from screen readers.
- **LandingPage, LoginPage, SignupPage:** Fixed marketing graphics, navigation links, and added robust form accessibility.
- **OnboardingPage:** Enhanced the wizard flow with proper step labeling, radio group semantics, and live region announcements.

## Conclusion
These updates ensure that EcoPilot AI is accessible to a wider audience, including users who rely on keyboards or screen readers, without compromising its modern, premium aesthetic.
