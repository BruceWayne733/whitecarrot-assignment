import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { applicationSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = applicationSchema.parse(body)
    
    const { jobId, ...applicationData } = body
    
    const application = await prisma.application.create({
      data: {
        ...applicationData,
        jobId
      },
      include: {
        job: true
      }
    })
    
    return NextResponse.json(application)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}
