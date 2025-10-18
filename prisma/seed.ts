import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample company
  const company = await prisma.company.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      slug: 'acme',
      name: 'ACME Corporation',
      description: 'Leading technology company focused on innovation and growth',
      logoUrl: 'https://via.placeholder.com/200x100/3b82f6/ffffff?text=ACME',
      bannerUrl: 'https://via.placeholder.com/1200x400/1e40af/ffffff?text=Join+Our+Team',
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      sections: [
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
      ]
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
      requirements: [
        '5+ years of software development experience',
        'Strong proficiency in React, Node.js, and TypeScript',
        'Experience with cloud platforms (AWS, GCP, or Azure)',
        'Knowledge of database design and optimization',
        'Experience with microservices architecture'
      ],
      tags: ['React', 'Node.js', 'TypeScript', 'AWS', 'Microservices'],
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
      requirements: [
        '3+ years of product management experience',
        'Strong analytical and problem-solving skills',
        'Experience with user research and data analysis',
        'Excellent communication and collaboration skills',
        'Technical background preferred'
      ],
      tags: ['Product Management', 'User Research', 'Analytics', 'Strategy'],
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
      requirements: [
        '3+ years of UX design experience',
        'Proficiency in Figma, Sketch, or similar design tools',
        'Strong portfolio demonstrating user-centered design',
        'Experience with user research and usability testing',
        'Knowledge of design systems and accessibility'
      ],
      tags: ['UX Design', 'Figma', 'User Research', 'Design Systems'],
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
      requirements: [
        '4+ years of data science experience',
        'Strong programming skills in Python and R',
        'Experience with machine learning frameworks',
        'Knowledge of SQL and data warehousing',
        'Advanced degree in quantitative field preferred'
      ],
      tags: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
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
      requirements: [
        '3+ years of marketing experience',
        'Experience with digital marketing channels',
        'Strong analytical and creative skills',
        'Knowledge of marketing automation tools',
        'Excellent written and verbal communication'
      ],
      tags: ['Digital Marketing', 'Content Marketing', 'Analytics', 'Brand'],
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
      requirements: [
        '4+ years of DevOps experience',
        'Strong knowledge of AWS, Docker, and Kubernetes',
        'Experience with CI/CD pipelines',
        'Knowledge of infrastructure as code',
        'Strong scripting skills (Bash, Python)'
      ],
      tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Infrastructure'],
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
      requirements: [
        '1+ years of sales experience',
        'Strong communication and interpersonal skills',
        'Goal-oriented and self-motivated',
        'Experience with CRM systems preferred',
        'Bachelor\'s degree preferred'
      ],
      tags: ['Sales', 'CRM', 'Communication', 'B2B'],
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
      requirements: [
        '2+ years of customer success experience',
        'Strong problem-solving and communication skills',
        'Experience with customer support tools',
        'Technical background preferred',
        'Passion for helping customers succeed'
      ],
      tags: ['Customer Success', 'Support', 'Account Management', 'SaaS'],
      isActive: true
    }
  ]

  for (const jobData of jobs) {
    await prisma.job.upsert({
      where: { 
        id: `${company.id}-${jobData.title.toLowerCase().replace(/\s+/g, '-')}`
      },
      update: {},
      create: {
        id: `${company.id}-${jobData.title.toLowerCase().replace(/\s+/g, '-')}`,
        companyId: company.id,
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
