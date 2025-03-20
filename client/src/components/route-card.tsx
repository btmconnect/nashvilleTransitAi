import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import type { Route } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  return (
    <Card className="border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <h3 className="font-semibold text-blue-900">{route.name}</h3>
        </div>
        <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
          View Details
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-800">{route.description}</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              {route.duration} minutes
            </span>
          </div>
          <div className="text-sm text-blue-700">
            Next departure: {formatDistanceToNow(new Date(route.nextDeparture))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}