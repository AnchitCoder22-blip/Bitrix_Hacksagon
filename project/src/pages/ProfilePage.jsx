import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import { useSystem } from '../context/SystemContext';

export default function ProfilePage() {
  const { user, setUser } = useSystem();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });

  const handleSave = () => {
    setUser(form);
    setEditing(false);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Profile</h2>
        <p style={{ color: '#64748b' }}>Manage your personal information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white', borderRadius: 20, padding: 32,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center',
          marginBottom: 24,
        }}
      >
        <Avatar name={user.name} size={80} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: 16, marginBottom: 4 }}>
          {user.name}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{user.email}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{
          background: 'white', borderRadius: 20, padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700 }}>Personal Information</h3>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => editing ? handleSave() : setEditing(true)}
            style={{
              padding: '8px 20px', borderRadius: 10, fontSize: '0.85rem',
              fontWeight: 600, border: 'none', cursor: 'pointer',
              background: editing ? 'linear-gradient(135deg, #2563EB, #14B8A6)' : '#f1f5f9',
              color: editing ? 'white' : '#475569',
            }}>
            {editing ? 'Save' : 'Edit'}
          </motion.button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, marginBottom: 6, display: 'block' }}>Full Name</label>
            <input
              value={editing ? form.name : user.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              disabled={!editing}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: `1px solid ${editing ? '#2563EB' : '#e2e8f0'}`,
                fontSize: '0.95rem', outline: 'none',
                background: editing ? 'white' : '#f8fafc',
                transition: 'all 0.2s',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, marginBottom: 6, display: 'block' }}>Email</label>
            <input
              value={editing ? form.email : user.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              disabled={!editing}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: `1px solid ${editing ? '#2563EB' : '#e2e8f0'}`,
                fontSize: '0.95rem', outline: 'none',
                background: editing ? 'white' : '#f8fafc',
                transition: 'all 0.2s',
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
