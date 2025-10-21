import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const url = process.env.DATABASE_URL
    
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not found',
        hasUrl: false
      })
    }
    
    return NextResponse.json({
      success: true,
      hasUrl: true,
      urlLength: url.length,
      startsWithPostgresql: url.startsWith('postgresql://'),
      startsWithPostgres: url.startsWith('postgres://'),
      first20Chars: url.substring(0, 20),
      last20Chars: url.substring(url.length - 20),
      containsAt: url.includes('@'),
      containsColon: url.includes(':'),
      containsSlash: url.includes('/')
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
