import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Debug DATABASE_URL
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('DATABASE_URL format:', process.env.DATABASE_URL?.substring(0, 20) + '...')

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
