import { WebSocket, WebSocketServer } from 'ws';
import type { Server } from 'http';
import type { Stop, Route } from '@shared/schema';

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

let vehicles = new Map<number, VehicleLocation>();
let alerts = new Map<number, ServiceAlert>();
let alertId = 1;

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws' // Specify path to avoid conflict with Vite
  });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to real-time updates');

    // Send initial state
    ws.send(JSON.stringify({
      type: 'INIT',
      data: {
        vehicles: Array.from(vehicles.values()),
        alerts: Array.from(alerts.values())
      }
    }));

    ws.on('close', () => {
      console.log('Client disconnected from real-time updates');
    });
  });

  // Start simulation of real-time updates
  startSimulation(wss);
}

function startSimulation(wss: WebSocketServer) {
  // Simulate vehicle movement every 3 seconds
  setInterval(() => {
    vehicles.forEach((vehicle) => {
      // Simulate movement along route
      vehicle.latitude += (Math.random() - 0.5) * 0.001;
      vehicle.longitude += (Math.random() - 0.5) * 0.001;
      vehicle.heading = Math.random() * 360;
      vehicle.speed = 20 + Math.random() * 10;
      vehicle.lastUpdate = new Date();
    });

    broadcastUpdate(wss, 'VEHICLE_UPDATES', Array.from(vehicles.values()));
  }, 3000);

  // Simulate random service alerts every 30 seconds
  setInterval(() => {
    if (Math.random() < 0.3) { // 30% chance of new alert
      const alert: ServiceAlert = {
        id: alertId++,
        routeId: Math.floor(Math.random() * 6) + 1,
        type: ['DELAY', 'CANCELLATION', 'DETOUR', 'NOTICE'][Math.floor(Math.random() * 4)] as ServiceAlert['type'],
        severity: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as ServiceAlert['severity'],
        message: generateRandomAlert(),
        timestamp: new Date()
      };
      alerts.set(alert.id, alert);
      broadcastUpdate(wss, 'SERVICE_ALERT', alert);
    }
  }, 30000);

  // Initialize some vehicles
  for (let i = 1; i <= 6; i++) {
    vehicles.set(i, {
      routeId: i,
      latitude: 36.1627 + (Math.random() - 0.5) * 0.02,
      longitude: -86.7816 + (Math.random() - 0.5) * 0.02,
      heading: Math.random() * 360,
      speed: 20 + Math.random() * 10,
      lastUpdate: new Date()
    });
  }
}

function broadcastUpdate(wss: WebSocketServer, type: string, data: any) {
  const message = JSON.stringify({ type, data });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function generateRandomAlert(): string {
  const alerts = [
    "Minor delay due to traffic congestion",
    "Route detour due to road construction",
    "Service temporarily suspended",
    "Expect delays due to special event",
    "Bus running 5-10 minutes behind schedule",
    "Weather advisory: Service operating with caution"
  ];
  return alerts[Math.floor(Math.random() * alerts.length)];
}