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
    // Add mock stops with real Nashville coordinates
    const mockStops: InsertStop[] = [
      { name: "Downtown Transit Center", latitude: 36.166340, longitude: -86.781620 },
      { name: "Fisk University", latitude: 36.168470, longitude: -86.808360 },
      { name: "Vanderbilt Medical Center", latitude: 36.144570, longitude: -86.802864 },
      { name: "East Nashville", latitude: 36.177770, longitude: -86.751390 },
      { name: "Belmont University", latitude: 36.132580, longitude: -86.795690 },
      { name: "Music Row", latitude: 36.151430, longitude: -86.792110 },
      { name: "The Gulch", latitude: 36.151890, longitude: -86.784480 },
      { name: "12 South", latitude: 36.127670, longitude: -86.789480 },
      { name: "Nashville Farmers' Market", latitude: 36.171890, longitude: -86.784920 },
      { name: "Jefferson Street", latitude: 36.173870, longitude: -86.800710 }
    ];

    const stops = mockStops.map(stop => {
      const id = this.currentStopId++;
      const newStop = { ...stop, id };
      this.stops.set(id, newStop);
      return newStop;
    });

    // Add mock routes with realistic timings and connections
    const mockRoutes: InsertRoute[] = [
      {
        name: "Route 1",
        description: "Downtown to Fisk University Express",
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
      {
        name: "Route 3",
        description: "Belmont University Connection",
        startStopId: stops[0].id,
        endStopId: stops[4].id,
        duration: 25,
        nextDeparture: new Date(Date.now() + 10 * 60000),
      },
      {
        name: "Route 4",
        description: "Music Row - Gulch Connector",
        startStopId: stops[5].id,
        endStopId: stops[6].id,
        duration: 12,
        nextDeparture: new Date(Date.now() + 8 * 60000),
      },
      {
        name: "Route 5",
        description: "12 South - Belmont Express",
        startStopId: stops[7].id,
        endStopId: stops[4].id,
        duration: 10,
        nextDeparture: new Date(Date.now() + 12 * 60000),
      },
      {
        name: "Route 6",
        description: "Farmers Market - Jefferson Loop",
        startStopId: stops[8].id,
        endStopId: stops[9].id,
        duration: 18,
        nextDeparture: new Date(Date.now() + 20 * 60000),
      }
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