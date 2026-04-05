import { motion } from 'framer-motion';
import Icon from '../shared/Icon';

const links = [
  { label: 'Home', page: 'landing', icon: 'home' },
  { label: 'Doctors', page: 'doctors', icon: 'doctor' },
  { label: 'Queue', page: 'queue', icon: 'queue' },
  { label: 'AI Chat', page: 'chat', icon: 'chat' },
];

export default function Navbar({ currentPage, onNav, onLogin }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="hq-glass hq-navbar"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 64, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        zIndex: 1000,
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => onNav('landing')}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--accent-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>
          🏥
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>
          <span className="hq-gradient-text">Health</span><span style={{ color: 'var(--text)' }}>Queue</span>
        </span>
      </div>

      <div className="hq-nav-links-container" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {links.map(l => (
          <button key={l.page} onClick={() => onNav(l.page)}
            className="hq-nav-btn"
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.88rem', fontWeight: 500,
              color: currentPage === l.page ? 'var(--primary)' : 'var(--text-secondary)',
              background: currentPage === l.page ? 'rgba(0, 169, 242, 0.1)' : 'transparent',
              transition: 'var(--transition)',
            }}
          >
            <Icon name={l.icon} size={16} />
            <span className="nav-text">{l.label}</span>
          </button>
        ))}
      </div>

      <div className="hq-navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogin}
          className="btn-primary"
          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
        >
          Get Started
        </motion.button>
      </div>
    </motion.nav>
  );
}
