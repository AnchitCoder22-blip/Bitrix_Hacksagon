import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';

const typeStyles = {
  success: { bg: '#dcfce7', border: '#22c55e', color: '#15803d', icon: 'check' },
  error: { bg: '#fecaca', border: '#ef4444', color: '#dc2626', icon: 'close' },
  warning: { bg: '#fef3c7', border: '#f59e0b', color: '#b45309', icon: 'alert' },
  info: { bg: '#dbeafe', border: '#3b82f6', color: '#2563eb', icon: 'bell' },
};

function Toast({ toast, onRemove }) {
  const s = typeStyles[toast.type] || typeStyles.info;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 20px',
        background: s.bg,
        borderLeft: `4px solid ${s.border}`,
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        color: s.color,
        fontWeight: 500,
        fontSize: '0.9rem',
        minWidth: 280,
        maxWidth: 400,
        cursor: 'pointer',
      }}
      onClick={onRemove}
    >
      <Icon name={s.icon} size={20} color={s.border} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <Icon name="close" size={16} color={s.color} style={{ opacity: 0.5 }} />
    </motion.div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 10000 }}>
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
