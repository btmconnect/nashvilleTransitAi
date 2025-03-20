import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWalletSchema, insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Existing routes
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

  // New wallet and transaction routes
  app.get("/api/wallet/:userId", async (req, res) => {
    const userId = req.params.userId;
    const wallet = await storage.getWallet(userId);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.json(wallet);
  });

  app.post("/api/wallet", async (req, res) => {
    const result = insertWalletSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid wallet data" });
    }
    const wallet = await storage.createWallet(result.data);
    res.json(wallet);
  });

  app.post("/api/wallet/:walletId/transaction", async (req, res) => {
    const walletId = parseInt(req.params.walletId);
    if (isNaN(walletId)) {
      return res.status(400).json({ message: "Invalid wallet ID" });
    }

    const result = insertTransactionSchema.safeParse({
      ...req.body,
      walletId,
    });

    if (!result.success) {
      return res.status(400).json({ message: "Invalid transaction data" });
    }

    try {
      const transaction = await storage.createTransaction(result.data);
      await storage.updateWalletBalance(walletId, result.data.amount);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Failed to process transaction" });
    }
  });

  app.get("/api/wallet/:walletId/transactions", async (req, res) => {
    const walletId = parseInt(req.params.walletId);
    if (isNaN(walletId)) {
      return res.status(400).json({ message: "Invalid wallet ID" });
    }
    const transactions = await storage.getTransactions(walletId);
    res.json(transactions);
  });

  const httpServer = createServer(app);
  return httpServer;
}