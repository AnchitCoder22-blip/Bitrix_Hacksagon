import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PatientLogin from '../components/PatientLogin';
import PatientRegister from '../components/PatientRegister';
import DoctorLogin from '../components/DoctorLogin';
import DoctorRegister from '../components/DoctorRegister';
import AdminLogin from '../components/AdminLogin';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('patient');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSuccess = (data) => {
    onLoginSuccess(role, data);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius-lg)', padding: 48,
          boxShadow: 'var(--card-shadow)', maxWidth: 500, width: '100%',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
          }}>🏥</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
            <span className="hq-gradient-text">Health</span><span style={{ color: 'var(--text)' }}>Queue</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0' }}>Log in to access your portal</p>
        </div>

        {/* Role Tabs */}
        <div style={{ display: 'flex', background: 'var(--border-light)', borderRadius: 14, padding: 4, marginBottom: 24 }}>
          {['patient', 'doctor', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setIsRegistering(false); }}
              style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
                background: role === r ? 'var(--card)' : 'transparent',
                boxShadow: role === r ? 'var(--card-shadow)' : 'none',
                fontWeight: role === r ? 700 : 500,
                color: role === r ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'var(--transition)',
                textTransform: 'capitalize'
              }}
            >
              {r === 'patient' ? '👤 ' : r === 'doctor' ? '👨‍⚕️ ' : '🧑‍💼 '}{r}
            </button>
          ))}
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">
          <motion.div key={`${role}-${isRegistering}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.15 }}>
            {role === 'patient' && (
              isRegistering ? <PatientRegister onSuccess={handleSuccess} toggleLogin={() => setIsRegistering(false)} />
                            : <PatientLogin onSuccess={handleSuccess} toggleRegister={() => setIsRegistering(true)} />
            )}
            
            {role === 'doctor' && (
              isRegistering ? <DoctorRegister onSuccess={handleSuccess} toggleLogin={() => setIsRegistering(false)} />
                            : <DoctorLogin onSuccess={handleSuccess} toggleRegister={() => setIsRegistering(true)} />
            )}
            
            {role === 'admin' && (
              <AdminLogin onSuccess={handleSuccess} />
            )}
          </motion.div>
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
