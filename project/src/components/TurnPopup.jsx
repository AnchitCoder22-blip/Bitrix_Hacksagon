import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';

export default function TurnPopup({ show, token, patientsAhead, onNavigate, onOnMyWay, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 20,
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: 24,
              padding: 32,
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 36, color: 'white',
              }}
            >
              🔔
            </motion.div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Your Turn is Near!</h2>
            <p style={{ color: '#64748b', marginBottom: 20 }}>
              Token <strong>#{token?.tokenNumber}</strong> — <strong>{patientsAhead}</strong> patient{patientsAhead !== 1 ? 's' : ''} ahead
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={onNavigate}
                style={{
                  padding: '14px 28px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                  color: 'white', fontWeight: 600, fontSize: '0.95rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  border: 'none', cursor: 'pointer',
                }}
              >
                <Icon name="navigation" size={18} /> Navigate to Clinic
              </button>
              <button
                onClick={onOnMyWay}
                style={{
                  padding: '14px 28px', borderRadius: 12,
                  background: '#f0fdf4', color: '#15803d',
                  fontWeight: 600, fontSize: '0.95rem',
                  border: '2px solid #22c55e', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                🏃 I'm on my way!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
