/**
 * emergencyOverride.js
 * 
 * Allows a doctor to move a patient to the immediate top of the queue.
 * 
 * @param {Array} queue - The current queue array
 * @param {string} patientId - The ID of the patient to prioritize
 * @returns {Array} A new queue array with the patient at the top
 */
export function moveToTop(queue, patientId) {
  const patientIndex = queue.findIndex(p => p.id === patientId);
  
  if (patientIndex <= 0) {
    return queue; // Already at the top or not found
  }

  const newQueue = [...queue];
  const [patient] = newQueue.splice(patientIndex, 1);
  
  // Set emergency flag natively to sync UI visuals
  patient.isEmergency = true;
  patient.priority = 'emergency';
  
  // Bring to absolute top (index 0)
  newQueue.unshift(patient);
  
  return newQueue;
}
