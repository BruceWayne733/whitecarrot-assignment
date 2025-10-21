import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to convert sections array to JSON string
function sectionsToString(sections: any[]): string {
  return JSON.stringify(sections)
}

async function main() {
  // Create sample company
  const company = await prisma.company.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      slug: 'acme',
      name: 'ACME Corporation',
      description: 'Leading technology company focused on innovation and growth',
      logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop&crop=center&auto=format&q=80',
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      sections: sectionsToString([
        {
          type: 'about',
          title: 'About ACME',
          content: 'We are a forward-thinking technology company dedicated to creating innovative solutions that make a difference in the world. Our team of passionate professionals works together to build products that our customers love.',
          order: 1,
          isActive: true
        },
        {
          type: 'benefits',
          title: 'Why Work With Us',
          content: '• Competitive salary and equity\n• Comprehensive health insurance\n• Flexible work arrangements\n• Professional development opportunities\n• Modern office with great amenities\n• Team building events and activities',
          order: 2,
          isActive: true
        },
        {
          type: 'values',
          title: 'Our Values',
          content: 'Innovation: We constantly push boundaries and explore new possibilities.\n\nCollaboration: We believe in the power of working together.\n\nIntegrity: We do the right thing, even when no one is watching.\n\nExcellence: We strive for the highest quality in everything we do.',
          order: 3,
          isActive: true
        },
        {
          type: 'life',
          title: 'Life at ACME',
          content: 'At ACME, we believe work should be fulfilling and fun. Our office culture promotes creativity, learning, and work-life balance. From weekly team lunches to annual company retreats, we invest in building a strong community.',
          order: 4,
          isActive: true
        }
      ])
    }
  })

  // Create additional sample companies
  const techFlow = await prisma.company.upsert({
    where: { slug: 'techflow' },
    update: {},
    create: {
      slug: 'techflow',
      name: 'TechFlow Solutions',
      description: 'Revolutionizing the future of work with cutting-edge technology',
      logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop&crop=center&auto=format&q=80',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      sections: sectionsToString([
        {
          type: 'about',
          title: 'About TechFlow',
          content: 'TechFlow Solutions is at the forefront of digital transformation, helping businesses leverage technology to achieve their goals. We are a team of innovators, creators, and problem-solvers.',
          order: 1,
          isActive: true
        },
        {
          type: 'benefits',
          title: 'Why Join TechFlow',
          content: '• Remote-first culture\n• Competitive compensation\n• Learning and development budget\n• Health and wellness programs\n• Flexible PTO\n• Stock options',
          order: 2,
          isActive: true
        }
      ]) as string
    }
  })

  const dataVault = await prisma.company.upsert({
    where: { slug: 'datavault' },
    update: {},
    create: {
      slug: 'datavault',
      name: 'DataVault Analytics',
      description: 'Transforming data into actionable insights for enterprise clients',
      logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop&crop=center&auto=format&q=80',
      primaryColor: '#8b5cf6',
      secondaryColor: '#7c3aed',
      sections: sectionsToString([
        {
          type: 'about',
          title: 'About DataVault',
          content: 'DataVault Analytics specializes in helping organizations unlock the power of their data. Our team of data scientists and engineers work together to create solutions that drive business growth.',
          order: 1,
          isActive: true
        },
        {
          type: 'values',
          title: 'Our Mission',
          content: 'To democratize data analytics and make insights accessible to every business, regardless of size or technical expertise.',
          order: 2,
          isActive: true
        }
      ]) as string
    }
  })

  const greenEnergy = await prisma.company.upsert({
    where: { slug: 'greenenergy' },
    update: {},
    create: {
      slug: 'greenenergy',
      name: 'GreenEnergy Corp',
      description: 'Building a sustainable future through renewable energy solutions',
      logoUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=200&h=100&fit=crop&crop=center&auto=format&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=400&fit=crop&crop=center&auto=format&q=80',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      sections: sectionsToString([
        {
          type: 'about',
          title: 'About GreenEnergy',
          content: 'GreenEnergy Corp is leading the charge in renewable energy innovation. We develop and deploy sustainable energy solutions that help reduce carbon footprints and create a cleaner future.',
          order: 1,
          isActive: true
        },
        {
          type: 'life',
          title: 'Join Our Mission',
          content: 'Be part of a team that\'s making a real difference in the world. We offer meaningful work, competitive benefits, and the opportunity to contribute to environmental sustainability.',
          order: 2,
          isActive: true
        }
      ]) as string
    }
  })

  // Create sample jobs
  const jobs = [
    {
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      department: 'Engineering',
      workType: 'hybrid' as const,
      level: 'senior' as const,
      salaryMin: 120000,
      salaryMax: 160000,
      currency: 'USD',
      description: 'We are looking for a Senior Software Engineer to join our core platform team. You will be responsible for designing and implementing scalable solutions that power our main product.',
      requirements: JSON.stringify([
        '5+ years of software development experience',
        'Strong proficiency in React, Node.js, and TypeScript',
        'Experience with cloud platforms (AWS, GCP, or Azure)',
        'Knowledge of database design and optimization',
        'Experience with microservices architecture'
      ]),
      tags: JSON.stringify(['React', 'Node.js', 'TypeScript', 'AWS', 'Microservices']),
      isActive: true
    },
    {
      title: 'Product Manager',
      location: 'New York, NY',
      department: 'Product',
      workType: 'on-site' as const,
      level: 'mid' as const,
      salaryMin: 100000,
      salaryMax: 130000,
      currency: 'USD',
      description: 'Join our product team as a Product Manager and help shape the future of our platform. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.',
      requirements: JSON.stringify([
        '3+ years of product management experience',
        'Strong analytical and problem-solving skills',
        'Experience with user research and data analysis',
        'Excellent communication and collaboration skills',
        'Technical background preferred'
      ]),
      tags: JSON.stringify(['Product Management', 'User Research', 'Analytics', 'Strategy']),
      isActive: true
    },
    {
      title: 'UX Designer',
      location: 'Remote',
      department: 'Design',
      workType: 'remote' as const,
      level: 'mid' as const,
      salaryMin: 80000,
      salaryMax: 110000,
      currency: 'USD',
      description: 'We are seeking a talented UX Designer to join our design team. You will be responsible for creating intuitive and engaging user experiences across our product suite.',
      requirements: JSON.stringify([
        '3+ years of UX design experience',
        'Proficiency in Figma, Sketch, or similar design tools',
        'Strong portfolio demonstrating user-centered design',
        'Experience with user research and usability testing',
        'Knowledge of design systems and accessibility'
      ]),
      tags: JSON.stringify(['UX Design', 'Figma', 'User Research', 'Design Systems']),
      isActive: true
    },
    {
      title: 'Data Scientist',
      location: 'Seattle, WA',
      department: 'Data',
      workType: 'hybrid' as const,
      level: 'senior' as const,
      salaryMin: 110000,
      salaryMax: 150000,
      currency: 'USD',
      description: 'Join our data science team to help us extract insights from our vast datasets and build machine learning models that drive business decisions.',
      requirements: JSON.stringify([
        '4+ years of data science experience',
        'Strong programming skills in Python and R',
        'Experience with machine learning frameworks',
        'Knowledge of SQL and data warehousing',
        'Advanced degree in quantitative field preferred'
      ]),
      tags: JSON.stringify(['Python', 'Machine Learning', 'SQL', 'Statistics']),
      isActive: true
    },
    {
      title: 'Marketing Manager',
      location: 'Austin, TX',
      department: 'Marketing',
      workType: 'on-site' as const,
      level: 'mid' as const,
      salaryMin: 70000,
      salaryMax: 95000,
      currency: 'USD',
      description: 'We are looking for a Marketing Manager to lead our digital marketing efforts and help grow our brand presence in the market.',
      requirements: JSON.stringify([
        '3+ years of marketing experience',
        'Experience with digital marketing channels',
        'Strong analytical and creative skills',
        'Knowledge of marketing automation tools',
        'Excellent written and verbal communication'
      ]),
      tags: JSON.stringify(['Digital Marketing', 'Content Marketing', 'Analytics', 'Brand']),
      isActive: true
    },
    {
      title: 'DevOps Engineer',
      location: 'Remote',
      department: 'Engineering',
      workType: 'remote' as const,
      level: 'senior' as const,
      salaryMin: 100000,
      salaryMax: 140000,
      currency: 'USD',
      description: 'Join our DevOps team to help us build and maintain our cloud infrastructure, ensuring high availability and scalability of our services.',
      requirements: JSON.stringify([
        '4+ years of DevOps experience',
        'Strong knowledge of AWS, Docker, and Kubernetes',
        'Experience with CI/CD pipelines',
        'Knowledge of infrastructure as code',
        'Strong scripting skills (Bash, Python)'
      ]),
      tags: JSON.stringify(['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Infrastructure']),
      isActive: true
    },
    {
      title: 'Sales Representative',
      location: 'Chicago, IL',
      department: 'Sales',
      workType: 'on-site' as const,
      level: 'entry' as const,
      salaryMin: 50000,
      salaryMax: 70000,
      currency: 'USD',
      description: 'We are seeking a motivated Sales Representative to join our growing sales team and help us expand our customer base.',
      requirements: JSON.stringify([
        '1+ years of sales experience',
        'Strong communication and interpersonal skills',
        'Goal-oriented and self-motivated',
        'Experience with CRM systems preferred',
        'Bachelor\'s degree preferred'
      ]),
      tags: JSON.stringify(['Sales', 'CRM', 'Communication', 'B2B']),
      isActive: true
    },
    {
      title: 'Customer Success Manager',
      location: 'Denver, CO',
      department: 'Customer Success',
      workType: 'hybrid' as const,
      level: 'mid' as const,
      salaryMin: 65000,
      salaryMax: 85000,
      currency: 'USD',
      description: 'Join our customer success team to help our clients achieve their goals and ensure high satisfaction with our products and services.',
      requirements: JSON.stringify([
        '2+ years of customer success experience',
        'Strong problem-solving and communication skills',
        'Experience with customer support tools',
        'Technical background preferred',
        'Passion for helping customers succeed'
      ]),
      tags: JSON.stringify(['Customer Success', 'Support', 'Account Management', 'SaaS']),
      isActive: true
    }
  ]

  for (const jobData of jobs) {
    await prisma.job.create({
      data: {
        companyId: company.id,
        ...jobData
      }
    })
  }

  // Add jobs for TechFlow Solutions
  const techFlowJobs = [
    {
      title: 'Frontend Developer',
      location: 'Remote',
      department: 'Engineering',
      workType: 'remote' as const,
      level: 'mid' as const,
      salaryMin: 80000,
      salaryMax: 110000,
      currency: 'USD',
      description: 'Join our frontend team to build beautiful, responsive user interfaces that delight our users.',
      requirements: JSON.stringify([
        '3+ years of frontend development experience',
        'Proficiency in React, Vue.js, or Angular',
        'Experience with modern CSS frameworks',
        'Strong understanding of web performance',
        'Experience with testing frameworks'
      ]),
      tags: JSON.stringify(['React', 'Vue.js', 'CSS', 'JavaScript', 'Frontend']),
      isActive: true
    },
    {
      title: 'Product Designer',
      location: 'San Francisco, CA',
      department: 'Design',
      workType: 'hybrid' as const,
      level: 'senior' as const,
      salaryMin: 90000,
      salaryMax: 120000,
      currency: 'USD',
      description: 'Lead the design of our core products and help establish our design system.',
      requirements: JSON.stringify([
        '5+ years of product design experience',
        'Strong portfolio showcasing UX/UI work',
        'Experience with design systems',
        'Proficiency in Figma, Sketch, or similar',
        'Experience with user research'
      ]),
      tags: JSON.stringify(['UX Design', 'UI Design', 'Figma', 'Design Systems', 'User Research']),
      isActive: true
    }
  ]

  for (const jobData of techFlowJobs) {
    await prisma.job.create({
      data: {
        companyId: techFlow.id,
        ...jobData
      }
    })
  }

  // Add jobs for DataVault Analytics
  const dataVaultJobs = [
    {
      title: 'Data Scientist',
      location: 'New York, NY',
      department: 'Data Science',
      workType: 'on-site' as const,
      level: 'senior' as const,
      salaryMin: 110000,
      salaryMax: 150000,
      currency: 'USD',
      description: 'Lead data science initiatives and build machine learning models that drive business insights.',
      requirements: JSON.stringify([
        '4+ years of data science experience',
        'Strong Python and R skills',
        'Experience with machine learning frameworks',
        'Knowledge of statistics and mathematics',
        'Experience with big data tools'
      ]),
      tags: JSON.stringify(['Python', 'Machine Learning', 'Statistics', 'Big Data', 'R']),
      isActive: true
    },
    {
      title: 'Data Engineer',
      location: 'Remote',
      department: 'Engineering',
      workType: 'remote' as const,
      level: 'mid' as const,
      salaryMin: 85000,
      salaryMax: 115000,
      currency: 'USD',
      description: 'Build and maintain data pipelines that process large volumes of data efficiently.',
      requirements: JSON.stringify([
        '3+ years of data engineering experience',
        'Experience with Apache Spark, Kafka, or similar',
        'Strong SQL and Python skills',
        'Knowledge of cloud data platforms',
        'Experience with ETL processes'
      ]),
      tags: JSON.stringify(['Python', 'SQL', 'Apache Spark', 'ETL', 'Cloud']),
      isActive: true
    }
  ]

  for (const jobData of dataVaultJobs) {
    await prisma.job.create({
      data: {
        companyId: dataVault.id,
        ...jobData
      }
    })
  }

  // Add jobs for GreenEnergy Corp
  const greenEnergyJobs = [
    {
      title: 'Renewable Energy Engineer',
      location: 'Portland, OR',
      department: 'Engineering',
      workType: 'on-site' as const,
      level: 'senior' as const,
      salaryMin: 95000,
      salaryMax: 130000,
      currency: 'USD',
      description: 'Design and implement renewable energy solutions for commercial and residential clients.',
      requirements: JSON.stringify([
        '5+ years of renewable energy experience',
        'Engineering degree in relevant field',
        'Experience with solar, wind, or other renewables',
        'Knowledge of electrical systems',
        'Project management experience'
      ]),
      tags: JSON.stringify(['Renewable Energy', 'Solar', 'Wind', 'Electrical Engineering', 'Project Management']),
      isActive: true
    },
    {
      title: 'Environmental Consultant',
      location: 'Seattle, WA',
      department: 'Consulting',
      workType: 'hybrid' as const,
      level: 'mid' as const,
      salaryMin: 70000,
      salaryMax: 95000,
      currency: 'USD',
      description: 'Help clients assess and improve their environmental impact through sustainable practices.',
      requirements: JSON.stringify([
        '3+ years of environmental consulting experience',
        'Knowledge of environmental regulations',
        'Strong analytical and communication skills',
        'Experience with sustainability assessments',
        'Bachelor\'s degree in environmental science or related field'
      ]),
      tags: JSON.stringify(['Environmental', 'Sustainability', 'Consulting', 'Regulations', 'Assessment']),
      isActive: true
    }
  ]

  for (const jobData of greenEnergyJobs) {
    await prisma.job.create({
      data: {
        companyId: greenEnergy.id,
        ...jobData
      }
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })