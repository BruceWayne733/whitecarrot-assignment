import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check if this is a production environment
    if (process.env.NODE_ENV === 'production') {
      // In production, you might want to add additional security checks
      // For now, we'll allow it for demo purposes
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
    return NextResponse.json(
      { success: false, error: 'Database connection failed' },
      { status: 500 }
    )
  }
}
