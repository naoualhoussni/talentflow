import prisma from './prisma';

async function check() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true, name: true }
  });
  console.log('USERS IN DB:', JSON.stringify(users, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
