import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import CommandInput from "@/components/command-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, Settings } from "lucide-react";

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
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Nashville Transit AI</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsAccessibilityMode(!isAccessibilityMode)}
            aria-label="Toggle accessibility mode"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className={`p-6 ${isAccessibilityMode ? 'text-lg' : ''}`}>
            <CommandInput
              onCommand={handleCommand}
              placeholder="Ask about transit routes..."
              className={`bg-slate-900 border-slate-700 text-white ${isAccessibilityMode ? 'text-xl p-6' : ''}`}
            />

            <div className="mt-4 flex justify-center">
              <Button
                variant="secondary"
                size={isAccessibilityMode ? "lg" : "default"}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mic className="h-4 w-4" />
                Speak Command
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className={`font-semibold text-white ${isAccessibilityMode ? 'text-xl' : 'text-lg'}`}>
                Try asking:
              </h3>
              <ul className={`mt-2 space-y-2 text-slate-300 ${isAccessibilityMode ? 'text-lg' : ''}`}>
                <li>"Find bus to downtown"</li>
                <li>"Next bus to Fisk University"</li>
                <li>"Schedule ride to medical center"</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className={`font-semibold text-white ${isAccessibilityMode ? 'text-xl' : 'text-lg'}`}>
                Popular Destinations
              </h3>
              <ul className={`mt-2 space-y-2 text-slate-300 ${isAccessibilityMode ? 'text-lg' : ''}`}>
                <li>Downtown Transit Center</li>
                <li>Fisk University</li>
                <li>Vanderbilt Medical Center</li>
                <li>Belmont University</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}