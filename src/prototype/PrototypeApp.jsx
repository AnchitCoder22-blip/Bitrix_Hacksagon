import { useState } from 'react';
import { motion } from 'framer-motion';

// Prototype components
import QueueHealthBanner from './components/QueueHealthBanner';
import SecondaryQueueManager from './components/SecondaryQueueManager';
import BroadcastSender from './components/BroadcastSender';
import EnhancedAIChat from './components/EnhancedAIChat';
import MockLanguageSwitcher from './components/MockLanguageSwitcher';
import DoctorManager from './components/DoctorManager';

export default function PrototypeApp() {
  const [secondaryQueue, setSecondaryQueue] = useState([
    { id: '101', name: 'John Doe', tokenNumber: '4221', status: 'no-show' },
    { id: '102', name: 'Sarah Smith', tokenNumber: '4233', status: 'late' },
  ]);

  const [toasts, setToasts] = useState([]);

  // Mock functions
  const handleReAdd = (id) => {
    setSecondaryQueue(prev => prev.filter(p => p.id !== id));
    addToast(`Patient re-added to main queue successfully!`, 'success');
  };

  const addToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Toast Overlay for Prototype testing */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
            style={{ 
              padding: '12px 20px', borderRadius: 12, color: 'white', fontWeight: 600,
              background: t.type === 'success' ? '#22c55e' : t.type === 'info' ? '#3b82f6' : '#ef4444',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
            {t.msg}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
            Feature Prototype <span style={{ padding: '4px 12px', background: '#dbeafe', color: '#2563EB', fontSize: '0.9rem', borderRadius: 99, verticalAlign: 'middle' }}>v2.0 Beta</span>
          </h1>
          <p style={{ margin: 0, color: '#64748b' }}>Showcasing isolated UI components, notifications, and analytics extracted from experimental branches.</p>
        </div>
        
        {/* Language Switcher Component */}
        <MockLanguageSwitcher onChangeLanguage={(lang) => addToast(`Language switched to ${lang.toUpperCase()}`, 'info')} />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        
        {/* Left Column: Queue & Admin features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <QueueHealthBanner 
            health={{ color: '#f59e0b', label: 'Moderate Load', waitingCount: 12, arrivedCount: 15, noShowCount: 2 }} 
            avgWaitPerDoctor={18} 
          />

          <SecondaryQueueManager 
            secondaryQueue={secondaryQueue} 
            onReAdd={handleReAdd} 
          />

          <DoctorManager 
            initialDoctors={[
              { id: 'd1', name: 'Dr. Sarah Wilson', avatar: '👩‍⚕️', specialty: 'Cardiologist', patients: 3, available: true },
              { id: 'd2', name: 'Dr. Rajesh Kumar', avatar: '👨‍⚕️', specialty: 'General Physician', patients: 12, available: false }
            ]} 
          />

          <BroadcastSender 
            onSend={(msg) => addToast(`Broadcast Sent: ${msg}`, 'info')} 
          />

        </div>

        {/* Right Column: AI Chat feature */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <EnhancedAIChat />
        </div>

      </div>
    </div>
  );
}
