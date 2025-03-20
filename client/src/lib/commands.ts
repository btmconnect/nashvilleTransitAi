import { apiRequest } from "./queryClient";
import type { Stop, Route } from "@shared/schema";

export async function processCommand(command: string): Promise<{
  stops?: Stop[];
  routes?: Route[];
  error?: string;
}> {
  const normalizedCommand = command.toLowerCase().trim();

  try {
    if (normalizedCommand.includes("to")) {
      const destination = normalizedCommand.split("to")[1].trim();
      const res = await apiRequest("GET", `/api/stops/search?q=${encodeURIComponent(destination)}`);
      const stops = await res.json();
      
      if (stops.length === 0) {
        return { error: "No stops found matching your destination" };
      }

      const routesRes = await apiRequest("GET", `/api/routes/by-stop/${stops[0].id}`);
      const routes = await routesRes.json();
      
      return { stops, routes };
    }

    return { error: "I don't understand that command" };
  } catch (error) {
    return { error: "Failed to process command" };
  }
}
