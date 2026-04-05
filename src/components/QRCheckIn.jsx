import { motion } from 'framer-motion';
import Icon from '../shared/Icon';

export default function QRCheckIn({ token, onCheckIn, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9998, padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--card)', borderRadius: 24, padding: 36,
          maxWidth: 380, width: '100%', textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{
          width: 160, height: 160, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #e0e7ff, #dbeafe)',
          borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <Icon name="qrcode" size={80} color="#2563EB" />
          <motion.div
            animate={{ y: [-80, 80] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            style={{
              position: 'absolute', left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, transparent, #2563EB, transparent)',
            }}
          />
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>QR Check-In</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
          Token <strong>#{token?.tokenNumber}</strong>
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 24 }}>
          Scan the QR code at the clinic or tap below to check in
        </p>
        <button
          onClick={onCheckIn}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #22c55e, #14B8A6)',
            color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Icon name="check" size={20} /> Confirm Arrival
        </button>
      </motion.div>
    </motion.div>
  );
}
