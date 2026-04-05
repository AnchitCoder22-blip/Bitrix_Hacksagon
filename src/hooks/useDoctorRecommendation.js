import { useMemo } from 'react';

/**
 * useDoctorRecommendation
 *
 * Intelligently recommends a faster same-specialization doctor
 * when the current doctor's estimated wait time exceeds 30 minutes.
 *
 * Accepts both field name conventions used across HealthQueue:
 *   specialty | specialization   → doctor's specialization
 *   avgTime   | avgConsultTime   → avg minutes per consultation
 *   patients  | queueLength      → number of patients currently waiting
 *
 * @param {object} currentDoctor  - The doctor the patient is currently booked with
 * @param {Array}  doctorsList    - Full list of all available doctors
 *
 * @returns {{
 *   shouldSwitch: boolean,
 *   recommendedDoctor: object|null,
 *   alternatives: Array,          // top 3 same-spec doctors sorted by wait time
 *   estimatedTimeSaved: number,
 *   reason: string,
 *   urgency: 'high'|'moderate'|'none'
 * }}
 */
export default function useDoctorRecommendation(currentDoctor = null, doctorsList = []) {
  return useMemo(() => {
    const NO_RECOMMENDATION = {
      shouldSwitch: false,
      recommendedDoctor: null,
      alternatives: [],
      estimatedTimeSaved: 0,
      reason: '',
      urgency: 'none',
    };

    // Guard: need a valid currentDoctor
    if (!currentDoctor) return NO_RECOMMENDATION;

    // ── Normalize field names ──────────────────────────────────────────────
    const normalize = (doc) => ({
      ...doc,
      specialization: doc.specialization || doc.specialty || '',
      avgConsultTime:
        typeof doc.avgConsultTime === 'number'
          ? doc.avgConsultTime
          : typeof doc.avgTime === 'number'
          ? doc.avgTime
          : 10,
      queueLength:
        typeof doc.queueLength === 'number'
          ? doc.queueLength
          : typeof doc.patients === 'number'
          ? doc.patients
          : Array.isArray(doc.patients)
          ? doc.patients.length
          : 0,
    });

    const current = normalize(currentDoctor);

    // ── Determine current doctor's wait time ──────────────────────────────
    // If already provided, use it; otherwise calculate from queue × avg time
    const currentWaitTime =
      typeof current.waitTime === 'number' && current.waitTime > 0
        ? current.waitTime
        : current.avgConsultTime * current.queueLength;

    // ── Filter: same specialization, not the same doctor, available ────────
    const sameSpecDoctors = doctorsList
      .map(normalize)
      .filter((doc) => {
        if (doc.id === current.id) return false; // exclude current doctor
        if (doc.available === false) return false; // exclude unavailable
        return doc.specialization === current.specialization;
      })
      .map((doc) => ({
        ...doc,
        computedWaitTime: doc.avgConsultTime * doc.queueLength,
      }))
      .sort((a, b) => a.computedWaitTime - b.computedWaitTime); // ascending wait time

    // Edge case: no alternatives in same specialization
    if (sameSpecDoctors.length === 0) return NO_RECOMMENDATION;

    // Top 2-3 alternatives
    const alternatives = sameSpecDoctors.slice(0, 3);
    const best = alternatives[0]; // lowest wait time

    // ── Recommendation condition ───────────────────────────────────────────
    const THRESHOLD = 30; // minutes
    const qualifies =
      currentWaitTime > THRESHOLD &&
      best.computedWaitTime < currentWaitTime;

    if (!qualifies) return { ...NO_RECOMMENDATION, alternatives };

    const estimatedTimeSaved = Math.round(currentWaitTime - best.computedWaitTime);

    // ── Smart messaging based on urgency tier ─────────────────────────────
    let urgency = 'moderate';
    let reason = '';

    if (currentWaitTime > 45) {
      urgency = 'high';
      reason = `⚠️ High delay detected — your current wait is ~${Math.round(currentWaitTime)} min. Switching to ${best.name} saves ~${estimatedTimeSaved} min.`;
    } else {
      urgency = 'moderate';
      reason = `🕐 Moderate delay — your current wait is ~${Math.round(currentWaitTime)} min. ${best.name} has a shorter queue.`;
    }

    return {
      shouldSwitch: true,
      recommendedDoctor: best,
      alternatives,
      estimatedTimeSaved,
      reason,
      urgency,
    };
  }, [currentDoctor, doctorsList]);
}
