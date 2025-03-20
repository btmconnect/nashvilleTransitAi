import { useQuery } from "@tanstack/react-query";
import type { Stop } from "@shared/schema";

export default function TransitMap() {
  const { data: stops } = useQuery<Stop[]>({
    queryKey: ["/api/stops"],
  });

  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ maxHeight: "400px" }}
        >
          {/* Map lines */}
          <line
            x1="20"
            y1="20"
            x2="80"
            y2="80"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="2"
          />
          <line
            x1="20"
            y1="80"
            x2="80"
            y2="20"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="2"
          />

          {/* Stop markers */}
          {stops?.map((stop, index) => (
            <g key={stop.id}>
              <circle
                cx={20 + (index * 20)}
                cy={20 + (index * 20)}
                r="4"
                className="fill-primary"
              />
              <text
                x={20 + (index * 20)}
                y={30 + (index * 20)}
                className="text-xs"
                textAnchor="middle"
              >
                {stop.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
