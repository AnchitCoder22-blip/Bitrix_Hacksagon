import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import useWaitTimePredictor from '../hooks/useWaitTimePredictor';

export default function DoctorInsights({ queue = [], completedPatients = [], served = [] }) {
  // Use the existing predictor to derive active real-time stats safely
  const { avgConsultTime } = useWaitTimePredictor(queue, completedPatients);

  // Compute Queue Health Load
  const len = queue.length;
  let healthLabel = 'Low Load';
  let healthColor = '#22c55e';
  
  if (len > 5 && len <= 15) {
    healthLabel = 'Moderate';
    healthColor = '#f59e0b';
  } else if (len > 15) {
    healthLabel = 'High Load';
    healthColor = '#ef4444';
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 16, marginBottom: 24,
    }}>
      {[
        { label: 'In Queue', value: queue.length, color: '#00A9F2', icon: 'queue' },
        { label: 'Avg Time (m)', value: avgConsultTime, color: '#787CFE', icon: 'chart' },
        { label: 'Patients Served', value: served.length, color: '#14b8a6', icon: 'check' },
        { label: 'Queue Load', value: healthLabel, color: healthColor, icon: 'chart' },
      ].map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{
            background: 'var(--card)', borderRadius: 16, padding: 20,
            boxShadow: 'var(--card-shadow)',
            border: '1px solid rgba(226,232,240,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={stat.icon} size={18} color={stat.color} />
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500 }}>{stat.label}</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
