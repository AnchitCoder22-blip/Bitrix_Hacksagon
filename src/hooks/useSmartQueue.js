import { useState, useCallback, useRef } from 'react';

const generateId = () => Math.random().toString(36).slice(2, 9);

export default function useSmartQueue(initialQueue = [], initialServed = []) {
  const [queue, setQueue] = useState(initialQueue);
  const [scheduledQueue, setScheduledQueue] = useState([]);
  const [secondaryQueue, setSecondaryQueue] = useState([]);
  const [served, setServed] = useState(initialServed);
  const [paused, setPaused] = useState(false);
  const avgTimeRef = useRef(15);

  const estimateWaitTime = useCallback((position, avgTime) => {
    const avg = avgTime || avgTimeRef.current;
    return Math.max(0, position * avg);
  }, []);

  const addPatient = useCallback((patient) => {
    const token = {
      id: generateId(),
      tokenNumber: Date.now() % 10000,
      name: patient.name || 'Patient',
      phone: patient.phone || '',
      priority: patient.priority || 'normal',
      status: patient.type === 'scheduled' ? 'pending' : 'waiting',
      arrivedAt: null,
      joinedAt: new Date().toISOString(),
      isEmergency: patient.isEmergency || false,
      isVIP: patient.isVIP || false,
      doctorId: patient.doctorId,
      doctorName: patient.doctorName,
      specialty: patient.specialty || '',
      type: patient.type || 'instant',
      scheduledTime: patient.scheduledTime || null
    };
    
    if (patient.type === 'scheduled' && patient.scheduledTime) {
      setScheduledQueue(prev => [...prev, token]);
    } else {
      setQueue(prev => {
        const next = [...prev, token];
        return applyPriority(next);
      });
    }
    return token;
  }, []);

  const applyPriority = useCallback((q) => {
    return [...q].sort((a, b) => {
      if (a.isEmergency && !b.isEmergency) return -1;
      if (!a.isEmergency && b.isEmergency) return 1;
      if (a.isVIP && !b.isVIP) return -1;
      if (!a.isVIP && b.isVIP) return 1;
      
      // Keep scheduled tokens chronologically correct amongst themselves if possible
      if (a.type === 'scheduled' && b.type === 'scheduled' && a.scheduledTime && b.scheduledTime) {
        return new Date(a.scheduledTime) - new Date(b.scheduledTime);
      }
      return new Date(a.joinedAt) - new Date(b.joinedAt);
    });
  }, []);

  const nextPatient = useCallback(() => {
    if (paused) return null;
    setQueue(prev => {
      if (prev.length === 0) return prev;
      const [current, ...rest] = prev;
      setServed(s => [...s, { ...current, status: 'served', servedAt: new Date().toISOString() }]);
      return rest;
    });
  }, [paused]);

  const skipPatient = useCallback((patientId) => {
    setQueue(prev => {
      const idx = prev.findIndex(p => p.id === patientId);
      if (idx === -1) return prev;
      const skipped = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      setSecondaryQueue(sq => [...sq, { ...skipped, status: 'skipped' }]);
      return rest;
    });
  }, []);

  const handleNoShow = useCallback((patientId) => {
    setQueue(prev => {
      const idx = prev.findIndex(p => p.id === patientId);
      if (idx === -1) return prev;
      const noShow = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      setSecondaryQueue(sq => [...sq, { ...noShow, status: 'no-show' }]);
      return rest;
    });
  }, []);

  const markArrived = useCallback((patientId) => {
    setQueue(prev => prev.map(p =>
      p.id === patientId ? { ...p, status: 'arrived', arrivedAt: new Date().toISOString() } : p
    ));
  }, []);

  const moveUp = useCallback((patientId) => {
    setQueue(prev => {
      const idx = prev.findIndex(p => p.id === patientId);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((patientId) => {
    setQueue(prev => {
      const idx = prev.findIndex(p => p.id === patientId);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  const markEmergency = useCallback((patientId) => {
    setQueue(prev => {
      const updated = prev.map(p =>
        p.id === patientId ? { ...p, isEmergency: true, priority: 'emergency' } : p
      );
      return applyPriority(updated);
    });
  }, [applyPriority]);

  const reAddFromSecondary = useCallback((patientId) => {
    setSecondaryQueue(prev => {
      const p = prev.find(x => x.id === patientId);
      if (!p) return prev;
      setQueue(q => applyPriority([...q, { ...p, status: 'waiting' }]));
      return prev.filter(x => x.id !== patientId);
    });
  }, [applyPriority]);

  const togglePause = useCallback(() => setPaused(p => !p), []);

  const getQueueHealth = useCallback(() => {
    const len = queue.length;
    if (len <= 5) return { status: 'healthy', label: 'Low Load', color: '#22c55e' };
    if (len <= 15) return { status: 'moderate', label: 'Moderate', color: '#f59e0b' };
    return { status: 'overloaded', label: 'High Load', color: '#ef4444' };
  }, [queue]);

  const getPosition = useCallback((patientId) => {
    const idx = queue.findIndex(p => p.id === patientId);
    return idx === -1 ? null : idx;
  }, [queue]);

  return {
    queue,
    scheduledQueue,
    secondaryQueue,
    served,
    paused,
    addPatient,
    nextPatient,
    skipPatient,
    handleNoShow,
    markArrived,
    markEmergency,
    moveUp,
    moveDown,
    togglePause,
    reAddFromSecondary,
    estimateWaitTime,
    getQueueHealth,
    getPosition,
    setQueue,
    setScheduledQueue,
    applyPriority
  };
}
