import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check if this is a production environment
    if (process.env.NODE_ENV === 'production') {
      // In production, you might want to add additional security checks
      // For now, we'll allow it for demo purposes
    }

    // First, try to create the database tables
    try {
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Company" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "logoUrl" TEXT,
        "bannerUrl" TEXT,
        "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
        "secondaryColor" TEXT NOT NULL DEFAULT '#1e40af',
        "sections" TEXT NOT NULL DEFAULT '[]',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
      
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Job" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "companyId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "department" TEXT,
        "workType" TEXT NOT NULL,
        "level" TEXT,
        "salaryMin" INTEGER,
        "salaryMax" INTEGER,
        "currency" TEXT NOT NULL DEFAULT 'USD',
        "description" TEXT NOT NULL,
        "requirements" TEXT NOT NULL DEFAULT '[]',
        "tags" TEXT NOT NULL DEFAULT '[]',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE
      )`
      
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Application" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "jobId" TEXT NOT NULL,
        "candidateName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "resumeUrl" TEXT,
        "coverLetter" TEXT,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE
      )`
    } catch (tableError) {
      console.log('Tables might already exist, continuing...')
    }

    // Check if database is already seeded
    const existingCompany = await prisma.company.findFirst()
    if (existingCompany) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database already seeded' 
      })
    }

    // Run the seed script
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execAsync = promisify(exec)

    try {
      await execAsync('npx tsx lib/seed.ts')
      return NextResponse.json({ 
        success: true, 
        message: 'Database seeded successfully' 
      })
    } catch (error) {
      console.error('Seed error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to seed database' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Setup failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    const companyCount = await prisma.company.count()
    const jobCount = await prisma.job.count()
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      companies: companyCount,
      jobs: jobCount
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed. Please check your DATABASE_URL environment variable.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
