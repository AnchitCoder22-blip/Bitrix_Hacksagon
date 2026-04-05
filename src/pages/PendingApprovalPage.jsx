import { motion } from 'framer-motion';

export default function PendingApprovalPage({ onLogout }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
      padding: 24
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--card)', borderRadius: 24, padding: 48,
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)', maxWidth: 500, width: '100%',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: 24 }}>⏳</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Waiting for Approval</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
          Your doctor registration has been received. You will be able to access the Doctor Dashboard once an administrator approves your account.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          style={{
            padding: '12px 24px', borderRadius: 12, border: '1px solid #e2e8f0',
            background: 'var(--card)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Logout & Return Home
        </motion.button>
      </motion.div>
    </div>
  );
}
