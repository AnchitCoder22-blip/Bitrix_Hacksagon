import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useSystem } from '../context/SystemContext';

export default function DashLayout({ children, title }) {
  const { page, onNav, role } = useSystem();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 768);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div style={{
        flex: 1, marginLeft: window.innerWidth > 768 ? 260 : 0,
        display: 'flex', flexDirection: 'column',
        transition: 'margin 0.3s',
      }}>
        <TopBar
          title={title}
          onMenuToggle={() => setSidebarCollapsed(c => !c)}
        />
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
