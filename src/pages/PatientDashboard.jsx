import { motion } from 'framer-motion';
import BannerCarousel from '../components/BannerCarousel';
import Icon from '../shared/Icon';

const quickActions = [
  { label: 'Find Doctor', icon: 'doctor', page: 'doctors', gradient: 'linear-gradient(135deg, #2563EB, #3b82f6)' },
  { label: 'My Queue', icon: 'queue', page: 'queue', gradient: 'linear-gradient(135deg, #14B8A6, #2dd4bf)' },
  { label: 'Lab Tests', icon: 'flask', page: 'lab-tests', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { label: 'AI Chat', icon: 'chat', page: 'chat', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  { label: 'Emergency', icon: 'emergency', page: 'emergency', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  { label: 'Tracking', icon: 'mapPin', page: 'tracking', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
];

export default function PatientDashboard({ onNav, tokens = [], user }) {
  const activeTokens = tokens.filter(t => t.status !== 'served');

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
          Welcome back, <span className="gradient-text">{user?.name || 'Patient'}</span> 👋
        </h2>
        <p style={{ color: '#64748b' }}>Here's your health overview for today</p>
      </motion.div>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: 28 }}
      >
        <BannerCarousel />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: 28 }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
        }}>
          {quickActions.map((a, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNav(a.page)}
              style={{
                background: 'white', borderRadius: 16, padding: '20px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                cursor: 'pointer', border: 'none', transition: 'all 0.3s',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: a.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={a.icon} size={20} color="white" />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>{a.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Active Tokens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Active Tokens</h3>
        {activeTokens.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 16, padding: '40px 24px',
            textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🎫</span>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>No active tokens</p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 16 }}>Book an appointment to get started</p>
            <button onClick={() => onNav('doctors')} className="btn-primary" style={{ padding: '10px 24px' }}>
              Find a Doctor
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeTokens.map((token, i) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'white', borderRadius: 16, padding: 20,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', gap: 16,
                  borderLeft: `4px solid ${token.isEmergency ? '#ef4444' : '#2563EB'}`,
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: token.isEmergency
                    ? 'linear-gradient(135deg, #fecaca, #fef2f2)'
                    : 'linear-gradient(135deg, #dbeafe, #eff6ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', fontWeight: 800,
                  color: token.isEmergency ? '#dc2626' : '#2563EB',
                }}>
                  #{token.tokenNumber}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{token.doctorName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{token.specialty}</div>
                </div>
                <span className={`badge badge-${token.status === 'arrived' ? 'success' : token.isEmergency ? 'error' : 'info'}`}>
                  {token.status === 'arrived' ? 'Arrived' : token.isEmergency ? 'Emergency' : 'Waiting'}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
