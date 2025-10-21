'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export default function AdminBrandPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    bannerUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af'
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [bannerPreview, setBannerPreview] = useState<string>('')

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {
    try {
      const response = await fetch('/api/admin/company')
      const data = await response.json()
      if (data) {
        setCompany(data)
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          logoUrl: data.logoUrl || '',
          bannerUrl: data.bannerUrl || '',
          primaryColor: data.primaryColor || '#3b82f6',
          secondaryColor: data.secondaryColor || '#1e40af'
        })
        setLogoPreview(data.logoUrl || '')
        setBannerPreview(data.bannerUrl || '')
      }
    } catch (error) {
      console.error('Failed to fetch company:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Prepare data with file uploads
      const dataToSave = { ...formData }
      
      // If files are uploaded, convert them to data URLs
      if (logoFile) {
        const reader = new FileReader()
        dataToSave.logoUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(logoFile)
        })
      }
      
      if (bannerFile) {
        const reader = new FileReader()
        dataToSave.bannerUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(bannerFile)
        })
      }

      const response = await fetch('/api/admin/company', {
        method: company ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      })

      if (response.ok) {
        const updatedCompany = await response.json()
        setCompany(updatedCompany)
        // Clear file inputs after successful save
        setLogoFile(null)
        setBannerFile(null)
        toast({
          title: 'Success',
          description: 'Company settings saved successfully!',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to save company settings',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save company settings',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearLogoFile = () => {
    setLogoFile(null)
    setLogoPreview(formData.logoUrl)
  }

  const clearBannerFile = () => {
    setBannerFile(null)
    setBannerPreview(formData.bannerUrl)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Brand Settings</h1>
        <p className="text-gray-600">Customize your company branding and colors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Basic information about your company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="company-slug"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be your careers page URL: /{formData.slug}
              </p>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your company"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visual Assets</CardTitle>
            <CardDescription>
              Upload your logo and banner images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="logo">Company Logo</Label>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="flex-1"
                  />
                  {logoFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearLogoFile}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {logoPreview && (
                  <div className="mt-2">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={128}
                      height={64}
                      className="w-32 h-16 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <Label htmlFor="logoUrl">Or enter logo URL</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="banner">Banner Image</Label>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFileChange}
                    className="flex-1"
                  />
                  {bannerFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearBannerFile}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {bannerPreview && (
                  <div className="mt-2">
                    <Image
                      src={bannerPreview}
                      alt="Banner preview"
                      width={400}
                      height={128}
                      className="w-full h-32 object-cover border rounded"
                    />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <Label htmlFor="bannerUrl">Or enter banner URL</Label>
                <Input
                  id="bannerUrl"
                  value={formData.bannerUrl}
                  onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
                  placeholder="https://example.com/banner.png"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
            <CardDescription>
              Choose your primary and secondary colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  placeholder="#1e40af"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              See how your branding will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 rounded-lg text-white"
              style={{ 
                backgroundColor: formData.primaryColor,
                backgroundImage: formData.bannerUrl ? `url(${formData.bannerUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex items-center space-x-4">
                {formData.logoUrl && (
                  <Image 
                    src={formData.logoUrl} 
                    alt="Logo" 
                    width={48}
                    height={48}
                    className="h-12 w-auto"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{formData.name || 'Your Company'}</h2>
                  <p className="text-sm opacity-90">{formData.description || 'Company description'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
