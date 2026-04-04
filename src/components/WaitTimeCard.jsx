import { motion } from 'framer-motion';
import useWaitTimePredictor from '../hooks/useWaitTimePredictor';

/**
 * WaitTimeCard
 *
 * Displays the real-time adaptive wait time prediction.
 * Follows the existing card UI in QueuePage (white card, borderRadius 20, boxShadow).
 *
 * Props:
 *   queue              - Array of patients currently in queue
 *   completedPatients  - Array of { startTime, endTime } consultation records
 */
export default function WaitTimeCard({ queue = [], completedPatients = [] }) {
  const { estimatedWaitTime, avgConsultTime, patientsAhead } = useWaitTimePredictor(
    queue,
    completedPatients
  );

  const stats = [
    {
      id: 'wait-time-estimated',
      icon: '⏳',
      value: patientsAhead === 0 ? 'Now' : `~${estimatedWaitTime}m`,
      label: 'Est. Wait Time',
      color: '#2563EB',
      bg: '#eff6ff',
    },
    {
      id: 'wait-time-avg-consult',
      icon: '🩺',
      value: `${avgConsultTime}m`,
      label: 'Avg Consult Time',
      color: '#14B8A6',
      bg: '#f0fdfa',
    },
    {
      id: 'wait-time-patients-ahead',
      icon: '👥',
      value: patientsAhead,
      label: 'Patients Ahead',
      color: '#f59e0b',
      bg: '#fffbeb',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background: 'white',
        borderRadius: 20,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        marginBottom: 24,
        borderTop: '4px solid',
        borderImage: 'linear-gradient(90deg, #2563EB, #14B8A6) 1',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            flexShrink: 0,
          }}
        >
          🤖
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
            AI Wait Predictor
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Updates every 7 seconds · Based on live doctor speed
          </div>
        </div>

        {/* Live pulse badge */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        {stats.map((s) => (
          <motion.div
            key={s.id}
            whileHover={{ scale: 1.03 }}
            style={{
              background: s.bg,
              borderRadius: 14,
              padding: '14px 12px',
              textAlign: 'center',
              border: `1px solid ${s.color}22`,
            }}
          >
            <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.icon}</div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: s.color,
                letterSpacing: '-0.02em',
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      {patientsAhead === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: 14,
            padding: '10px 14px',
            borderRadius: 10,
            background: '#dcfce7',
            color: '#15803d',
            fontSize: '0.8rem',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          🎉 You're next! Please proceed to the consultation room.
        </motion.div>
      )}

      {completedPatients.length === 0 && (
        <div
          style={{
            marginTop: 14,
            fontSize: '0.75rem',
            color: '#94a3b8',
            textAlign: 'center',
          }}
        >
          Using fallback estimate · Prediction improves as consultations complete
        </div>
      )}
    </motion.div>
  );
}
