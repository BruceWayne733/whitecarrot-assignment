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
    
    // Check column structure of jobs table
    let jobColumns: any[] = []
    try {
      jobColumns = await prisma.$queryRaw`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'jobs' AND table_schema = 'public'
      ` as any[]
    } catch (error) {
      console.log('Could not get job columns:', error)
    }
    
    // Try to count records in each table
    let companyCount = 0
    let jobCount = 0
    let applicationCount = 0
    
    try {
      companyCount = await prisma.company.count()
    } catch (error) {
      console.log('Company table error:', error)
    }
    
    try {
      jobCount = await prisma.job.count()
    } catch (error) {
      console.log('Job table error:', error)
    }
    
    try {
      applicationCount = await prisma.application.count()
    } catch (error) {
      console.log('Application table error:', error)
    }
    
    return NextResponse.json({
      success: true,
      tables: tables,
      jobColumns: jobColumns,
      companyCount,
      jobCount,
      applicationCount,
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
