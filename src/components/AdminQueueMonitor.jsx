import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminQueueMonitor({ doctors, queue, scheduledQueue = [], onMove, onRemove, onBoost }) {
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [moveDropdownFor, setMoveDropdownFor] = useState(null); // patient id

  const getLoadStatus = (count) => {
    if (count > 10) return { label: 'High Load', color: '#ef4444', dot: '🔴' };
    if (count >= 5) return { label: 'Medium', color: '#f59e0b', dot: '🟡' };
    return { label: 'Low', color: '#22c55e', dot: '🟢' };
  };

  const calculateWaitTime = (count) => `${count * 15}m`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {doctors.length > 1 && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1, padding: 12, background: '#fee2e2', borderRadius: 12, border: '1px solid #fca5a5' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b91c1c' }}>MOST BUSY 🔴</span>
            <div style={{ fontWeight: 600, color: '#7f1d1d' }}>
              {doctors.reduce((max, d) => {
                const qLen = queue.filter(q => q.doctorId === d.id || q.doctorName === d.name || q.doctorName === d.username).length;
                return qLen > max.len ? { doc: d, len: qLen } : max;
              }, { len: -1 }).doc?.name || 'N/A'}
            </div>
          </div>
          <div style={{ flex: 1, padding: 12, background: '#dcfce7', borderRadius: 12, border: '1px solid #86efac' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d' }}>LEAST BUSY 🟢</span>
            <div style={{ fontWeight: 600, color: '#14532d' }}>
               {doctors.reduce((min, d) => {
                const qLen = queue.filter(q => q.doctorId === d.id || q.doctorName === d.name || q.doctorName === d.username).length;
                return qLen < min.len ? { doc: d, len: qLen } : min;
              }, { len: Infinity }).doc?.name || 'N/A'}
            </div>
          </div>
        </div>
      )}
      {doctors.map(doc => {
        // Find queue specifically for this doctor
        const docQueue = queue.filter(q => q.doctorId === doc.id || q.doctorName === doc.name || q.doctorName === doc.username);
        const docScheduledQueue = scheduledQueue.filter(q => q.doctorId === doc.id || q.doctorName === doc.name || q.doctorName === doc.username);
        
        const load = getLoadStatus(docQueue.length);
        const isExpanded = expandedDoc === doc.id;
        const currentActive = docQueue.length > 0 ? docQueue[0] : null;
        
        return (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'var(--card)', borderRadius: 20,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden'
            }}
          >
            {/* Header / Summary */}
            <div 
              style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, cursor: 'pointer', background: isExpanded ? 'var(--border-light)' : 'var(--card)' }}
              onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
            >
              <div style={{ flex: '1 1 200px' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{doc.name || doc.username}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{doc.specialty || doc.specialization}</div>
              </div>
              
              <div style={{ display: 'flex', gap: 24, fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</div>
                  <div style={{ fontWeight: 600, color: doc.available !== false ? '#22c55e' : '#ef4444' }}>
                    {doc.available !== false ? 'Available' : 'Busy/Leave'}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Active</div>
                  <div style={{ fontWeight: 600 }}>{docQueue.length}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Scheduled</div>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{docScheduledQueue.length}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Load</div>
                  <div style={{ fontWeight: 600, color: load.color }}>{load.dot} {load.label}</div>
                </div>
                {currentActive && (
                  <div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Patient</div>
                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>#{currentActive.tokenNumber} {currentActive.name.split(' ')[0]}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Patient List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)', marginTop: 12 }}>
                    {docQueue.length === 0 && docScheduledQueue.length === 0 ? (
                      <p style={{ color: 'var(--text-light)', padding: '16px 0' }}>No patients waiting.</p>
                    ) : (
                      <>
                        {/* Active Queue Display */}
                        {docQueue.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>LIVE QUEUE</div>
                            {docQueue.map((p, idx) => (
                              <div key={p.id} style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                                background: p.isEmergency ? 'rgba(239,68,68,0.06)' : 'var(--card)', borderRadius: 12,
                                border: `1px solid ${p.isEmergency ? 'var(--error)' : 'var(--border)'}`,
                                borderLeftWidth: 4
                              }}>
                                <div style={{
                                  background: 'var(--primary)', color: 'var(--text-muted)', padding: '4px 8px',
                                  borderRadius: 6, fontWeight: 700, fontSize: '0.8rem'
                                }}>
                                  #{p.tokenNumber}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    Pos: {idx + 1} • {p.status} • Type: {p.type || 'Offline'} {p.isEmergency ? '• EMERGENCY' : ''}
                                  </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onBoost(p.id); }}
                                    style={actionStyle('#f59e0b', '#fffbeb')}
                                    title="Boost Patient to Top"
                                  >
                                    Boost
                                  </button>
                                  
                                  <div style={{ position: 'relative' }}>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setMoveDropdownFor(moveDropdownFor === p.id ? null : p.id); }}
                                      style={actionStyle('#2563EB', '#eff6ff')}
                                    >
                                      Move
                                    </button>
                                    {moveDropdownFor === p.id && (
                                      <div style={{
                                        position: 'absolute', top: '100%', right: 0, marginTop: 4,
                                        background: 'var(--card)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        borderRadius: 12, padding: 8, zIndex: 10, minWidth: 160
                                      }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 4, padding: '0 4px' }}>Move to:</div>
                                        {doctors.filter(d => d.id !== doc.id && (d.specialty === doc.specialty || d.specialization === doc.specialization)).map(targetDoc => (
                                          <button
                                            key={targetDoc.id}
                                            onClick={() => { onMove(p.id, targetDoc); setMoveDropdownFor(null); }}
                                            style={{
                                              display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px',
                                              background: 'transparent', border: 'none', borderRadius: 6, fontSize: '0.85rem', cursor: 'pointer'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                          >
                                            {targetDoc.name || targetDoc.username}
                                          </button>
                                        ))}
                                        {doctors.filter(d => d.id !== doc.id && (d.specialty === doc.specialty || d.specialization === doc.specialization)).length === 0 && (
                                           <div style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '4px' }}>No matching doctors</div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <button 
                                    onClick={(e) => { e.stopPropagation(); if(confirm('Cancel this token completely?')) onRemove(p.id); }}
                                    style={actionStyle('#ef4444', '#fef2f2')}
                                    title="Cancel Token"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Scheduled Queue Display */}
                        {docScheduledQueue.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>UPCOMING SCHEDULED (Future Offline)</div>
                            {docScheduledQueue.map((p, idx) => (
                              <div key={p.id} style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                                background: 'var(--bg-subtle)', borderRadius: 12,
                                border: '1px dashed var(--border)',
                              }}>
                                <div style={{
                                  background: 'rgba(100, 116, 139, 0.1)', color: 'var(--text-secondary)', padding: '4px 8px',
                                  borderRadius: 6, fontWeight: 700, fontSize: '0.8rem'
                                }}>
                                  #{p.tokenNumber}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    Time: {new Date(p.scheduledTime).toLocaleString()} • Type: Scheduled
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                                    (Activates automatically)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

const actionStyle = (color, bg) => ({
  padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center',
  color: color, background: bg, border: 'none', borderRadius: 8, cursor: 'pointer'
});

