import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import Spinner from '../shared/Spinner';
import useGeolocation from '../hooks/useGeolocation';
import { CLINIC_LOCATION } from '../data/constants';

export default function LiveTrackingPage({ token, addToast }) {
  const { position, distance, eta, status, error, loading, openMapsNavigation } = useGeolocation(CLINIC_LOCATION.lat, CLINIC_LOCATION.lng);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16 }}>
        <Spinner size={40} />
        <p style={{ color: 'var(--text-secondary)' }}>Getting your location...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>📍</span>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Location Access Required</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
          {error}. Please enable location services to use live tracking.
        </p>
        <button className="btn-primary" onClick={openMapsNavigation}>
          <Icon name="navigation" size={18} /> Open in Google Maps
        </button>
      </div>
    );
  }

  const progressPercent = distance ? Math.max(5, Math.min(95, 100 - (distance / 10) * 100)) : 0;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Live Tracking</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track your journey to {CLINIC_LOCATION.name}</p>
      </motion.div>

      {/* Status card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)', padding: 28,
          boxShadow: 'var(--card-shadow)', marginBottom: 20,
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              width: 64, height: 64, borderRadius: 20,
              background: `${status?.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32,
            }}
          >{status?.emoji}</motion.div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: status?.color }}>{status?.label}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {distance ? `${distance.toFixed(2)} km from clinic` : 'Calculating...'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 8 }}>
            <span>📍 You</span>
            <span>🏥 Clinic</span>
          </div>
          <div style={{ height: 10, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1 }}
              style={{
                height: '100%', borderRadius: 99,
                background: `linear-gradient(90deg, var(--primary), ${status?.color || 'var(--secondary)'})`,
              }}
            />
            <motion.div
              animate={{ left: `${progressPercent}%` }}
              transition={{ duration: 1 }}
              style={{
                position: 'absolute', top: -8, marginLeft: -12,
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--card)', border: `3px solid ${status?.color || 'var(--primary)'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ background: 'var(--border-light)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
              {distance ? `${distance.toFixed(1)}` : '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>km away</div>
          </div>
          <div style={{ background: 'var(--border-light)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {eta ? `${eta}` : '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>min ETA</div>
          </div>
          <div style={{ background: 'var(--border-light)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>30</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>km/h avg</div>
          </div>
        </div>
      </motion.div>

      {/* Clinic info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
          boxShadow: 'var(--card-shadow)', marginBottom: 20,
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Destination</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(0,169,242,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>🏥</div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{CLINIC_LOCATION.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{CLINIC_LOCATION.address}</div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openMapsNavigation}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: 'var(--accent-gradient)',
            color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Icon name="navigation" size={18} /> Open in Google Maps
        </motion.button>
      </motion.div>

      {/* Your coordinates */}
      {position && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{
            background: 'var(--card)', borderRadius: 'var(--radius)', padding: 20,
            boxShadow: 'var(--card-shadow)', fontSize: '0.85rem', color: 'var(--text-secondary)',
            border: '1px solid rgba(226,232,240,0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Your Lat: {position.lat.toFixed(6)}</span>
            <span>Your Lng: {position.lng.toFixed(6)}</span>
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}
            />
            Live updating
          </div>
        </motion.div>
      )}
    </div>
  );
}
