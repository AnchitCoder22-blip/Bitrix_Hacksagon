import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import { useSystem } from '../context/SystemContext';

export default function QueuePage({ onCheckIn }) {
  const { tokens, queue, estimateWaitTime, getPosition, getQueueHealth, onNav } = useSystem();
  const health = getQueueHealth();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>My Queue</h2>
            <p style={{ color: '#64748b' }}>Track your appointments and queue position</p>
          </div>
          {/* Queue Health Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 99,
            background: `${health.color}15`, border: `1px solid ${health.color}30`,
          }}>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: health.color }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: health.color }}>{health.label}</span>
          </div>
        </div>
      </motion.div>

      {tokens.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'white', borderRadius: 20, padding: '60px 24px',
            textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>🎫</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No Active Tokens</h3>
          <p style={{ color: '#64748b', marginBottom: 24 }}>Book an appointment with a doctor to join the queue</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => onNav('doctors')} className="btn-primary" style={{ padding: '12px 28px' }}>
            Find a Doctor
          </motion.button>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tokens.map((token, i) => {
            const position = getPosition(token.id);
            const inQueue = position !== null && position >= 0;
            const waitTime = inQueue ? estimateWaitTime(position) : 0;
            const isNearFront = inQueue && position <= 2;

            // Determine status label and style
            let statusLabel = 'Waiting';
            let statusBadge = 'warning';
            if (token.status === 'arrived') { statusLabel = '✓ Arrived'; statusBadge = 'success'; }
            else if (token.status === 'ongoing') { statusLabel = '🔵 In Progress'; statusBadge = 'info'; }
            else if (token.status === 'completed') { statusLabel = '✓ Completed'; statusBadge = 'success'; }
            else if (token.status === 'skipped') { statusLabel = 'Skipped'; statusBadge = 'error'; }
            else if (token.status === 'no-show') { statusLabel = 'No Show'; statusBadge = 'error'; }

            return (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                style={{
                  background: 'white', borderRadius: 20, padding: 24,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  borderLeft: `4px solid ${token.isEmergency ? '#ef4444' : token.status === 'arrived' ? '#22c55e' : isNearFront ? '#f59e0b' : '#2563EB'}`,
                  transition: 'all 0.3s',
                }}
              >
                {/* Delay Alert */}
                {inQueue && waitTime > 30 && (
                  <div style={{
                    background: '#fef3c7', borderRadius: 10, padding: '8px 14px',
                    marginBottom: 14, fontSize: '0.82rem', fontWeight: 600, color: '#b45309',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    ⏰ Long wait expected — estimated ~{waitTime} minutes
                  </div>
                )}

                {/* Near-front Alert */}
                {isNearFront && token.status !== 'arrived' && (
                  <motion.div
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                      background: '#eff6ff', borderRadius: 10, padding: '8px 14px',
                      marginBottom: 14, fontSize: '0.82rem', fontWeight: 600, color: '#2563EB',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    🔔 Your turn is coming up! Get ready.
                  </motion.div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: '1.4rem', fontWeight: 800,
                        background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}>#{token.tokenNumber}</span>
                      {token.isEmergency && <span className="badge badge-error">Emergency</span>}
                      {token.isVIP && <span className="badge badge-warning">VIP</span>}
                    </div>
                    <p style={{ fontWeight: 600 }}>{token.doctorName}</p>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{token.specialty}</p>
                  </div>
                  <span className={`badge badge-${statusBadge}`}>{statusLabel}</span>
                </div>

                {/* Queue info */}
                {inQueue && (
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16,
                  }}>
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563EB' }}>{position + 1}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Position</div>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#14B8A6' }}>{position}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ahead</div>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: waitTime > 30 ? '#ef4444' : '#f59e0b' }}>~{waitTime}m</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Est. Wait</div>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                {inQueue && (
                  <div style={{
                    height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden', marginBottom: 16,
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(5, 100 - position * 10)}%` }}
                      transition={{ duration: 1 }}
                      style={{
                        height: '100%', borderRadius: 99,
                        background: 'linear-gradient(90deg, #2563EB, #14B8A6)',
                      }}
                    />
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {token.status === 'waiting' && (
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(34,197,94,0.2)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onCheckIn(token)}
                      style={{
                        padding: '10px 20px', borderRadius: 10,
                        background: '#f0fdf4', color: '#15803d',
                        border: '1px solid #bbf7d0', fontWeight: 600,
                        fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon name="qrcode" size={16} /> Check In
                    </motion.button>
                  )}
                  {inQueue && (
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(37,99,235,0.2)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onNav('tracking')}
                      style={{
                        padding: '10px 20px', borderRadius: 10,
                        background: '#eff6ff', color: '#2563EB',
                        border: '1px solid #bfdbfe', fontWeight: 600,
                        fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon name="mapPin" size={16} /> Track
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
