import { useQuery } from "@tanstack/react-query";
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
    <div className="min-h-screen bg-gray-100 relative">
      {/* Map container with lower z-index */}
      <div className="fixed inset-0 z-0">
        <TransitMap />
      </div>

      {/* Header with higher z-index */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-b from-white via-white/90 to-transparent h-24 px-4 py-4">
          <div className="max-w-xl mx-auto flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation("/")}
              aria-label="Go back"
              className="bg-white/90 backdrop-blur-sm border-blue-200 text-blue-900 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-blue-900">Available Routes</h1>
              <p className="text-sm text-gray-600">Minor delay due to traffic congestion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet with higher z-index */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="bg-white rounded-t-3xl shadow-2xl">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="px-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Choose a Route</h2>
              <div className="divide-y divide-gray-100">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full bg-gray-50" />
                  ))
                ) : routes?.map(route => (
                  <RouteCard key={route.id} route={route} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}