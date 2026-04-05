import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Icon from '../shared/Icon';

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
  { num: '04', title: 'Get Treated', desc: 'Walk in right when it\'s your turn — no waiting.' },
];

export default function LandingPage({ onNav }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar currentPage="landing" onNav={onNav} onLogin={() => onNav('patient-dashboard')} />

      <HeroSection
        onBookAppointment={() => onNav('queue')}
        onExploreDoctors={() => onNav('doctors')}
      />

      {/* Features */}
      <section style={{
        padding: '80px 24px', maxWidth: 1200, margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>
            Why <span className="hq-gradient-text">HealthQueue</span>?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
            A complete healthcare ecosystem that puts you in control
          </p>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              style={{
                background: 'var(--card)', borderRadius: 'var(--radius)', padding: 28,
                boxShadow: 'var(--card-shadow)',
                border: '1px solid rgba(226,232,240,0.5)',
                transition: 'var(--transition)',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(0,169,242,0.1), rgba(20,184,166,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, marginBottom: 16,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,169,242,0.04) 100%)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>
              How It <span className="hq-gradient-text">Works</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Four simple steps to a better healthcare experience</p>
          </motion.div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 32,
          }}>
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontWeight: 800, fontSize: '1.2rem',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 24px rgba(0,169,242,0.2)',
                }}>{s.num}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 800, margin: '0 auto',
            background: 'var(--accent-gradient)',
            borderRadius: 'var(--radius-lg)', padding: '56px 40px',
            color: 'var(--text-muted)',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
            Ready to Skip the Queue?
          </h2>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Join thousands of patients who already experience smarter healthcare.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNav('patient-dashboard')}
            style={{
              padding: '16px 40px', borderRadius: 99,
              background: 'var(--card)', color: 'var(--primary)',
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
        borderTop: '1px solid var(--border)',
        color: 'var(--text-light)', fontSize: '0.85rem',
      }}>
        <p>© 2026 HealthQueue — AI-Powered Healthcare Queue System. All rights reserved.</p>
      </footer>
    </div>
  );
}
