import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';

const menuItems = [
  { label: 'Dashboard', page: 'patient-dashboard', icon: 'home', roles: ['patient', 'doctor', 'admin'] },
  { label: 'Find Doctors', page: 'doctors', icon: 'doctor', roles: ['patient'] },
  { label: 'My Queue', page: 'queue', icon: 'queue', roles: ['patient'] },
  { label: 'Live Tracking', page: 'tracking', icon: 'mapPin', roles: ['patient'] },
  { label: 'Lab Tests', page: 'lab-tests', icon: 'flask', roles: ['patient'] },
  { label: 'AI Symptom Checker', page: 'chat', icon: 'chat', roles: ['patient'] },
  { label: 'Emergency', page: 'emergency', icon: 'emergency', roles: ['patient', 'doctor', 'admin'] },
  { type: 'divider', roles: ['doctor'] },
  { label: 'Doctor Dashboard', page: 'doctor-dashboard', icon: 'doctor', roles: ['doctor'] },
  { type: 'divider', roles: ['admin'] },
  { label: 'Admin Panel', page: 'admin', icon: 'admin', roles: ['admin'] },
  { label: 'Analytics', page: 'analytics', icon: 'chart', roles: ['admin'] },
  { type: 'divider', roles: ['patient', 'doctor', 'admin'] },
  { label: 'Profile', page: 'profile', icon: 'user', roles: ['patient', 'doctor', 'admin'] },
  { label: 'Settings', page: 'settings', icon: 'settings', roles: ['patient', 'doctor', 'admin'] },
];

export default function Sidebar({ currentPage, onNav, role, user, collapsed, onToggle, onSwitchRole }) {
  const filteredItems = menuItems.filter(m => m.roles?.includes(role));

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && window.innerWidth <= 768 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onToggle}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1099 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: collapsed && window.innerWidth <= 768 ? -280 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 260, padding: '20px 12px',
          background: 'white',
          borderRight: '1px solid #e2e8f0',
          display: 'flex', flexDirection: 'column',
          zIndex: 1100,
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '4px 8px', marginBottom: 24,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🏥</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
            <span className="gradient-text">Health</span>Queue
          </span>
          {window.innerWidth <= 768 && (
            <button onClick={onToggle} style={{ marginLeft: 'auto', padding: 4 }}>
              <Icon name="close" size={20} />
            </button>
          )}
        </div>

        {/* User card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px', marginBottom: 16,
          background: '#f8fafc', borderRadius: 12,
        }}>
          <Avatar name={user?.name || 'User'} size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </div>
            <div style={{
              fontSize: '0.75rem', color: '#64748b',
              textTransform: 'capitalize',
            }}>{role}</div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredItems.map((item, i) => {
            if (item.type === 'divider') {
              return <div key={i} style={{ height: 1, background: '#e2e8f0', margin: '8px 8px' }} />;
            }
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  onNav(item.page);
                  if (window.innerWidth <= 768) onToggle();
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10,
                  fontSize: '0.9rem', fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#2563EB' : '#475569',
                  background: isActive ? '#eff6ff' : 'transparent',
                  transition: 'all 0.2s', textAlign: 'left', width: '100%',
                }}
              >
                <Icon name={item.icon} size={18} color={isActive ? '#2563EB' : '#94a3b8'} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto' }}>
          {onSwitchRole && (
            <button
              onClick={onSwitchRole}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                fontSize: '0.9rem', fontWeight: 500,
                color: '#64748b', marginTop: 8, width: '100%', textAlign: 'left',
                border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer'
              }}
            >
              <Icon name="user" size={18} color="#64748b" />
              Switch Role
            </button>
          )}

          <button
            onClick={() => onNav('landing')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              fontSize: '0.9rem', fontWeight: 500,
              color: '#ef4444', marginTop: 8, width: '100%', textAlign: 'left',
              border: 'none', background: 'transparent', cursor: 'pointer'
            }}
          >
            <Icon name="logout" size={18} color="#ef4444" />
            Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
}
