import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from './context/SystemContext';

// Layout
import DashLayout from './layout/DashLayout';

// Pages
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorsPage from './pages/DoctorsPage';
import QueuePage from './pages/QueuePage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import LabTestsPage from './pages/LabTestsPage';
import EmergencyPage from './pages/EmergencyPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';

// Components
import ToastContainer from './components/ToastContainer';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25 },
};

const pageTitles = {
  dashboard: 'Dashboard',
  doctors: 'Find Doctors',
  queue: 'My Queue',
  tracking: 'Live Tracking',
  'lab-tests': 'Lab Tests',
  chat: 'AI Symptom Checker',
  emergency: 'Emergency',
  profile: 'Profile',
  settings: 'Settings',
  admin: 'Admin Dashboard',
  analytics: 'Analytics',
};

export default function App() {
  const { systemState, toasts, removeToast, page, onNav } = useSystem();
  
  // Role-based root view
  if (!systemState.user.isLoggedIn) {
    return (
      <>
        <LoginPage />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  // Note: onNav is passed to components if they still rely on the prop, 
  // but most extract it directly from useSystem().
  const handleNav = onNav;

  const renderContent = () => {
    const { role } = systemState.user;

    if (role === 'admin') {
      if (page === 'analytics') return <AnalyticsPage onNav={handleNav} />;
      if (page === 'emergency') return <EmergencyPage onNav={handleNav} />;
      return <AdminDashboard onNav={handleNav} />;
    }

    // Patient or Doctor standard routing
    switch (page) {
      case 'dashboard': return role === 'doctor' ? <DoctorDashboard onNav={handleNav} /> : <PatientDashboard onNav={handleNav} />;
      case 'doctors': return <DoctorsPage onNav={handleNav} />;
      case 'queue': return <QueuePage onNav={handleNav} />;
      case 'tracking': return <LiveTrackingPage onNav={handleNav} />;
      case 'lab-tests': return <LabTestsPage onNav={handleNav} />;
      case 'emergency': return <EmergencyPage onNav={handleNav} />;
      case 'chat': return <ChatPage onNav={handleNav} />;
      case 'profile': return <ProfilePage onNav={handleNav} />;
      case 'settings': return <SettingsPage onNav={handleNav} />;
      default: return <PatientDashboard onNav={handleNav} />;
    }
  };

  const pageTitle = pageTitles[page] || (systemState.user.role === 'admin' ? 'Admin Dashboard' : systemState.user.role === 'doctor' ? 'Doctor Dashboard' : 'Dashboard');

  return (
    <>
      <DashLayout title={pageTitle} onNav={handleNav}>
        <AnimatePresence mode="wait">
          <motion.div key={page} {...pageTransition}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </DashLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
