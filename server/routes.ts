import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/stops", async (_req, res) => {
    const stops = await storage.getStops();
    res.json(stops);
  });

  app.get("/api/routes", async (_req, res) => {
    const routes = await storage.getRoutes();
    res.json(routes);
  });

  app.get("/api/stops/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }
    const stops = await storage.searchStops(query);
    res.json(stops);
  });

  app.get("/api/routes/by-stop/:stopId", async (req, res) => {
    const stopId = parseInt(req.params.stopId);
    if (isNaN(stopId)) {
      return res.status(400).json({ message: "Invalid stop ID" });
    }
    const routes = await storage.getRoutesByStop(stopId);
    res.json(routes);
  });

  app.get("/api/routes/between", async (req, res) => {
    const startId = parseInt(req.query.start as string);
    const endId = parseInt(req.query.end as string);
    
    if (isNaN(startId) || isNaN(endId)) {
      return res.status(400).json({ message: "Invalid stop IDs" });
    }

    const routes = await storage.findRoutesBetweenStops(startId, endId);
    res.json(routes);
  });

  const httpServer = createServer(app);
  return httpServer;
}
