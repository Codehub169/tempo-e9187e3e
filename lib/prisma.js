import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Ensure the prisma instance is re-used during hot-reloading
  // Prevents too many connections during development
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      // log: ['query', 'info', 'warn', 'error'], // Uncomment for debugging
    });
  }
  prisma = global.prisma;
}

export default prisma;
