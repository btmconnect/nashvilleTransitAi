import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, AlertCircle } from "lucide-react";
import type { Route } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  // Mock data for demonstration
  const crowdLevel = Math.floor(Math.random() * 3); // 0: Low, 1: Medium, 2: High
  const delay = Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0; // Random delay in minutes
  const fare = 2 + (Math.random() * 3).toFixed(2); // Random fare between $2-$5

  const getCrowdStatus = () => {
    switch(crowdLevel) {
      case 0: return { text: "Low occupancy", color: "text-green-600" };
      case 1: return { text: "Moderate occupancy", color: "text-yellow-600" };
      case 2: return { text: "High occupancy", color: "text-red-600" };
      default: return { text: "Unknown", color: "text-gray-600" };
    }
  };

  return (
    <Card className="border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <h3 className="font-semibold text-blue-900">{route.name}</h3>
        </div>
        <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
          Book Ride
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-800">{route.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Duration: {route.duration} minutes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className={`text-sm ${getCrowdStatus().color}`}>
                {getCrowdStatus().text}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-blue-700">
              Next departure: {formatDistanceToNow(new Date(route.nextDeparture))}
            </div>
            {delay > 0 && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <AlertCircle className="h-4 w-4" />
                {delay} min delay
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-blue-900 font-medium">
            Fare: ${fare}
          </span>
          <span className="text-blue-600">
            {Math.floor(Math.random() * 20) + 10} seats available
          </span>
        </div>
      </CardContent>
    </Card>
  );
}