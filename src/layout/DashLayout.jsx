import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function DashLayout({ children, currentPage, onNav, role, user, title, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 768);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', transition: 'all 0.3s' }}>
      <Sidebar
        currentPage={currentPage}
        onNav={onNav}
        role={role}
        user={user}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        onLogout={onLogout}
      />
      <div style={{
        flex: 1, marginLeft: window.innerWidth > 768 ? 260 : 0,
        display: 'flex', flexDirection: 'column',
        transition: 'margin 0.3s',
      }}>
        <TopBar
          title={title}
          user={user}
          onMenuToggle={() => setSidebarCollapsed(c => !c)}
          notifCount={3}
        />
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
