import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ToastContainer';
import useGeolocation from '../hooks/useGeolocation';
import { DOCTORS, CLINIC_LOCATION } from '../data/constants';

const SystemContext = createContext(null);

export function SystemProvider({ children }) {
  // Global Toast
  const { toasts, addToast, removeToast } = useToast();

  // 1. Central Store: systemState
  const [systemState, setSystemState] = useState({
    user: {
      isLoggedIn: false,
      role: null, // "patient", "doctor", "admin"
      name: "",
      tokenNumber: null,
      status: "idle", // idle, waiting, ongoing, arrived
      doctorId: null // to track which doctor they booked
    },
    queue: [],
    currentPatient: null,
    tracking: {
      distance: null,
      eta: null,
      status: "idle" // far, onWay, near, arrived
    },
    notifications: []
  });

  // Settings
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    location: true,
    darkMode: false,
  });

  const tracking = useGeolocation(CLINIC_LOCATION.lat, CLINIC_LOCATION.lng);
  // Add global navigation state
  const [page, setPage] = useState('dashboard');
  const onNav = useCallback((p) => setPage(p), []);

  const [trackingWarning, setTrackingWarning] = useState(null);

  const [doctors, setDoctors] = useState(DOCTORS);

  // Helper config
  const AVG_TIME_MINUTES = 15;

  // -- QUEUE METHODS --

  const sortQueue = (q) => {
    return [...q].sort((a, b) => {
      // 1000 - emergency, 100 - arrived, 0 - normal
      const scoreA = (a.priority === 'emergency' ? 1000 : 0) + (a.status === 'arrived' ? 100 : 0);
      const scoreB = (b.priority === 'emergency' ? 1000 : 0) + (b.status === 'arrived' ? 100 : 0);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return new Date(a.joinedAt) - new Date(b.joinedAt);
    });
  };

  const addNotification = useCallback((message, type = 'info') => {
    setSystemState(prev => ({
      ...prev,
      notifications: [{ id: Date.now(), message, type, time: new Date().toISOString() }, ...prev.notifications].slice(0, 20)
    }));
  }, []);

  const updateQueueWaitTimes = (queue) => {
    return queue.map((p, i) => ({ ...p, estimatedWait: i * AVG_TIME_MINUTES }));
  };

  const addPatient = useCallback((patientInfo) => {
    const token = {
      id: Math.random().toString(36).slice(2, 9),
      tokenNumber: Date.now() % 10000,
      name: patientInfo.name,
      priority: patientInfo.isEmergency ? 'emergency' : 'normal',
      status: 'waiting',
      joinedAt: new Date().toISOString(),
      doctorId: patientInfo.doctorId,
      doctorName: patientInfo.doctorName,
      estimatedWait: 0
    };

    setSystemState(prev => {
      let newQueue = sortQueue([...prev.queue, token]);
      newQueue = updateQueueWaitTimes(newQueue);
      return { ...prev, queue: newQueue };
    });

    addNotification(`Patient ${token.name} added to queue #${token.tokenNumber}`, patientInfo.isEmergency ? 'warning' : 'success');
    return token;
  }, [addNotification]);

  const nextPatient = useCallback(() => {
    setSystemState(prev => {
      if (prev.queue.length === 0) return prev;
      const [next, ...rest] = prev.queue;
      return {
        ...prev,
        currentPatient: { ...next, status: 'ongoing', startedAt: new Date().toISOString() },
        queue: updateQueueWaitTimes(rest)
      };
    });
  }, []);

  const skipPatient = useCallback((patientId) => {
    setSystemState(prev => {
      const idx = prev.queue.findIndex(p => p.id === patientId);
      if (idx === -1) return prev;
      const rest = prev.queue.filter(p => p.id !== patientId);
      return { ...prev, queue: updateQueueWaitTimes(rest) };
    });
  }, []);

  const markEmergency = useCallback((patientId) => {
    setSystemState(prev => {
      const updated = prev.queue.map(p =>
        p.id === patientId ? { ...p, priority: 'emergency' } : p
      );
      return { ...prev, queue: updateQueueWaitTimes(sortQueue(updated)) };
    });
  }, []);

  const markArrived = useCallback((patientId) => {
    setSystemState(prev => {
      const updated = prev.queue.map(p =>
        p.id === patientId ? { ...p, status: 'arrived' } : p
      );
      // update logged in user status if matching
      const userUpdates = {};
      if (prev.user.isLoggedIn && prev.user.role === 'patient') {
        const tokenInQueue = updated.find(u => u.name === prev.user.name && u.id === patientId);
        if (tokenInQueue) {
          userUpdates.status = 'arrived';
        }
      }

      return {
        ...prev,
        user: { ...prev.user, ...userUpdates },
        queue: updateQueueWaitTimes(sortQueue(updated))
      };
    });
    addNotification('Patient marked as arrived', 'success');
  }, [addNotification]);

  const updateStatus = useCallback((patientId, newStatus) => {
    setSystemState(prev => {
      const updated = prev.queue.map(p =>
        p.id === patientId ? { ...p, status: newStatus } : p
      );
      return { ...prev, queue: updateQueueWaitTimes(sortQueue(updated)) };
    });
  }, []);

  const moveUp = useCallback((patientId) => {
    setSystemState(prev => {
      const idx = prev.queue.findIndex(p => p.id === patientId);
      if (idx <= 0) return prev;
      const next = [...prev.queue];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return { ...prev, queue: updateQueueWaitTimes(next) }; // manual order override
    });
  }, []);

  const moveDown = useCallback((patientId) => {
    setSystemState(prev => {
      const idx = prev.queue.findIndex(p => p.id === patientId);
      if (idx === -1 || idx >= prev.queue.length - 1) return prev;
      const next = [...prev.queue];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return { ...prev, queue: updateQueueWaitTimes(next) }; // manual order override
    });
  }, []);

  const handleNoShow = useCallback((patientId) => {
    updateStatus(patientId, 'no-show');
  }, [updateStatus]);

  const reAddFromSecondary = useCallback((patientId) => {
    updateStatus(patientId, 'waiting');
  }, [updateStatus]);

  const removePatient = useCallback((patientId) => {
    setSystemState(prev => ({
      ...prev,
      queue: updateQueueWaitTimes(prev.queue.filter(p => p.id !== patientId))
    }));
  }, []);

  const toggleDoctorAvailability = useCallback((doctorId) => {
    setDoctors(prev => prev.map(d =>
      d.id === doctorId ? { ...d, available: !d.available } : d
    ));
  }, []);

  // Sync logged in user details from queue
  useEffect(() => {
    if (systemState.user.isLoggedIn && systemState.user.role === 'patient') {
      const qs = systemState.queue.find(q => q.name === systemState.user.name);
      if (qs && (qs.status !== systemState.user.status || qs.tokenNumber !== systemState.user.tokenNumber)) {
        setSystemState(prev => ({
          ...prev,
          user: { ...prev.user, status: qs.status, tokenNumber: qs.tokenNumber, doctorId: qs.doctorId }
        }));
      }
    }
  }, [systemState.queue, systemState.user.isLoggedIn, systemState.user.role, systemState.user.name]);

  // Global Tracking Reactivity: ETA vs Wait Time
  useEffect(() => {
    if (!systemState.user.isLoggedIn || systemState.user.role !== 'patient') return;

    const activeToken = systemState.queue.find(
      t => t.name === systemState.user.name && t.status !== 'completed' && t.status !== 'arrived' && t.status !== 'skipped'
    );

    if (!activeToken || tracking.eta === null) {
      setTrackingWarning(null);
      return;
    }

    if (tracking.status?.arrived && activeToken.status === 'waiting') {
       markArrived(activeToken.id);
    }

    const pos = systemState.queue.findIndex(p => p.id === activeToken.id);
    const wait = Math.max(0, pos * AVG_TIME_MINUTES);

    if (tracking.eta > wait + 10) { // 10 minutes buffer
      setTrackingWarning({ type: 'warning', text: 'You may be late' });
    } else {
      setTrackingWarning({ type: 'success', text: 'On time' });
    }
  }, [tracking.eta, tracking.status, systemState.queue, systemState.user, markArrived]);


  // Authentication Methods
  const login = useCallback((name, role) => {
    setSystemState(prev => ({
      ...prev,
      user: {
        isLoggedIn: true,
        role: role,
        name: name,
        tokenNumber: null,
        status: "idle",
        doctorId: null
      }
    }));
    addToast(`Logged in successfully as ${role}`, 'success');
  }, [addToast]);

  const logout = useCallback(() => {
    setSystemState(prev => ({
      ...prev,
      user: { isLoggedIn: false, role: null, name: "", tokenNumber: null, status: "idle", doctorId: null }
    }));
  }, []);


  // Helper API for components
  const getQueueHealth = useCallback(() => {
    const qLen = systemState.queue.length;
    let status, label, color;
    if (qLen <= 5) { status = 'healthy'; label = 'Low Load'; color = '#22c55e'; }
    else if (qLen <= 15) { status = 'moderate'; label = 'Moderate'; color = '#f59e0b'; }
    else { status = 'overloaded'; label = 'High Load'; color = '#ef4444'; }
    
    return {
      status, label, color,
      waitingCount: systemState.queue.filter(q => q.status === 'waiting').length,
      arrivedCount: systemState.queue.filter(q => q.status === 'arrived').length,
      totalServed: 0
    };
  }, [systemState.queue]);

  const estimateWaitTime = useCallback((position) => {
    return Math.max(0, position * AVG_TIME_MINUTES);
  }, []);

  const getPosition = useCallback((patientId) => {
    const idx = systemState.queue.findIndex(p => p.id === patientId);
    return idx === -1 ? null : idx;
  }, [systemState.queue]);

  const value = {
    systemState,
    setSystemState,
    
    // Auth & Global
    login,
    logout,
    user: systemState.user,
    role: systemState.user.role,

    // Expose root paths
    page,
    onNav,
    queue: systemState.queue.filter(q => !['completed', 'no-show', 'late', 'skipped'].includes(q.status)),
    served: systemState.queue.filter(q => q.status === 'completed'),
    secondaryQueue: systemState.queue.filter(q => ['no-show', 'late', 'skipped'].includes(q.status)),
    tokens: systemState.queue.filter(q => systemState.user.role !== 'patient' || q.name === systemState.user.name),
    tracking: tracking,
    trackingWarning: trackingWarning,

    getQueueHealth,
    estimateWaitTime,
    getPosition,

    // Queue API
    addPatient,
    nextPatient,
    skipPatient,
    markEmergency,
    markArrived,
    updateStatus,
    moveUp,
    moveDown,
    handleNoShow,
    reAddFromSecondary,
    removePatient,
    
    // Legacy mapping (to be updated later or mapped if needed)
    doctors, setDoctors, toggleDoctorAvailability,
    settings, setSettings,
    toasts, addToast, removeToast,
    notifications: systemState.notifications,
    addNotification,
    clinicLocation: CLINIC_LOCATION
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem must be used within SystemProvider');
  return ctx;
}
