/**
 * createFollowUp.js
 * 
 * Utility to schedule a future follow-up appointment.
 * 
 * @param {object} patient - Patient info { id, name }
 * @param {object} doctor - Doctor info { id, name }
 * @param {string} dateTime - ISO string for the requested appointment date
 * @param {Array} existingAppointments - Array of existing follow-ups to check for collision
 * @returns {object} The scheduled follow-up record
 */
export function createFollowUp(patient, doctor, dateTime, existingAppointments = []) {
  const selectedDate = new Date(dateTime);
  
  // 1. Prevent past date selection
  if (selectedDate < new Date()) {
    throw new Error('Cannot schedule an appointment in the past.');
  }

  // 2. Prevent double booking and check minimum gap (e.g., 10 minutes)
  const MIN_GAP_MS = 10 * 60 * 1000;
  
  const hasCollision = existingAppointments.some(appt => {
    if (appt.doctorId !== doctor.id) return false;
    
    const apptDate = new Date(appt.dateTime);
    const diffMs = Math.abs(selectedDate - apptDate);
    
    return diffMs < MIN_GAP_MS;
  });

  if (hasCollision) {
    throw new Error('This time slot is unavailable or too close to an existing appointment.');
  }

  return {
    id: Math.random().toString(36).slice(2, 10),
    patientId: patient.id || 'patient-1',
    patientName: patient.name || 'Unknown Patient',
    doctorId: doctor.id,
    doctorName: doctor.name || 'Unknown Doctor',
    specialty: doctor.specialty || doctor.specialization || '',
    dateTime: selectedDate.toISOString(),
    type: 'follow-up',
    status: 'scheduled'
  };
}
