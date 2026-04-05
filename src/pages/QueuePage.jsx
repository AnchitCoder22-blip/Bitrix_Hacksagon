import { motion } from 'framer-motion';
import Icon from '../shared/Icon';

export default function QueuePage({ tokens, queue, onCheckIn, onTrack, estimateWaitTime }) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>My Queue</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track your appointments and queue position</p>
      </motion.div>

      {tokens.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'var(--card)', borderRadius: 'var(--radius)', padding: '60px 24px',
            textAlign: 'center', boxShadow: 'var(--card-shadow)',
            border: '1px solid rgba(226,232,240,0.5)',
          }}
        >
          <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>🎫</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No Active Tokens</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Book an appointment with a doctor to join the queue</p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tokens.map((token, i) => {
            const position = queue.findIndex(q => q.id === token.id);
            const waitTime = position >= 0 ? estimateWaitTime(position, 15) : 0;

            return (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
                  boxShadow: 'var(--card-shadow)',
                  borderLeft: `4px solid ${token.isEmergency ? 'var(--error)' : token.status === 'arrived' ? 'var(--success)' : 'var(--primary)'}`,
                  border: '1px solid rgba(226,232,240,0.5)',
                  borderLeftWidth: 4,
                  borderLeftColor: token.isEmergency ? 'var(--error)' : token.status === 'arrived' ? 'var(--success)' : 'var(--primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="hq-gradient-text" style={{
                        fontSize: '1.4rem', fontWeight: 800,
                      }}>#{token.tokenNumber}</span>
                      {token.isEmergency && <span className="badge badge-error">Emergency</span>}
                      {token.isVIP && <span className="badge badge-warning">VIP</span>}
                    </div>
                    <p style={{ fontWeight: 600, color: 'var(--text)' }}>{token.doctorName}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{token.specialty}</p>
                  </div>
                  <span className={`badge badge-${token.status === 'arrived' ? 'success' : token.status === 'served' ? 'info' : 'warning'}`}>
                    {token.status === 'arrived' ? '✓ Arrived' : token.status === 'served' ? 'Served' : 'Waiting'}
                  </span>
                </div>

                {/* Queue info */}
                {position >= 0 && (
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16,
                  }}>
                    <div style={{
                      background: 'var(--border-light)', borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{position + 1}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Position</div>
                    </div>
                    <div style={{
                      background: 'var(--border-light)', borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)' }}>{position}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Ahead</div>
                    </div>
                    <div style={{
                      background: 'var(--border-light)', borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--warning)' }}>~{waitTime}m</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Est. Wait</div>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                {position >= 0 && (
                  <div style={{
                    height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 16,
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(5, 100 - position * 10)}%` }}
                      transition={{ duration: 1 }}
                      style={{
                        height: '100%', borderRadius: 99,
                        background: 'var(--accent-gradient)',
                      }}
                    />
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {token.status !== 'arrived' && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onCheckIn(token)}
                      style={{
                        padding: '10px 20px', borderRadius: 10,
                        background: 'rgba(34,197,94,0.1)', color: '#15803d',
                        border: '1px solid rgba(34,197,94,0.2)', fontWeight: 600,
                        fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'var(--transition)',
                      }}
                    >
                      <Icon name="qrcode" size={16} /> Check In
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onTrack(token)}
                    style={{
                      padding: '10px 20px', borderRadius: 10,
                      background: 'rgba(0,169,242,0.1)', color: 'var(--primary)',
                      border: '1px solid rgba(0,169,242,0.2)', fontWeight: 600,
                      fontSize: '0.85rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'var(--transition)',
                    }}
                  >
                    <Icon name="mapPin" size={16} /> Track
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
