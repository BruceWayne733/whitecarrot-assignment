'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

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

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [jobForm, setJobForm] = useState({
    title: '',
    location: '',
    department: '',
    workType: 'hybrid' as 'on-site' | 'remote' | 'hybrid',
    level: 'mid' as 'entry' | 'mid' | 'senior' | 'lead',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    description: '',
    requirements: '',
    tags: '',
    isActive: true
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/admin/jobs')
      const data = await response.json()
      // Convert string arrays back to arrays for display
      const processedJobs = data.map((job: any) => ({
        ...job,
        requirements: typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements,
        tags: typeof job.tags === 'string' ? JSON.parse(job.tags) : job.tags
      }))
      setJobs(processedJobs)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveJob = async () => {
    setSaving(true)
    try {
      const jobData = {
        ...jobForm,
        salaryMin: jobForm.salaryMin ? parseInt(jobForm.salaryMin) : undefined,
        salaryMax: jobForm.salaryMax ? parseInt(jobForm.salaryMax) : undefined,
        requirements: JSON.stringify(jobForm.requirements.split('\n').filter(req => req.trim())),
        tags: JSON.stringify(jobForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag))
      }

      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (response.ok) {
        const newJob = await response.json()
        setJobs([newJob, ...jobs])
        setIsDialogOpen(false)
        resetForm()
        toast({
          title: 'Success',
          description: 'Job created successfully!',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to create job',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create job',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateJob = async () => {
    if (!editingJob) return

    setSaving(true)
    try {
      const jobData = {
        ...jobForm,
        salaryMin: jobForm.salaryMin ? parseInt(jobForm.salaryMin) : undefined,
        salaryMax: jobForm.salaryMax ? parseInt(jobForm.salaryMax) : undefined,
        requirements: JSON.stringify(jobForm.requirements.split('\n').filter(req => req.trim())),
        tags: JSON.stringify(jobForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag))
      }

      const response = await fetch(`/api/admin/jobs/${editingJob.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (response.ok) {
        const updatedJob = await response.json()
        setJobs(jobs.map(job => job.id === editingJob.id ? updatedJob : job))
        setEditingJob(null)
        setIsDialogOpen(false)
        resetForm()
        toast({
          title: 'Success',
          description: 'Job updated successfully!',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to update job',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== jobId))
        toast({
          title: 'Success',
          description: 'Job deleted successfully!',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete job',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete job',
        variant: 'destructive',
      })
    }
  }

  const handleToggleActive = async (job: Job) => {
    try {
      const response = await fetch(`/api/admin/jobs/${job.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !job.isActive }),
      })

      if (response.ok) {
        const updatedJob = await response.json()
        setJobs(jobs.map(j => j.id === job.id ? updatedJob : j))
        toast({
          title: 'Success',
          description: `Job ${job.isActive ? 'deactivated' : 'activated'} successfully!`,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job status',
        variant: 'destructive',
      })
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    
    // Parse requirements and tags if they are strings
    const requirements = typeof job.requirements === 'string' 
      ? JSON.parse(job.requirements) 
      : job.requirements
    const tags = typeof job.tags === 'string' 
      ? JSON.parse(job.tags) 
      : job.tags
    
    setJobForm({
      title: job.title,
      location: job.location,
      department: job.department || '',
      workType: job.workType,
      level: job.level || 'mid',
      salaryMin: job.salaryMin?.toString() || '',
      salaryMax: job.salaryMax?.toString() || '',
      currency: job.currency,
      description: job.description,
      requirements: Array.isArray(requirements) ? requirements.join('\n') : '',
      tags: Array.isArray(tags) ? tags.join(', ') : '',
      isActive: job.isActive
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setJobForm({
      title: '',
      location: '',
      department: '',
      workType: 'hybrid',
      level: 'mid',
      salaryMin: '',
      salaryMax: '',
      currency: 'USD',
      description: '',
      requirements: '',
      tags: '',
      isActive: true
    })
  }

  const openCreateDialog = () => {
    setEditingJob(null)
    resetForm()
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-600">Create and manage job postings</p>
        </div>
        <Button onClick={openCreateDialog}>
          Add New Job
        </Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <Badge variant={job.isActive ? 'default' : 'secondary'}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">{job.workType}</Badge>
                    {job.level && <Badge variant="outline">{job.level}</Badge>}
                  </div>
                  <p className="text-gray-600 mb-2">{job.location}</p>
                  {job.department && (
                    <p className="text-sm text-gray-500 mb-2">{job.department}</p>
                  )}
                  {job.salaryMin && job.salaryMax && (
                    <p className="text-sm text-gray-500 mb-2">
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} {job.currency}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(job.tags) ? job.tags : JSON.parse(job.tags || '[]')).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Switch
                    checked={job.isActive}
                    onCheckedChange={() => handleToggleActive(job)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditJob(job)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {jobs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first job posting.</p>
              <Button onClick={openCreateDialog}>
                Add Your First Job
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? 'Edit Job' : 'Create New Job'}
            </DialogTitle>
            <DialogDescription>
              {editingJob ? 'Update the job details below' : 'Fill in the details for the new job posting'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={jobForm.location}
                  onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={jobForm.department}
                  onChange={(e) => setJobForm(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g. Engineering"
                />
              </div>
              <div>
                <Label htmlFor="workType">Work Type</Label>
                <select
                  id="workType"
                  value={jobForm.workType}
                  onChange={(e) => setJobForm(prev => ({ ...prev, workType: e.target.value as 'on-site' | 'remote' | 'hybrid' }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="on-site">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <select
                  id="level"
                  value={jobForm.level}
                  onChange={(e) => setJobForm(prev => ({ ...prev, level: e.target.value as 'entry' | 'mid' | 'senior' | 'lead' }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="salaryMin">Min Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={jobForm.salaryMin}
                  onChange={(e) => setJobForm(prev => ({ ...prev, salaryMin: e.target.value }))}
                  placeholder="80000"
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Max Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={jobForm.salaryMax}
                  onChange={(e) => setJobForm(prev => ({ ...prev, salaryMax: e.target.value }))}
                  placeholder="120000"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={jobForm.currency}
                  onChange={(e) => setJobForm(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={jobForm.description}
                onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                value={jobForm.requirements}
                onChange={(e) => setJobForm(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="5+ years of experience&#10;Proficiency in React&#10;Strong communication skills"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={jobForm.tags}
                onChange={(e) => setJobForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="React, Node.js, TypeScript, AWS"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={jobForm.isActive}
                onCheckedChange={(checked) => setJobForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active (visible to candidates)</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingJob ? handleUpdateJob : handleSaveJob} disabled={saving}>
              {saving ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
