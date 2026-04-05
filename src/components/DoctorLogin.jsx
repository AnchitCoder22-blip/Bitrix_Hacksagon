import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DoctorLogin({ onSuccess, toggleRegister }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      return;
    }

    const pending = JSON.parse(window.localStorage.getItem('pendingDoctors') || '[]');
    const approved = JSON.parse(window.localStorage.getItem('approvedDoctors') || '[]');
    
    const matchPending = pending.find(p => p.username === formData.username && p.password === formData.password);
    const matchApproved = approved.find(p => p.username === formData.username && p.password === formData.password);
    
    if (matchApproved) {
      onSuccess(matchApproved);
    } else if (matchPending) {
      onSuccess(matchPending);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: 10, borderRadius: 8, fontSize: '0.85rem' }}>{error}</div>}
      
      <input placeholder="Doctor Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={inputStyle} />
      <input placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} />

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={btnStyle}>Log In</motion.button>
      
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 10 }}>
        New doctor? <span onClick={toggleRegister} style={{ color: '#14B8A6', cursor: 'pointer', fontWeight: 600 }}>Apply here</span>
      </p>
    </motion.form>
  );
}

const inputStyle = { padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' };
const btnStyle = { padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg, #14B8A6, #0d9488)', color: 'var(--text-muted)', fontWeight: 700, border: 'none', cursor: 'pointer' };
