import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Company
  const company = await prisma.company.upsert({
    where: { domain: 'talentflow.ai' },
    update: {},
    create: {
      name: 'TalentFlow AI Corp',
      domain: 'talentflow.ai',
      plan: 'enterprise',
    },
  });

  // 2. Create Admin
  await prisma.user.upsert({
    where: { email_companyId: { email: 'admin@talentflow.ai', companyId: company.id } },
    update: { password: hashedPassword },
    create: {
      email: 'admin@talentflow.ai',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      companyId: company.id,
    },
  });

  // 3. Create RH User
  await prisma.user.upsert({
    where: { email_companyId: { email: 'hr@talentflow.ai', companyId: company.id } },
    update: { password: hashedPassword },
    create: {
      email: 'hr@talentflow.ai',
      password: hashedPassword,
      name: 'Sarah HR',
      role: 'RH',
      companyId: company.id,
    },
  });

  // 4. Create a Job
  await prisma.job.create({
    data: {
      title: 'Senior Fullstack Developer',
      description: 'Looking for a React/Node expert.',
      requirements: '5+ years experience, TS, Prisma.',
      salary: '80k - 120k',
      companyId: company.id,
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
