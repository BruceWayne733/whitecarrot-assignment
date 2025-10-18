import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { jobSchema } from '@/lib/validations'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        company: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = jobSchema.parse(body)
    
    // Get the first company (assuming single company for MVP)
    const company = await prisma.company.findFirst()
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }
    
    // Data is already in correct format (JSON strings)
    const processedData = validatedData
    
    const job = await prisma.job.create({
      data: {
        ...processedData,
        companyId: company.id
      },
      include: {
        company: true
      }
    })
    
    return NextResponse.json(job)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
