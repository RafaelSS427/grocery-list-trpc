import { inferAsyncReturnType } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const createContext = async(opts?: CreateNextContextOptions ) => {
    const prisma = globalForPrisma.prisma ?? new PrismaClient()
    if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

    return { prisma }
}

export type Context = inferAsyncReturnType<typeof createContext>