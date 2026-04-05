import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DoctorRegister({ onSuccess, toggleLogin }) {
  const [formData, setFormData] = useState({ name: '', username: '', phone: '', email: '', password: '', specialization: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password || !formData.specialization) {
      setError('Name, username, password, and specialization are required.');
      return;
    }

    const pending = JSON.parse(window.localStorage.getItem('pendingDoctors') || '[]');
    const approved = JSON.parse(window.localStorage.getItem('approvedDoctors') || '[]');
    
    if (pending.some(d => d.username === formData.username) || approved.some(d => d.username === formData.username)) {
      setError('Username already exists.');
      return;
    }

    const newDoctor = { ...formData, id: Date.now().toString(), status: 'pending', patientsHandled: 0, consultations: [] };
    pending.push(newDoctor);
    window.localStorage.setItem('pendingDoctors', JSON.stringify(pending));
    
    onSuccess(newDoctor);
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: 10, borderRadius: 8, fontSize: '0.85rem' }}>{error}</div>}
      
      <input placeholder="Dr. Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
      <input placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={inputStyle} />
      <input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
      <input placeholder="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
      <input placeholder="Specialization (e.g. Cardiologist)" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} style={inputStyle} />
      <input placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} />

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={btnStyle}>Apply for Approval & Login</motion.button>
      
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 10 }}>
        Already registered? <span onClick={toggleLogin} style={{ color: '#14B8A6', cursor: 'pointer', fontWeight: 600 }}>Login here</span>
      </p>
    </motion.form>
  );
}

const inputStyle = { padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' };
const btnStyle = { padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg, #14B8A6, #0d9488)', color: 'var(--text-muted)', fontWeight: 700, border: 'none', cursor: 'pointer' };
