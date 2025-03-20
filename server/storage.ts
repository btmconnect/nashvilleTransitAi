import { stops, routes, wallets, transactions, type Stop, type Route, type Wallet, type Transaction, type InsertStop, type InsertRoute, type InsertWallet, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  getStops(): Promise<Stop[]>;
  getRoutes(): Promise<Route[]>;
  getRoutesByStop(stopId: number): Promise<Route[]>;
  findRoutesBetweenStops(startStopId: number, endStopId: number): Promise<Route[]>;
  searchStops(query: string): Promise<Stop[]>;

  getWallet(userId: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(walletId: number, amount: number): Promise<Wallet>;
  getTransactions(walletId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class MemStorage implements IStorage {
  private stops: Map<number, Stop>;
  private routes: Map<number, Route>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private currentStopId: number;
  private currentRouteId: number;
  private currentWalletId: number;
  private currentTransactionId: number;

  constructor() {
    this.stops = new Map();
    this.routes = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.currentStopId = 1;
    this.currentRouteId = 1;
    this.currentWalletId = 1;
    this.currentTransactionId = 1;
    this.initializeMockData();
  }

  private initializeMockData() {
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

    const mockRoutes = [
      {
        name: "Route 1",
        description: "Downtown to Fisk University Express",
        startStopId: stops[0].id,
        endStopId: stops[1].id,
        duration: 20,
        nextDeparture: new Date(Date.now() + 15 * 60000),
        tokenCost: 2.50,
      },
      {
        name: "Route 2",
        description: "Medical Center Shuttle",
        startStopId: stops[0].id,
        endStopId: stops[2].id,
        duration: 15,
        nextDeparture: new Date(Date.now() + 5 * 60000),
        tokenCost: 2.00,
      },
      {
        name: "Route 3",
        description: "Belmont University Connection",
        startStopId: stops[0].id,
        endStopId: stops[4].id,
        duration: 25,
        nextDeparture: new Date(Date.now() + 10 * 60000),
        tokenCost: 3.00,
      },
      {
        name: "Route 4",
        description: "Music Row - Gulch Connector",
        startStopId: stops[5].id,
        endStopId: stops[6].id,
        duration: 12,
        nextDeparture: new Date(Date.now() + 8 * 60000),
        tokenCost: 1.50,
      },
      {
        name: "Route 5",
        description: "12 South - Belmont Express",
        startStopId: stops[7].id,
        endStopId: stops[4].id,
        duration: 10,
        nextDeparture: new Date(Date.now() + 12 * 60000),
        tokenCost: 1.00,
      },
      {
        name: "Route 6",
        description: "Farmers Market - Jefferson Loop",
        startStopId: stops[8].id,
        endStopId: stops[9].id,
        duration: 18,
        nextDeparture: new Date(Date.now() + 20 * 60000),
        tokenCost: 2.00,
      }
    ];

    mockRoutes.forEach(route => {
      const id = this.currentRouteId++;
      this.routes.set(id, { ...route, id });
    });

    const mockWallet: InsertWallet = {
      userId: "demo-user",
      balance: 50.00,
    };

    const wallet: Wallet = {
      id: this.currentWalletId++,
      ...mockWallet,
      lastUpdated: new Date(),
    };
    this.wallets.set(wallet.id, wallet);

    const mockTransactions: InsertTransaction[] = [
      {
        walletId: wallet.id,
        amount: 50.00,
        type: "EARN",
        description: "Welcome bonus",
      },
      {
        walletId: wallet.id,
        amount: -2.50,
        type: "SPEND",
        description: "Bus fare to Fisk University",
      },
    ];

    mockTransactions.forEach(transaction => {
      const id = this.currentTransactionId++;
      this.transactions.set(id, {
        ...transaction,
        id,
        createdAt: new Date(),
      });
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

  async getWallet(userId: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(wallet => wallet.userId === userId);
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const id = this.currentWalletId++;
    const newWallet: Wallet = {
      ...wallet,
      id,
      lastUpdated: new Date(),
    };
    this.wallets.set(id, newWallet);
    return newWallet;
  }

  async updateWalletBalance(walletId: number, amount: number): Promise<Wallet> {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const updatedWallet: Wallet = {
      ...wallet,
      balance: wallet.balance + amount,
      lastUpdated: new Date(),
    };
    this.wallets.set(walletId, updatedWallet);
    return updatedWallet;
  }

  async getTransactions(walletId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.walletId === walletId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }
}

export const storage = new MemStorage();