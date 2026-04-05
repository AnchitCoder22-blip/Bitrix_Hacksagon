import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import { useSystem } from '../context/SystemContext';

export default function DoctorDashboard() {
  const {
    queue, currentPatient, served, paused,
    nextPatient, skipPatient, handleNoShow, togglePause,
    getQueueHealth, estimateWaitTime, addToast
  } = useSystem();

  const health = getQueueHealth();

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Doctor Dashboard</h2>
        <p style={{ color: '#64748b' }}>Manage your queue and patients</p>
      </motion.div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: 'In Queue', value: queue.length, color: '#2563EB', icon: 'queue' },
          { label: 'Served Today', value: served.length, color: '#22c55e', icon: 'check' },
          { label: 'Queue Health', value: health.label, color: health.color, icon: 'chart' },
          { label: 'Avg Service', value: `${health.avgWait || 15}m`, color: '#f59e0b', icon: 'clock' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            style={{
              background: 'white', borderRadius: 16, padding: 20,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'all 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={stat.icon} size={18} color={stat.color} />
              </div>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}
      >
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => {
            nextPatient();
            addToast?.('Next patient called', 'info');
          }}
          disabled={paused || queue.length === 0}
          style={{
            padding: '12px 24px', borderRadius: 12,
            background: paused || queue.length === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #2563EB, #14B8A6)',
            color: paused || queue.length === 0 ? '#94a3b8' : 'white',
            fontWeight: 600, border: 'none',
            cursor: paused || queue.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <Icon name="play" size={16} /> Call Next
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={togglePause}
          style={{
            padding: '12px 24px', borderRadius: 12,
            background: paused ? '#fef3c7' : '#f8fafc',
            color: paused ? '#b45309' : '#475569',
            fontWeight: 600, border: `1px solid ${paused ? '#fbbf24' : '#e2e8f0'}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <Icon name={paused ? 'play' : 'pause'} size={16} />
          {paused ? 'Resume Queue' : 'Pause Queue'}
        </motion.button>
      </motion.div>

      {/* Currently Serving */}
      {currentPatient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{
            background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
            borderRadius: 20, padding: 24, color: 'white', marginBottom: 24,
          }}
        >
          <p style={{ opacity: 0.8, fontSize: '0.82rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>NOW SERVING</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '2rem', fontWeight: 900 }}>#{currentPatient.tokenNumber}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{currentPatient.name}</div>
              <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>
                {currentPatient.isEmergency ? '🚨 Emergency' : currentPatient.isVIP ? '⭐ VIP' : 'Regular'}
                {currentPatient.startedAt && ` • Started ${new Date(currentPatient.startedAt).toLocaleTimeString()}`}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Next up - preview */}
      {!currentPatient && queue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{
            background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
            borderRadius: 20, padding: 24, color: 'white', marginBottom: 24,
          }}
        >
          <p style={{ opacity: 0.8, fontSize: '0.82rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>NEXT UP</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '2rem', fontWeight: 900 }}>#{queue[0].tokenNumber}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{queue[0].name}</div>
              <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>
                {queue[0].isEmergency ? '🚨 Emergency' : queue[0].isVIP ? '⭐ VIP' : 'Regular'}
                {' • '}{queue[0].status === 'arrived' ? '✓ Arrived' : '⏳ Waiting'}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Queue List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{
          background: 'white', borderRadius: 20, padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Queue ({queue.length})</h3>
        {queue.length === 0 ? (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: 32 }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>✅</span>
            <p>No patients in queue — all caught up!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {queue.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ backgroundColor: '#f1f5f9' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 12,
                  background: i === 0 ? '#eff6ff' : '#f8fafc',
                  borderLeft: `3px solid ${patient.isEmergency ? '#ef4444' : patient.status === 'arrived' ? '#22c55e' : '#e2e8f0'}`,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2563EB', minWidth: 50 }}>
                  #{patient.tokenNumber}
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{patient.name}</span>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {patient.status === 'arrived' ? '✓ Arrived' : '⏳ Waiting'}
                    {patient.isEmergency ? ' • 🚨 Emergency' : ''}
                    {patient.isVIP ? ' • ⭐ VIP' : ''}
                    {' • ~'}{estimateWaitTime(i)}m
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => { skipPatient(patient.id); addToast?.(`${patient.name} skipped`, 'warning'); }}
                    style={{
                      padding: '6px 14px', borderRadius: 8,
                      background: '#fef2f2', color: '#dc2626',
                      fontWeight: 600, fontSize: '0.78rem', border: 'none', cursor: 'pointer',
                    }}>
                    Skip
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => { handleNoShow(patient.id); addToast?.(`${patient.name} marked no-show`, 'error'); }}
                    style={{
                      padding: '6px 14px', borderRadius: 8,
                      background: '#fecaca', color: '#dc2626',
                      fontWeight: 600, fontSize: '0.78rem', border: 'none', cursor: 'pointer',
                    }}>
                    No-show
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
