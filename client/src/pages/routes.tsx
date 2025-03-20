import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import TransitMap from "@/components/transit-map";
import RouteCard from "@/components/route-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Route } from "@shared/schema";

export default function Routes() {
  const [, setLocation] = useLocation();

  const { data: routes, isLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });

  return (
    <div className="min-h-screen relative">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <TransitMap />
      </div>

      {/* Fixed header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-white/90 to-white/0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation("/")}
            aria-label="Go back"
            className="bg-white text-blue-900 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-blue-900">Available Routes</h1>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-white rounded-t-3xl shadow-lg">
          <div className="p-4 border-b border-gray-100">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Choose a Route</h2>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full bg-blue-50" />
              ))
            ) : routes?.map(route => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}