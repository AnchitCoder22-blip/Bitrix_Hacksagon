import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '../context/SystemContext';

export default function LoginPage() {
  const { login } = useSystem();
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate short network delay for loading feedback UX
    await new Promise(r => setTimeout(r, 600));

    login(name.trim(), role);
    // Note: login sets the systemState, so App.jsx will automatically route away
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 100%)', // blue -> teal
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow elements */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 60%)',
        borderRadius: '50%', pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 60%)',
        borderRadius: '50%', pointerEvents: 'none'
      }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'white',
          borderRadius: 24,
          padding: '48px 40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.1)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
            boxShadow: '0 10px 25px rgba(37,99,235,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem'
          }}>
            🏥
          </div>
        </div>
        
        <h1 style={{ 
          fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', color: '#0f172a', marginBottom: 8 
        }}>
          HealthQueue
        </h1>
        <p style={{ 
          textAlign: 'center', color: '#64748b', marginBottom: 36, fontSize: '0.95rem', fontWeight: 500 
        }}>
          Smart Healthcare Queue System
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Name Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginLeft: 4 }}>
              Full Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => { setName(e.target.value); if(error) setError(''); }}
              placeholder="e.g. Alex Johnson"
              disabled={isLoading}
              style={{
                width: '100%', height: 52, borderRadius: 16, padding: '0 16px',
                border: `2px solid ${error ? '#ef4444' : '#e2e8f0'}`,
                background: '#f8fafc', color: '#0f172a', fontSize: '1rem',
                outline: 'none', transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => { if (!error) e.target.style.borderColor = '#2563EB'; }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = '#e2e8f0'; }}
            />
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: -4 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500, marginLeft: 4 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Role Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginLeft: 4 }}>
              Select Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {['patient', 'doctor', 'admin'].map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    disabled={isLoading}
                    style={{
                      height: 48, borderRadius: 14, fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize',
                      transition: 'all 0.2s', cursor: isLoading ? 'default' : 'pointer', border: 'none',
                      background: isSelected ? 'linear-gradient(135deg, #2563EB, #1d4ed8)' : '#f1f5f9',
                      color: isSelected ? 'white' : '#64748b',
                      boxShadow: isSelected ? '0 8px 20px rgba(37,99,235,0.3)' : 'none',
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!name.trim() || isLoading}
            whileHover={!name.trim() || isLoading ? {} : { scale: 1.02, boxShadow: '0 12px 25px rgba(20,184,166,0.3)' }}
            whileTap={!name.trim() || isLoading ? {} : { scale: 0.98 }}
            style={{
              width: '100%', height: 56, marginTop: 8, borderRadius: 16,
              background: (!name.trim() || isLoading) ? '#cbd5e1' : 'linear-gradient(135deg, #2563EB, #14B8A6)',
              color: 'white', fontSize: '1.05rem', fontWeight: 700,
              border: 'none', cursor: (!name.trim() || isLoading) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite'
                }} />
                Authenticating...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </>
            ) : (
              'Continue'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
