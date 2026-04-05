import { motion } from 'framer-motion';

export default function QueueHealthBanner({ 
  health = { color: '#22c55e', label: 'Low Load', waitingCount: 2, arrivedCount: 5, noShowCount: 1 }, 
  avgWaitPerDoctor = 15 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: `linear-gradient(135deg, ${health.color}15, ${health.color}08)`,
        borderRadius: 16, padding: '16px 20px', marginBottom: 20,
        border: `1px solid ${health.color}30`,
        display: 'flex', alignItems: 'center', gap: 14,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          width: 12, height: 12, borderRadius: '50%',
          background: health.color,
          boxShadow: `0 0 12px ${health.color}60`,
        }}
      />
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 700, color: health.color }}>{health.label}</span>
        <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: 12 }}>
          {health.waitingCount} waiting • {health.arrivedCount} arrived • {health.noShowCount} no-shows
        </span>
      </div>
      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
        Avg Wait: <strong style={{ color: health.color }}>{avgWaitPerDoctor}m</strong>
      </div>
    </motion.div>
  );
}
