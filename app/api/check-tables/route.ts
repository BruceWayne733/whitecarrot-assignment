import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    // Try to count records in each table
    let companyCount = 0
    let jobCount = 0
    
    try {
      companyCount = await prisma.company.count()
    } catch (error) {
      console.log('Company table does not exist or has issues')
    }
    
    try {
      jobCount = await prisma.job.count()
    } catch (error) {
      console.log('Job table does not exist or has issues')
    }
    
    return NextResponse.json({
      success: true,
      tables: tables,
      companyCount,
      jobCount,
      message: 'Database tables checked'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to check tables'
    })
  }
}
