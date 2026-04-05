import { motion } from 'framer-motion';

export default function RoleSelection({ onSelectRole }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius-lg)', padding: 48,
          boxShadow: 'var(--card-shadow)', maxWidth: 800, width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 24px',
          background: 'var(--accent-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32
        }}>🏥</div>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>
          Welcome to <span className="hq-gradient-text">HealthQueue</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 48 }}>
          Please select your role to continue into the platform.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {/* Patient Card */}
          <motion.button
            whileHover={{ y: -6, boxShadow: '0 12px 24px rgba(0,169,242,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('patient')}
            style={{
              padding: '32px 24px', borderRadius: 'var(--radius)', border: '2px solid var(--border)',
              background: 'var(--card)', cursor: 'pointer', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', gap: 16, transition: 'var(--transition)'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: '4rem' }}>👤</div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Continue as Patient</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Find doctors, book tokens, and track your queue in real-time.</p>
            </div>
          </motion.button>

          {/* Doctor Card */}
          <motion.button
            whileHover={{ y: -6, boxShadow: '0 12px 24px rgba(20,184,166,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('doctor')}
            style={{
              padding: '32px 24px', borderRadius: 'var(--radius)', border: '2px solid var(--border)',
              background: 'var(--card)', cursor: 'pointer', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', gap: 16, transition: 'var(--transition)'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--secondary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: '4rem' }}>👨‍⚕️</div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Continue as Doctor</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage your schedule, handle active queues, and conduct appointments.</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
