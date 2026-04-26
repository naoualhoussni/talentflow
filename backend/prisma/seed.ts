import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up database...');
  await prisma.auditLog.deleteMany();
  await prisma.documentRequest.deleteMany();
  await prisma.document.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.workflowState.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  // We keep the Company or delete it too
  await prisma.company.deleteMany();

  console.log('🌱 Seeding database...');

  // 1. Create Company
  const company = await prisma.company.upsert({
    where: { domain: 'techflow.ai' },
    update: {},
    create: {
      name: 'TechFlow AI Solutions',
      domain: 'techflow.ai',
      plan: 'premium',
    },
  });

  const companyId = company.id;
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. Create Users
  console.log('👤 Creating users...');
  const users = [
    { email: 'admin@techflow.ai', name: 'Admin User', role: 'SUPER_ADMIN' },
    { email: 'rh@techflow.ai', name: 'Sarah Miller', role: 'RH' },
    { email: 'manager@techflow.ai', name: 'David Chen', role: 'MANAGER' },
    { email: 'employee@techflow.ai', name: 'John Doe', role: 'EMPLOYEE' },
    { email: 'candidate@techflow.ai', name: 'Alice Smith', role: 'CANDIDATE' },
  ];

  for (const u of users) {
    // For the seed, we put everyone in the same company to avoid null issues with unique constraint
    await prisma.user.upsert({
      where: { email_companyId: { email: u.email, companyId: companyId } },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        role: u.role,
        companyId: companyId,
      },
    });
  }

  // 3. Create Jobs
  console.log('💼 Creating jobs...');
  const jobsData = [
    { title: 'Senior Fullstack Developer', department: 'Engineering', salary: '75k - 95k', requirements: 'React, Node.js, Prisma, PostgreSQL, 5+ years experience' },
    { title: 'Product Designer (UX/UI)', department: 'Product', salary: '60k - 80k', requirements: 'Figma, Design Systems, User Research, Portfolio required' },
    { title: 'HR Manager', department: 'HR', salary: '55k - 70k', requirements: 'HR Management, Recruitment, Labor Law, 3+ years experience' },
    { title: 'Data Scientist', department: 'Data', salary: '70k - 100k', requirements: 'Python, Machine Learning, SQL, Statistics' },
  ];

  const jobs = [];
  for (const j of jobsData) {
    const job = await prisma.job.create({
      data: {
        ...j,
        description: `Join our team as a ${j.title}. We are looking for a passionate professional to help us grow.`,
        companyId,
        status: 'OPEN',
      },
    });
    jobs.push(job);
  }

  // 4. Create Candidates
  console.log('👥 Creating candidates...');
  const candidatesData = [
    { name: 'Alice Smith', email: 'candidate@techflow.ai', jobId: jobs[0].id, experienceYears: 6, score: 85, status: 'EVALUATED' },
    { name: 'Bob Johnson', email: 'bob.j@outlook.com', jobId: jobs[0].id, experienceYears: 4, score: 72, status: 'CHATBOT_DONE' },
    { name: 'Charlie Davis', email: 'charlie.d@gmail.com', jobId: jobs[1].id, experienceYears: 3, score: 92, status: 'APPROVED' },
    { name: 'Diana Prince', email: 'diana.p@amazon.com', jobId: jobs[2].id, experienceYears: 8, score: 95, status: 'HIRED' },
    { name: 'Evan Wright', email: 'evan.w@gmail.com', jobId: jobs[3].id, experienceYears: 2, score: 65, status: 'APPLIED' },
  ];

  const candidates = [];
  for (const c of candidatesData) {
    const candidate = await prisma.candidate.create({
      data: {
        ...c,
        companyId,
        resumeText: `${c.name} resume content for ${c.jobId}. Expertise in ${jobs.find(j => j.id === c.jobId)?.title}.`,
        skills: JSON.stringify(['React', 'Node.js', 'Problem Solving']),
      },
    });
    candidates.push(candidate);
  }

  // 5. Create Evaluations
  console.log('📊 Creating evaluations...');
  const rhUser = await prisma.user.findFirst({ where: { role: 'RH', companyId } });
  if (rhUser) {
    await prisma.evaluation.create({
      data: {
        candidateId: candidates[0].id,
        evaluatorId: rhUser.id,
        companyId,
        technicalScore: 8,
        softSkillScore: 9,
        motivationScore: 10,
        globalScore: 9,
        notes: 'Excellent candidate with strong technical background.',
        feedback: 'Very impressive performance.',
        decision: 'APPROVE',
      },
    });
  }

  // 6. Create Employees
  console.log('👨‍💼 Creating employees...');
  const hiredCandidate = candidates.find(c => c.status === 'HIRED');
  if (hiredCandidate) {
    const emp = await prisma.employee.create({
      data: {
        candidateId: hiredCandidate.id,
        companyId,
        department: 'HR',
        position: 'HR Manager',
        salary: 65000,
        performanceScore: 4.5,
        riskLevel: 'LOW',
      },
    });

    // Ensure the user role is EMPLOYEE
    await prisma.user.updateMany({
      where: { email: hiredCandidate.email, companyId },
      data: { role: 'EMPLOYEE' }
    });
  }

  // 7. Create Document Requests
  console.log('📄 Creating document requests...');
  const employeeUser = await prisma.user.findFirst({ where: { role: 'EMPLOYEE', companyId } });
  if (employeeUser) {
    await prisma.documentRequest.createMany({
      data: [
        {
          userId: employeeUser.id,
          companyId,
          type: 'conge',
          title: 'Congé Annuel',
          description: 'Vacances d\'été',
          status: 'APPROVED',
          requestedAt: new Date('2026-04-10'),
          processedAt: new Date('2026-04-11'),
        },
        {
          userId: employeeUser.id,
          companyId,
          type: 'salaire',
          title: 'Fiche de Paie Mars',
          description: 'Demande de bulletin de salaire',
          status: 'PENDING',
          requestedAt: new Date(),
        },
      ],
    });
  }

  // 8. Specific simulation for the Candidate Dashboard (candidate@techflow.ai)
  console.log('🌟 Simulating rich data for Candidate Alice Smith...');
  // Add 2 more applications for Alice to show on her dashboard
  const candidateAlice = candidates[0]; // Alice Smith
  const extraJobs = jobs.slice(1, 3); // Product Designer and HR Manager
  
  for (const job of extraJobs) {
    await prisma.candidate.create({
      data: {
        name: 'Alice Smith',
        email: 'candidate@techflow.ai',
        jobId: job.id,
        experienceYears: 6,
        score: Math.floor(Math.random() * 30) + 65,
        status: job.title === 'HR Manager' ? 'APPLIED' : 'EVALUATED',
        companyId,
        resumeText: `Alice Smith resume for ${job.title}. Senior expertise.`,
        skills: JSON.stringify(['UI/UX', 'Management', 'HR']),
        aiSummary: "Profil complet avec une grande capacité d'adaptation."
      },
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
