import { motion } from 'framer-motion';

export default function SecondaryQueueManager({ secondaryQueue = [], onReAdd }) {
  if (secondaryQueue.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      style={{
        background: 'white', borderRadius: 20, padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 24,
      }}
    >
      <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
        Secondary Queue Management ({secondaryQueue.length})
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
        Patients who missed their turn, were late, or skipped.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {secondaryQueue.map((p) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 12, background: '#f8fafc',
            borderLeft: `3px solid ${p.status === 'no-show' ? '#ef4444' : p.status === 'late' ? '#f59e0b' : '#94a3b8'}`,
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', minWidth: 50 }}>
              #{p.tokenNumber}
            </span>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</span>
              <span style={{ 
                marginLeft: 8, fontSize: '0.72rem', padding: '2px 8px', borderRadius: 99,
                background: p.status === 'no-show' ? '#fecaca' : '#fef3c7',
                color: p.status === 'no-show' ? '#dc2626' : '#b45309'
              }}>
                {p.status}
              </span>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => onReAdd?.(p.id)}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                background: '#dbeafe', color: '#2563EB', border: 'none', cursor: 'pointer',
              }}>
              Re-Add to Main Queue
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
