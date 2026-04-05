import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDoctorRecommendation from '../hooks/useDoctorRecommendation';

/**
 * DoctorRecommendationCard
 *
 * Shows a smart, context-aware alert when a faster same-specialization
 * doctor is available. Follows existing card UI conventions.
 *
 * Props:
 *   currentDoctor   {object}   - Doctor the patient is booked with
 *   doctorsList     {Array}    - All available doctors
 *   onSwitchDoctor  {function} - Optional callback(doctor) when user confirms switch
 */
export default function DoctorRecommendationCard({
  currentDoctor,
  doctorsList = [],
  onSwitchDoctor,
}) {
  const { shouldSwitch, recommendedDoctor, alternatives, estimatedTimeSaved, reason, urgency } =
    useDoctorRecommendation(currentDoctor, doctorsList);

  const [dismissed, setDismissed] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Nothing to show
  if (!shouldSwitch || dismissed || switched) return null;

  const urgencyColors = {
    high: { bg: '#fef2f2', border: '#fca5a5', accent: '#dc2626', badge: '#fee2e2', badgeText: '#991b1b' },
    moderate: { bg: '#fffbeb', border: '#fcd34d', accent: '#d97706', badge: '#fef3c7', badgeText: '#92400e' },
  };
  const colors = urgencyColors[urgency] || urgencyColors.moderate;

  const handleSwitch = () => {
    setSwitched(true);
    if (onSwitchDoctor) onSwitchDoctor(recommendedDoctor);
  };

  // Normalize helper for display
  const getWait = (doc) => {
    const avgTime = doc.avgConsultTime ?? doc.avgTime ?? 10;
    const queue = doc.queueLength ?? doc.patients ?? 0;
    return doc.computedWaitTime ?? avgTime * queue;
  };

  return (
    <AnimatePresence>
      <motion.div
        key="doc-rec-card"
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          background: colors.bg,
          border: `1.5px solid ${colors.border}`,
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          position: 'relative',
        }}
      >
        {/* Dismiss button */}
        <button
          id="doc-rec-dismiss"
          onClick={() => setDismissed(true)}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94a3b8', fontSize: '1rem', lineHeight: 1,
            padding: 4, borderRadius: 6,
          }}
          aria-label="Dismiss recommendation"
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: colors.accent, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', color: 'var(--text-muted)',
            }}
          >
            🔄
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
              Doctor Switch Recommended
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 1 }}>
              {urgency === 'high' ? '⚠️ Current doctor is busy. You may experience a long wait.' : '🕐 Moderate wait detected — a faster option is available.'}
            </div>
          </div>
          <span
            style={{
              background: colors.badge, color: colors.badgeText,
              fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
              borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.04em',
              flexShrink: 0,
            }}
          >
            {urgency === 'high' ? 'High Delay' : 'Moderate Delay'}
          </span>
        </div>

        {/* Reason message */}
        <div
          style={{
            fontSize: '0.82rem', color: '#374151',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: 10, padding: '10px 14px',
            marginBottom: 14, lineHeight: 1.5,
          }}
        >
          {reason}
        </div>

        {/* Recommended Doctor card */}
        <div
          style={{
            background: 'var(--card)', borderRadius: 14, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem',
            }}
          >
            {recommendedDoctor.avatar || '👨‍⚕️'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
              {recommendedDoctor.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 1 }}>
              {recommendedDoctor.specialization || recommendedDoctor.specialty}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>
                ⏱ ~{Math.round(getWait(recommendedDoctor))}m wait
              </span>
              <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                💛 Save ~{estimatedTimeSaved}m
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                ⭐ {recommendedDoctor.rating}
              </span>
            </div>
          </div>

          {/* Switch button */}
          <motion.button
            id="doc-rec-switch-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSwitch}
            style={{
              padding: '10px 18px', borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
              color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
            }}
          >
            Switch Doctor
          </motion.button>
        </div>

        {/* Alternatives toggle — show top 2-3 same-spec doctors */}
        {alternatives.length > 1 && (
          <div>
            <button
              id="doc-rec-show-alternatives"
              onClick={() => setShowAlternatives((v) => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.78rem', color: colors.accent,
                fontWeight: 600, padding: '0 2px',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {showAlternatives ? '▲ Hide' : '▼ Show'} all {alternatives.length} alternatives (same specialization)
            </button>

            <AnimatePresence>
              {showAlternatives && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                    {alternatives.map((doc, i) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        style={{
                          background: 'var(--card)', borderRadius: 12, padding: '10px 14px',
                          display: 'flex', alignItems: 'center', gap: 10,
                          boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{doc.avatar || '👨‍⚕️'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{doc.name}</div>
                          <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                            ~{Math.round(getWait(doc))}m wait · ⭐ {doc.rating}
                          </div>
                        </div>
                        {i === 0 && (
                          <span
                            style={{
                              fontSize: '0.68rem', padding: '2px 8px',
                              background: '#dcfce7', color: '#15803d',
                              borderRadius: 999, fontWeight: 700,
                            }}
                          >
                            Fastest
                          </span>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setSwitched(true); if (onSwitchDoctor) onSwitchDoctor(doc); }}
                          style={{
                            padding: '7px 14px', borderRadius: 8,
                            background: '#eff6ff', color: '#2563EB',
                            border: '1px solid #bfdbfe',
                            fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                          }}
                        >
                          Switch
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
