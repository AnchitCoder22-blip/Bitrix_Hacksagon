import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Layout
import DashLayout from './layout/DashLayout';

// Pages
import LandingPage from './pages/LandingPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorsPage from './pages/DoctorsPage';
import QueuePage from './pages/QueuePage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import LabTestsPage from './pages/LabTestsPage';
import EmergencyPage from './pages/EmergencyPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import PendingApprovalPage from './pages/PendingApprovalPage';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';

// Prototype Feature Flag
const ENABLE_PROTOTYPE = true;
import PrototypeApp from './prototype/PrototypeApp';

// Components
import ToastContainer, { useToast } from './components/ToastContainer';
import TurnPopup from './components/TurnPopup';
import QRCheckIn from './components/QRCheckIn';
import WaitTimeCard from './components/WaitTimeCard';
import DoctorRecommendationCard from './components/DoctorRecommendationCard';
import RescheduleModal from './components/RescheduleModal';
import FollowUpScheduler from './components/FollowUpScheduler';
import UpcomingAppointments from './components/UpcomingAppointments';

// Hooks
import useSmartQueue from './hooks/useSmartQueue';
import useScheduledQueue from './hooks/useScheduledQueue';
import useAuth from './hooks/useAuth';
import useTheme from './hooks/useTheme';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';


// Utils
import { startConsultation, endConsultation, getCompletedPatients } from './utils/consultationTracker';
import { rescheduleToken } from './utils/rescheduleToken';
import { moveToTop } from './utils/emergencyOverride';

// Data
import { DOCTORS, CLINIC_LOCATION } from './data/constants';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25 },
};

const pageTitles = {
  'patient-dashboard': 'Dashboard',
  doctors: 'Find Doctors',
  queue: 'My Queue',
  tracking: 'Live Tracking',
  'lab-tests': 'Lab Tests',
  chat: 'AI Symptom Checker',
  emergency: 'Emergency',
  profile: 'Profile',
  settings: 'Settings',
  'doctor-dashboard': 'Doctor Dashboard',
  admin: 'Admin Dashboard',
  analytics: 'Analytics',
  prototype: 'Feature Sandbox',
};

export default function App() {
  const { role, currentUser, login, logout, updateActivity } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [page, setPage] = useState(role ? 'landing' : 'select-role');

  
  const user = currentUser?.data || { name: 'Guest', email: 'guest@email.com' };
  const setUser = () => {}; // mock for profile updates

  const [doctors, setDoctors] = useState(DOCTORS);
  const [tokens, setTokens] = useState([]);
  const [showTurnPopup, setShowTurnPopup] = useState(false);
  const [showQRCheckIn, setShowQRCheckIn] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [completedPatients, setCompletedPatients] = useState([]);
  const [showPrediction] = useState(true); 
  const [showRecommendation] = useState(true);

  const [followUpAppointments, setFollowUpAppointments] = useState([]);
  const [selectedRescheduleToken, setSelectedRescheduleToken] = useState(null);
  const [selectedFollowUpPatient, setSelectedFollowUpPatient] = useState(null);

  // Default entry check
  useEffect(() => {
    if (!role && page !== 'select-role') {
      setPage('select-role');
    } else if (role && page === 'select-role') {
      if (role === 'doctor') {
        if (currentUser?.data?.status === 'pending') setPage('pending-approval');
        else setPage('doctor-dashboard');
      } else if (role === 'admin') {
        setPage('admin');
      } else {
        setPage('patient-dashboard');
      }
    }
  }, [role, page, currentUser]);

  const initialQueue = DOCTORS.flatMap(doc => 
    (doc.patients || [])
      .filter(p => !['served', 'skipped', 'no-show'].includes(p.status))
      .map(p => ({
        ...p,
        doctorId: doc.id,
        doctorName: doc.name || doc.username,
        specialty: doc.specialty || doc.specialization
      }))
  );

  const initialServed = DOCTORS.flatMap(doc => 
    (doc.patients || [])
      .filter(p => p.status === 'served')
      .map(p => ({
        ...p,
        doctorId: doc.id,
        doctorName: doc.name || doc.username,
        specialty: doc.specialty || doc.specialization
      }))
  );

  const { toasts, addToast, removeToast } = useToast();
  const {
    queue, scheduledQueue, secondaryQueue, served, paused,
    addPatient, nextPatient, skipPatient, handleNoShow,
    markArrived, markEmergency, moveUp, moveDown,
    togglePause, estimateWaitTime, getQueueHealth,
    getPosition, setQueue, setScheduledQueue, applyPriority
  } = useSmartQueue(initialQueue, initialServed);

  // Initialize global observer for auto-activating scheduled queues when the time arrives
  useScheduledQueue(scheduledQueue, setScheduledQueue, setQueue, applyPriority);

  // Navigation
  const onNav = useCallback((p) => {
    // Override manual routing logic if switching to role selector space
    if (p === 'select-role') {
      setPage(p);
      return;
    }
    
    // Role assumptions can remain dynamic based on components requesting the nav
    setPage(p);
  }, []);

  // Expose for testing
  useEffect(() => {
    window.__TEST_NAV__ = onNav;
  }, [onNav]);

  // Book a doctor
  const handleBookDoctor = useCallback((doctor, isScheduled = false, scheduledTime = null) => {
    const token = addPatient({
      name: user.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      type: isScheduled ? 'scheduled' : 'instant',
      scheduledTime: scheduledTime
    });
    setTokens(prev => [...prev, token]);
    addToast(`Token #${token.tokenNumber} booked with ${doctor.name}!`, 'success');
    updateActivity('book_token', { doctorName: doctor.name, tokenNumber: token.tokenNumber });
    setPage('queue');
  }, [addPatient, user.name, addToast, updateActivity]);

  // Emergency book
  const handleEmergencyBook = useCallback(() => {
    const token = addPatient({
      name: user.name,
      doctorId: 2,
      doctorName: 'Dr. Rajesh Kumar',
      specialty: 'General Physician',
      isEmergency: true,
    });
    setTokens(prev => [...prev, token]);
    setPage('queue');
  }, [addPatient, user.name]);

  // Check-in
  const handleCheckIn = useCallback((token) => {
    setSelectedToken(token);
    setShowQRCheckIn(true);
  }, []);

  const confirmCheckIn = useCallback(() => {
    if (selectedToken) {
      markArrived(selectedToken.id);
      setTokens(prev => prev.map(t => t.id === selectedToken.id ? { ...t, status: 'arrived' } : t));
      addToast('Check-in confirmed! You are now marked as arrived.', 'success');
      updateActivity('check_in', { tokenNumber: selectedToken.tokenNumber });
    }
    setShowQRCheckIn(false);
    setSelectedToken(null);
  }, [selectedToken, markArrived, addToast, updateActivity]);

  // Turn alert simulation
  useEffect(() => {
    if (tokens.length > 0 && queue.length > 0) {
      const myTokenInQueue = queue.find(q => tokens.some(t => t.id === q.id));
      if (myTokenInQueue) {
        const pos = getPosition(myTokenInQueue.id);
        if (pos !== null && pos <= 2 && pos > 0) {
          const timer = setTimeout(() => setShowTurnPopup(true), 3000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [queue, tokens, getPosition]);

  // Synchronize dynamic status updates (like pending -> waiting) from the queue back to tokens state
  useEffect(() => {
    if (queue.length > 0 || scheduledQueue.length > 0) {
      setTokens(prevTokens => prevTokens.map(t => {
        const liveMatch = queue.find(q => q.id === t.id);
        if (liveMatch && t.status !== liveMatch.status) return { ...t, status: liveMatch.status };
        return t;
      }));
    }
  }, [queue, scheduledQueue]);

  // Page content renderer
  const renderDashboardPage = () => {
    switch (page) {
      case 'patient-dashboard':
        return <PatientDashboard onNav={onNav} tokens={tokens} user={user} />;
      case 'doctors':
        return <DoctorsPage doctors={doctors} onBook={handleBookDoctor} />;
      case 'queue': {
        const activeDoctorId = tokens.length > 0 ? tokens[0].doctorId : null;
        const currentDoctor = activeDoctorId ? doctors.find(d => d.id === activeDoctorId) : null;
        
        return (
          <>
            {showPrediction && (
              <WaitTimeCard
                queue={queue}
                completedPatients={completedPatients}
              />
            )}
            {showRecommendation && currentDoctor && (
              <DoctorRecommendationCard
                currentDoctor={{
                  ...currentDoctor,
                  waitTime: estimateWaitTime(queue.findIndex(q => q.id === tokens[0].id) >= 0 ? queue.findIndex(q => q.id === tokens[0].id) : currentDoctor.patients)
                }}
                doctorsList={doctors}
                onSwitchDoctor={(newDoc) => {
                  handleBookDoctor(newDoc);
                  addToast(`Successfully switched to ${newDoc.name}`, 'success');
                }}
              />
            )}
            <QueuePage tokens={tokens} queue={queue} onCheckIn={handleCheckIn} onTrack={() => onNav('tracking')} estimateWaitTime={estimateWaitTime} />
            {followUpAppointments.length > 0 && <UpcomingAppointments followUpAppointments={followUpAppointments} />}
          </>
        );
      }
      case 'tracking':
        return <ProtectedRoute roleRequired="patient" currentRole={role} fallbackPage="select-role" onRedirect={onNav}><LiveTrackingPage token={selectedToken || tokens[0]} addToast={addToast} /></ProtectedRoute>;
      case 'lab-tests':
        return <ProtectedRoute roleRequired="patient" currentRole={role} fallbackPage="select-role" onRedirect={onNav}><LabTestsPage addToast={addToast} /></ProtectedRoute>;
      case 'emergency':
        return <ProtectedRoute roleRequired="patient" currentRole={role} fallbackPage="select-role" onRedirect={onNav}><EmergencyPage onEmergencyBook={handleEmergencyBook} addToast={addToast} /></ProtectedRoute>;
      case 'chat':
        return <ProtectedRoute roleRequired="patient" currentRole={role} fallbackPage="select-role" onRedirect={onNav}><ChatPage onNav={onNav} /></ProtectedRoute>;
      case 'profile':
        return <ProtectedRoute roleRequired="patient" currentRole={role} fallbackPage="select-role" onRedirect={onNav}><ProfilePage user={user} onUpdateUser={setUser} /></ProtectedRoute>;
      case 'settings':
        return <ProtectedRoute roleRequired="patient" currentRole={role} fallbackPage="select-role" onRedirect={onNav}><SettingsPage addToast={addToast} /></ProtectedRoute>;
      case 'doctor-dashboard':
        return (
          <ProtectedRoute roleRequired="doctor" currentRole={role} fallbackPage="select-role" onRedirect={onNav}>
          <DoctorDashboard
            queue={queue} 
            completedPatients={completedPatients}
            served={served}
            paused={paused} 
            onNextPatient={nextPatient} 
            onSkip={skipPatient}
            onTogglePause={togglePause}
            addToast={addToast}
            user={user}
            onStartConsultation={(patientId) => startConsultation(patientId)}
            onEndConsultation={(patientId) => {
              endConsultation(patientId);
              setCompletedPatients(getCompletedPatients());
            }}
            onEmergency={(patientId) => setQueue(prev => moveToTop(prev, patientId))}
            onRescheduleClick={(patient) => setSelectedRescheduleToken(patient)}
            onFollowUpClick={(patient) => setSelectedFollowUpPatient(patient)}
          />
          </ProtectedRoute>
        );
      case 'admin':
        const approvedCache = JSON.parse(window.localStorage.getItem('approvedDoctors') || '[]');
        const combinedDocs = [...doctors, ...approvedCache];
        return (
          <ProtectedRoute roleRequired="admin" currentRole={role} fallbackPage="select-role" onRedirect={onNav}>
            <AdminDashboard
              doctors={combinedDocs} queue={queue} scheduledQueue={scheduledQueue} setQueue={setQueue} served={served}
              queueHealth={getQueueHealth} onMoveUp={moveUp}
              onMoveDown={moveDown} onMarkEmergency={markEmergency}
              addPatient={addPatient}
              addToast={addToast}
            />
          </ProtectedRoute>
        );
      case 'analytics':
        return <ProtectedRoute roleRequired="admin" currentRole={role} fallbackPage="select-role" onRedirect={onNav}><AnalyticsPage /></ProtectedRoute>;
      case 'pending-approval':
        return <PendingApprovalPage onLogout={logout} />;
      case 'prototype':
        return ENABLE_PROTOTYPE ? <PrototypeApp /> : <div>Prototype Disabled</div>;
      default:
        return <ProtectedRoute roleRequired="patient" currentRole={role} fallbackPage="select-role" onRedirect={onNav}><PatientDashboard onNav={onNav} tokens={tokens} user={user} /></ProtectedRoute>;
    }
  };

  // Landing page (no dashboard layout)
  if (page === 'select-role') {
    return (
      <div className={theme === "dark" ? "dark" : "light"} style={{ minHeight: '100vh', transition: '0.3s', position: 'relative' }}>
        <Login onLoginSuccess={login} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="hq-theme-toggle-wrapper" style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999 }}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    );
  }

  if (page === 'landing') {
    return (
      <div className={theme === "dark" ? "dark" : "light"} style={{ minHeight: '100vh', transition: '0.3s', position: 'relative' }}>
        <ProtectedRoute roleRequired="patient" currentRole={role} fallbackPage="select-role" onRedirect={onNav}>
          <LandingPage onNav={onNav} />
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ProtectedRoute>
        <div className="hq-theme-toggle-wrapper" style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999 }}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    );
  }

  // Dashboard pages
  return (
    <div className={theme === "dark" ? "dark" : "light"} style={{ minHeight: '100vh', transition: '0.3s', position: 'relative' }}>
      <DashLayout
        currentPage={page}
        onNav={onNav}
        role={role}
        user={user}
        onLogout={logout}
        title={pageTitles[page] || 'Dashboard'}
      >
        <AnimatePresence mode="wait">
          <motion.div key={page} {...pageTransition}>
            {renderDashboardPage()}
          </motion.div>
        </AnimatePresence>
      </DashLayout>

      {/* Global overlays */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <TurnPopup
        show={showTurnPopup}
        token={tokens.find(t => queue.some(q => q.id === t.id))}
        patientsAhead={(() => {
          const t = tokens.find(t => queue.some(q => q.id === t.id));
          return t ? getPosition(t.id) || 0 : 0;
        })()}
        onNavigate={() => {
          setShowTurnPopup(false);
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${CLINIC_LOCATION.lat},${CLINIC_LOCATION.lng}`, '_blank');
        }}
        onOnMyWay={() => {
          setShowTurnPopup(false);
          addToast("Great! We'll track your arrival.", 'info');
          onNav('tracking');
        }}
        onClose={() => setShowTurnPopup(false)}
      />

      <AnimatePresence>
        {showQRCheckIn && (
          <QRCheckIn
            token={selectedToken}
            onCheckIn={confirmCheckIn}
            onClose={() => setShowQRCheckIn(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRescheduleToken && (
          <RescheduleModal 
            token={selectedRescheduleToken}
            onClose={() => setSelectedRescheduleToken(null)}
            onReschedule={(newDateTime) => {
              const updated = rescheduleToken(selectedRescheduleToken, newDateTime);
              addToast(`Token reschedule confirmed for ${new Date(newDateTime).toLocaleString()}`, 'success');
              // Optionally remove from primary queue here (omitted for brevity)
              setSelectedRescheduleToken(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFollowUpPatient && (
          <FollowUpScheduler 
            patient={selectedFollowUpPatient}
            doctor={{ id: selectedFollowUpPatient.doctorId, name: selectedFollowUpPatient.doctorName, specialty: selectedFollowUpPatient.specialty }}
            existingAppointments={followUpAppointments}
            onClose={() => setSelectedFollowUpPatient(null)}
            onSchedule={(followUpReq) => {
              setFollowUpAppointments(prev => [...prev, followUpReq]);
              addToast('Follow-up scheduled successfully!', 'success');
              setSelectedFollowUpPatient(null);
            }}
          />
        )}
      </AnimatePresence>

      <button 
        id="__test_nav_btn" 
        style={{ position: 'fixed', bottom: 0, right: 0, opacity: 0.1, zIndex: 99999 }}
        onClick={() => onNav('doctor-dashboard')}
      >
        Doctor Nav
      </button>

      {ENABLE_PROTOTYPE && (
        <button 
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 99999, background: '#2563EB', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
          onClick={() => onNav('prototype')}
        >
          {page === 'prototype' ? 'Back to App' : 'View Prototype'}
        </button>
      )}

      {/* Global Dashboard Theme Toggle */}
      <div className="hq-theme-toggle-wrapper" style={{ position: 'fixed', top: 12, right: 120, zIndex: 99999 }}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}
