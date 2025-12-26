import { z } from 'zod';
import { createOrderRequestSchema, orders } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  transactions: {
    create: {
      method: 'POST' as const,
      path: '/api/transactions',
      input: createOrderRequestSchema,
      responses: {
        200: z.object({
          transactionId: z.string(),
          status: z.string(),
          orderId: z.number().optional(),
          message: z.string(),
        }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  system: {
    state: {
      method: 'GET' as const,
      path: '/api/system/state',
      responses: {
        200: z.object({
          orders: z.array(z.any()), // Typed in frontend via generic
          inventory: z.array(z.any()),
          sagaLogs: z.array(z.any()),
        }),
      },
    },
    seed: {
      method: 'POST' as const,
      path: '/api/system/seed',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
