'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'seeding' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [dbInfo, setDbInfo] = useState<any>(null)

  const checkDatabase = async () => {
    setStatus('checking')
    try {
      const response = await fetch('/api/setup')
      const data = await response.json()
      
      if (data.success) {
        setDbInfo(data)
        setMessage('Database is connected and ready!')
        setStatus('success')
      } else {
        setMessage('Database connection failed')
        setStatus('error')
      }
    } catch (error) {
      setMessage('Failed to check database')
      setStatus('error')
    }
  }

  const seedDatabase = async () => {
    setStatus('seeding')
    try {
      const response = await fetch('/api/setup', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setMessage('Database seeded successfully!')
        setStatus('success')
        // Refresh database info
        checkDatabase()
      } else {
        setMessage('Failed to seed database')
        setStatus('error')
      }
    } catch (error) {
      setMessage('Failed to seed database')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            Check database connection and seed initial data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              onClick={checkDatabase} 
              disabled={status === 'checking' || status === 'seeding'}
              className="w-full"
            >
              {status === 'checking' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking Database...
                </>
              ) : (
                'Check Database'
              )}
            </Button>
            
            {status === 'success' && (
              <Button 
                onClick={seedDatabase} 
                disabled={status === 'seeding'}
                className="w-full"
                variant="outline"
              >
                {status === 'seeding' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  'Seed Database'
                )}
              </Button>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-md flex items-center space-x-2 ${
              status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span>{message}</span>
            </div>
          )}

          {dbInfo && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-sm mb-2">Database Status:</h4>
              <div className="text-sm space-y-1">
                <div>Status: <span className="text-green-600">Connected</span></div>
                <div>Companies: {dbInfo.companies}</div>
                <div>Jobs: {dbInfo.jobs}</div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p>After seeding, you can:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Login with admin/admin123</li>
              <li>View the sample careers page at /acme</li>
              <li>Browse companies at /companies</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
