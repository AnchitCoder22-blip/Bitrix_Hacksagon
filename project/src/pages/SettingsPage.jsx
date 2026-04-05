import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';

import { useSystem } from '../context/SystemContext';

export default function SettingsPage() {
  const { settings, setSettings, addToast } = useSystem();

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    addToast?.('Setting updated', 'success');
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <button onClick={onChange} style={{
      width: 48, height: 26, borderRadius: 99, padding: 2,
      background: checked ? 'linear-gradient(135deg, #2563EB, #14B8A6)' : '#e2e8f0',
      transition: 'all 0.3s', cursor: 'pointer', border: 'none',
      display: 'flex', alignItems: 'center',
    }}>
      <motion.div
        animate={{ x: checked ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 22, height: 22, borderRadius: '50%',
          background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
      />
    </button>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Settings</h2>
      </motion.div>

      {/* Sections */}
      {[
        {
          title: 'Notifications', items: [
            { key: 'notifications', label: 'Push Notifications', desc: 'Get alerts for your turn and queue updates' },
            { key: 'sound', label: 'Sound Alerts', desc: 'Play sound when your turn is near' },
            { key: 'emailAlerts', label: 'Email Notifications', desc: 'Receive appointment summaries via email' },
            { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Get text messages for important updates' },
          ]
        },
        {
          title: 'Location & Privacy', items: [
            { key: 'location', label: 'Location Services', desc: 'Enable GPS for live tracking' },
          ]
        },
        {
          title: 'Appearance', items: [
            { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to dark theme (coming soon)' },
          ]
        },
      ].map((section, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{
            background: 'white', borderRadius: 20, padding: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 16,
          }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1.05rem' }}>{section.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {section.items.map(item => (
              <div key={item.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0', borderBottom: '1px solid #f1f5f9',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.label}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{item.desc}</div>
                </div>
                <ToggleSwitch checked={settings[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Queue Alert Distance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{
          background: 'white', borderRadius: 20, padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 16,
        }}
      >
        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1.05rem' }}>Queue Settings</h3>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Alert Distance (km)</label>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 10 }}>
            Get notified when you're within this distance from the clinic
          </p>
          <select value={settings.queueAlertDistance}
            onChange={e => setSettings(prev => ({ ...prev, queueAlertDistance: e.target.value }))}
            style={{
              padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0',
              background: 'white', fontSize: '0.9rem', outline: 'none',
            }}
          >
            <option value="1">1 km</option>
            <option value="2">2 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
          </select>
        </div>
      </motion.div>
    </div>
  );
}
