import { useQuery } from "@tanstack/react-query";
import type { Stop, Route } from "@shared/schema";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRealTimeTransit } from "@/hooks/use-real-time-transit";
import { AlertCircle, Navigation2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bus icon
const busIcon = L.divIcon({
  html: `<div class="bg-blue-600 p-2 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 19v2"></path><path d="M18 19v2"></path><path d="M2 7h18"></path><path d="M4 12h16"></path>
      <rect x="2" y="3" width="20" height="16" rx="2"></rect>
    </svg>
  </div>`,
  className: 'bus-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function TransitMap() {
  const { data: stops } = useQuery<Stop[]>({
    queryKey: ["/api/stops"],
  });

  const { data: routes } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  const { vehicles, alerts, connected } = useRealTimeTransit();

  // Nashville center coordinates
  const center: [number, number] = [36.1627, -86.7816];

  return (
    <div className="space-y-4">
      {!connected && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connecting to real-time transit updates...
          </AlertDescription>
        </Alert>
      )}

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
            <Alert
              key={alert.id}
              variant={alert.severity === 'HIGH' ? 'destructive' : 'warning'}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="w-full h-[500px] rounded-lg overflow-hidden">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Draw routes as lines */}
          {routes?.map(route => {
            const startStop = stops?.find(s => s.id === route.startStopId);
            const endStop = stops?.find(s => s.id === route.endStopId);

            if (startStop && endStop) {
              return (
                <Polyline
                  key={route.id}
                  positions={[
                    [startStop.latitude, startStop.longitude],
                    [endStop.latitude, endStop.longitude]
                  ]}
                  color="#3b82f6"
                  weight={3}
                />
              );
            }
            return null;
          })}

          {/* Add markers for stops */}
          {stops?.map(stop => (
            <Marker
              key={stop.id}
              position={[stop.latitude, stop.longitude]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-blue-900">{stop.name}</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Click for routes and schedules
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Add markers for vehicles */}
          {vehicles.map(vehicle => (
            <Marker
              key={vehicle.routeId}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={busIcon}
              rotationAngle={vehicle.heading}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-blue-900">
                    Route {vehicle.routeId}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Speed: {Math.round(vehicle.speed)} mph
                  </p>
                  <p className="text-sm text-blue-700">
                    Last Update: {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}