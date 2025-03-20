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
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            aria-label="Go back"
            className="text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Available Routes</h1>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <TransitMap />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full bg-slate-800" />
            ))
          ) : routes?.map(route => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </div>
  );
}