import { useEffect } from 'react';

export default function ProtectedRoute({ roleRequired, currentRole, fallbackPage, onRedirect, children }) {
  useEffect(() => {
    if (!currentRole || currentRole !== roleRequired) {
      if (currentRole === 'admin' && roleRequired === 'patient') {
         // Admins can see patient pages, let them pass if needed or enforce strictly.
         // Sticking to strictly as requested. Actually, Admin usually sees all, but let's stick to strict rules.
      }
      onRedirect(fallbackPage);
    }
  }, [currentRole, roleRequired, fallbackPage, onRedirect]);

  // Block rendering entirely while executing the redirect
  if (!currentRole || currentRole !== roleRequired) {
    return null;
  }

  return children;
}
