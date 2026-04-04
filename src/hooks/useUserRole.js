import { useState, useCallback } from 'react';

export default function useUserRole() {
  const [role, setStoredRoleState] = useState(() => {
    try {
      const item = window.localStorage.getItem('healthqueue_user_role');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read role from localStorage', error);
      return null;
    }
  });

  const setRole = useCallback((newRole) => {
    try {
      window.localStorage.setItem('healthqueue_user_role', JSON.stringify(newRole));
      setStoredRoleState(newRole);
    } catch (error) {
      console.warn('Failed to save role to localStorage', error);
    }
  }, []);

  const clearRole = useCallback(() => {
    try {
      window.localStorage.removeItem('healthqueue_user_role');
      setStoredRoleState(null);
    } catch (error) {
      console.warn('Failed to remove role from localStorage', error);
    }
  }, []);

  return { role, setRole, clearRole };
}
