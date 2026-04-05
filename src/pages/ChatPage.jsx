import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';
import { SYMPTOM_RULES } from '../data/constants';

const quickSuggestions = [
  'I have a headache',
  'Chest pain',
  'Skin rash',
  'Fever and cold',
  'Back pain',
  'Eye problems',
  'Feeling anxious',
  'Stomach pain',
];

function analyzeSymptoms(text) {
  const lower = text.toLowerCase();
  for (const rule of SYMPTOM_RULES) {
    const matched = rule.keywords.filter(k => lower.includes(k));
    if (matched.length > 0) {
      return {
        specialty: rule.specialty,
        severity: rule.severity,
        advice: rule.advice,
        matched,
      };
    }
  }
  return {
    specialty: 'General Physician',
    severity: 'low',
    advice: 'Based on your symptoms, I recommend visiting a General Physician for a thorough checkup.',
    matched: [],
  };
}

export default function ChatPage({ onNav }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: "Hello! 👋 I'm your AI Health Assistant. Describe your symptoms, and I'll recommend the right specialist for you.", typing: false },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const result = analyzeSymptoms(text);
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: `Based on your symptoms, I recommend seeing a **${result.specialty}**.`,
        analysis: result,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>AI Symptom Checker</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Describe your symptoms for AI-powered recommendations</p>
      </motion.div>

      {/* Chat area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 0',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '75%', padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'var(--accent-gradient)'
                  : 'var(--card)',
                color: msg.role === 'user' ? 'white' : 'var(--text)',
                boxShadow: 'var(--card-shadow)',
                fontSize: '0.9rem', lineHeight: 1.6,
                border: msg.role === 'user' ? 'none' : '1px solid rgba(226,232,240,0.5)',
              }}>
                <p>{msg.text}</p>
                {msg.analysis && (
                  <div style={{
                    marginTop: 12, padding: 14, borderRadius: 12,
                    background: 'var(--border-light)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700,
                        background: msg.analysis.severity === 'high' ? 'rgba(239,68,68,0.1)' : msg.analysis.severity === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                        color: msg.analysis.severity === 'high' ? '#dc2626' : msg.analysis.severity === 'medium' ? '#b45309' : '#15803d',
                        textTransform: 'uppercase',
                      }}>
                        {msg.analysis.severity} severity
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 10 }}>{msg.analysis.advice}</p>
                    <button
                      onClick={() => onNav('doctors')}
                      style={{
                        padding: '8px 16px', borderRadius: 10,
                        background: 'var(--accent-gradient)',
                        color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <Icon name="doctor" size={14} color="white" /> Book {msg.analysis.specialty}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 18px', background: 'var(--card)',
              borderRadius: 18, width: 'fit-content',
              boxShadow: 'var(--card-shadow)',
              border: '1px solid rgba(226,232,240,0.5)',
            }}
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--text-light)',
                }}
              />
            ))}
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 2 && (
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12,
          padding: '0 4px',
        }}>
          {quickSuggestions.map((s, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(s)}
              style={{
                padding: '8px 14px', borderRadius: 99,
                background: 'var(--card)', border: '1px solid var(--border)',
                fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500,
                cursor: 'pointer', transition: 'var(--transition)',
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        display: 'flex', gap: 10, padding: '12px 0',
        borderTop: '1px solid var(--border)',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Describe your symptoms..."
          style={{
            flex: 1, padding: '14px 18px', borderRadius: 14,
            border: '1px solid var(--border)', background: 'var(--card)',
            fontSize: '0.9rem', outline: 'none', color: 'var(--text)',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendMessage(input)}
          style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
          }}
        >
          <Icon name="send" size={20} color="white" />
        </motion.button>
      </div>
    </div>
  );
}
