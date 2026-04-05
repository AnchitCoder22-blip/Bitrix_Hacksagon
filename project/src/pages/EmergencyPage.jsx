import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import { useSystem } from '../context/SystemContext';

export default function EmergencyPage({ }) {
  const { handleEmergencyBook, addNotification } = useSystem();

  const handleEmergency = () => {
    handleEmergencyBook();
    addNotification('Emergency token created — you have top priority!', 'warning');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Emergency</h2>
        <p style={{ color: '#64748b' }}>For urgent medical needs — get immediate priority access</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #fef2f2, #fff1f2)',
          borderRadius: 20, padding: 32, textAlign: 'center',
          border: '2px solid #fecaca', marginBottom: 24,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 36, color: 'white',
          }}
        >🚨</motion.div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>
          Emergency Queue Access
        </h3>
        <p style={{ color: '#64748b', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
          This will create an emergency token with the highest priority. You will be moved to the front of the queue immediately.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleEmergency}
          style={{
            padding: '16px 40px', borderRadius: 14,
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white', fontWeight: 700, fontSize: '1rem',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(239,68,68,0.3)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}
        >
          <Icon name="emergency" size={20} color="white" /> Request Emergency Token
        </motion.button>
      </motion.div>

      {/* Emergency numbers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{
          background: 'white', borderRadius: 20, padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Emergency Contacts</h3>
        {[
          { label: 'Ambulance', number: '102', icon: '🚑' },
          { label: 'Police', number: '100', icon: '🚔' },
          { label: 'Fire', number: '101', icon: '🚒' },
          { label: 'Emergency Helpline', number: '112', icon: '📞' },
        ].map((c, i) => (
          <motion.div key={i}
            whileHover={{ backgroundColor: '#f1f5f9', x: 4 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px', borderRadius: 12, marginBottom: 8,
              background: '#f8fafc', transition: 'all 0.2s', cursor: 'pointer',
            }}
            onClick={() => window.open(`tel:${c.number}`)}
          >
            <span style={{ fontSize: 28 }}>{c.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{c.label}</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{c.number}</div>
            </div>
            <Icon name="phone" size={18} color="#2563EB" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
