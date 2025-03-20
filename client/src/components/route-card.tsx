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
  const fare = Number(route.tokenCost).toFixed(2); // Use actual token cost

  const getCrowdStatus = () => {
    switch(crowdLevel) {
      case 0: return { text: "Low occupancy", color: "text-green-600" };
      case 1: return { text: "Moderate occupancy", color: "text-yellow-600" };
      case 2: return { text: "High occupancy", color: "text-red-600" };
      default: return { text: "Unknown", color: "text-gray-600" };
    }
  };

  return (
    <Card className="border-none shadow-sm hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Bus className="h-5 w-5 text-blue-600" />
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{route.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{route.description}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{fare} T</p>
                <p className="text-sm text-gray-500">per ride</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{route.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span className={getCrowdStatus().color}>
                    {getCrowdStatus().text}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-right">
                <div className="text-sm text-gray-600">
                  Next: {formatDistanceToNow(new Date(route.nextDeparture))}
                </div>
                {delay > 0 && (
                  <div className="flex items-center justify-end gap-1 text-sm text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    {delay} min delay
                  </div>
                )}
              </div>
            </div>

            <Button 
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Book This Route
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}