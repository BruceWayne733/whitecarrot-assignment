import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const url = process.env.DATABASE_URL
    
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not found'
      })
    }
    
    // Try to parse the URL
    try {
      const urlObj = new URL(url)
      const host = urlObj.hostname
      const port = urlObj.port || '5432'
      
      return NextResponse.json({
        success: true,
        host,
        port,
        message: `Trying to connect to ${host}:${port}`,
        url: url.substring(0, 30) + '...'
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid DATABASE_URL format',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
