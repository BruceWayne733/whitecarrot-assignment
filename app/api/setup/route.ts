import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting database setup...')
    
    // Create tables manually (skip Prisma push due to npm issues)
    try {
      console.log('Creating tables manually...')
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS companies (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          logo_url TEXT,
          banner_url TEXT,
          primary_color TEXT DEFAULT '#3b82f6',
          secondary_color TEXT DEFAULT '#1e40af',
          sections TEXT DEFAULT '[]',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS jobs (
          id TEXT PRIMARY KEY,
          company_id TEXT NOT NULL,
          title TEXT NOT NULL,
          location TEXT NOT NULL,
          department TEXT,
          work_type TEXT NOT NULL,
          level TEXT,
          salary_min INTEGER,
          salary_max INTEGER,
          currency TEXT DEFAULT 'USD',
          description TEXT NOT NULL,
          requirements TEXT DEFAULT '[]',
          tags TEXT DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS applications (
          id TEXT PRIMARY KEY,
          job_id TEXT NOT NULL,
          candidate_name TEXT NOT NULL,
          email TEXT NOT NULL,
          resume_url TEXT,
          cover_letter TEXT,
          status TEXT DEFAULT 'new',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `
      console.log('Tables created successfully')
    } catch (error) {
      console.error('Table creation error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create tables: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      )
    }
    
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
    
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL environment variable is not set'
      }, { status: 500 })
    }
    
    // Check URL format
    const url = process.env.DATABASE_URL
    console.log('DATABASE_URL format check:', url.substring(0, 20) + '...')
    console.log('URL starts with postgresql:', url.startsWith('postgresql://'))
    console.log('URL starts with postgres:', url.startsWith('postgres://'))
    
    // Try to connect with a timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 10000)
    )
    
    const connectionPromise = prisma.$queryRaw`SELECT 1`
    
    await Promise.race([connectionPromise, timeoutPromise])
    console.log('Database connection successful')
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      message: 'Database connection successful',
      urlFormat: url.substring(0, 20) + '...'
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed. This might be a network issue or the database is not ready yet.',
        details: error instanceof Error ? error.message : 'Unknown error',
        urlFormat: process.env.DATABASE_URL?.substring(0, 20) + '...',
        urlStartsWithPostgresql: process.env.DATABASE_URL?.startsWith('postgresql://'),
        urlStartsWithPostgres: process.env.DATABASE_URL?.startsWith('postgres://'),
        suggestion: 'Try waiting a few minutes for the database to fully initialize, or check your Supabase dashboard for any issues.'
      },
      { status: 500 }
    )
  }
}
