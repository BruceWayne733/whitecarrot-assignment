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
    console.log('Testing database connection...')
    console.log('DATABASE_URL format check:', process.env.DATABASE_URL?.substring(0, 20) + '...')
    
    // Test basic database connection
    await prisma.$queryRaw`SELECT 1`
    console.log('Database connection successful')
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      message: 'Database connection successful'
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed. Please check your DATABASE_URL environment variable.',
        details: error instanceof Error ? error.message : 'Unknown error',
        urlFormat: process.env.DATABASE_URL?.substring(0, 20) + '...'
      },
      { status: 500 }
    )
  }
}
