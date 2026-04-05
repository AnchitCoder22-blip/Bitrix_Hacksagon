import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../shared/Icon';

// Mocks the SYMPTOM_RULES locally for prototype
const SYMPTOM_RULES = [
  { keywords: ['headache', 'migraine', 'dizzy'], specialty: 'Neurologist', severity: 'medium', advice: 'Avoid bright lights and rest. If it persists, see a Neurologist.' },
  { keywords: ['chest', 'heart', 'breath'], specialty: 'Cardiologist', severity: 'high', advice: 'Seek emergency care immediately if chest pain is severe or radiates.' },
  { keywords: ['stomach', 'pain', 'nausea'], specialty: 'Gastroenterologist', severity: 'medium', advice: 'Stay hydrated. If pain is severe, visit a doctor soon.' }
];

const quickSuggestions = [
  'I have a headache',
  'Chest pain',
  'Stomach pain',
  'Fever and cold'
];

const followUpSuggestions = {
  Cardiologist: ['How severe is the pain?', 'Any shortness of breath?', 'History of heart disease?'],
  Neurologist: ['How long have headaches lasted?', 'Any vision changes?', 'Numbness or tingling?'],
  Gastroenterologist: ['When did it start?', 'Is it sharp or dull?', 'Any nausea?'],
  'General Physician': ['When did symptoms start?', 'Any medications?', 'Fever temperature?'],
};

function analyzeSymptoms(text) {
  const lower = text.toLowerCase();
  for (const rule of SYMPTOM_RULES) {
    const matched = rule.keywords.filter(k => lower.includes(k));
    if (matched.length > 0) {
      return { specialty: rule.specialty, severity: rule.severity, advice: rule.advice, matched };
    }
  }
  return { specialty: 'General Physician', severity: 'low', advice: 'Based on your symptoms, I recommend visiting a General Physician.', matched: [] };
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
    }, 25);
    return () => clearInterval(timer);
  }, [text, onComplete]);

  return <span>{displayed}<span style={{ opacity: indexRef.current < text.length ? 1 : 0 }}>▍</span></span>;
}

export default function EnhancedAIChat() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: "Hello! 👋 Describe your symptoms, and I'll suggest the right specialist.", typing: false, analysis: null },
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
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: `Based on your symptoms, I recommend seeing a **${result.specialty}**.`,
        typing: true,
        analysis: result,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      setCurrentSuggestions(followUpSuggestions[result.specialty] || followUpSuggestions['General Physician']);
    }, 800 + Math.random() * 600);
  }, []);

  const markTypingComplete = useCallback((msgId) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, typing: false } : m));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 600, background: 'white', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '20px 20px 0 0' }}>
        <h3 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>AI Diagnosis System (Prototype)</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Advanced text-streaming and severity tracking</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #2563EB, #14B8A6)' : '#f1f5f9',
                color: msg.role === 'user' ? 'white' : '#1e293b',
              }}>
                <p style={{ margin: 0 }}>
                  {msg.role === 'bot' && msg.typing ? (
                    <TypingText text={msg.text} onComplete={() => markTypingComplete(msg.id)} />
                  ) : msg.text}
                </p>
                {msg.analysis && !msg.typing && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 12, padding: 14, borderRadius: 12, background: 'white', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700,
                        background: msg.analysis.severity === 'high' ? '#fecaca' : msg.analysis.severity === 'medium' ? '#fef3c7' : '#dcfce7',
                        color: msg.analysis.severity === 'high' ? '#dc2626' : msg.analysis.severity === 'medium' ? '#b45309' : '#15803d',
                      }}>
                        {msg.analysis.severity}
                      </span>
                      <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, background: '#dbeafe', color: '#2563EB' }}>
                        {msg.analysis.specialty}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>{msg.analysis.advice}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: 6, padding: '12px 18px', background: '#f1f5f9', width: 'fit-content', borderRadius: 18 }}>
            {[0, 1, 2].map(i => <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8' }} />)}
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {currentSuggestions.length > 0 && !isTyping && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '0 20px 12px' }}>
          {currentSuggestions.map((s, i) => (
            <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => sendMessage(s)}
              style={{ padding: '8px 14px', borderRadius: 99, background: 'white', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
              {s}
            </motion.button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, padding: 20, borderTop: '1px solid #e2e8f0' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Describe your symptoms..."
          style={{ flex: 1, padding: '14px 18px', borderRadius: 14, border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }} />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => sendMessage(input)}
          style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #2563EB, #14B8A6)', border: 'none', cursor: 'pointer' }}>
          <Icon name="send" size={20} color="white" />
        </motion.button>
      </div>
    </div>
  );
}
