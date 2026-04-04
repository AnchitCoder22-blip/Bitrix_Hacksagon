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
        <p style={{ color: '#64748b' }}>Track your appointments and queue position</p>
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
          <p style={{ color: '#64748b' }}>Book an appointment with a doctor to join the queue</p>
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
                  background: 'white', borderRadius: 20, padding: 24,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  borderLeft: `4px solid ${token.isEmergency ? '#ef4444' : token.status === 'arrived' ? '#22c55e' : '#2563EB'}`,
                }}
              >
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
                      background: '#f8fafc', borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563EB' }}>{position + 1}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Position</div>
                    </div>
                    <div style={{
                      background: '#f8fafc', borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#14B8A6' }}>{position}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ahead</div>
                    </div>
                    <div style={{
                      background: '#f8fafc', borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>~{waitTime}m</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Est. Wait</div>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                {position >= 0 && (
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
                  {token.status !== 'arrived' && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onCheckIn(token)}
                      style={{
                        padding: '10px 20px', borderRadius: 10,
                        background: '#f0fdf4', color: '#15803d',
                        border: '1px solid #bbf7d0', fontWeight: 600,
                        fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
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
                      background: '#eff6ff', color: '#2563EB',
                      border: '1px solid #bfdbfe', fontWeight: 600,
                      fontSize: '0.85rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
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
