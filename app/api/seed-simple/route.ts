import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    console.log('Starting simple seed...')
    
    // Create a simple company
    const company = await prisma.company.upsert({
      where: { slug: 'acme' },
      update: {},
      create: {
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
            content: 'We are a forward-thinking technology company dedicated to creating innovative solutions.',
            order: 1,
            isActive: true
          }
        ])
      }
    })
    
    // Create a simple job
    const job = await prisma.job.create({
      data: {
        companyId: company.id,
        title: 'Senior Software Engineer',
        location: 'Remote',
        department: 'Engineering',
        workType: 'remote',
        level: 'senior',
        salaryMin: 120000,
        salaryMax: 180000,
        currency: 'USD',
        description: 'We are looking for a Senior Software Engineer to join our team.',
        requirements: JSON.stringify([
          '5+ years of software development experience',
          'Strong proficiency in React, Node.js, and TypeScript'
        ]),
        tags: JSON.stringify(['React', 'Node.js', 'TypeScript']),
        isActive: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      company: company.name,
      job: job.title
    })
  } catch (error) {
    console.error('Simple seed error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to seed database'
    })
  }
}
