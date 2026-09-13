import { PrismaClient } from '@prisma/client';

// Declare global variable for hot-reloading environments to prevent multiple instances
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prismaLogLevels = process.env.NODE_ENV === 'development'
  ? (['error', 'warn'] as const)
  : (['error'] as const);

export const prisma: PrismaClient =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: [...prismaLogLevels],
    errorFormat: 'minimal'
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

/**
 * Verify database connectivity with retry support
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Graceful disconnection hook
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
