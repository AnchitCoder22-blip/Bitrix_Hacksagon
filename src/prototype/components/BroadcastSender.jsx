import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../shared/Icon';

export default function BroadcastSender({ onSend }) {
  const [msg, setMsg] = useState('');

  const handleSend = () => {
    if (!msg.trim()) return;
    onSend?.(msg);
    setMsg('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'white', borderRadius: 20, padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <Icon name="broadcast" size={20} style={{ marginRight: 8, color: '#f59e0b' }} />
        Broadcast Notification Center
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
        Send an urgent toast/push notification to all active patient dashboards.
      </p>
      
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="E.g. Dr. Rajesh is running 15 mins late..."
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 12,
            border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
            background: '#f8fafc'
          }}
        />
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handleSend}
          disabled={!msg.trim()}
          style={{
            padding: '12px 24px', borderRadius: 12,
            background: msg.trim() ? 'linear-gradient(135deg, #2563EB, #14B8A6)' : '#e2e8f0',
            color: msg.trim() ? 'white' : '#94a3b8', 
            fontWeight: 600, border: 'none', 
            cursor: msg.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <Icon name="send" size={18} /> Send
        </motion.button>
      </div>
    </motion.div>
  );
}
