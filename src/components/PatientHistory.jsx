import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/**
 * PatientHistory – Displays a patient's complete medical record timeline.
 * Used in both PatientDashboard and DoctorDashboard / ConsultationModal.
 *
 * Props:
 *  - patient: object with a `history` array
 *  - compact: boolean – if true, renders a shorter version (for inside modals)
 */
export default function PatientHistory({ patient, compact = false }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const history = patient?.history || [];

  if (history.length === 0) {
    return (
      <div style={{
        padding: compact ? '20px 16px' : '40px 24px',
        textAlign: 'center',
        background: 'var(--card, #f8fafc)',
        borderRadius: 16,
        border: '1px dashed var(--border, #e2e8f0)',
      }}>
        <span style={{ fontSize: compact ? 32 : 48, display: 'block', marginBottom: 8 }}>📋</span>
        <p style={{ color: 'var(--text-muted, #94a3b8)', fontWeight: 600, fontSize: compact ? '0.85rem' : '0.95rem' }}>
          No medical records yet
        </p>
        {!compact && (
          <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.8rem', marginTop: 4 }}>
            Visit history will appear here after consultations
          </p>
        )}
      </div>
    );
  }

  // Sort history newest-first
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 10 : 16 }}>
      {sortedHistory.map((record, idx) => {
        const isExpanded = expandedIdx === idx;
        const visitDate = new Date(record.date);
        const followUp = record.followUpDate ? new Date(record.followUpDate) : null;
        const isFutureFollowUp = followUp && followUp >= new Date();

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.25 }}
            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
            style={{
              background: 'var(--card, white)',
              borderRadius: compact ? 14 : 18,
              border: '1px solid var(--border, #e2e8f0)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              boxShadow: isExpanded ? '0 8px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            {/* Header – always visible */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: compact ? '12px 16px' : '16px 20px',
              borderLeft: `4px solid ${getSpecColor(record.specialization)}`,
            }}>
              {/* Visit number badge */}
              <div style={{
                width: compact ? 36 : 44, height: compact ? 36 : 44,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${getSpecColor(record.specialization)}22, ${getSpecColor(record.specialization)}11)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: compact ? '0.75rem' : '0.85rem',
                color: getSpecColor(record.specialization),
                flexShrink: 0,
              }}>
                #{sortedHistory.length - idx}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 700, fontSize: compact ? '0.9rem' : '1rem',
                  color: 'var(--text, #0f172a)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {record.diagnosis || 'General Consultation'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', marginTop: 2 }}>
                  👨‍⚕️ {record.doctorName} &bull; {record.specialization}
                </div>
              </div>

              {/* Date badge */}
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                background: 'var(--bg-subtle, #f1f5f9)', color: 'var(--text-muted, #475569)',
                padding: '4px 10px', borderRadius: 99,
              }}>
                {visitDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>

              {/* Expand chevron */}
              <span style={{
                transition: 'transform 0.2s',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                fontSize: '1rem', color: 'var(--text-muted, #94a3b8)',
              }}>
                ›
              </span>
            </div>

            {/* Expandable details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    padding: compact ? '0 16px 14px' : '0 20px 20px',
                    display: 'flex', flexDirection: 'column', gap: 14,
                    borderTop: '1px solid var(--border, #f1f5f9)',
                    paddingTop: 14,
                  }}>
                    {/* Medicines */}
                    {record.medicines && record.medicines.length > 0 && (
                      <div>
                        <p style={sectionLabel}>💊 Prescribed Medicines</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {record.medicines.map((med, mIdx) => (
                            <span key={mIdx} style={medPill}>{med}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tests */}
                    {record.tests && record.tests.length > 0 && (
                      <div>
                        <p style={sectionLabel}>🧪 Recommended Tests</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {record.tests.map((test, tIdx) => (
                            <span key={tIdx} style={testPill}>{test}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {record.prescriptionNote && (
                      <div>
                        <p style={sectionLabel}>📝 Doctor's Notes</p>
                        <p style={{
                          fontSize: '0.88rem', color: 'var(--text, #334155)',
                          background: 'var(--bg-subtle, #f8fafc)',
                          padding: '10px 14px', borderRadius: 10,
                          border: '1px solid var(--border, #e2e8f0)',
                          lineHeight: 1.5,
                        }}>
                          {record.prescriptionNote}
                        </p>
                      </div>
                    )}

                    {/* Follow-up */}
                    {followUp && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 14px', borderRadius: 10,
                        background: isFutureFollowUp ? '#fef9c3' : '#f1f5f9',
                        color: isFutureFollowUp ? '#a16207' : '#64748b',
                        fontSize: '0.85rem', fontWeight: 700,
                      }}>
                        {isFutureFollowUp ? '📅' : '✅'} Follow-up: {followUp.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {isFutureFollowUp && <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>(Upcoming)</span>}
                      </div>
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

// ── Helpers ──

const sectionLabel = {
  fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em',
  color: 'var(--text-muted, #94a3b8)', fontWeight: 700, marginBottom: 6,
};

const medPill = {
  fontSize: '0.82rem', background: '#dcfce7', color: '#166534',
  padding: '4px 10px', borderRadius: 6, fontWeight: 600,
};

const testPill = {
  fontSize: '0.82rem', background: '#dbeafe', color: '#1e40af',
  padding: '4px 10px', borderRadius: 6, fontWeight: 600,
};

function getSpecColor(spec) {
  const colors = {
    'Cardiology': '#ef4444',
    'Cardiologist': '#ef4444',
    'Dermatology': '#f59e0b',
    'Dermatologist': '#f59e0b',
    'Orthopedics': '#14b8a6',
    'Orthopedist': '#14b8a6',
    'Pediatrics': '#8b5cf6',
    'Pediatrician': '#8b5cf6',
    'General': '#2563eb',
    'General Physician': '#2563eb',
    'Neurology': '#ec4899',
    'Neurologist': '#ec4899',
    'Oncology': '#f97316',
    'Oncologist': '#f97316',
    'ENT': '#06b6d4',
  };
  return colors[spec] || '#6366f1';
}
