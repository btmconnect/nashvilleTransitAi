import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, AlertCircle, Bus } from "lucide-react";
import type { Route } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  // Mock data for demonstration
  const crowdLevel = Math.floor(Math.random() * 3); // 0: Low, 1: Medium, 2: High
  const delay = Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0; // Random delay in minutes

  const getCrowdStatus = () => {
    switch(crowdLevel) {
      case 0: return { text: "Low occupancy", color: "text-green-600" };
      case 1: return { text: "Moderate occupancy", color: "text-yellow-600" };
      case 2: return { text: "High occupancy", color: "text-red-600" };
      default: return { text: "Unknown", color: "text-gray-600" };
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Bus className="h-6 w-6 text-blue-600" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{route.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{route.description}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{Number(route.tokenCost).toFixed(2)} T</p>
              <p className="text-sm text-gray-500">per ride</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{route.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className={getCrowdStatus().color}>
                {getCrowdStatus().text}
              </span>
            </div>
            {delay > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span>{delay} min delay</span>
              </div>
            )}
          </div>

          <div className="mt-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Book This Route
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}