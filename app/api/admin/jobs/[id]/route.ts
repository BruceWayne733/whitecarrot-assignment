import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { jobSchema } from '@/lib/validations'
import { z } from 'zod'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const partialJobSchema = z.object({
      title: z.string().min(1, 'Job title is required').optional(),
      location: z.string().min(1, 'Location is required').optional(),
      department: z.string().optional(),
      workType: z.enum(['on-site', 'remote', 'hybrid']).optional(),
      level: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
      salaryMin: z.number().int().min(0).optional(),
      salaryMax: z.number().int().min(0).optional(),
      currency: z.string().optional(),
      description: z.string().min(1, 'Job description is required').optional(),
      requirements: z.string().optional(),
      tags: z.string().optional(),
      isActive: z.boolean().optional()
    })
    
    const validatedData = partialJobSchema.parse(body)
    
    const job = await prisma.job.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        company: true
      }
    })
    
    return NextResponse.json(job)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.message }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Failed to update job', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.job.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}
