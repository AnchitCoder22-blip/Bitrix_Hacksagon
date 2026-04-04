/**
 * consultationTracker.js
 *
 * In-memory tracker for consultation start/end times.
 * Used to feed real consultation durations into useWaitTimePredictor.
 *
 * Storage shape:
 *   active:    { [patientId]: { startTime: ISO string } }
 *   completed: [{ patientId, startTime, endTime }]
 */

const store = {
  active: {},        // ongoing consultations keyed by patientId
  completed: [],     // historical records with startTime + endTime
};

/**
 * Mark the start of a consultation session for a patient.
 * @param {string} patientId
 */
export function startConsultation(patientId) {
  if (!patientId) return;
  store.active[patientId] = {
    startTime: new Date().toISOString(),
  };
}

/**
 * Mark the end of a consultation session for a patient.
 * Pushes a record into completedPatients array.
 * @param {string} patientId
 * @returns {object|null} The completed record, or null if no matching start.
 */
export function endConsultation(patientId) {
  if (!patientId) return null;

  const session = store.active[patientId];
  if (!session) {
    console.warn(`[consultationTracker] No active session for patientId: ${patientId}`);
    return null;
  }

  const record = {
    patientId,
    startTime: session.startTime,
    endTime: new Date().toISOString(),
  };

  store.completed.push(record);
  delete store.active[patientId];

  return record;
}

/**
 * Get all completed consultation records.
 * Returns a shallow copy so consumers cannot mutate the internal store.
 * @returns {Array<{ patientId, startTime, endTime }>}
 */
export function getCompletedPatients() {
  return [...store.completed];
}

/**
 * Get any active (in-progress) session for a patient.
 * @param {string} patientId
 * @returns {{ startTime: string }|undefined}
 */
export function getActiveSession(patientId) {
  return store.active[patientId];
}

/**
 * Clear all data — useful for testing / resets.
 */
export function resetTracker() {
  store.active = {};
  store.completed = [];
}

export default store;
