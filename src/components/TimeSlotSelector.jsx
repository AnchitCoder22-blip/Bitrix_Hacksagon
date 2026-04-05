import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimeSlotSelector({ show, onClose, onSchedule, doctorName }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const minDate = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduledTime = new Date(`${date}T${time}`);
    
    // Validate past selection
    if (scheduledTime.getTime() <= Date.now()) {
      setError("Please select a future time. Past times are invalid.");
      return;
    }
    
    setError('');
    onSchedule(scheduledTime.toISOString());
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: 20
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              background: 'var(--card, white)', padding: 32, borderRadius: 24, width: '100%', maxWidth: 400,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', margin: 'auto',
              border: '1px solid var(--border, #e2e8f0)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>Schedule Appointment</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
              Select a date and time for your consultation with <strong>{doctorName}</strong>.
            </p>

            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Date</label>
                <input 
                  type="date" required 
                  min={minDate} 
                  value={date} onChange={e => { setDate(e.target.value); setError(''); }} 
                  style={inputStyle}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Time</label>
                <input 
                  type="time" required 
                  value={time} onChange={e => { setTime(e.target.value); setError(''); }} 
                  style={inputStyle}
                />
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={onClose} style={{ ...btnStyle, flex: 1, background: 'var(--border-light, #f1f5f9)', color: 'var(--text)' }}>Cancel</button>
                <button type="submit" style={{ ...btnStyle, flex: 2, background: 'var(--primary, #00A9F2)', color: 'var(--text-muted)' }}>Confirm Time</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const inputStyle = { padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', background: 'var(--input-bg, #f8fafc)', color: 'var(--text, #0f172a)', fontSize: '0.95rem', outline: 'none' };
const btnStyle = { padding: '14px', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'transform 0.1s' };
