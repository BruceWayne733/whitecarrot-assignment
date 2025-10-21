import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting database setup...')
    
    // Check if database is already seeded
    try {
      const existingCompany = await prisma.company.findFirst()
      if (existingCompany) {
        return NextResponse.json({ 
          success: true, 
          message: 'Database already seeded' 
        })
      }
    } catch (error) {
      console.log('Tables might not exist yet, will create them during seeding')
    }

    // Run the seed script
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execAsync = promisify(exec)

    try {
      console.log('Running seed script...')
      await execAsync('npx tsx lib/seed.ts')
      return NextResponse.json({ 
        success: true, 
        message: 'Database seeded successfully' 
      })
    } catch (error) {
      console.error('Seed error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to seed database: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Setup failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // First, try a simple connection test
    await prisma.$queryRaw`SELECT 1`
    
    // Try to get table counts, but don't fail if tables don't exist yet
    let companyCount = 0
    let jobCount = 0
    
    try {
      companyCount = await prisma.company.count()
      jobCount = await prisma.job.count()
    } catch (tableError) {
      // Tables don't exist yet, that's okay
      console.log('Tables not created yet, will create them during seeding')
    }
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      companies: companyCount,
      jobs: jobCount,
      message: companyCount === 0 ? 'Database connected but not seeded yet' : 'Database connected and ready'
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
