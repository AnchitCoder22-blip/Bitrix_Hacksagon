import { motion } from 'framer-motion';

export default function RoleSelection({ onSelectRole }) {
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
          background: 'white', borderRadius: 24, padding: 48,
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)', maxWidth: 800, width: '100%',
          textAlign: 'center'
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32
        }}>🏥</div>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>
          Welcome to <span style={{ background: 'linear-gradient(135deg, #2563EB, #14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HealthQueue</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: 48 }}>
          Please select your role to continue into the platform.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {/* Patient Card */}
          <motion.button
            whileHover={{ y: -6, boxShadow: '0 12px 24px rgba(37,99,235,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('patient')}
            style={{
              padding: '32px 24px', borderRadius: 20, border: '2px solid #e2e8f0',
              background: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', gap: 16, transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#2563EB'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ fontSize: '4rem' }}>👤</div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Continue as Patient</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Find doctors, book tokens, and track your queue in real-time.</p>
            </div>
          </motion.button>

          {/* Doctor Card */}
          <motion.button
            whileHover={{ y: -6, boxShadow: '0 12px 24px rgba(20,184,166,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('doctor')}
            style={{
              padding: '32px 24px', borderRadius: 20, border: '2px solid #e2e8f0',
              background: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', gap: 16, transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#14B8A6'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ fontSize: '4rem' }}>👨‍⚕️</div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Continue as Doctor</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Manage your schedule, handle active queues, and conduct appointments.</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
