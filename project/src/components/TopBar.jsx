import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import { useSystem } from '../context/SystemContext';

export default function TopBar({ title, onMenuToggle }) {
  const { user, notifications } = useSystem();
  const notifCount = notifications.length;

  return (
    <div style={{
      height: 64, padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onMenuToggle}
          style={{
            display: 'none', width: 40, height: 40, borderRadius: 10,
            alignItems: 'center', justifyContent: 'center',
            background: '#f8fafc',
          }}
          className="mobile-menu-btn"
        >
          <Icon name="menu" size={22} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{
          width: 40, height: 40, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f8fafc', position: 'relative',
        }}>
          <Icon name="bell" size={20} color="#64748b" />
          {notifCount > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: '#ef4444',
            }} />
          )}
        </button>
        <Avatar name={user?.name || 'User'} size={36} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
