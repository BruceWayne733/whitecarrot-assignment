import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    const isValid = verifySession(token)
    return NextResponse.json({ valid: isValid })
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
