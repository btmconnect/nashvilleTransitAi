import { stops, routes, type Stop, type Route, type InsertStop, type InsertRoute } from "@shared/schema";

export interface IStorage {
  getStops(): Promise<Stop[]>;
  getRoutes(): Promise<Route[]>;
  getRoutesByStop(stopId: number): Promise<Route[]>;
  findRoutesBetweenStops(startStopId: number, endStopId: number): Promise<Route[]>;
  searchStops(query: string): Promise<Stop[]>;
}

export class MemStorage implements IStorage {
  private stops: Map<number, Stop>;
  private routes: Map<number, Route>;
  private currentStopId: number;
  private currentRouteId: number;

  constructor() {
    this.stops = new Map();
    this.routes = new Map();
    this.currentStopId = 1;
    this.currentRouteId = 1;
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add mock stops
    const mockStops: InsertStop[] = [
      { name: "Downtown Transit Center", latitude: 36.166340, longitude: -86.781620 },
      { name: "TSU Campus", latitude: 36.176590, longitude: -86.828560 },
      { name: "Vanderbilt Medical Center", latitude: 36.144570, longitude: -86.802864 },
      { name: "East Nashville", latitude: 36.177770, longitude: -86.751390 },
    ];

    const stops = mockStops.map(stop => {
      const id = this.currentStopId++;
      const newStop = { ...stop, id };
      this.stops.set(id, newStop);
      return newStop;
    });

    // Add mock routes
    const mockRoutes: InsertRoute[] = [
      {
        name: "Route 1",
        description: "Downtown to TSU Express",
        startStopId: stops[0].id,
        endStopId: stops[1].id,
        duration: 20,
        nextDeparture: new Date(Date.now() + 15 * 60000),
      },
      {
        name: "Route 2",
        description: "Medical Center Shuttle",
        startStopId: stops[0].id,
        endStopId: stops[2].id,
        duration: 15,
        nextDeparture: new Date(Date.now() + 5 * 60000),
      },
    ];

    mockRoutes.forEach(route => {
      const id = this.currentRouteId++;
      this.routes.set(id, { ...route, id });
    });
  }

  async getStops(): Promise<Stop[]> {
    return Array.from(this.stops.values());
  }

  async getRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async getRoutesByStop(stopId: number): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(
      route => route.startStopId === stopId || route.endStopId === stopId
    );
  }

  async findRoutesBetweenStops(startStopId: number, endStopId: number): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(
      route => route.startStopId === startStopId && route.endStopId === endStopId
    );
  }

  async searchStops(query: string): Promise<Stop[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.stops.values()).filter(
      stop => stop.name.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const storage = new MemStorage();
