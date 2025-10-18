'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Users, Briefcase } from 'lucide-react'

interface Company {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  _count: {
    jobs: number
  }
}

interface Job {
  id: string
  title: string
  location: string
  department: string
  workType: string
  level: string
  isActive: boolean
  company: {
    name: string
    slug: string
    primaryColor: string
  }
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch companies with job counts
      const companiesResponse = await fetch('/api/companies')
      const companiesData = await companiesResponse.json()
      setCompanies(companiesData)

      // Fetch recent jobs
      const jobsResponse = await fetch('/api/jobs/recent')
      const jobsData = await jobsResponse.json()
      setRecentJobs(jobsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getWorkTypeColor = (workType: string) => {
    switch (workType) {
      case 'remote': return 'bg-green-100 text-green-800'
      case 'hybrid': return 'bg-yellow-100 text-yellow-800'
      case 'on-site': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800'
      case 'mid': return 'bg-blue-100 text-blue-800'
      case 'senior': return 'bg-purple-100 text-purple-800'
      case 'lead': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover opportunities at amazing companies
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Companies List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Companies ({filteredCompanies.length})
              </h2>
              <p className="text-gray-600">
                Browse companies and their open positions
              </p>
            </div>

            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        {company.logoUrl && (
                          <img
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            className="w-12 h-12 object-contain rounded"
                          />
                        )}
                        <div>
                          <CardTitle className="text-xl">{company.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {company.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className="text-sm"
                          style={{ 
                            backgroundColor: `${company.primaryColor}20`,
                            color: company.primaryColor,
                            borderColor: company.primaryColor
                          }}
                        >
                          <Briefcase className="w-4 h-4 mr-1" />
                          {company._count.jobs} {company._count.jobs === 1 ? 'opening' : 'openings'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {company._count.jobs} active jobs
                        </div>
                      </div>
                      <Link href={`/${company.slug}`}>
                        <Button 
                          style={{ 
                            backgroundColor: company.primaryColor,
                            borderColor: company.primaryColor
                          }}
                          className="hover:opacity-90"
                        >
                          View Careers
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredCompanies.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm ? 'No companies found matching your search.' : 'No companies available at the moment.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Jobs Sidebar */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recent Jobs
              </h2>
              <p className="text-gray-600">
                Latest job postings across all companies
              </p>
            </div>

            <div className="space-y-4">
              {recentJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {job.title}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className="text-xs ml-2 flex-shrink-0"
                          style={{ 
                            backgroundColor: `${job.company.primaryColor}20`,
                            color: job.company.primaryColor,
                            borderColor: job.company.primaryColor
                          }}
                        >
                          {job.company.name}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getWorkTypeColor(job.workType)}>
                          {job.workType}
                        </Badge>
                        <Badge variant="outline" className={getLevelColor(job.level)}>
                          {job.level}
                        </Badge>
                        <Badge variant="outline">
                          {job.department}
                        </Badge>
                      </div>
                      
                      <Link href={`/${job.company.slug}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                        >
                          View Job
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {recentJobs.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No recent jobs available.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
