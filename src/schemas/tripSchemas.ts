import { z } from "zod";

export const createTripSchema = z.object({
  routeId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  departureDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:mm
  minQuota: z.number().int().positive(),
  estimatedCost: z.number().positive(),
});