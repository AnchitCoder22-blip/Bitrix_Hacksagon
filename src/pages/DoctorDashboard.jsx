import { motion } from 'framer-motion';
import DoctorInsights from '../components/DoctorInsights';
import DoctorQueueControl from '../components/DoctorQueueControl';
import ConsultationModal from '../components/ConsultationModal';
import { useState } from 'react';

export default function DoctorDashboard({ 
  queue, 
  completedPatients, 
  served, 
  paused, 
  onNextPatient, 
  onTogglePause, 
  onSkip, 
  onStartConsultation, 
  onEndConsultation,
  onEmergency,
  onRescheduleClick, 
  onFollowUpClick,
  addToast,
  user // The logged in doctor object
}) {
  const [activeEncounterPatient, setActiveEncounterPatient] = useState(null);

  const handleSaveMedicalRecord = (record) => {
    try {
      // Load all patients to find the target and append their true Medical History EMR
      const allPatients = JSON.parse(window.localStorage.getItem('patients') || '[]');
      const targetName = activeEncounterPatient.name;
      
      const updatedPatients = allPatients.map(p => {
        // Fallback matching logic based on name since some dynamic tokens lack global UUIDs matching patient user login
        if (p.name === targetName || p.username === targetName) {
          const newHistory = [...(p.history || []), record];
          return { ...p, history: newHistory };
        }
        return p;
      });

      window.localStorage.setItem('patients', JSON.stringify(updatedPatients));
      addToast?.('Medical Record successfully generated and secured.', 'success');
    } catch (e) {
      console.warn('Failed to append EMR History', e);
      addToast?.('Failed to save medical record.', 'error');
    }

    // Terminate consultation in the tracker hook
    onEndConsultation(activeEncounterPatient.id);
    setActiveEncounterPatient(null);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Doctor Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your queue, patients, and workflow</p>
      </motion.div>

      {/* Analytics Insights */}
      <DoctorInsights 
        queue={queue} 
        completedPatients={completedPatients} 
        served={served} 
      />

      {/* Global Queue Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{
          display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
          background: 'var(--card)', padding: 16, borderRadius: 16,
          boxShadow: 'var(--card-shadow)',
          border: '1px solid rgba(226,232,240,0.5)',
        }}
      >
        <button
          onClick={() => {
            onNextPatient();
            addToast?.('Next patient called', 'info');
          }}
          disabled={paused || queue.length === 0}
          style={{
            padding: '12px 24px', borderRadius: 12,
            background: paused || queue.length === 0 ? 'var(--border)' : 'linear-gradient(135deg, #10b981, #059669)',
            color: paused || queue.length === 0 ? 'var(--text-light)' : 'white',
            fontWeight: 700, border: 'none', cursor: paused || queue.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'var(--transition)',
          }}
        >
          Call Next Patient
        </button>

        <button
          onClick={onTogglePause}
          style={{
            padding: '12px 24px', borderRadius: 12,
            background: paused ? 'rgba(245,158,11,0.1)' : 'var(--border-light)',
            color: paused ? '#b45309' : 'var(--text-secondary)',
            fontWeight: 600, border: `1px solid ${paused ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
            cursor: 'pointer', transition: 'var(--transition)',
          }}
        >
          {paused ? 'Resume Receiving Patients' : 'Pause Queue'}
        </button>
      </motion.div>

      {/* Active Patients Context */}
      <DoctorQueueControl 
        queue={queue}
        onStart={(patient) => {
          onStartConsultation(patient.id);
          addToast?.(`Consultation Started: ${patient.name}`, 'info');
        }}
        onEnd={(patient) => {
          // Open Modal instead of instantly ending
          setActiveEncounterPatient(patient);
        }}
        onEmergency={(patient) => {
          if(onEmergency) onEmergency(patient.id);
          addToast?.(`Priority Override: ${patient.name}`, 'warning');
        }}
        onSkip={(patientId) => {
          onSkip(patientId);
          addToast?.('Patient skipped', 'warning');
        }}
        onRescheduleClick={onRescheduleClick}
        onFollowUpClick={onFollowUpClick}
      />

      {activeEncounterPatient && (
        <ConsultationModal
          patient={activeEncounterPatient}
          doctor={{ id: user?.id || activeEncounterPatient.doctorId, name: user?.name || 'Doctor', specialty: user?.specialty || '' }}
          onClose={() => setActiveEncounterPatient(null)}
          onSave={handleSaveMedicalRecord}
        />
      )}
    </div>
  );
}
