import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PatientLogin({ onSuccess, toggleRegister }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      return;
    }

    const patients = JSON.parse(window.localStorage.getItem('patients') || '[]');
    const match = patients.find(p => p.username === formData.username && p.password === formData.password);
    
    if (!match) {
      setError('Invalid username or password.');
      return;
    }

    onSuccess(match);
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: 10, borderRadius: 8, fontSize: '0.85rem' }}>{error}</div>}
      
      <input placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={inputStyle} />
      <input placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} />

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={btnStyle}>Log In</motion.button>
      
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 10 }}>
        New user? <span onClick={toggleRegister} style={{ color: '#2563EB', cursor: 'pointer', fontWeight: 600 }}>Register here</span>
      </p>
    </motion.form>
  );
}

const inputStyle = { padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' };
const btnStyle = { padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #14B8A6)', color: 'var(--text-muted)', fontWeight: 700, border: 'none', cursor: 'pointer' };
