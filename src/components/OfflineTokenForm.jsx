import { useState } from 'react';
import { motion } from 'framer-motion';

export default function OfflineTokenForm({ doctors, addPatient, addToast }) {
  const [patientName, setPatientName] = useState('');
  const [doctorId, setDoctorId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      addToast?.('Patient name is required', 'error');
      return;
    }
    if (!doctorId) {
      addToast?.('Please select a doctor', 'error');
      return;
    }

    const doc = doctors.find(d => String(d.id) === String(doctorId));
    
    if (doc) {
      addPatient({
        name: patientName,
        doctorId: doc.id,
        doctorName: doc.name || doc.username,
        specialty: doc.specialty || doc.specialization,
        type: 'offline'
      });
      
      const msg = `Offline token generated for ${patientName} to see ${doc.name || doc.username}`;
      if (addToast) {
        addToast(msg, 'success');
      } else {
        alert(msg);
      }
      
      setPatientName('');
      setDoctorId('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
        boxShadow: 'var(--card-shadow)', border: '1px solid var(--border)'
      }}
    >
      <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Generate Offline Token</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
        Manually assign walk-in patients to the live queue.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Patient Name</label>
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--input-bg, #f8fafc)', color: 'var(--text)', outline: 'none' }}
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Assign to Doctor</label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--input-bg, #f8fafc)', color: 'var(--text)', outline: 'none' }}
          >
            <option value="" disabled>Select an available doctor...</option>
            {doctors?.filter(d => d.available !== false).map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name || doc.username} - {doc.specialty || doc.specialization}</option>
            ))}
          </select>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          style={{ padding: '12px 16px', background: 'var(--primary)', color: 'var(--text-muted)', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: 8 }}
        >
          Generate Token
        </motion.button>
      </form>
    </motion.div>
  );
}
