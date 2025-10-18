import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const recentJobs = await prisma.job.findMany({
      where: {
        isActive: true
      },
      include: {
        company: {
          select: {
            name: true,
            slug: true,
            primaryColor: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json(recentJobs)
  } catch (error) {
    console.error('Error fetching recent jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent jobs' },
      { status: 500 }
    )
  }
}
