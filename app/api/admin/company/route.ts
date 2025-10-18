import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { companySchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET() {
  try {
    const company = await prisma.company.findFirst()
    return NextResponse.json(company)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = companySchema.parse(body)
    
    // Convert sections to JSON string if it's an array
    const processedData = {
      ...validatedData,
      sections: typeof validatedData.sections === 'string' 
        ? validatedData.sections 
        : JSON.stringify(validatedData.sections || [])
    }
    
    const company = await prisma.company.create({
      data: processedData
    })
    
    return NextResponse.json(company)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const partialCompanySchema = z.object({
      name: z.string().min(1, 'Company name is required').optional(),
      slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
      description: z.string().optional(),
      logoUrl: z.string().url().optional().or(z.literal('')),
      bannerUrl: z.string().url().optional().or(z.literal('')),
      primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color').optional(),
      secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Secondary color must be a valid hex color').optional(),
      sections: z.string().optional()
    })
    
    const validatedData = partialCompanySchema.parse(body)
    
    const company = await prisma.company.findFirst()
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }
    
    // Convert sections to JSON string if it's an array
    const processedData = {
      ...validatedData,
      sections: validatedData.sections 
        ? (typeof validatedData.sections === 'string' 
            ? validatedData.sections 
            : JSON.stringify(validatedData.sections))
        : undefined
    }
    
    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: processedData
    })
    
    return NextResponse.json(updatedCompany)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }
}
