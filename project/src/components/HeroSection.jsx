import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ onBookAppointment, onExploreDoctors }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });

  // Smooth cursor tracking with requestAnimationFrame
  const handleMouseMove = useCallback((e) => {
    targetRef.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    };
  }, []);

  useEffect(() => {
    let animating = true;
    const animate = () => {
      if (!animating) return;
      setMousePos(prev => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.08,
        y: prev.y + (targetRef.current.y - prev.y) * 0.08,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      animating = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden', padding: '120px 24px 80px',
    }}>
      {/* Glow gradient background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(20,184,166,0.08) 0%, transparent 60%)',
      }} />

      {/* Floating shapes with parallax depth */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -15, 0],
            x: [0, i % 2 ? 10 : -10, 0],
            rotate: [0, i % 2 ? 5 : -5, 0],
          }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: 60 + i * 20, height: 60 + i * 20,
            borderRadius: '50%',
            background: i % 2
              ? 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(37,99,235,0.02))'
              : 'linear-gradient(135deg, rgba(20,184,166,0.06), rgba(20,184,166,0.02))',
            top: `${15 + i * 12}%`,
            left: `${10 + i * 15}%`,
            // Parallax: deeper shapes move less
            transform: `translate(${mousePos.x * (0.3 + i * 0.12)}px, ${mousePos.y * (0.3 + i * 0.12)}px)`,
            willChange: 'transform',
          }}
        />
      ))}

      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
      }}>
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #eff6ff, #ecfdf5)',
              padding: '8px 16px', borderRadius: 99, fontSize: '0.85rem',
              fontWeight: 600, color: '#2563EB', marginBottom: 24,
            }}
          >
            🚀 AI-Powered Healthcare
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900,
            lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.03em',
          }}>
            Smart Healthcare{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Queue System</span>
          </h1>

          <p style={{
            fontSize: '1.1rem', color: '#64748b', lineHeight: 1.7,
            maxWidth: 520, marginBottom: 36,
          }}>
            No more long waits. Track your queue in real-time, get AI-powered health insights,
            and experience healthcare the way it should be — smart, fast, and patient-first.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(37,99,235,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookAppointment}
              className="btn-primary"
              style={{ padding: '16px 32px', fontSize: '1rem' }}
            >
              📅 Book Appointment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(37,99,235,0.15)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onExploreDoctors}
              className="btn-secondary"
              style={{ padding: '16px 32px', fontSize: '1rem' }}
            >
              👨‍⚕️ Explore Doctors
            </motion.button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
            {[
              { value: '10K+', label: 'Patients Served' },
              { value: '50+', label: 'Expert Doctors' },
              { value: '4.9', label: 'User Rating' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
              willChange: 'transform',
            }}
          >
            <div style={{
              width: 'min(400px, 80vw)', height: 'min(400px, 80vw)',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(20,184,166,0.08))',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                width: '85%', height: '85%',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(20,184,166,0.1))',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 60px rgba(37,99,235,0.15)',
              }}>
                <span style={{ fontSize: 'min(140px, 30vw)' }}>👨‍⚕️</span>
              </div>

              {/* Floating cards with parallax depth */}
              {[
                { emoji: '💊', top: '10%', right: '-10%', delay: 0, depth: 1.5 },
                { emoji: '🩺', bottom: '15%', right: '-5%', delay: 1, depth: 1.2 },
                { emoji: '❤️', top: '5%', left: '0%', delay: 0.5, depth: 1.8 },
                { emoji: '📊', bottom: '10%', left: '-5%', delay: 1.5, depth: 1 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: item.top, bottom: item.bottom,
                    left: item.left, right: item.right,
                    width: 52, height: 52,
                    background: 'white', borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    fontSize: 24,
                    transform: `translate(${mousePos.x * item.depth * 0.3}px, ${mousePos.y * item.depth * 0.3}px)`,
                    willChange: 'transform',
                  }}
                >
                  {item.emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div > div { grid-template-columns: 1fr !important; text-align: center; }
          section > div > div > div:last-child { order: -1; }
        }
      `}</style>
    </section>
  );
}
