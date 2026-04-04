import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';

export default function DoctorCard({ doctor, onBook, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(37,99,235,0.12)' }}
      style={{
        background: 'white', borderRadius: 20, padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', gap: 16,
        cursor: 'pointer', transition: 'box-shadow 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar emoji={doctor.avatar} size={52} />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{doctor.name}</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{doctor.specialty}</p>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: '#64748b' }}>
          <Icon name="clock" size={14} />
          {doctor.experience} yrs
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: '#64748b' }}>
          <Icon name="users" size={14} />
          {doctor.patients} in queue
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid #f1f5f9', paddingTop: 16,
      }}>
        <div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2563EB' }}>₹{doctor.fee}</span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: 4 }}>consultation</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onBook(doctor)}
          disabled={!doctor.available}
          style={{
            padding: '10px 24px', borderRadius: 12,
            background: doctor.available ? 'linear-gradient(135deg, #2563EB, #14B8A6)' : '#e2e8f0',
            color: doctor.available ? 'white' : '#94a3b8',
            fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: doctor.available ? 'pointer' : 'not-allowed',
          }}
        >
          Book Token
        </motion.button>
      </div>
    </motion.div>
  );
}
