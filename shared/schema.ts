import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === SQL Store: Orders ===
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: text("customer_id").notNull(),
  sku: text("sku").notNull(),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull(), // PENDING, CONFIRMED, CANCELLED
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// === NoSQL Store Models (Types only, stored in NeDB) ===
export interface InventoryDoc {
  _id: string; // SKU
  available: number;
  reserved: number;
}

export interface SagaLogEntry {
  _id: string; // txId
  state: 'STARTED' | 'COMMITTED' | 'COMPENSATING' | 'COMPENSATED' | 'FAILED';
  context: {
    orderId?: number;
    sku?: string;
    quantity?: number;
    customerId?: string;
    error?: string;
  };
  updatedAt: Date;
}

// === API Schemas ===
export const createOrderRequestSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  simulateFailure: z.boolean().optional().default(false), // For testing recovery
});

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;

// === Response Types ===
export interface TransactionResponse {
  transactionId: string;
  status: string;
  orderId?: number;
  message: string;
}

export interface SystemStateResponse {
  orders: Order[];
  inventory: InventoryDoc[];
  sagaLogs: SagaLogEntry[];
}
