import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import { ANALYTICS_DATA } from '../data/constants';

function BarChart({ data, labelKey, valueKey, color = '#00A9F2', height = 180 }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 600 }}>{d[valueKey]}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d[valueKey] / max) * 100}%` }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            style={{
              width: '100%', maxWidth: 40,
              background: `linear-gradient(180deg, ${color}, ${color}80)`,
              borderRadius: '6px 6px 2px 2px',
              minHeight: 4,
            }}
          />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { peakHours, waitTrends, doctorPerformance, patientFlow } = ANALYTICS_DATA;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Analytics</h2>
        <p style={{ color: 'var(--text-secondary)' }}>System insights and performance metrics</p>
      </motion.div>

      {/* Overview stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: 'Total Patients', value: patientFlow.total.toLocaleString(), icon: 'users', color: '#00A9F2' },
          { label: 'Today', value: patientFlow.today, icon: 'calendar', color: '#14B8A6' },
          { label: 'Avg/Day', value: patientFlow.avgPerDay, icon: 'chart', color: '#f59e0b' },
          { label: 'Satisfaction', value: `${patientFlow.satisfaction}⭐`, icon: 'star', color: '#C53F7B' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'var(--card)', borderRadius: 16, padding: 20,
              boxShadow: 'var(--card-shadow)',
              border: '1px solid rgba(226,232,240,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name={s.icon} size={16} color={s.color} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Peak Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
            boxShadow: 'var(--card-shadow)',
            border: '1px solid rgba(226,232,240,0.5)',
          }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.05rem' }}>Peak Hours</h3>
          <BarChart data={peakHours} labelKey="hour" valueKey="patients" color="#00A9F2" />
        </motion.div>

        {/* Wait Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{
            background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
            boxShadow: 'var(--card-shadow)',
            border: '1px solid rgba(226,232,240,0.5)',
          }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.05rem' }}>Avg Wait Time (min)</h3>
          <BarChart data={waitTrends} labelKey="day" valueKey="avg" color="#14B8A6" />
        </motion.div>
      </div>

      {/* Doctor Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{
          background: 'var(--card)', borderRadius: 'var(--radius)', padding: 24,
          boxShadow: 'var(--card-shadow)',
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.05rem' }}>Doctor Performance</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['Doctor', 'Patients Served', 'Avg Wait (min)', 'Satisfaction'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doctorPerformance.map((doc, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text)' }}>{doc.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text)' }}>{doc.patientsServed}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 99,
                      background: doc.avgWait <= 10 ? 'rgba(34,197,94,0.1)' : doc.avgWait <= 15 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                      color: doc.avgWait <= 10 ? '#15803d' : doc.avgWait <= 15 ? '#b45309' : '#dc2626',
                      fontSize: '0.82rem', fontWeight: 600,
                    }}>{doc.avgWait}m</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="star" size={14} color="#f59e0b" />
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{doc.satisfaction}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
