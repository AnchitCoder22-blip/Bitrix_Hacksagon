import { useState } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../../shared/Avatar';

export default function DoctorManager({ initialDoctors = [] }) {
  const [doctors, setDoctors] = useState(initialDoctors);

  const toggleAvailability = (id) => {
    setDoctors(docs => docs.map(d => d.id === id ? { ...d, available: !d.available } : d));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      style={{
        background: 'white', borderRadius: 20, padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, margin: 0 }}>Doctor Info & Management</h3>
        <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: 99 }}>Admin View</span>
      </div>
      
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
        Manage doctor availability dynamically from the admin panel.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {doctors.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No doctors found.</p>
        ) : (
          doctors.map((doc) => (
            <motion.div key={doc.id}
              whileHover={{ backgroundColor: '#f1f5f9' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 14px', borderRadius: 14,
                background: '#f8fafc', transition: 'all 0.2s',
              }}
            >
              <Avatar emoji={doc.avatar} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {doc.specialty} • {doc.patients || 0} patients waiting
                  {doc.avgTime ? ` • ${doc.avgTime}m avg` : ''}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => toggleAvailability(doc.id)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                  background: doc.available ? '#dcfce7' : '#fecaca',
                  color: doc.available ? '#15803d' : '#dc2626',
                  border: 'none', cursor: 'pointer',
                  minWidth: 80
                }}
              >
                {doc.available ? 'Active' : 'Inactive'}
              </motion.button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
