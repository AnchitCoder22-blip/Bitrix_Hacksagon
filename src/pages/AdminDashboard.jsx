import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';

export default function AdminDashboard({ doctors, queue, served, queueHealth, onMoveUp, onMoveDown, onMarkEmergency, addToast }) {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const health = queueHealth?.();

  const sendBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    addToast?.(`Broadcast sent: "${broadcastMsg}"`, 'info');
    setBroadcastMsg('');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Admin Dashboard</h2>
        <p style={{ color: '#64748b' }}>System control center</p>
      </motion.div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: 'Total Patients', value: (queue?.length || 0) + (served?.length || 0), icon: 'users', color: '#2563EB', gradient: 'linear-gradient(135deg, #dbeafe, #eff6ff)' },
          { label: 'In Queue', value: queue?.length || 0, icon: 'queue', color: '#14B8A6', gradient: 'linear-gradient(135deg, #ccfbf1, #f0fdfa)' },
          { label: 'Avg Wait Time', value: `${Math.round((queue?.length || 0) * 15 / Math.max(doctors?.filter(d => d.available).length, 1))}m`, icon: 'clock', color: '#f59e0b', gradient: 'linear-gradient(135deg, #fef3c7, #fffbeb)' },
          { label: 'Queue Health', value: health?.label || 'Healthy', icon: 'chart', color: health?.color || '#22c55e', gradient: `linear-gradient(135deg, ${health?.color || '#22c55e'}20, ${health?.color || '#22c55e'}10)` },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: stat.gradient, borderRadius: 18, padding: 22,
              border: `1px solid ${stat.color}20`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Icon name={stat.icon} size={18} color={stat.color} />
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Doctor Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{
          background: 'white', borderRadius: 20, padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 24,
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Doctor Management</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {doctors?.map((doc, i) => (
            <div key={doc.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 14,
              background: '#f8fafc',
            }}>
              <Avatar emoji={doc.avatar} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {doc.specialty} • {doc.patients} patients
                </div>
              </div>
              <span className={`badge badge-${doc.available ? 'success' : 'error'}`}>
                {doc.available ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Queue Override */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{
          background: 'white', borderRadius: 20, padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 24,
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Queue Control</h3>
        {queue?.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: 24 }}>No patients in queue</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {queue?.map((p, i) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 12,
                background: p.isEmergency ? '#fef2f2' : '#f8fafc',
                borderLeft: `3px solid ${p.isEmergency ? '#ef4444' : '#e2e8f0'}`,
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563EB', minWidth: 50 }}>
                  #{p.tokenNumber}
                </span>
                <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{p.name}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => onMoveUp(p.id)}
                    style={{ width: 30, height: 30, borderRadius: 8, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                    <Icon name="arrowUp" size={14} color="#2563EB" />
                  </button>
                  <button onClick={() => onMoveDown(p.id)}
                    style={{ width: 30, height: 30, borderRadius: 8, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                    <Icon name="arrowDown" size={14} color="#2563EB" />
                  </button>
                  <button onClick={() => {
                    onMarkEmergency(p.id);
                    addToast?.(`${p.name} marked as emergency`, 'warning');
                  }}
                    style={{ width: 30, height: 30, borderRadius: 8, background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                    <Icon name="alert" size={14} color="#dc2626" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Broadcast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{
          background: 'white', borderRadius: 20, padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
          <Icon name="broadcast" size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Broadcast Notification
        </h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={broadcastMsg}
            onChange={e => setBroadcastMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendBroadcast()}
            placeholder="Type a message to all patients..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 12,
              border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={sendBroadcast}
            style={{
              padding: '12px 24px', borderRadius: 12,
              background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
              color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
            }}
          >
            <Icon name="send" size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
