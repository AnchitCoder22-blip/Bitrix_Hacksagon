import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import AdminQueueMonitor from '../components/AdminQueueMonitor';
import OfflineTokenForm from '../components/OfflineTokenForm';
import { movePatient, removePatient, boostPatient } from '../utils/adminQueueManager';

export default function AdminDashboard({ doctors, queue, scheduledQueue, setQueue, served, queueHealth, onMoveUp, onMoveDown, onMarkEmergency, addPatient, addToast }) {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [pendingDocs, setPendingDocs] = useState([]);
  
  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = () => {
    try {
      const pending = JSON.parse(window.localStorage.getItem('pendingDoctors') || '[]');
      setPendingDocs(pending);
    } catch { }
  };

  const handleApprove = (doc) => {
    const pending = JSON.parse(window.localStorage.getItem('pendingDoctors') || '[]');
    const approved = JSON.parse(window.localStorage.getItem('approvedDoctors') || '[]');
    
    const updatedPending = pending.filter(p => p.username !== doc.username);
    approved.push({ ...doc, status: 'approved', available: true });
    
    window.localStorage.setItem('pendingDoctors', JSON.stringify(updatedPending));
    window.localStorage.setItem('approvedDoctors', JSON.stringify(approved));
    
    loadPending();
    addToast?.(`Approved Dr. ${doc.name}`, 'success');
  };

  const handleReject = (doc) => {
    const pending = JSON.parse(window.localStorage.getItem('pendingDoctors') || '[]');
    const updatedPending = pending.filter(p => p.username !== doc.username);
    window.localStorage.setItem('pendingDoctors', JSON.stringify(updatedPending));
    
    loadPending();
    addToast?.(`Rejected Dr. ${doc.name}`, 'error');
  };

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
        <p style={{ color: 'var(--text-secondary)' }}>System control center</p>
      </motion.div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: 'Total Patients', value: (queue?.length || 0) + (served?.length || 0), icon: 'users', color: '#00A9F2', gradient: 'linear-gradient(135deg, rgba(0,169,242,0.1), rgba(0,169,242,0.05))' },
          { label: 'In Active Queue', value: queue?.length || 0, icon: 'queue', color: '#14B8A6', gradient: 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(20,184,166,0.05))' },
          { label: 'Avg Wait Time', value: `${Math.round((queue?.length || 0) * 15 / Math.max(doctors?.filter(d => d.available).length, 1))}m`, icon: 'clock', color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))' },
          { label: 'Scheduled (Future)', value: scheduledQueue?.length || 0, icon: 'calendar', color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))' },
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
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Offline Token Form */}
        <OfflineTokenForm doctors={doctors} addPatient={addPatient} addToast={addToast} />

        {/* Broadcast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{
            background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
            boxShadow: 'var(--card-shadow)',
            border: '1px solid rgba(226,232,240,0.5)',
          }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
            <Icon name="broadcast" size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Broadcast Notification
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              value={broadcastMsg}
              onChange={e => setBroadcastMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendBroadcast()}
              placeholder="Type a message to all patients..."
              style={{
                padding: '12px 16px', borderRadius: 12,
                border: '1px solid var(--border)', fontSize: '0.9rem', outline: 'none',
                background: 'var(--border-light)', color: 'var(--text)',
                transition: 'var(--transition)',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={sendBroadcast}
              style={{
                padding: '12px 24px', borderRadius: 12,
                background: 'var(--accent-gradient)',
                color: 'var(--text-muted)', fontWeight: 600, border: 'none', cursor: 'pointer',
              }}
            >
              Send Message
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Doctor Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
          boxShadow: 'var(--card-shadow)', marginBottom: 24,
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Pending Doctor Approvals</h3>
        {pendingDocs.length === 0 ? (
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: 24 }}>No pending requests.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {pendingDocs.map(doc => (
              <div key={doc.username} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Avatar emoji="👨‍⚕️" size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#b45309' }}>{doc.specialization} • {doc.phone} • {doc.email}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleApprove(doc)} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--success)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                  <button onClick={() => handleReject(doc)} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--error)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Verified Doctors System Monitor</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {doctors?.map((doc, i) => (
            <div key={doc.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 14px', borderRadius: 14,
              background: 'var(--border-light)',
              transition: 'var(--transition)',
            }}>
              <Avatar emoji={doc.avatar} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{doc.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {doc.specialty} • {Array.isArray(doc.patients) ? doc.patients.length : doc.patients} patients
                </div>
              </div>
              <span className={`badge badge-${doc.available ? 'success' : 'error'}`}>
                {doc.available ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Queue Override via dedicated Queue Monitor Module */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ marginBottom: 24 }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Queue Monitoring System</h3>
        <AdminQueueMonitor 
          doctors={doctors}
          queue={queue}
          scheduledQueue={scheduledQueue}
          onMove={(patientId, targetDoc) => {
            if (confirm(`Move patient to Dr. ${targetDoc.name || targetDoc.username}?`)) {
              setQueue(prev => movePatient(prev, patientId, targetDoc));
              addToast?.(`Patient moved to Dr. ${targetDoc.name || targetDoc.username}`, 'success');
            }
          }}
          onRemove={(patientId) => {
            setQueue(prev => removePatient(prev, patientId));
            addToast?.('Patient removed from queue', 'info');
          }}
          onBoost={(patientId) => {
            setQueue(prev => boostPatient(prev, patientId));
            addToast?.('Patient boosted to emergency priority', 'warning');
          }}
        />
      </motion.div>

    </div>
  );
}
