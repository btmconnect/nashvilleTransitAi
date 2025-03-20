import { useState, useEffect } from 'react';

interface VehicleLocation {
  routeId: number;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  lastUpdate: Date;
}

interface ServiceAlert {
  id: number;
  routeId: number;
  type: 'DELAY' | 'CANCELLATION' | 'DETOUR' | 'NOTICE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  timestamp: Date;
}

export function useRealTimeTransit() {
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => {
      console.log('Connected to real-time transit updates');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'INIT':
          setVehicles(message.data.vehicles);
          setAlerts(message.data.alerts);
          break;
        case 'VEHICLE_UPDATES':
          setVehicles(message.data);
          break;
        case 'SERVICE_ALERT':
          setAlerts(prev => [...prev, message.data]);
          break;
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from real-time transit updates');
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return {
    vehicles,
    alerts,
    connected
  };
}