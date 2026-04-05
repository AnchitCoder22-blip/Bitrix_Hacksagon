import { motion } from 'framer-motion';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '8px 12px', borderRadius: '10px',
        background: 'var(--card)', color: 'var(--text)',
        border: '1px solid var(--border)', cursor: 'pointer',
        gap: '8px', fontSize: '0.85rem', fontWeight: 600,
        boxShadow: 'var(--card-shadow)', transition: 'background 0.3s'
      }}
      title="Toggle Dark Mode"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </motion.button>
  );
}
