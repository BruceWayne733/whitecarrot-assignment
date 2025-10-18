'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface Section {
  type: string
  title: string
  content: string
  order: number
  isActive: boolean
}

interface Company {
  id: string
  sections: string
}

export default function AdminSectionsPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const { toast } = useToast()

  const [sectionForm, setSectionForm] = useState({
    type: 'about',
    title: '',
    content: '',
    isActive: true
  })

  const sectionTypes = [
    { value: 'about', label: 'About Us' },
    { value: 'benefits', label: 'Benefits' },
    { value: 'values', label: 'Values' },
    { value: 'life', label: 'Life at Company' },
    { value: 'custom', label: 'Custom' }
  ]

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {
    try {
      const response = await fetch('/api/admin/company')
      const data = await response.json()
      if (data) {
        setCompany(data)
      }
    } catch (error) {
      console.error('Failed to fetch company:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSections = (): Section[] => {
    if (!company) return []
    try {
      return JSON.parse(company.sections || '[]')
    } catch {
      return []
    }
  }

  const setSections = (sections: Section[]) => {
    if (!company) return
    setCompany({
      ...company,
      sections: JSON.stringify(sections)
    })
    setHasUnsavedChanges(true)
  }

  const handleSaveSections = async () => {
    if (!company) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/company', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sections: company.sections
        }),
      })

      if (response.ok) {
        setHasUnsavedChanges(false)
        toast({
          title: 'Success',
          description: 'Sections saved successfully!',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to save sections',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save sections',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddSection = () => {
    if (!company) return

    const sections = getSections()
    const newSection: Section = {
      ...sectionForm,
      order: sections.length
    }

    setSections([...sections, newSection])

    setSectionForm({
      type: 'about',
      title: '',
      content: '',
      isActive: true
    })
  }

  const handleEditSection = (section: Section) => {
    setEditingSection(section)
    setSectionForm({
      type: section.type,
      title: section.title,
      content: section.content,
      isActive: section.isActive
    })
  }

  const handleUpdateSection = () => {
    if (!company || !editingSection) return

    const sections = getSections()
    const updatedSections = sections.map(section => {
      if (section.title === editingSection.title && 
          section.type === editingSection.type &&
          section.content === editingSection.content) {
        return { ...section, ...sectionForm }
      }
      return section
    })

    setSections(updatedSections)

    setEditingSection(null)
    setSectionForm({
      type: 'about',
      title: '',
      content: '',
      isActive: true
    })
  }

  const handleDeleteSection = (sectionToDelete: Section) => {
    if (!company) return

    const sections = getSections()
    const sectionIndex = sections.findIndex(section => 
      section.title === sectionToDelete.title && 
      section.type === sectionToDelete.type &&
      section.content === sectionToDelete.content
    )
    
    if (sectionIndex !== -1) {
      const updatedSections = sections.filter((_, index) => index !== sectionIndex)
      setSections(updatedSections)
    }
  }

  const handleToggleSection = (section: Section) => {
    if (!company) return

    const sections = getSections()
    const updatedSections = sections.map(s => {
      if (s.title === section.title && 
          s.type === section.type &&
          s.content === section.content) {
        return { ...s, isActive: !s.isActive }
      }
      return s
    })

    setSections(updatedSections)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Sections</h1>
        <p className="text-gray-600">Manage the content sections on your careers page</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </CardTitle>
            <CardDescription>
              {editingSection ? 'Update the selected section' : 'Create a new content section'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Section Type</Label>
              <select
                id="type"
                value={sectionForm.type}
                onChange={(e) => setSectionForm(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {sectionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={sectionForm.title}
                onChange={(e) => setSectionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Section title"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={sectionForm.content}
                onChange={(e) => setSectionForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Section content (supports line breaks)"
                rows={6}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={sectionForm.isActive}
                onCheckedChange={(checked) => setSectionForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex space-x-2">
              {editingSection ? (
                <>
                  <Button onClick={handleUpdateSection}>
                    Update Section
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingSection(null)
                      setSectionForm({
                        type: 'about',
                        title: '',
                        content: '',
                        isActive: true
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={handleAddSection}>
                  Add Section
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Sections</CardTitle>
            <CardDescription>
              Manage your existing content sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getSections().map((section, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{section.title}</h3>
                        <Badge variant={section.isActive ? 'default' : 'secondary'}>
                          {section.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {sectionTypes.find(t => t.value === section.type)?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {section.content}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSection(section)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleSection(section)}
                      >
                        {section.isActive ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteSection(section)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {getSections().length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No sections yet. Add your first section to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSections} 
          disabled={saving || !hasUnsavedChanges}
          variant={hasUnsavedChanges ? "default" : "outline"}
        >
          {saving ? 'Saving...' : hasUnsavedChanges ? 'Save All Changes' : 'No Changes to Save'}
        </Button>
      </div>
    </div>
  )
}
