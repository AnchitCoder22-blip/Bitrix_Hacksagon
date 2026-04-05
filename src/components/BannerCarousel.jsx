import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  { title: 'AI Health Insights', desc: 'Get symptom analysis powered by AI', gradient: 'linear-gradient(135deg, #00A9F2, #787CFE)', emoji: '🤖' },
  { title: 'Zero Wait Queues', desc: 'Real-time tracking & smart scheduling', gradient: 'linear-gradient(135deg, #14B8A6, #00A9F2)', emoji: '⚡' },
  { title: 'Lab Tests at Home', desc: 'Book tests online, results delivered fast', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', emoji: '🧪' },
  { title: 'Emergency Care', desc: '24/7 priority access for emergencies', gradient: 'linear-gradient(135deg, #ef4444, #C53F7B)', emoji: '🚨' },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', height: 160, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', inset: 0,
            background: banners[current].gradient,
            borderRadius: 'var(--radius)', padding: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 6 }}>{banners[current].title}</h3>
            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>{banners[current].desc}</p>
          </div>
          <span style={{ fontSize: 64, opacity: 0.4 }}>{banners[current].emoji}</span>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 6,
      }}>
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 24 : 8, height: 8,
              borderRadius: 99, border: 'none',
              background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
              transition: 'var(--transition)', cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}
