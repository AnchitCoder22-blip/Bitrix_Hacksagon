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
  if (distKm <= 0.1) return { label: 'Arrived', color: '#22c55e', emoji: '🏥' };
  if (distKm <= 1) return { label: 'Near', color: '#14B8A6', emoji: '📍' };
  if (distKm <= 5) return { label: 'On the way', color: '#f59e0b', emoji: '🚗' };
  return { label: 'Far', color: '#ef4444', emoji: '🗺️' };
}

export default function useGeolocation(clinicLat, clinicLng) {
  const [position, setPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const watchRef = useRef(null);
  const speedKmH = 30;

  const updatePosition = useCallback((pos) => {
    const { latitude, longitude } = pos.coords;
    setPosition({ lat: latitude, lng: longitude });
    const dist = haversineDistance(latitude, longitude, clinicLat, clinicLng);
    setDistance(dist);
    setEta(Math.round((dist / speedKmH) * 60));
    setStatus(getStatus(dist));
    setLoading(false);
    setError(null);
  }, [clinicLat, clinicLng]);

  const handleError = useCallback((err) => {
    setError(err.message || 'Location permission denied');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
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

  return { position, distance, eta, status, error, loading, openMapsNavigation };
}
