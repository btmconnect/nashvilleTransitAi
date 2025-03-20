import { useQuery } from "@tanstack/react-query";
import type { Stop, Route } from "@shared/schema";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function TransitMap() {
  const { data: stops } = useQuery<Stop[]>({
    queryKey: ["/api/stops"],
  });

  const { data: routes } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  // Nashville center coordinates
  const center: [number, number] = [36.1627, -86.7816];

  return (
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
      </MapContainer>
    </div>
  );
}