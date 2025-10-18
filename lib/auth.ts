// Simple authentication utilities
export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
}

export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export function createSession(): string {
  // Simple session token (in production, use JWT or proper session management)
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64')
}

export function verifySession(token: string): boolean {
  // Simple session verification (in production, use proper session validation)
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [timestamp] = decoded.split('-')
    const sessionAge = Date.now() - parseInt(timestamp)
    // Session expires after 24 hours
    return sessionAge < 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}
