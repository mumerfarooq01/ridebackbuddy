import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrisma() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
