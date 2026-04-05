import { useState, useEffect, useCallback, useRef } from 'react';

const toRad = (deg) => (deg * Math.PI) / 180;

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getStatus(distKm) {
  if (distKm <= 0.1) return { label: 'Arrived', color: '#22c55e', emoji: '🏥', arrived: true };
  if (distKm <= 1) return { label: 'Near', color: '#14B8A6', emoji: '📍', arrived: false };
  if (distKm <= 5) return { label: 'On the way', color: '#f59e0b', emoji: '🚗', arrived: false };
  return { label: 'Far', color: '#ef4444', emoji: '🗺️', arrived: false };
}

const ERROR_MESSAGES = {
  1: 'Location permission was denied. Please enable it in your browser settings.',
  2: 'Unable to determine your position. Please check your connection.',
  3: 'Location request timed out. Please try again.',
};

export default function useGeolocation(clinicLat, clinicLng) {
  const [position, setPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [initialDistance, setInitialDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const watchRef = useRef(null);
  const initialDistRef = useRef(null);
  const speedKmH = 30;

  const updatePosition = useCallback((pos) => {
    const { latitude, longitude } = pos.coords;
    setPosition({ lat: latitude, lng: longitude });
    const dist = haversineDistance(latitude, longitude, clinicLat, clinicLng);
    setDistance(dist);

    // Store initial distance for accurate progress
    if (initialDistRef.current === null) {
      initialDistRef.current = Math.max(dist, 0.1); // min 100m to avoid division issues
      setInitialDistance(initialDistRef.current);
    }

    // Calculate progress (0-100) based on initial distance
    const prog = Math.max(0, Math.min(100,
      ((initialDistRef.current - dist) / initialDistRef.current) * 100
    ));
    setProgress(prog);

    setEta(Math.round((dist / speedKmH) * 60));
    setStatus(getStatus(dist));
    setLoading(false);
    setError(null);
    setErrorCode(null);
  }, [clinicLat, clinicLng]);

  const handleError = useCallback((err) => {
    const code = err.code || 0;
    setErrorCode(code);
    setError(ERROR_MESSAGES[code] || err.message || 'Location access failed');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setErrorCode(-1);
      setLoading(false);
      return;
    }
    watchRef.current = navigator.geolocation.watchPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    });
    return () => {
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    };
  }, [updatePosition, handleError]);

  const openMapsNavigation = useCallback(() => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${clinicLat},${clinicLng}`, '_blank');
  }, [clinicLat, clinicLng]);

  // Reset initial distance (e.g., when starting a new trip)
  const resetProgress = useCallback(() => {
    initialDistRef.current = null;
    setInitialDistance(null);
    setProgress(0);
  }, []);

  return {
    position,
    distance,
    initialDistance,
    eta,
    progress,
    status,
    error,
    errorCode,
    loading,
    openMapsNavigation,
    resetProgress,
  };
}
