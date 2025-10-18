# Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
1. Vercel account (free tier available)
2. GitHub repository with your code
3. PostgreSQL database (Vercel Postgres, Supabase, or PlanetScale)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Set up environment variables** (you'll do this in Vercel dashboard):
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   NEXTAUTH_SECRET=your-random-secret-key
   ```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com) and sign in**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - Framework Preset: Next.js
   - Root Directory: `careers-page-builder`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Set Up Database

**Option A: Vercel Postgres (Recommended)**
1. In your Vercel project dashboard
2. Go to "Storage" tab
3. Create a new Postgres database
4. Copy the connection string to `DATABASE_URL`

**Option B: Supabase (Free)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

**Option C: PlanetScale (Free)**
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Copy the connection string

### Step 4: Configure Environment Variables

In Vercel dashboard:
1. Go to "Settings" > "Environment Variables"
2. Add these variables:
   ```
   DATABASE_URL=your-database-connection-string
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   NEXTAUTH_SECRET=generate-a-random-string
   ```

### Step 5: Deploy and Seed Database

1. **Deploy the project** (Vercel will do this automatically)
2. **Run database migrations**:
   ```bash
   # In Vercel dashboard, go to Functions tab
   # Create a new serverless function to run migrations
   ```

3. **Seed the database** (optional):
   - You can create a simple API endpoint to seed data
   - Or use Vercel's CLI to run the seed script

### Step 6: Test Your Deployment

1. **Visit your deployed URL**
2. **Test the login** (admin/admin123)
3. **Create a company and jobs**
4. **View the public careers page**

## 🔧 Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes locally

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` is correct
   - Check if database allows connections from Vercel IPs

3. **Environment Variables**:
   - Make sure all required env vars are set
   - Redeploy after adding new environment variables

### Performance Optimization:

1. **Enable Vercel Analytics**:
   - Go to project settings
   - Enable Vercel Analytics

2. **Optimize Images**:
   - Use Next.js Image component
   - Consider using Vercel's Image Optimization

3. **Database Optimization**:
   - Add proper indexes
   - Use connection pooling

## 📊 Monitoring

1. **Vercel Dashboard**: Monitor deployments and performance
2. **Function Logs**: Check serverless function logs
3. **Database Monitoring**: Use your database provider's monitoring tools

## 🔒 Security Considerations

1. **Change default admin credentials**
2. **Use strong passwords**
3. **Enable HTTPS** (automatic with Vercel)
4. **Regular security updates**

## 🚀 Going Live

Once deployed:
1. **Test all functionality**
2. **Update DNS** if using custom domain
3. **Set up monitoring and alerts**
4. **Create backup strategy for database**
