import { useState, useCallback, useEffect } from 'react';

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const item = window.localStorage.getItem('currentUser');
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  });

  const [role, setRole] = useState(currentUser?.role || null);

  const saveUser = useCallback((userObj) => {
    try {
      window.localStorage.setItem('currentUser', JSON.stringify(userObj));
      setCurrentUser(userObj);
      setRole(userObj.role);
    } catch (e) {
      console.warn('Failed to save user', e);
    }
  }, []);

  const login = useCallback((selectedRole, data) => {
    const userObj = { role: selectedRole, data };
    saveUser(userObj);
  }, [saveUser]);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setRole(null);
    } catch (e) {
      console.warn('Failed to logic out', e);
    }
  }, []);

  const getCurrentUser = useCallback(() => currentUser, [currentUser]);

  // Activity tracking for Patient role
  const updateActivity = useCallback((activityType, details) => {
    if (!currentUser || currentUser.role !== 'patient') return;

    try {
      // Get all patients
      const allPatients = JSON.parse(window.localStorage.getItem('patients') || '[]');
      
      // Update the specific patient
      const updatedPatients = allPatients.map(p => {
        if (p.username === currentUser.data.username) {
          const newLog = [...(p.activityLog || []), { type: activityType, details, timestamp: new Date().toISOString() }];
          const updatedPatient = { ...p, activityLog: newLog };
          
          // Also update the active session currentUser safely
          saveUser({ role: 'patient', data: updatedPatient });
          return updatedPatient;
        }
        return p;
      });

      window.localStorage.setItem('patients', JSON.stringify(updatedPatients));
    } catch (e) {
      console.warn('Failed to update activity memory', e);
    }
  }, [currentUser, saveUser]);

  return { role, currentUser, login, logout, getCurrentUser, saveUser, updateActivity };
}
