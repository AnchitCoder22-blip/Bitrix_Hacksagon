import { useState, useEffect, useRef } from 'react';

const FALLBACK_AVG_CONSULT_TIME = 5; // minutes
const ROLLING_WINDOW = 5; // last N consultations
const REFRESH_INTERVAL = 7000; // 7 seconds

/**
 * useWaitTimePredictor
 *
 * Calculates an adaptive estimated wait time based on:
 *  - rolling average of last 5 completed consultations
 *  - current patients ahead in queue
 *
 * @param {Array} queue              - Current queue of patients
 * @param {Array} completedPatients  - Patients with { startTime, endTime } timestamps
 * @returns {{ estimatedWaitTime, avgConsultTime, patientsAhead }}
 */
export default function useWaitTimePredictor(queue = [], completedPatients = []) {
  const [prediction, setPrediction] = useState({
    estimatedWaitTime: 0,
    avgConsultTime: FALLBACK_AVG_CONSULT_TIME,
    patientsAhead: 0,
  });

  const intervalRef = useRef(null);

  const calculate = () => {
    const patientsAhead = queue.length;

    // Rolling average of last ROLLING_WINDOW consultations
    let avgConsultTime = FALLBACK_AVG_CONSULT_TIME;

    if (completedPatients.length > 0) {
      const recent = completedPatients.slice(-ROLLING_WINDOW);
      const durations = recent
        .filter(p => p.startTime && p.endTime)
        .map(p => {
          const duration = (new Date(p.endTime) - new Date(p.startTime)) / 60000; // ms → minutes
          return duration > 0 ? duration : null;
        })
        .filter(d => d !== null);

      if (durations.length > 0) {
        const total = durations.reduce((sum, d) => sum + d, 0);
        avgConsultTime = total / durations.length;
      }
    }

    // Guard against divide-by-zero or NaN
    if (!isFinite(avgConsultTime) || avgConsultTime <= 0) {
      avgConsultTime = FALLBACK_AVG_CONSULT_TIME;
    }

    const estimatedWaitTime = patientsAhead > 0
      ? Math.round(avgConsultTime * patientsAhead)
      : 0;

    setPrediction({
      estimatedWaitTime,
      avgConsultTime: Math.round(avgConsultTime * 10) / 10, // 1 decimal
      patientsAhead,
    });
  };

  // Initial calculation
  useEffect(() => {
    calculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, completedPatients]);

  // Real-time refresh every REFRESH_INTERVAL ms
  useEffect(() => {
    intervalRef.current = setInterval(calculate, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, completedPatients]);

  return prediction;
}
