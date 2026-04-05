import { useState } from 'react';
import { motion } from 'framer-motion';
import DoctorCard from '../components/DoctorCard';
import Icon from '../shared/Icon';
import { useSystem } from '../context/SystemContext';

export default function DoctorsPage() {
  const { doctors, handleBookDoctor } = useSystem();
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('All');

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty))];

  const filtered = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = filterSpec === 'All' || d.specialty === filterSpec;
    return matchesSearch && matchesSpec;
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Find Doctors</h2>
        <p style={{ color: '#64748b' }}>Browse specialists and book appointments</p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}
      >
        <div style={{
          flex: 1, minWidth: 200, position: 'relative',
        }}>
          <Icon name="search" size={18} color="#94a3b8" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctors..."
            style={{
              width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12,
              border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {specialties.slice(0, 6).map(s => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setFilterSpec(s)}
              style={{
                padding: '8px 16px', borderRadius: 99,
                background: filterSpec === s ? 'linear-gradient(135deg, #2563EB, #14B8A6)' : 'white',
                color: filterSpec === s ? 'white' : '#475569',
                border: filterSpec === s ? 'none' : '1px solid #e2e8f0',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'white', borderRadius: 20, padding: '60px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🔍</span>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No doctors found</h3>
          <p style={{ color: '#64748b' }}>Try adjusting your search or filter</p>
        </motion.div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16,
        }}>
          {filtered.map((doc, i) => (
            <DoctorCard key={doc.id} doctor={doc} onBook={handleBookDoctor} delay={i * 0.05} />
          ))}
        </div>
      )}
    </div>
  );
}
