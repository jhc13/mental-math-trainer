import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { SUPABASE_ROOT_CA } from 'prisma/supabaseRootCa';

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: { ca: SUPABASE_ROOT_CA },
    connectionTimeoutMillis: 5000
  });
  return new PrismaClient({ adapter });
}

const prisma = global.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
