import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DoctorQueueControl({ 
  queue = [],
  onStart, 
  onEnd, 
  onEmergency, 
  onSkip, 
  onRescheduleClick, 
  onFollowUpClick 
}) {
  const [activeConsultationId, setActiveConsultationId] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (activeConsultationId) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeConsultationId]);

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = (patient) => {
    setActiveConsultationId(patient.id);
    onStart(patient);
  };

  const handleEnd = (patient) => {
    setActiveConsultationId(null);
    onEnd(patient);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      style={{
        background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
        boxShadow: 'var(--card-shadow)',
        border: '1px solid rgba(226,232,240,0.5)',
      }}
    >
      <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Queue Management ({queue.length})</h3>
      {queue.length === 0 ? (
        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 32 }}>No patients in queue</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {queue.map((patient, i) => {
            const isActive = activeConsultationId === patient.id;

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14,
                  padding: '16px', borderRadius: 12,
                  background: isActive ? 'rgba(0,169,242,0.06)' : i === 0 ? 'var(--border-light)' : 'var(--card)',
                  border: `1px solid ${isActive ? 'rgba(0,169,242,0.3)' : 'var(--border)'}`,
                  borderLeft: `4px solid ${patient.isEmergency ? 'var(--error)' : isActive ? 'var(--primary)' : patient.status === 'arrived' ? 'var(--success)' : 'var(--border)'}`,
                }}
              >
                <div style={{ minWidth: '40px', fontWeight: 800, color: isActive ? 'var(--primary)' : 'var(--text-secondary)' }}>
                  #{patient.tokenNumber}
                </div>
                
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{patient.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: 8, marginTop: 4 }}>
                    <span>{patient.status === 'arrived' ? '✓ Arrived' : '⏳ Waiting'}</span>
                    {patient.isEmergency && <span style={{ color: 'var(--error)', fontWeight: 600 }}>🚨 Emergency</span>}
                  </div>
                </div>

                {isActive && (
                  <div style={{
                    padding: '6px 12px', borderRadius: 8, background: 'rgba(0,169,242,0.1)', color: 'var(--primary-dark)', 
                    fontWeight: 700, fontFamily: 'monospace', fontSize: '1.1rem'
                  }}>
                    ⏱ {formatTimer(timerSeconds)}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {!isActive ? (
                    <button onClick={() => handleStart(patient)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, background: 'var(--primary)', color: 'var(--text-muted)',
                        fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer'
                      }}>
                      Play
                    </button>
                  ) : (
                    <button onClick={() => handleEnd(patient)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, background: 'var(--success)', color: 'var(--text-muted)',
                        fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer'
                      }}>
                      Stop
                    </button>
                  )}

                  {!patient.isEmergency && (
                    <button onClick={() => onEmergency(patient)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.06)', color: 'var(--error)',
                        fontWeight: 600, fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer'
                      }}>
                      🚨 Override
                    </button>
                  )}

                  <button onClick={() => onSkip(patient.id)}
                    style={{
                      padding: '8px 14px', borderRadius: 8, background: 'var(--border-light)', color: 'var(--text-secondary)',
                      fontWeight: 600, fontSize: '0.8rem', border: '1px solid var(--border)', cursor: 'pointer'
                    }}>
                    Skip
                  </button>

                  <button onClick={() => onRescheduleClick(patient)}
                    style={{
                      padding: '8px 14px', borderRadius: 8, background: 'var(--card)', color: 'var(--text-secondary)',
                      fontWeight: 600, fontSize: '0.8rem', border: '1px solid var(--border)', cursor: 'pointer'
                    }}>
                    Reschedule
                  </button>

                  <button onClick={() => onFollowUpClick(patient)}
                    style={{
                      padding: '8px 14px', borderRadius: 8, background: 'rgba(34,197,94,0.06)', color: 'var(--success)',
                      fontWeight: 600, fontSize: '0.8rem', border: '1px solid rgba(34,197,94,0.2)', cursor: 'pointer'
                    }}>
                    📅 Follow-up
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
