import { motion } from 'framer-motion';

export default function UpcomingAppointments({ followUpAppointments = [] }) {
  if (!followUpAppointments || followUpAppointments.length === 0) {
    return null;
  }

  // Sort by date ascending
  const sortedAppts = [...followUpAppointments].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'white', borderRadius: 20, padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        marginTop: 24
      }}
    >
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>📅</span> Upcoming Follow-ups
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sortedAppts.map((appt, i) => {
          const dateObj = new Date(appt.dateTime);
          const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
          const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={appt.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 12, background: '#f8fafc',
                borderLeft: '4px solid #8b5cf6'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{appt.patientName}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>With {appt.doctorName} ({appt.specialty})</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, color: '#2563EB' }}>{dateStr}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{timeStr}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
