import { useState } from 'react';
import { motion } from 'framer-motion';
import { createFollowUp } from '../utils/createFollowUp';

export default function FollowUpScheduler({ patient, doctor, existingAppointments = [], onSchedule, onClose }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time.');
      return;
    }

    const dateTimeStr = `${selectedDate}T${selectedTime}`;
    try {
      const followUp = createFollowUp(patient, doctor, dateTimeStr, existingAppointments);
      setError('');
      onSchedule(followUp);
    } catch (err) {
      setError(err.message);
    }
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Schedule Follow-up</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
        </div>

        <div style={{ marginBottom: 20, padding: 12, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '0.85rem', color: '#166534', marginBottom: 4 }}>For Patient:</div>
          <div style={{ fontWeight: 700, color: '#15803d' }}>{patient.name}</div>
          <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: 4 }}>
            With: {doctor.name || 'Current Doctor'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</label>
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
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Time</label>
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
              background: 'linear-gradient(135deg, #16a34a, #059669)',
              color: 'var(--text-muted)', fontWeight: 600, border: 'none', cursor: 'pointer'
            }}
          >
            Confirm Booking
          </button>
        </div>
      </motion.div>
    </div>
  );
}
