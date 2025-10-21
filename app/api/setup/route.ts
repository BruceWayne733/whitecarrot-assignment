import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check if this is a production environment
    if (process.env.NODE_ENV === 'production') {
      // In production, you might want to add additional security checks
      // For now, we'll allow it for demo purposes
    }

    // First, try to create the database tables using Prisma's built-in migration
    try {
      // Use Prisma's push command to create tables
      const { exec } = require('child_process')
      const { promisify } = require('util')
      const execAsync = promisify(exec)
      
      console.log('Creating database tables...')
      await execAsync('npx prisma db push --accept-data-loss')
      console.log('Database tables created successfully')
    } catch (tableError) {
      console.log('Tables might already exist or creation failed, continuing...', tableError)
      // Don't fail the entire process if table creation fails
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
