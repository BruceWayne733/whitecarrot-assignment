# Careers Page Builder

A complete MVP for building branded careers pages. Recruiters can customize company branding, manage content sections, and post jobs. Candidates can browse, filter, and apply to positions seamlessly.


Vercel links: 

## Features

### Admin Dashboard
- **Brand Editor**: Customize company name, slug, colors, logo, and banner
- **Sections Manager**: Create and manage content sections (About, Benefits, Values, Life at Company, Custom)
- **Jobs Manager**: Full CRUD operations for job postings with rich metadata

### Public Careers Page
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Job Filtering**: Search by title, location, department, work type, and level
- **Application System**: Simple application form with resume upload and cover letter
- **Brand Integration**: Dynamic colors and branding from admin settings

### Technical Features
- **Next.js 14** with App Router and TypeScript
- **Prisma** with SQLite for zero-setup database
- **shadcn/ui** components with Tailwind CSS
- **Zod** validation for type safety
- **Responsive** mobile-first design

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Authentication
The admin dashboard is protected with a simple login system:
- **Default Username**: `admin`
- **Default Password**: `admin123`

You can customize these credentials by setting environment variables:
```bash
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
```

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd careers-page-builder
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. **Seed the database with sample data:**
   ```bash
   npx tsx lib/seed.ts
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Admin Dashboard: http://localhost:3000 /admin
   - Sample Careers Page: http://localhost:3000/acme
   - Home Page: http://localhost:3000

## Usage

### Admin Dashboard

1. **Brand Settings** (`/admin`):
   - Set company name and URL slug
   - Upload logo and banner images
   - Choose primary and secondary colors
   - Preview your branding

2. **Content Sections** (`/admin/sections`):
   - Add About Us, Benefits, Values, and custom sections
   - Reorder sections with drag-and-drop
   - Toggle sections on/off
   - Rich text content with line breaks

3. **Jobs Management** (`/admin/jobs`):
   - Create job postings with detailed information
   - Set salary ranges, work types, and experience levels
   - Add tags and requirements
   - Toggle job visibility

### Public Careers Page

1. **Visit your careers page** at `/{your-slug}`
2. **Browse jobs** with real-time filtering
3. **Apply to positions** with a simple form
4. **View company information** in branded sections

## API Endpoints

### Admin APIs
- `GET/POST/PATCH /api/admin/company` - Company settings
- `GET/POST /api/admin/jobs` - Jobs management
- `PATCH/DELETE /api/admin/jobs/[id]` - Individual job operations

### Public APIs
- `POST /api/applications` - Submit job applications

## Database Schema

### Company
- Basic info (name, slug, description)
- Visual assets (logo, banner URLs)
- Brand colors (primary, secondary)
- Content sections (JSON array)

### Job
- Job details (title, location, department)
- Work type (on-site, remote, hybrid)
- Salary range and currency
- Requirements and tags arrays
- Active status

### Application
- Candidate information
- Job reference
- Resume URL and cover letter
- Application status

## Development

### Project Structure
```
careers-page-builder/
├── app/
│   ├── admin/           # Admin dashboard pages
│   ├── api/             # API routes
│   ├── [slug]/          # Dynamic careers pages
│   └── globals.css      # Global styles
├── components/
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── db.ts           # Database connection
│   ├── validations.ts  # Zod schemas
│   └── seed.ts         # Database seeding
└── prisma/
    └── schema.prisma   # Database schema
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Customization

### Brand Colors
The app uses CSS custom properties for dynamic theming:
```css
:root {
  --brand-primary: #3b82f6;
  --brand-secondary: #1e40af;
}
```

### Adding New Section Types
1. Update the `sectionTypes` array in `/app/admin/sections/page.tsx`
2. Add rendering logic in the careers page component
3. Update the Prisma schema if needed

### Styling
- Uses Tailwind CSS with custom design system
- shadcn/ui components for consistency
- Mobile-first responsive design
- Dark mode support (future enhancement)

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables if needed
3. Deploy automatically on push

### Other Platforms
1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Set up database (PostgreSQL for production)
4. Run migrations: `npx prisma migrate deploy`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

---

**Built with ❤️ using Next.js, Prisma, and shadcn/ui**