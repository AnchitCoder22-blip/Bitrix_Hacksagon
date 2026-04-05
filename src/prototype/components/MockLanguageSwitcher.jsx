import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', native: 'English', flag: '🇬🇧' },
  { code: 'hi', native: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'bn', native: 'বাংলা (Bengali)', flag: '🇧🇩' },
  { code: 'ta', native: 'தமிழ் (Tamil)', flag: '🇮🇳' },
];

export default function MockLanguageSwitcher({ onChangeLanguage }) {
  const [lang, setLang] = useState('en');
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 16px', borderRadius: 12, 
          border: '1px solid #e2e8f0',
          background: open ? '#eff6ff' : 'white',
          cursor: 'pointer', fontSize: '0.9rem',
          fontWeight: 600, color: '#334155',
          transition: 'all 0.2s',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}
      >
        <span style={{ fontSize: 18 }}>{current.flag}</span>
        <span>{current.native}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', marginLeft: 4 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', right: 0,
              marginTop: 8, minWidth: 200,
              background: 'white', borderRadius: 14,
              border: '1px solid #e2e8f0',
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              zIndex: 9999, overflow: 'hidden',
              padding: '8px',
            }}
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { 
                  setLang(l.code); 
                  setOpen(false); 
                  onChangeLanguage?.(l.code);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '12px',
                  borderRadius: 10, border: 'none',
                  background: lang === l.code ? 'linear-gradient(135deg, #eff6ff, #ecfdf5)' : 'transparent',
                  cursor: 'pointer', fontSize: '0.9rem',
                  fontWeight: lang === l.code ? 600 : 500,
                  color: lang === l.code ? '#2563EB' : '#475569',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 18 }}>{l.flag}</span>
                <span style={{ flex: 1 }}>{l.native}</span>
                {lang === l.code && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
