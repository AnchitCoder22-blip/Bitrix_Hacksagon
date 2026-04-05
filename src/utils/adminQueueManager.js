// Utility functions for overriding Global Queue explicitly by the Admin.

export const movePatient = (globalQueue, patientId, targetDoctor) => {
  // Transfer patient to newly assigned doctor while maintaining queue properties
  return globalQueue.map(p => {
    if (p.id === patientId) {
      return { 
        ...p, 
        doctorId: targetDoctor.id, 
        doctorName: targetDoctor.name || targetDoctor.username 
      };
    }
    return p;
  });
};

export const removePatient = (globalQueue, patientId) => {
  // Eliminate a token out of the smart queue completely
  return globalQueue.filter(p => p.id !== patientId);
};

export const boostPatient = (globalQueue, patientId) => {
  // Elevate patient to the very top by shifting priority flags explicitly 
  // overriding useSmartQueue natural ordering.
  const targetPatient = globalQueue.find(p => p.id === patientId);
  if (!targetPatient) return globalQueue;
  
  const others = globalQueue.filter(p => p.id !== patientId);
  // Reconstruct list putting the patient at index 0 explicitly marked as emergency.
  return [
    { ...targetPatient, isEmergency: true, priority: 'emergency' },
    ...others
  ];
};
