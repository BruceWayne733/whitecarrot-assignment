const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up Careers Page Builder...\n');

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔧 Installing additional required packages...');
  execSync('npm install autoprefixer', { stdio: 'inherit' });
  
  console.log('\n🗄️  Setting up database...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  console.log('\n🌱 Seeding database...');
  try {
    execSync('npx tsx lib/seed.ts', { stdio: 'inherit' });
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.log('⚠️  Database seeding failed, but you can run it manually later with: npm run db:seed');
  }
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000/admin');
  console.log('3. View sample page: http://localhost:3000/acme');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
