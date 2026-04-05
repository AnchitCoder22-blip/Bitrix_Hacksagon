import { useState } from 'react';
import { motion } from 'framer-motion';
import DoctorCard from '../components/DoctorCard';
import TimeSlotSelector from '../components/TimeSlotSelector';
import Icon from '../shared/Icon';
import { SPECIALTIES } from '../data/constants';

export default function DoctorsPage({ doctors, onBook }) {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  
  // Scheduling state
  const [schedulingDoctor, setSchedulingDoctor] = useState(null);

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
        <p style={{ color: 'var(--text-secondary)' }}>Browse our expert doctors and book your appointment</p>
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
          background: 'var(--card)', borderRadius: 12, padding: '0 16px',
          border: '1px solid var(--border)',
          transition: 'var(--transition)',
        }}>
          <Icon name="search" size={18} color="var(--text-light)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctors or specialties..."
            style={{
              flex: 1, padding: '12px 0', border: 'none', outline: 'none',
              background: 'none', fontSize: '0.9rem', color: 'var(--text)',
            }}
          />
        </div>
        <select
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          style={{
            padding: '12px 16px', borderRadius: 12,
            border: '1px solid var(--border)', background: 'var(--card)',
            fontSize: '0.9rem', color: 'var(--text)', outline: 'none',
            minWidth: 180,
          }}
        >
          <option value="All">All Specialties</option>
          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </motion.div>

      {/* Results count */}
      <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: 16 }}>
        Showing {filtered.length} doctor{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 20,
      }}>
        {filtered.map((doc, i) => (
          <DoctorCard 
            key={doc.id} 
            doctor={doc} 
            onBook={onBook} 
            onScheduleClick={(doctor) => setSchedulingDoctor(doctor)}
            index={i} 
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          color: 'var(--text-light)',
        }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🔍</span>
          <p>No doctors found matching your search</p>
        </div>
      )}

      {/* Time Slot Scheduler Modal Overlay */}
      <TimeSlotSelector 
        show={!!schedulingDoctor}
        doctorName={schedulingDoctor?.name}
        onClose={() => setSchedulingDoctor(null)}
        onSchedule={(isoDateTime) => {
          onBook(schedulingDoctor, true, isoDateTime);
        }}
      />
    </div>
  );
}
