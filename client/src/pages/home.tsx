import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import CommandInput from "@/components/command-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, Settings, Wallet } from "lucide-react";
import TransitMap from "@/components/transit-map";
import { Bus } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);

  const handleCommand = (command: string) => {
    if (command.toLowerCase().includes("route") ||
      command.toLowerCase().includes("bus")) {
      setLocation("/routes");
    } else {
      toast({
        title: "Command not recognized",
        description: "Try asking about routes or buses",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Map container with lower z-index */}
      <div className="fixed inset-0 z-0">
        <TransitMap />
      </div>

      {/* Header with higher z-index */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-b from-white via-white/90 to-transparent h-24 px-4 py-4">
          <div className="max-w-lg mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-900">Nashville Transit AI</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLocation("/wallet")}
                className="bg-white/90 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50"
                aria-label="Open wallet"
              >
                <Wallet className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsAccessibilityMode(!isAccessibilityMode)}
                aria-label="Toggle accessibility mode"
                className="bg-white/90 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet with higher z-index */}
      <div className="fixed bottom-0 left-0 right-0 z-10 pb-safe">
        <div className="bg-white rounded-t-3xl shadow-2xl">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
          <div className="px-4 pb-6 space-y-6">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className={`p-0 ${isAccessibilityMode ? 'text-lg' : ''}`}>
                <CommandInput
                  onCommand={handleCommand}
                  placeholder="Where are you going?"
                  className={`bg-gray-50 border-transparent ${isAccessibilityMode ? 'text-xl p-6' : ''}`}
                />

                <div className="mt-4 flex justify-center">
                  <Button
                    variant="secondary"
                    size={isAccessibilityMode ? "lg" : "default"}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    <Mic className="h-4 w-4" />
                    Use Voice Command
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className={`font-semibold text-gray-900 ${isAccessibilityMode ? 'text-xl' : 'text-lg'}`}>
                Popular Routes
              </h3>
              <div className="space-y-2">
                {["Downtown Transit Center", "Fisk University", "Vanderbilt Medical Center"].map((dest) => (
                  <Button
                    key={dest}
                    variant="outline"
                    className="w-full justify-start gap-3 py-6 border-gray-200 bg-white hover:bg-gray-50"
                    onClick={() => setLocation("/routes")}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bus className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{dest}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}