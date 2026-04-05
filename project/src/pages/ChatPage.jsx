import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../shared/Icon';
import { useSystem } from '../context/SystemContext';
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

const followUpSuggestions = {
  Cardiologist: ['How severe is the pain?', 'Any shortness of breath?', 'History of heart disease?'],
  Neurologist: ['How long have headaches lasted?', 'Any vision changes?', 'Numbness or tingling?'],
  Dermatologist: ['When did it start?', 'Any known allergies?', 'Is it spreading?'],
  Orthopedic: ['Was there an injury?', 'Pain while moving?', 'Any swelling?'],
  Pediatrician: ['How old is the child?', 'Temperature reading?', 'Eating normally?'],
  'ENT Specialist': ['Ear pain or ringing?', 'Difficulty swallowing?', 'Snoring issues?'],
  Ophthalmologist: ['Sudden or gradual?', 'One eye or both?', 'Using contacts?'],
  Psychiatrist: ['How long feeling this way?', 'Sleep pattern changes?', 'Any support system?'],
  'General Physician': ['When did symptoms start?', 'Any medications?', 'Fever temperature?'],
};

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

// Typing animation component
function TypingText({ text, onComplete }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (indexRef.current >= text.length) {
      onComplete?.();
      return;
    }
    const timer = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 18);
    return () => clearInterval(timer);
  }, [text, onComplete]);

  return <span>{displayed}<span style={{ opacity: indexRef.current < text.length ? 1 : 0 }}>▍</span></span>;
}

export default function ChatPage() {
  const { onNav } = useSystem();
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: "Hello! 👋 I'm your AI Health Assistant. Describe your symptoms, and I'll recommend the right specialist for you.", typing: false, analysis: null },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState(quickSuggestions);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), typing: false, analysis: null };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setCurrentSuggestions([]);

    setTimeout(() => {
      const result = analyzeSymptoms(text);
      const botText = `Based on your symptoms, I recommend seeing a **${result.specialty}**.`;
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: botText,
        typing: true,
        analysis: result,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      // Set follow-up suggestions
      setCurrentSuggestions(followUpSuggestions[result.specialty] || quickSuggestions);
    }, 800 + Math.random() * 600);
  }, []);

  const markTypingComplete = useCallback((msgId) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, typing: false } : m));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>AI Symptom Checker</h2>
        <p style={{ color: '#64748b' }}>Describe your symptoms for AI-powered recommendations</p>
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
                  ? 'linear-gradient(135deg, #2563EB, #14B8A6)'
                  : 'white',
                color: msg.role === 'user' ? 'white' : '#1e293b',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                fontSize: '0.9rem', lineHeight: 1.6,
              }}>
                <p>
                  {msg.role === 'bot' && msg.typing ? (
                    <TypingText text={msg.text} onComplete={() => markTypingComplete(msg.id)} />
                  ) : (
                    msg.text
                  )}
                </p>
                {msg.analysis && !msg.typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      marginTop: 12, padding: 14, borderRadius: 12,
                      background: '#f8fafc', border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700,
                        background: msg.analysis.severity === 'high' ? '#fecaca' : msg.analysis.severity === 'medium' ? '#fef3c7' : '#dcfce7',
                        color: msg.analysis.severity === 'high' ? '#dc2626' : msg.analysis.severity === 'medium' ? '#b45309' : '#15803d',
                        textTransform: 'uppercase',
                      }}>
                        {msg.analysis.severity} severity
                      </span>
                      <span style={{
                        padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700,
                        background: '#dbeafe', color: '#2563EB',
                      }}>
                        {msg.analysis.specialty}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: 10 }}>{msg.analysis.advice}</p>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => onNav('doctors')}
                      style={{
                        padding: '8px 16px', borderRadius: 10,
                        background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                        color: 'white', fontWeight: 600, fontSize: '0.82rem',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <Icon name="doctor" size={14} color="white" /> Book {msg.analysis.specialty}
                    </motion.button>
                  </motion.div>
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
              padding: '12px 18px', background: 'white',
              borderRadius: 18, width: 'fit-content',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#94a3b8',
                }}
              />
            ))}
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions - always visible after responses */}
      {currentSuggestions.length > 0 && !isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12,
            padding: '0 4px',
          }}
        >
          {currentSuggestions.map((s, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(s)}
              style={{
                padding: '8px 14px', borderRadius: 99,
                background: 'white', border: '1px solid #e2e8f0',
                fontSize: '0.8rem', color: '#475569', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {s}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Input */}
      <div style={{
        display: 'flex', gap: 10, padding: '12px 0',
        borderTop: '1px solid #e2e8f0',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Describe your symptoms..."
          style={{
            flex: 1, padding: '14px 18px', borderRadius: 14,
            border: '1px solid #e2e8f0', background: 'white',
            fontSize: '0.9rem', outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#2563EB'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendMessage(input)}
          style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
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
