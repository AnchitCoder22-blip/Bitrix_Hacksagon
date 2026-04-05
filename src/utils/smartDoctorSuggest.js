/**
 * Smart Doctor Suggestion Utility
 * 
 * Analyzes patient's medical history and recommends a doctor specialization
 * based on their most frequently visited specialty.
 */

export function getRecommendedSpecialization(patient) {
  if (!patient?.history || patient.history.length === 0) {
    return null;
  }

  // Group visits by specialization and count
  const specCount = {};
  for (const visit of patient.history) {
    const spec = visit.specialization || 'General';
    specCount[spec] = (specCount[spec] || 0) + 1;
  }

  // Find the specialization with highest visit count
  let topSpec = null;
  let topCount = 0;
  for (const [spec, count] of Object.entries(specCount)) {
    if (count > topCount) {
      topCount = count;
      topSpec = spec;
    }
  }

  return {
    recommendedSpecialization: topSpec,
    visitCount: topCount,
    totalVisits: patient.history.length,
    breakdown: specCount,
  };
}

/**
 * Returns upcoming follow-up dates from a patient's history
 * that are in the future.
 */
export function getUpcomingFollowUps(patient) {
  if (!patient?.history || patient.history.length === 0) {
    return [];
  }

  const now = new Date();
  return patient.history
    .filter(visit => visit.followUpDate && new Date(visit.followUpDate) >= now)
    .map(visit => ({
      followUpDate: visit.followUpDate,
      doctorName: visit.doctorName,
      specialization: visit.specialization,
      diagnosis: visit.diagnosis,
      originalVisitDate: visit.date,
    }))
    .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));
}
