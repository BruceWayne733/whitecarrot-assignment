import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting database setup...')
    
    // Drop and recreate tables with correct structure
    try {
      console.log('Dropping and recreating tables...')
      
      // Drop tables if they exist (in correct order due to foreign keys)
      await prisma.$executeRaw`DROP TABLE IF EXISTS applications CASCADE`
      await prisma.$executeRaw`DROP TABLE IF EXISTS jobs CASCADE`
      await prisma.$executeRaw`DROP TABLE IF EXISTS companies CASCADE`
      
      // Create companies table
      await prisma.$executeRaw`
        CREATE TABLE companies (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          "logoUrl" TEXT,
          "bannerUrl" TEXT,
          "primaryColor" TEXT DEFAULT '#3b82f6',
          "secondaryColor" TEXT DEFAULT '#1e40af',
          sections TEXT DEFAULT '[]',
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `
      
      // Create jobs table
      await prisma.$executeRaw`
        CREATE TABLE jobs (
          id TEXT PRIMARY KEY,
          "companyId" TEXT NOT NULL,
          title TEXT NOT NULL,
          location TEXT NOT NULL,
          department TEXT,
          "workType" TEXT NOT NULL,
          level TEXT,
          "salaryMin" INTEGER,
          "salaryMax" INTEGER,
          currency TEXT DEFAULT 'USD',
          description TEXT NOT NULL,
          requirements TEXT DEFAULT '[]',
          tags TEXT DEFAULT '[]',
          "isActive" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `
      
      // Create applications table
      await prisma.$executeRaw`
        CREATE TABLE applications (
          id TEXT PRIMARY KEY,
          "jobId" TEXT NOT NULL,
          "candidateName" TEXT NOT NULL,
          email TEXT NOT NULL,
          "resumeUrl" TEXT,
          "coverLetter" TEXT,
          status TEXT DEFAULT 'new',
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
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

    // Seed the database directly
    try {
      console.log('Seeding database...')
      
      // Create sample company
      const company = await prisma.company.create({
        data: {
          slug: 'acme',
          name: 'ACME Corporation',
          description: 'Leading technology company focused on innovation and growth',
          logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop&crop=center&auto=format&q=80',
          primaryColor: '#3b82f6',
          secondaryColor: '#1e40af',
          sections: JSON.stringify([
            {
              type: 'about',
              title: 'About ACME',
              content: 'We are a forward-thinking technology company dedicated to creating innovative solutions that make a difference in the world.',
              order: 1,
              isActive: true
            },
            {
              type: 'benefits',
              title: 'Why Work With Us',
              content: '• Competitive salary and equity\n• Comprehensive health insurance\n• Flexible work arrangements\n• Professional development opportunities',
              order: 2,
              isActive: true
            }
          ])
        }
      })
      
      // Create sample jobs
      const jobs = [
        {
          companyId: company.id,
          title: 'Senior Software Engineer',
          location: 'Remote',
          department: 'Engineering',
          workType: 'remote',
          level: 'senior',
          salaryMin: 120000,
          salaryMax: 180000,
          currency: 'USD',
          description: 'We are looking for a Senior Software Engineer to join our core platform team.',
          requirements: JSON.stringify([
            '5+ years of software development experience',
            'Strong proficiency in React, Node.js, and TypeScript',
            'Experience with cloud platforms (AWS, GCP, or Azure)'
          ]),
          tags: JSON.stringify(['React', 'Node.js', 'TypeScript', 'AWS']),
          isActive: true
        },
        {
          companyId: company.id,
          title: 'Product Manager',
          location: 'San Francisco, CA',
          department: 'Product',
          workType: 'on-site',
          level: 'mid',
          salaryMin: 100000,
          salaryMax: 150000,
          currency: 'USD',
          description: 'Join our product team to help shape the future of our platform.',
          requirements: JSON.stringify([
            '3+ years of product management experience',
            'Strong analytical and communication skills',
            'Experience with agile development processes'
          ]),
          tags: JSON.stringify(['Product Management', 'Analytics', 'Agile']),
          isActive: true
        }
      ]
      
      for (const jobData of jobs) {
        await prisma.job.create({ data: jobData })
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database seeded successfully',
        company: company.name,
        jobs: jobs.length
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
