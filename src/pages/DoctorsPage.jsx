import { useState } from 'react';
import { motion } from 'framer-motion';
import DoctorCard from '../components/DoctorCard';
import Icon from '../shared/Icon';
import { SPECIALTIES } from '../data/constants';

export default function DoctorsPage({ doctors, onBook }) {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specialty === 'All' || d.specialty === specialty;
    return matchSearch && matchSpec;
  });

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Find a Doctor</h2>
        <p style={{ color: '#64748b' }}>Browse our expert doctors and book your appointment</p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
        }}
      >
        <div style={{
          flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 10,
          background: 'white', borderRadius: 12, padding: '0 16px',
          border: '1px solid #e2e8f0',
        }}>
          <Icon name="search" size={18} color="#94a3b8" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctors or specialties..."
            style={{
              flex: 1, padding: '12px 0', border: 'none', outline: 'none',
              background: 'none', fontSize: '0.9rem',
            }}
          />
        </div>
        <select
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          style={{
            padding: '12px 16px', borderRadius: 12,
            border: '1px solid #e2e8f0', background: 'white',
            fontSize: '0.9rem', color: '#334155', outline: 'none',
            minWidth: 180,
          }}
        >
          <option value="All">All Specialties</option>
          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </motion.div>

      {/* Results count */}
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 16 }}>
        Showing {filtered.length} doctor{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 20,
      }}>
        {filtered.map((doc, i) => (
          <DoctorCard key={doc.id} doctor={doc} onBook={onBook} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          color: '#94a3b8',
        }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🔍</span>
          <p>No doctors found matching your search</p>
        </div>
      )}
    </div>
  );
}
