import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';

export default function ProfilePage({ user, onUpdateUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex@email.com',
    phone: user?.phone || '+91 9876543210',
    age: user?.age || '28',
    blood: user?.blood || 'O+',
    gender: user?.gender || 'Male',
  });

  const handleSave = () => {
    onUpdateUser?.({ ...user, ...form });
    setEditing(false);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Profile</h2>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: 'var(--card-shadow)', marginBottom: 24,
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <div style={{
          height: 120, background: 'var(--accent-gradient)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', bottom: -40, left: 32,
          }}>
            <Avatar name={form.name} size={80} style={{ border: '4px solid var(--card)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
        <div style={{ padding: '56px 32px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{form.name}</h3>
            <button onClick={() => setEditing(!editing)} className="btn-ghost" style={{ fontSize: '0.85rem' }}>
              {editing ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{form.email}</p>
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)', padding: 28,
          boxShadow: 'var(--card-shadow)',
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Personal Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { label: 'Full Name', key: 'name', icon: 'user' },
            { label: 'Email', key: 'email', icon: 'chat' },
            { label: 'Phone', key: 'phone', icon: 'phone' },
            { label: 'Age', key: 'age', icon: 'calendar' },
            { label: 'Blood Group', key: 'blood', icon: 'emergency' },
            { label: 'Gender', key: 'gender', icon: 'users' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {field.label}
              </label>
              {editing ? (
                <input
                  value={form[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none',
                    background: 'var(--border-light)', color: 'var(--text)',
                  }}
                />
              ) : (
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--border-light)', fontSize: '0.9rem', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)',
                }}>
                  <Icon name={field.icon} size={16} color="var(--text-light)" />
                  {form[field.key]}
                </div>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="btn-primary"
            style={{ marginTop: 24, padding: '12px 32px' }}
          >
            Save Changes
          </motion.button>
        )}
      </motion.div>

      {/* Electronic Medical Records Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)', padding: 28, marginTop: 24,
          boxShadow: 'var(--card-shadow)',
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="doctor" size={20} color="var(--primary)" /> 
          Medical History
        </h3>
        
        {(!user?.history || user.history.length === 0) ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-light)', background: 'var(--border-light)', borderRadius: 16 }}>
            <p style={{ fontWeight: 600 }}>No medical records found.</p>
            <p style={{ fontSize: '0.85rem' }}>Your consultation history will appear here once requested.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {user.history.map((record, idx) => (
              <div key={idx} style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 16, background: 'var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>
                      {record.diagnosis || 'General Consultation'}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      👨‍⚕️ {record.doctorName} • {record.specialization}
                    </p>
                  </div>
                  <div style={{ fontSize: '0.8rem', background: 'var(--border)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 99, fontWeight: 700 }}>
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>

                {record.medicines && record.medicines.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 700, marginBottom: 6 }}>Medicines</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {record.medicines.map((med, mIdx) => (
                        <span key={mIdx} style={{ fontSize: '0.85rem', background: 'rgba(34,197,94,0.1)', color: '#166534', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>
                          💊 {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {record.tests && record.tests.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 700, marginBottom: 6 }}>Tests Recommended</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {record.tests.map((test, tIdx) => (
                        <span key={tIdx} style={{ fontSize: '0.85rem', background: 'rgba(0,169,242,0.1)', color: '#0369a1', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>
                          🧪 {test}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {record.prescriptionNote && (
                  <div>
                    <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 700, marginBottom: 4 }}>Doctor's Advice</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', background: 'var(--card)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                      {record.prescriptionNote}
                    </p>
                  </div>
                )}
                
                {record.followUpDate && (
                  <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#ca8a04', background: 'rgba(245,158,11,0.1)', padding: '6px 12px', borderRadius: 8, fontWeight: 700 }}>
                    ⚠️ Follow-up recommended on: {new Date(record.followUpDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
