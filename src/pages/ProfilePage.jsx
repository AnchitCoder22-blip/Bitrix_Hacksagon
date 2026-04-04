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
          background: 'white', borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 24,
        }}
      >
        <div style={{
          height: 120, background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', bottom: -40, left: 32,
          }}>
            <Avatar name={form.name} size={80} style={{ border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
        <div style={{ padding: '56px 32px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{form.name}</h3>
            <button onClick={() => setEditing(!editing)} className="btn-ghost" style={{ fontSize: '0.85rem' }}>
              {editing ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{form.email}</p>
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{
          background: 'white', borderRadius: 20, padding: 28,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
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
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {field.label}
              </label>
              {editing ? (
                <input
                  value={form[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
                    background: '#f8fafc',
                  }}
                />
              ) : (
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: '#f8fafc', fontSize: '0.9rem', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <Icon name={field.icon} size={16} color="#94a3b8" />
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
    </div>
  );
}
