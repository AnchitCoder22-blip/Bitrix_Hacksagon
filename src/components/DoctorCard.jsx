import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';

export default function DoctorCard({ doctor, onBook, onScheduleClick, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: 'var(--card-shadow-hover)' }}
      style={{
        background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
        boxShadow: 'var(--card-shadow)',
        display: 'flex', flexDirection: 'column', gap: 16,
        cursor: 'pointer', transition: 'var(--transition)',
        border: '1px solid rgba(226,232,240,0.5)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar emoji={doctor.avatar} size={52} />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{doctor.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{doctor.specialty}</p>
        </div>
        {doctor.available ? (
          <span className="badge badge-success">Available</span>
        ) : (
          <span className="badge badge-error">Busy</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
          <Icon name="star" size={14} color="#f59e0b" />
          <strong>{doctor.rating}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Icon name="clock" size={14} />
          {doctor.experience} yrs
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Icon name="users" size={14} />
          {Array.isArray(doctor.patients) ? doctor.patients.length : doctor.patients} in queue
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid var(--border-light)', paddingTop: 16,
      }}>
        <div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>₹{doctor.fee}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: 4 }}>consultation</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onScheduleClick ? onScheduleClick(doctor) : onBook(doctor, true, new Date(Date.now() + 86400000).toISOString())}
            disabled={!doctor.available}
            style={{
              padding: '10px 16px', borderRadius: 12,
              background: doctor.available ? 'transparent' : 'var(--border)',
              border: doctor.available ? '2px solid var(--secondary)' : 'none',
              color: doctor.available ? 'var(--secondary)' : 'var(--text-light)',
              fontWeight: 600, fontSize: '0.8rem', cursor: doctor.available ? 'pointer' : 'not-allowed',
            }}
          >
            Schedule
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBook(doctor)}
            disabled={!doctor.available}
            style={{
              padding: '10px 20px', borderRadius: 12,
              background: doctor.available ? 'var(--accent-gradient)' : 'var(--border)',
              color: doctor.available ? 'white' : 'var(--text-light)',
              fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: doctor.available ? 'pointer' : 'not-allowed',
            }}
          >
            Walk-in
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
