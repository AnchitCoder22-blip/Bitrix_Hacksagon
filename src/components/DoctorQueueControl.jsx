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
        background: 'white', borderRadius: 20, padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Queue Management ({queue.length})</h3>
      {queue.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: 32 }}>No patients in queue</p>
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
                  background: isActive ? '#eff6ff' : i === 0 ? '#f8fafc' : 'white',
                  border: `1px solid ${isActive ? '#93c5fd' : '#e2e8f0'}`,
                  borderLeft: `4px solid ${patient.isEmergency ? '#ef4444' : isActive ? '#2563EB' : patient.status === 'arrived' ? '#22c55e' : '#e2e8f0'}`,
                }}
              >
                <div style={{ minWidth: '40px', fontWeight: 800, color: isActive ? '#2563EB' : '#64748b' }}>
                  #{patient.tokenNumber}
                </div>
                
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{patient.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: 8, marginTop: 4 }}>
                    <span>{patient.status === 'arrived' ? '✓ Arrived' : '⏳ Waiting'}</span>
                    {patient.isEmergency && <span style={{ color: '#dc2626', fontWeight: 600 }}>🚨 Emergency</span>}
                  </div>
                </div>

                {isActive && (
                  <div style={{
                    padding: '6px 12px', borderRadius: 8, background: '#dbeafe', color: '#1e40af', 
                    fontWeight: 700, fontFamily: 'monospace', fontSize: '1.1rem'
                  }}>
                    ⏱ {formatTimer(timerSeconds)}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {!isActive ? (
                    <button onClick={() => handleStart(patient)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, background: '#2563EB', color: 'white',
                        fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer'
                      }}>
                      Play
                    </button>
                  ) : (
                    <button onClick={() => handleEnd(patient)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, background: '#10b981', color: 'white',
                        fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer'
                      }}>
                      Stop
                    </button>
                  )}

                  {!patient.isEmergency && (
                    <button onClick={() => onEmergency(patient)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, background: '#fef2f2', color: '#dc2626',
                        fontWeight: 600, fontSize: '0.8rem', border: '1px solid #fecaca', cursor: 'pointer'
                      }}>
                      🚨 Override
                    </button>
                  )}

                  <button onClick={() => onSkip(patient.id)}
                    style={{
                      padding: '8px 14px', borderRadius: 8, background: '#f8fafc', color: '#475569',
                      fontWeight: 600, fontSize: '0.8rem', border: '1px solid #cbd5e1', cursor: 'pointer'
                    }}>
                    Skip
                  </button>

                  <button onClick={() => onRescheduleClick(patient)}
                    style={{
                      padding: '8px 14px', borderRadius: 8, background: 'white', color: '#64748b',
                      fontWeight: 600, fontSize: '0.8rem', border: '1px solid #cbd5e1', cursor: 'pointer'
                    }}>
                    Reschedule
                  </button>

                  <button onClick={() => onFollowUpClick(patient)}
                    style={{
                      padding: '8px 14px', borderRadius: 8, background: '#f0fdf4', color: '#16a34a',
                      fontWeight: 600, fontSize: '0.8rem', border: '1px solid #bbf7d0', cursor: 'pointer'
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
