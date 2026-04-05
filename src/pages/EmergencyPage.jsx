import { motion } from 'framer-motion';
import Icon from '../shared/Icon';

export default function EmergencyPage({ onEmergencyBook, addToast }) {
  const emergencyContacts = [
    { label: 'Ambulance', number: '108', icon: '🚑' },
    { label: 'Emergency', number: '112', icon: '🆘' },
    { label: 'Clinic Direct', number: '+91 9876543210', icon: '🏥' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4, color: 'var(--error)' }}>
          🚨 Emergency Services
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Quick access to emergency healthcare services</p>
      </motion.div>

      {/* Emergency CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          borderRadius: 'var(--radius-lg)', padding: 36, textAlign: 'center',
          color: 'var(--text-muted)', marginBottom: 24,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ fontSize: 56, marginBottom: 16 }}
        >🚨</motion.div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Need Immediate Help?</h3>
        <p style={{ opacity: 0.9, marginBottom: 24 }}>
          Skip the queue and get priority access to emergency care
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onEmergencyBook?.();
            addToast?.('Emergency token created! You have priority access.', 'warning');
          }}
          style={{
            padding: '16px 40px', borderRadius: 14,
            background: 'var(--card)', color: 'var(--error)',
            fontWeight: 700, fontSize: '1.05rem',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <Icon name="emergency" size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Emergency Priority Token
        </motion.button>
      </motion.div>

      {/* Emergency Contacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
          boxShadow: 'var(--card-shadow)', marginBottom: 24,
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Emergency Contacts</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {emergencyContacts.map((c, i) => (
            <motion.a
              key={i}
              href={`tel:${c.number}`}
              whileHover={{ x: 4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 14,
                background: 'rgba(239,68,68,0.06)', textDecoration: 'none',
                transition: 'var(--transition)',
                border: '1px solid rgba(239,68,68,0.1)',
              }}
            >
              <span style={{ fontSize: 28 }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{c.number}</div>
              </div>
              <Icon name="phone" size={20} color="var(--error)" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Safety Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
          boxShadow: 'var(--card-shadow)',
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>While You Wait</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Stay calm and take deep breaths',
            'Keep the patient comfortable and still',
            'Do not give food or water if unconscious',
            'Note the time when symptoms started',
            'Have identification and insurance ready',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <Icon name="check" size={16} color="var(--success)" />
              {tip}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
