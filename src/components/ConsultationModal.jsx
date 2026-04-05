import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import PatientHistory from './PatientHistory';

export default function ConsultationModal({ patient, doctor, onClose, onSave }) {
  const [formData, setFormData] = useState({
    diagnosis: '',
    prescriptionNote: '',
    followUpDate: '',
  });

  const [medicineInput, setMedicineInput] = useState('');
  const [medicines, setMedicines] = useState([]);
  
  const [testInput, setTestInput] = useState('');
  const [tests, setTests] = useState([]);

  const [showHistory, setShowHistory] = useState(false);

  // Load fresh patient data from localStorage so we see real history
  const enrichedPatient = useMemo(() => {
    try {
      const allPatients = JSON.parse(window.localStorage.getItem('patients') || '[]');
      const found = allPatients.find(p => p.name === patient?.name || p.username === patient?.name);
      return found || patient;
    } catch {
      return patient;
    }
  }, [patient]);

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (medicineInput.trim()) {
      setMedicines([...medicines, medicineInput.trim()]);
      setMedicineInput('');
    }
  };

  const handleAddTest = (e) => {
    e.preventDefault();
    if (testInput.trim()) {
      setTests([...tests, testInput.trim()]);
      setTestInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct the requested schema History record
    const historyRecord = {
      date: new Date().toISOString(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialty || doctor.specialization || 'General',
      diagnosis: formData.diagnosis,
      medicines: medicines,
      tests: tests,
      prescriptionNote: formData.prescriptionNote,
      followUpDate: formData.followUpDate || null,
    };

    onSave(historyRecord);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999999, padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          background: 'var(--card, white)', padding: 32, borderRadius: 24,
          width: '100%', maxWidth: 600, boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          maxHeight: '90vh', overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text, #0f172a)' }}>
              Consultation Notes
            </h3>
            <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.9rem' }}>
              Patient: {patient?.name}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer',
            color: 'var(--text-muted, #94a3b8)'
          }}>×</button>
        </div>

        {/* Patient History Toggle */}
        <div style={{ marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              background: showHistory ? 'linear-gradient(135deg, rgba(0,169,242,0.08), rgba(0,169,242,0.04))' : 'var(--bg-subtle, #f8fafc)',
              border: `1px solid ${showHistory ? 'rgba(0,169,242,0.3)' : 'var(--border, #e2e8f0)'}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontWeight: 700, fontSize: '0.9rem',
              color: showHistory ? 'var(--primary-dark, #172D9D)' : 'var(--text-muted, #475569)',
              transition: 'all 0.2s',
            }}
          >
            <span>📋 View Past Medical History ({enrichedPatient?.history?.length || 0} records)</span>
            <span style={{ transform: showHistory ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>›</span>
          </button>
          {showHistory && (
            <div style={{ marginTop: 12, maxHeight: 260, overflowY: 'auto', borderRadius: 12 }}>
              <PatientHistory patient={enrichedPatient} compact />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Diagnosis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle}>Diagnosis <span style={{color: '#ef4444'}}>*</span></label>
            <input
              required
              value={formData.diagnosis}
              onChange={e => setFormData({...formData, diagnosis: e.target.value})}
              placeholder="e.g. Acute Bronchitis"
              style={inputStyle}
            />
          </div>

          {/* Medicines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle}>Prescribed Medicines</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={medicineInput}
                onChange={e => setMedicineInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddMedicine(e)}
                placeholder="e.g. Paracetamol 500mg 1-0-1"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button 
                type="button" 
                onClick={handleAddMedicine}
                style={{ ...btnStyle, background: 'var(--border-light, #f1f5f9)', color: 'var(--text, #334155)' }}
              >
                Add
              </button>
            </div>
            {medicines.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {medicines.map((med, idx) => (
                  <div key={idx} style={pillStyle}>
                    💊 {med}
                    <span 
                      onClick={() => setMedicines(medicines.filter((_, i) => i !== idx))}
                      style={{ marginLeft: 8, cursor: 'pointer', color: '#94a3b8', fontWeight: 'bold' }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tests */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle}>Recommended Tests</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={testInput}
                onChange={e => setTestInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTest(e)}
                placeholder="e.g. Complete Blood Count (CBC)"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button 
                type="button" 
                onClick={handleAddTest}
                style={{ ...btnStyle, background: 'var(--border-light, #f1f5f9)', color: 'var(--text, #334155)' }}
              >
                Add
              </button>
            </div>
            {tests.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {tests.map((test, idx) => (
                  <div key={idx} style={{ ...pillStyle, background: '#eff6ff', color: '#1d4ed8' }}>
                    🧪 {test}
                    <span 
                      onClick={() => setTests(tests.filter((_, i) => i !== idx))}
                      style={{ marginLeft: 8, cursor: 'pointer', color: '#93c5fd', fontWeight: 'bold' }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prescription Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle}>Prescription Notes & Advice</label>
            <textarea
              rows={3}
              value={formData.prescriptionNote}
              onChange={e => setFormData({...formData, prescriptionNote: e.target.value})}
              placeholder="e.g. Drink plenty of water and rest for 3 days."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Follow-up Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={labelStyle}>Follow-up Date (Optional)</label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={e => setFormData({...formData, followUpDate: e.target.value})}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button type="button" onClick={onClose} style={{ ...btnStyle, flex: 1, background: 'var(--border-light, #f1f5f9)', color: 'var(--text-secondary, #64748b)' }}>
              Cancel
            </button>
            <button type="submit" style={{ ...btnStyle, flex: 2, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'var(--text-muted)' }}>
              Complete & Save Record
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const labelStyle = { fontSize: '0.9rem', fontWeight: 600, color: 'var(--text, #334155)' };
const inputStyle = {
  padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border, #e2e8f0)',
  background: 'var(--input-bg, #f8fafc)', color: 'var(--text, #0f172a)',
  fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s'
};
const btnStyle = { padding: '14px', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'transform 0.1s' };
const pillStyle = {
  padding: '6px 12px', background: '#f0fdf4', color: '#166534',
  borderRadius: 99, fontSize: '0.85rem', fontWeight: 600,
  display: 'inline-flex', alignItems: 'center'
};
