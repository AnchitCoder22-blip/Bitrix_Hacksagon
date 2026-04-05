import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../shared/Icon';
import { LAB_TESTS } from '../data/constants';

export default function LabTestsPage({ addToast }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [booked, setBooked] = useState([]);

  const categories = ['All', ...new Set(LAB_TESTS.map(t => t.category))];

  const filtered = LAB_TESTS.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || t.category === category;
    return matchSearch && matchCat;
  });

  const handleBook = (test) => {
    if (booked.includes(test.id)) return;
    setBooked(prev => [...prev, test.id]);
    addToast?.(`${test.name} booked successfully!`, 'success');
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Lab Tests</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Book diagnostic tests online with fast results</p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}
      >
        <div style={{
          flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--card)', borderRadius: 12, padding: '0 16px', border: '1px solid var(--border)',
        }}>
          <Icon name="search" size={18} color="var(--text-light)" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tests..."
            style={{ flex: 1, padding: '12px 0', border: 'none', outline: 'none', background: 'none', fontSize: '0.9rem', color: 'var(--text)' }}
          />
        </div>
      </motion.div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{
              padding: '8px 16px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 600,
              background: category === c ? 'var(--accent-gradient)' : 'var(--card)',
              color: category === c ? 'white' : 'var(--text-secondary)',
              border: category === c ? 'none' : '1px solid var(--border)',
              cursor: 'pointer', transition: 'var(--transition)',
            }}
          >{c}</button>
        ))}
      </div>

      {/* Tests grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16,
      }}>
        {filtered.map((test, i) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            style={{
              background: 'var(--card)', borderRadius: 16, padding: 20,
              boxShadow: 'var(--card-shadow)',
              border: '1px solid rgba(226,232,240,0.5)',
              transition: 'var(--transition)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>{test.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{test.name}</h3>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{test.category}</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 14, lineHeight: 1.5 }}>{test.description}</p>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: '1px solid var(--border-light)', paddingTop: 14,
            }}>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>₹{test.price}</span>
                <span style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginLeft: 8 }}>
                  <Icon name="clock" size={12} style={{ verticalAlign: 'middle' }} /> {test.duration}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBook(test)}
                disabled={booked.includes(test.id)}
                style={{
                  padding: '8px 18px', borderRadius: 10,
                  background: booked.includes(test.id) ? 'rgba(34,197,94,0.1)' : 'var(--accent-gradient)',
                  color: booked.includes(test.id) ? '#15803d' : 'white',
                  fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: booked.includes(test.id) ? 'default' : 'pointer',
                }}
              >
                {booked.includes(test.id) ? '✓ Booked' : 'Book Test'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
