import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminLogin({ onSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username === 'surya' && formData.password === '1410') {
      onSuccess({ name: 'Surya', username: 'surya', id: 'admin-1' });
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: 10, borderRadius: 8, fontSize: '0.85rem' }}>{error}</div>}
      
      <input placeholder="Admin Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={inputStyle} />
      <input placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} />

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={btnStyle}>Enter Admin Panel</motion.button>
    </motion.form>
  );
}

const inputStyle = { padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' };
const btnStyle = { padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'var(--text-muted)', fontWeight: 700, border: 'none', cursor: 'pointer' };
