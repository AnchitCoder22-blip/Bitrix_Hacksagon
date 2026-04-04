import { motion } from 'framer-motion';
import DoctorInsights from '../components/DoctorInsights';
import DoctorQueueControl from '../components/DoctorQueueControl';

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
  addToast
}) {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Doctor Dashboard</h2>
        <p style={{ color: '#64748b' }}>Manage your queue, patients, and workflow</p>
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
          background: 'white', padding: 16, borderRadius: 16,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
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
            background: paused || queue.length === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #10b981, #059669)',
            color: paused || queue.length === 0 ? '#94a3b8' : 'white',
            fontWeight: 700, border: 'none', cursor: paused || queue.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Call Next Patient
        </button>

        <button
          onClick={onTogglePause}
          style={{
            padding: '12px 24px', borderRadius: 12,
            background: paused ? '#fef3c7' : '#f8fafc',
            color: paused ? '#b45309' : '#475569',
            fontWeight: 600, border: `1px solid ${paused ? '#fbbf24' : '#e2e8f0'}`,
            cursor: 'pointer',
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
          onEndConsultation(patient.id);
          addToast?.(`Consultation Ended: ${patient.name}`, 'success');
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
    </div>
  );
}
