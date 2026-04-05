import { motion } from 'framer-motion';
import { useMemo } from 'react';
import BannerCarousel from '../components/BannerCarousel';
import PatientHistory from '../components/PatientHistory';
import Icon from '../shared/Icon';
import { getRecommendedSpecialization, getUpcomingFollowUps } from '../utils/smartDoctorSuggest';

const quickActions = [
  { label: 'Find Doctor', icon: 'doctor', page: 'doctors', gradient: 'linear-gradient(135deg, #00A9F2, #33bbf5)' },
  { label: 'My Queue', icon: 'queue', page: 'queue', gradient: 'linear-gradient(135deg, #14B8A6, #2dd4bf)' },
  { label: 'Lab Tests', icon: 'flask', page: 'lab-tests', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { label: 'AI Chat', icon: 'chat', page: 'chat', gradient: 'linear-gradient(135deg, #787CFE, #a78bfa)' },
  { label: 'Emergency', icon: 'emergency', page: 'emergency', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  { label: 'Tracking', icon: 'mapPin', page: 'tracking', gradient: 'linear-gradient(135deg, #C53F7B, #e879a8)' },
];

export default function PatientDashboard({ onNav, tokens = [], user }) {
  const activeTokens = tokens.filter(t => t.status !== 'served');

  // Load fresh patient data from localStorage to get the latest history
  const freshPatient = useMemo(() => {
    try {
      const allPatients = JSON.parse(window.localStorage.getItem('patients') || '[]');
      const found = allPatients.find(
        p => p.username === user?.username || p.name === user?.name
      );
      return found || user;
    } catch {
      return user;
    }
  }, [user]);

  const suggestion = useMemo(() => getRecommendedSpecialization(freshPatient), [freshPatient]);
  const followUps = useMemo(() => getUpcomingFollowUps(freshPatient), [freshPatient]);

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
          Welcome back, <span className="hq-gradient-text">{user?.name || 'Patient'}</span> 👋
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Here's your health overview for today</p>
      </motion.div>

      {/* Smart Doctor Suggestion */}
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            background: 'linear-gradient(135deg, rgba(0,169,242,0.08), rgba(0,169,242,0.04))',
            borderRadius: 18, padding: '18px 22px', marginBottom: 20,
            border: '1px solid rgba(0,169,242,0.2)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 22 }}>🧠</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)', marginBottom: 2 }}>
              Smart Recommendation
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
              Based on your history, consider booking a <strong>{suggestion.recommendedSpecialization}</strong> ({suggestion.visitCount} of {suggestion.totalVisits} past visits)
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNav('doctors')}
            style={{
              padding: '8px 16px', borderRadius: 10,
              background: 'var(--primary)', color: 'var(--text-muted)',
              fontWeight: 700, fontSize: '0.82rem',
              border: 'none', cursor: 'pointer', flexShrink: 0,
            }}
          >
            Find →
          </motion.button>
        </motion.div>
      )}

      {/* Upcoming Follow-ups */}
      {followUps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04))',
            borderRadius: 18, padding: '18px 22px', marginBottom: 20,
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#92400e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            📅 Upcoming Follow-ups
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {followUps.map((fu, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--glass-bg)', borderRadius: 12, padding: '12px 16px',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0,
                }}>
                  {new Date(fu.followUpDate).getDate()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#78350f' }}>
                    {fu.diagnosis || 'Follow-up Visit'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#92400e' }}>
                    👨‍⚕️ {fu.doctorName} &bull; {new Date(fu.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
              whileHover={{ y: -4, boxShadow: 'var(--card-shadow-hover)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNav(a.page)}
              style={{
                background: 'var(--card)', borderRadius: 16, padding: '20px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                boxShadow: 'var(--card-shadow)',
                cursor: 'pointer', border: '1px solid rgba(226,232,240,0.5)', transition: 'var(--transition)',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: a.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={a.icon} size={20} color="white" />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{a.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Active Tokens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginBottom: 28 }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Live Queue Tokens</h3>
        {activeTokens.filter(t => t.status !== 'pending').length === 0 ? (
          <div style={{
            background: 'var(--card)', borderRadius: 16, padding: '40px 24px',
            textAlign: 'center', boxShadow: 'var(--card-shadow)',
            border: '1px solid rgba(226,232,240,0.5)',
          }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🎫</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No active queue tokens</p>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: 16 }}>Check-in or Walk-in to join the queue</p>
            <button onClick={() => onNav('doctors')} className="btn-primary" style={{ padding: '10px 24px' }}>
              Find a Doctor
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeTokens.filter(t => t.status !== 'pending').map((token, i) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'var(--card)', borderRadius: 16, padding: 20,
                  boxShadow: 'var(--card-shadow)',
                  display: 'flex', alignItems: 'center', gap: 16,
                  borderLeft: `4px solid ${token.isEmergency ? 'var(--error)' : 'var(--primary)'}`,
                  border: '1px solid rgba(226,232,240,0.5)',
                  borderLeftWidth: 4,
                  borderLeftColor: token.isEmergency ? 'var(--error)' : 'var(--primary)',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: token.isEmergency
                    ? 'rgba(239,68,68,0.1)'
                    : 'rgba(0,169,242,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', fontWeight: 800,
                  color: token.isEmergency ? 'var(--error)' : 'var(--primary)',
                }}>
                  #{token.tokenNumber}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{token.doctorName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{token.specialty}</div>
                </div>
                <span className={`badge badge-${token.status === 'arrived' ? 'success' : token.isEmergency ? 'error' : 'info'}`}>
                  {token.status === 'arrived' ? 'Arrived' : token.isEmergency ? 'Emergency' : 'Waiting'}
                </span>
                {token.type === 'scheduled' && (
                  <span className="badge badge-warning" style={{ background: '#fef3c7', color: '#b45309' }}>
                    Scheduled
                  </span>
                )}
                {token.type === 'offline' && (
                  <span className="badge badge-warning" style={{ background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                    Offline
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upcoming Scheduled Tokens */}
      {activeTokens.filter(t => t.status === 'pending' && t.type === 'scheduled').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ marginBottom: 28 }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            🕒 Upcoming Scheduled Appointments
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeTokens.filter(t => t.status === 'pending' && t.type === 'scheduled').map((token, i) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'var(--bg-subtle)', borderRadius: 16, padding: 20,
                  display: 'flex', alignItems: 'center', gap: 16,
                  border: '1px dashed var(--border)',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(100, 116, 139, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', fontWeight: 800,
                  color: 'var(--text-secondary)',
                }}>
                  📅
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{token.doctorName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 600, marginTop: 4 }}>
                    {new Date(token.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <span className="badge badge-warning" style={{ background: '#fef3c7', color: '#b45309' }}>
                  Scheduled (Auto-Activates)
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* My Medical History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="doctor" size={18} color="var(--primary)" />
          My Medical History
        </h3>
        <PatientHistory patient={freshPatient} />
      </motion.div>
    </div>
  );
}
