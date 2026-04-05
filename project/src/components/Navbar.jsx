import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import { useSystem } from '../context/SystemContext';

const links = [
  { label: 'Home', page: 'login', icon: 'home' },
  { label: 'Doctors', page: 'doctors', icon: 'doctor' },
  { label: 'Queue', page: 'queue', icon: 'queue' },
  { label: 'AI Chat', page: 'chat', icon: 'chat' },
];

export default function Navbar({ onLogin }) {
  const { page: currentPage, onNav } = useSystem();
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 64, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226,232,240,0.6)',
        zIndex: 1000,
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => onNav('login')}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>
          🏥
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>
          <span style={{ background: 'linear-gradient(135deg, #2563EB, #14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Health</span>Queue
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {links.map(l => (
          <button key={l.page} onClick={() => onNav(l.page)}
            style={{
              padding: '8px 16px', borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.88rem', fontWeight: 500,
              color: currentPage === l.page ? '#2563EB' : '#64748b',
              background: currentPage === l.page ? '#eff6ff' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <Icon name={l.icon} size={16} />
            <span className="nav-text">{l.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onLogin}
          className="btn-primary"
          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
        >
          Get Started
        </button>
      </div>
    </motion.nav>
  );
}
