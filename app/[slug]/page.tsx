'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface Company {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  primaryColor: string
  secondaryColor: string
  sections: string
}

interface Job {
  id: string
  title: string
  location: string
  department?: string
  workType: 'on-site' | 'remote' | 'hybrid'
  level?: 'entry' | 'mid' | 'senior' | 'lead'
  salaryMin?: number
  salaryMax?: number
  currency: string
  description: string
  requirements: string
  tags: string
  isActive: boolean
  createdAt: string
}

interface ApplicationForm {
  candidateName: string
  email: string
  resumeUrl: string
  coverLetter: string
}

export default function CareersPage({ params }: { params: { slug: string } }) {
  const [company, setCompany] = useState<Company | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)
  const [applying, setApplying] = useState(false)
  const { toast } = useToast()

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    department: '',
    workType: '',
    level: ''
  })

  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    candidateName: '',
    email: '',
    resumeUrl: '',
    coverLetter: ''
  })

  const getSections = () => {
    if (!company) return []
    try {
      return JSON.parse(company.sections || '[]')
    } catch {
      return []
    }
  }

  useEffect(() => {
    fetchCompanyAndJobs()
  }, [fetchCompanyAndJobs])

  useEffect(() => {
    filterJobs()
  }, [filterJobs])

  const fetchCompanyAndJobs = useCallback(async () => {
    try {
      const [companyResponse, jobsResponse] = await Promise.all([
        fetch('/api/admin/company'),
        fetch('/api/admin/jobs')
      ])

      const companyData = await companyResponse.json()
      const jobsData = await jobsResponse.json()

      if (companyData.slug !== params.slug) {
        setCompany(null)
        return
      }

      setCompany(companyData)
      // Convert string arrays back to arrays for display
      const processedJobs = jobsData
        .filter((job: any) => job.isActive)
        .map((job: any) => ({
          ...job,
          requirements: typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements,
          tags: typeof job.tags === 'string' ? JSON.parse(job.tags) : job.tags
        }))
      setJobs(processedJobs)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }, [params.slug])

  const filterJobs = useCallback(() => {
    let filtered = jobs

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.department) {
      filtered = filtered.filter(job =>
        job.department?.toLowerCase().includes(filters.department.toLowerCase())
      )
    }

    if (filters.workType) {
      filtered = filtered.filter(job => job.workType === filters.workType)
    }

    if (filters.level) {
      filtered = filtered.filter(job => job.level === filters.level)
    }

    setFilteredJobs(filtered)
  }, [jobs, filters])

  const handleApply = (job: Job) => {
    setSelectedJob(job)
    setApplicationForm({
      candidateName: '',
      email: '',
      resumeUrl: '',
      coverLetter: ''
    })
    setIsApplicationOpen(true)
  }

  const handleSubmitApplication = async () => {
    if (!selectedJob) return

    setApplying(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicationForm,
          jobId: selectedJob.id
        }),
      })

      if (response.ok) {
        toast({
          title: 'Application Submitted',
          description: 'Thank you for your interest! We\'ll be in touch soon.',
        })
        setIsApplicationOpen(false)
        setSelectedJob(null)
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to submit application',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive',
      })
    } finally {
      setApplying(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h1>
          <p className="text-gray-600">The careers page you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const activeSections = getSections()
    .filter(section => section.isActive)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative py-16 px-4 sm:px-6 lg:px-8"
        style={{ 
          backgroundColor: company.primaryColor,
          backgroundImage: company.bannerUrl ? `url(${company.bannerUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            {company.logoUrl && (
              <Image 
                src={company.logoUrl} 
                alt={`${company.name} logo`}
                width={64}
                height={64}
                className="h-16 w-auto"
              />
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {company.name}
          </h1>
          {company.description && (
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
              {company.description}
            </p>
          )}
        </div>
      </div>

      {/* Content Sections */}
      {activeSections.map((section, index) => (
        <div key={index} className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {section.title}
            </h2>
            <div 
              className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line"
              style={{ color: 'inherit' }}
            >
              {section.content}
            </div>
          </div>
        </div>
      ))}

      {/* Jobs Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600">Join our team and make a difference</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Job title, keywords..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, state..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Department..."
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="workType">Work Type</Label>
                <select
                  id="workType"
                  value={filters.workType}
                  onChange={(e) => handleFilterChange('workType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="on-site">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <select
                  id="level"
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <Badge variant="outline">{job.workType}</Badge>
                        {job.level && <Badge variant="outline">{job.level}</Badge>}
                      </div>
                      <p className="text-gray-600 mb-2">{job.location}</p>
                      {job.department && (
                        <p className="text-sm text-gray-500 mb-2">{job.department}</p>
                      )}
                      {job.salaryMin && job.salaryMax && (
                        <p className="text-sm text-gray-500 mb-3">
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} {job.currency}
                        </p>
                      )}
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(Array.isArray(job.tags) ? job.tags : JSON.parse(job.tags || '[]')).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button
                        onClick={() => handleApply(job)}
                        style={{ backgroundColor: company.primaryColor }}
                        className="text-white hover:opacity-90"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredJobs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit your application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidateName">Full Name *</Label>
                <Input
                  id="candidateName"
                  value={applicationForm.candidateName}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, candidateName: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={applicationForm.email}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="resumeUrl">Resume URL (optional)</Label>
              <Input
                id="resumeUrl"
                value={applicationForm.resumeUrl}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, resumeUrl: e.target.value }))}
                placeholder="https://example.com/resume.pdf"
              />
            </div>
            <div>
              <Label htmlFor="coverLetter">Cover Letter (optional)</Label>
              <Textarea
                id="coverLetter"
                value={applicationForm.coverLetter}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                placeholder="Tell us why you're interested in this position..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsApplicationOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitApplication} 
              disabled={applying || !applicationForm.candidateName || !applicationForm.email}
              style={{ backgroundColor: company.primaryColor }}
              className="text-white hover:opacity-90"
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
