import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Icon from '../shared/Icon';
import { useSystem } from '../context/SystemContext';

const features = [
  { icon: '🧠', title: 'Smart Queue AI', desc: 'Intelligent queue reordering based on urgency, wait time, and patient flow patterns.' },
  { icon: '📍', title: 'Live Tracking', desc: 'Real-time GPS tracking with ETA estimation and automatic arrival detection.' },
  { icon: '🤖', title: 'AI Symptom Checker', desc: 'Describe your symptoms, get instant AI-powered doctor specialty recommendations.' },
  { icon: '⚡', title: 'Zero Wait Time', desc: 'Predictive scheduling ensures you spend minutes, not hours, in the waiting room.' },
  { icon: '🔔', title: 'Smart Alerts', desc: 'Get notified exactly when your turn is approaching — no more guessing.' },
  { icon: '📊', title: 'Health Analytics', desc: 'Comprehensive dashboards for patients, doctors, and administrators.' },
];

const steps = [
  { num: '01', title: 'Find a Doctor', desc: 'Browse specialists, check ratings, availability, and fees.' },
  { num: '02', title: 'Book Your Token', desc: 'Reserve your spot instantly and get a unique token number.' },
  { num: '03', title: 'Track & Arrive', desc: 'Monitor your queue in real-time and navigate to the clinic.' },
  { num: '04', title: 'Get Treated', desc: "Walk in right when it's your turn — no waiting." },
];

export default function LandingPage() {
  const { onNav } = useSystem();

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar onLogin={() => onNav('patient-dashboard')} />

      <HeroSection
        onBookAppointment={() => onNav('doctors')}
        onExploreDoctors={() => onNav('doctors')}
      />

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>
            Why <span className="gradient-text">HealthQueue</span>?
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
            A complete healthcare ecosystem that puts you in control
          </p>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(37,99,235,0.1)' }}
              style={{
                background: 'white', borderRadius: 20, padding: 28,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)', transition: 'all 0.3s',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'linear-gradient(135deg, #eff6ff, #ecfdf5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, marginBottom: 16,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Four simple steps to a better healthcare experience</p>
          </motion.div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32,
          }}>
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                style={{ textAlign: 'center' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: '0 12px 32px rgba(37,99,235,0.3)' }}
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '1.2rem',
                    margin: '0 auto 16px',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.2)',
                    transition: 'all 0.3s',
                  }}
                >{s.num}</motion.div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{
            maxWidth: 800, margin: '0 auto',
            background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
            borderRadius: 28, padding: '56px 40px', color: 'white',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
            Ready to Skip the Queue?
          </h2>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Join thousands of patients who already experience smarter healthcare.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => onNav('patient-dashboard')}
            style={{
              padding: '16px 40px', borderRadius: 99,
              background: 'white', color: '#2563EB',
              fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            Get Started Free →
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px', textAlign: 'center',
        borderTop: '1px solid #e2e8f0',
        color: '#94a3b8', fontSize: '0.85rem',
      }}>
        <p>© 2026 HealthQueue — AI-Powered Healthcare Queue System. All rights reserved.</p>
      </footer>
    </div>
  );
}
