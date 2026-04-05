import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RescheduleModal({ token, onReschedule, onClose }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both a date and a time.');
      return;
    }
    
    const dateTimeStr = `${selectedDate}T${selectedTime}`;
    if (new Date(dateTimeStr) < new Date()) {
      setError('Cannot reschedule to a past time.');
      return;
    }

    setError('');
    onReschedule(dateTimeStr);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
          width: '100%', maxWidth: 400, boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Reschedule Token</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
        </div>

        <div style={{ marginBottom: 20, padding: 12, background: 'var(--border-light)', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>#{token.tokenNumber}</span>
            <span style={{ fontWeight: 600 }}>{token.name}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Doctor: {token.doctorName}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Date</label>
            <input 
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #cbd5e1', fontSize: '0.95rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Time</label>
            <input 
              type="time" 
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #cbd5e1', fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 12, fontWeight: 500 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button 
            onClick={onClose}
            style={{
              flex: 1, padding: '10px', borderRadius: 10,
              background: 'var(--border-light)', color: 'var(--text-secondary)', fontWeight: 600,
              border: 'none', cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            style={{
              flex: 1, padding: '10px', borderRadius: 10,
              background: 'var(--accent-gradient)',
              color: 'var(--text-muted)', fontWeight: 600, border: 'none', cursor: 'pointer'
            }}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}
