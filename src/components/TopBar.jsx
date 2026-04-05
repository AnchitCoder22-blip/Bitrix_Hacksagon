import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';

export default function TopBar({ title, user, onMenuToggle, notifCount = 0 }) {
  return (
    <div className="hq-glass" style={{
      height: 64, padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
      transition: 'var(--transition)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onMenuToggle}
          style={{
            display: 'none', width: 40, height: 40, borderRadius: 'var(--radius-sm)',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--border-light)',
          }}
          className="mobile-menu-btn"
        >
          <Icon name="menu" size={22} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button 
          onClick={() => alert("Notification settings opened!")}
          style={{
          width: 40, height: 40, borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--border-light)', position: 'relative',
          transition: 'var(--transition)',
        }}>
          <Icon name="bell" size={20} color="var(--text-secondary)" />
          {notifCount > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--error)', color: 'var(--text-muted)',
              fontSize: '0.65rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {notifCount}
            </span>
          )}
        </button>
        <button 
          onClick={() => alert("Search functionality coming soon!")}
          style={{
          width: 40, height: 40, borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--border-light)',
          transition: 'var(--transition)',
        }}>
          <Icon name="search" size={20} color="var(--text-secondary)" />
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
