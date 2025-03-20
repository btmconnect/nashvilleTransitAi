import { pgTable, text, serial, integer, timestamp, real, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stops = pgTable("stops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
});

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startStopId: integer("start_stop_id").references(() => stops.id).notNull(),
  endStopId: integer("end_stop_id").references(() => stops.id).notNull(),
  duration: integer("duration").notNull(), // in minutes
  nextDeparture: timestamp("next_departure").notNull(),
  tokenCost: decimal("token_cost", { precision: 10, scale: 2 }).notNull().default("2.00"),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'EARN', 'SPEND', 'RECEIVE'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Export existing schemas
export const insertStopSchema = createInsertSchema(stops).pick({
  name: true,
  latitude: true,
  longitude: true,
});

export const insertRouteSchema = createInsertSchema(routes).pick({
  name: true,
  description: true,
  startStopId: true,
  endStopId: true,
  duration: true,
  nextDeparture: true,
  tokenCost: true,
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
  balance: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  walletId: true,
  amount: true,
  type: true,
  description: true,
});

// Export types
export type Stop = typeof stops.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type InsertStop = z.infer<typeof insertStopSchema>;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;