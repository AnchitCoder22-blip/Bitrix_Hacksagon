# 🏥 HealthQueue

**HealthQueue** is a modern, responsive, and intelligent web application built to revolutionize clinic queue management and enhance patient-doctor interactions. By utilizing adaptive wait-time prediction and real-time monitoring, HealthQueue eliminates the stressful experience of waiting rooms. 

Built entirely with React, Vite, and vanilla CSS for a premium design, this app enforces role-based workflows for Patients, Doctors, and Administrators.

---

## ✨ Core Features

### 🩺 Smart Queue Management
- **Adaptive Wait Time Predictor:** Calculates real-time estimated wait durations based on active queue dynamics, patient turn-arounds, and historical consultation durations.
- **Emergency Overrides:** Enables administrative personnel to instantly prioritize acute emergencies to the very front of the queue, dynamically recalculating the ETA for everyone else.
- **Auto-Turn Skips & Rescheduling:** Patients can securely shift their appointments using time-sensitive Reschedule Tokens, avoiding backlogs.

### 📍 Live GPS Tracking & ETA
- **Haversine Distance Formula Integration:** Calculates precise distance and travel time from a patient's device location to the clinic. 
- **Proximity Alerts:** Warns patients if they are too far away to make their turn in time or alerts them when they are optimally positioned.

### 🤖 AI-Powered Doctor Recommendations
- **Symptom Matching Engine:** Suggests the most suitable specialist based on a patient's historical medical records and current symptoms using a mocked AI-suggestion hook.

### 🔐 Strict Role-Based Access
- Forced Entry Selection Gateway.
- Protected Routing for isolation between `Patient`, `Doctor`, and `Admin` perspectives.
- **Dedicated Dashboards:** 
  - *Patient Hub:* For tracking personal queue position, discovering doctors, and viewing appointments.
  - *Doctor Hub:* For comprehensive overview, controlling patient flows, extending follow-ups, and viewing efficiency insights.

### 🎨 Premium Aesthetic Design
- Glassmorphism, tailored animations, and a rich dark/light mode adaptable color palette designed purely with raw Vanilla CSS.
- Completely customized Reusable SVG `Icon` library, `BannerCarousel`, and `ToastContainers`.

---

## 📂 Project Structure Snapshot

```text
src/
├── components/       # 17+ Reusable UI elements (Cards, Modals, Navbars)
├── data/             # Centralized application constants & mocked backend state
├── hooks/            # Core business logic (useSmartQueue, useGeolocation)
├── layout/           # Standard authenticated dashboard framework
├── pages/            # 14 views including LiveTracking, Auth Gateways, Analytics
├── shared/           # Micro-components like Spinners and Avatars
├── utils/            # Background algorithms (Consultation trackers & Token generation)
├── App.jsx           # Main Application Router & Entry 
└── index.css         # The Design System
```

---

## 🚀 Getting Started

To run this application locally, ensure you have Node.js installed.

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd HealthQueue
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **View the Application:**
   Open `http://localhost:5173` in your browser.

---

## 🛠️ Built With

* **[React 18](https://reactjs.org/)** - UI Library
* **[Vite](https://vitejs.dev/)** - Lightning Fast Build Tool
* **[React-Router-Dom](https://reactrouter.com/)** - Client Side Routing
* **Vanilla CSS** - Zero Tailwind dependency for absolute stylistic control

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE.md file for details.
