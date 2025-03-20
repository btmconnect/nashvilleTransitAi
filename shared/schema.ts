import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
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
});

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
});

export type Stop = typeof stops.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type InsertStop = z.infer<typeof insertStopSchema>;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
