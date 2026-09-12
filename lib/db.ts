import { PrismaClient } from "@prisma/client";

// Reuse one client across hot reloads (dev) and warm serverless invocations
// so we don't exhaust Neon's connection limit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
