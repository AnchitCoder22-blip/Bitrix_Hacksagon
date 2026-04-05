import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PatientRegister({ onSuccess, toggleLogin }) {
  const [formData, setFormData] = useState({ name: '', username: '', phone: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) {
      setError('Name, username, and password are required.');
      return;
    }

    const patients = JSON.parse(window.localStorage.getItem('patients') || '[]');
    if (patients.some(p => p.username === formData.username)) {
      setError('Username already exists. Please choose another.');
      return;
    }

    const newPatient = { ...formData, history: [] };
    patients.push(newPatient);
    window.localStorage.setItem('patients', JSON.stringify(patients));
    
    // Automatically login logic passes data up to parent
    onSuccess(newPatient);
  };

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {error && <div style={{ color: '#dc2626', background: '#fef2f2', padding: 10, borderRadius: 8, fontSize: '0.85rem' }}>{error}</div>}
      
      <input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
      <input placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={inputStyle} />
      <input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
      <input placeholder="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
      <input placeholder="Home Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} />
      <input placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} />

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={btnStyle}>Register & Login</motion.button>
      
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 10 }}>
        Already registered? <span onClick={toggleLogin} style={{ color: '#2563EB', cursor: 'pointer', fontWeight: 600 }}>Login here</span>
      </p>
    </motion.form>
  );
}

const inputStyle = { padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' };
const btnStyle = { padding: '14px', borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #14B8A6)', color: 'var(--text-muted)', fontWeight: 700, border: 'none', cursor: 'pointer' };
