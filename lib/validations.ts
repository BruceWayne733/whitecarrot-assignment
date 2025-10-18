import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  bannerUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Secondary color must be a valid hex color'),
  sections: z.string().optional().default("[]")
})

export const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  location: z.string().min(1, 'Location is required'),
  department: z.string().optional(),
  workType: z.enum(['on-site', 'remote', 'hybrid']),
  level: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  currency: z.string().default('USD'),
  description: z.string().min(1, 'Job description is required'),
  requirements: z.string().default("[]"),
  tags: z.string().default("[]"),
  isActive: z.boolean().default(true)
}).refine((data) => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMin <= data.salaryMax
  }
  return true
}, {
  message: 'Minimum salary must be less than or equal to maximum salary',
  path: ['salaryMin']
})

export const applicationSchema = z.object({
  candidateName: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  coverLetter: z.string().optional()
})

export type CompanyInput = z.infer<typeof companySchema>
export type JobInput = z.infer<typeof jobSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
