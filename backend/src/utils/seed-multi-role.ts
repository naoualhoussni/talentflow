import prisma from './prisma';

const seedData = async () => {
  console.log('Starting multi-role data seeding...');

  try {
    // Clean existing data
    await prisma.auditLog.deleteMany();
    await prisma.eventLog.deleteMany();
    await prisma.workflowState.deleteMany();
    await prisma.document.deleteMany();
    await prisma.evaluation.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.candidate.deleteMany();
    await prisma.job.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();

    // Create main company
    const company = await prisma.company.create({
      data: {
        name: 'TechCorp Solutions',
        domain: 'techcorp.fr',
        plan: 'premium'
      }
    });

    console.log('Created company:', company.name);

    // Create users for each role
    const users = {
      admin: await prisma.user.create({
        data: {
          email: 'admin@techcorp.fr',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflLxQxe', // password123
          name: 'Jean Dupont',
          role: 'ADMIN',
          companyId: company.id
        }
      }),
      
      rh: await prisma.user.create({
        data: {
          email: 'rh@techcorp.fr',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflLxQxe', // password123
          name: 'Marie Laurent',
          role: 'RH',
          companyId: company.id
        }
      }),
      
      manager1: await prisma.user.create({
        data: {
          email: 'manager.tech@techcorp.fr',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflLxQxe', // password123
          name: 'Thomas Bernard',
          role: 'MANAGER',
          companyId: company.id
        }
      }),
      
      manager2: await prisma.user.create({
        data: {
          email: 'manager.marketing@techcorp.fr',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflLxQxe', // password123
          name: 'Sophie Martin',
          role: 'MANAGER',
          companyId: company.id
        }
      }),
      
      employee1: await prisma.user.create({
        data: {
          email: 'dev1@techcorp.fr',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflLxQxe', // password123
          name: 'Lucas Petit',
          role: 'CANDIDATE',
          companyId: company.id
        }
      }),
      
      employee2: await prisma.user.create({
        data: {
          email: 'dev2@techcorp.fr',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflLxQxe', // password123
          name: 'Emma Rousseau',
          role: 'CANDIDATE',
          companyId: company.id
        }
      })
    };

    console.log('Created users for all roles');

    // Create job positions
    const jobs = await Promise.all([
      prisma.job.create({
        data: {
          title: 'Développeur Full Stack Senior',
          description: 'Nous recherchons un développeur expérimenté pour rejoindre notre équipe produit',
          requirements: 'React, Node.js, TypeScript, 5+ ans expérience, MongoDB, PostgreSQL',
          department: 'Technique',
          salary: '55k-65k',
          status: 'OPEN',
          companyId: company.id
        }
      }),
      
      prisma.job.create({
        data: {
          title: 'Chef de Projet Digital',
          description: 'Lead digital projects and coordinate cross-functional teams',
          requirements: '5+ years project management, Agile/Scrum, digital transformation',
          department: 'Marketing',
          salary: '45k-55k',
          status: 'OPEN',
          companyId: company.id
        }
      }),
      
      prisma.job.create({
        data: {
          title: 'Data Analyst',
          description: 'Analyze complex datasets and provide actionable insights',
          requirements: 'Python, SQL, Tableau, Statistics, 3+ years experience',
          department: 'Data',
          salary: '40k-50k',
          status: 'OPEN',
          companyId: company.id
        }
      })
    ]);

    console.log('Created job positions');

    // Create candidates with different statuses
    const candidates = await Promise.all([
      // Applied candidates
      prisma.candidate.create({
        data: {
          name: 'Alexandre Dubois',
          email: 'alex.dubois@email.com',
          phone: '06 12 34 56 78',
          resumeText: 'Développeur avec 6 ans expérience en React et Node.js. Expert en TypeScript, passionné par les architectures microservices. Projet récent : refonte complète d\'une plateforme e-commerce.',
          skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'CI/CD']),
          experienceYears: 6,
          score: 85,
          status: 'APPLIED',
          jobId: jobs[0].id,
          companyId: company.id,
          aiSummary: 'Excellent profil technique avec forte expérience en full stack. Bonne adéquation avec le poste.'
        }
      }),
      
      prisma.candidate.create({
        data: {
          name: 'Camille Leroy',
          email: 'camille.leroy@email.com',
          phone: '06 98 76 54 32',
          resumeText: 'Chef de projet avec 7 ans expérience en transformation digitale. Certifié PMP, expert en méthodologies Agiles. Leadership d\'équipes de 15 personnes.',
          skills: JSON.stringify(['Project Management', 'Agile', 'Scrum', 'Digital Transformation', 'Team Leadership', 'PMP']),
          experienceYears: 7,
          score: 92,
          status: 'EVALUATED',
          jobId: jobs[1].id,
          companyId: company.id,
          aiSummary: 'Profile exceptionnel avec solide expérience en management de projet digital.'
        }
      }),
      
      // Approved candidates
      prisma.candidate.create({
        data: {
          name: 'Nicolas Mercier',
          email: 'n.mercier@email.com',
          phone: '06 45 67 89 01',
          resumeText: 'Data analyst avec 4 ans expérience. Spécialisé en Python et SQL. Projets : dashboard KPI, prédictions ventes, analyse comportement client.',
          skills: JSON.stringify(['Python', 'SQL', 'Tableau', 'Power BI', 'Statistics', 'Machine Learning']),
          experienceYears: 4,
          score: 78,
          status: 'APPROVED',
          jobId: jobs[2].id,
          companyId: company.id,
          aiSummary: 'Bon profil data analyst avec compétences solides en analyse et visualisation.'
        }
      }),
      
      // Rejected candidates
      prisma.candidate.create({
        data: {
          name: 'Julie Fernandez',
          email: 'julie.fernandez@email.com',
          phone: '06 23 45 67 89',
          resumeText: 'Débutant en développement, formation de 6 mois en JavaScript. Projets personnels : site vitrine, todo list.',
          skills: JSON.stringify(['JavaScript', 'HTML', 'CSS', 'Git']),
          experienceYears: 0,
          score: 35,
          status: 'REJECTED',
          jobId: jobs[0].id,
          companyId: company.id,
          aiSummary: 'Manque d\'expérience pour le poste senior. Potentiel à développer.'
        }
      })
    ]);

    console.log('Created candidates with different statuses');

    // Create employees (approved candidates converted to employees)
    const employees = await Promise.all([
      prisma.employee.create({
        data: {
          candidateId: candidates[2].id, // Nicolas Mercier
          companyId: company.id,
          department: 'Data',
          position: 'Data Analyst',
          salary: 45000,
          performanceScore: 85,
          riskScore: 15,
          riskLevel: 'LOW',
          status: 'ACTIVE'
        }
      }),
      
      prisma.employee.create({
        data: {
          candidateId: candidates[1].id, // Camille Leroy  
          companyId: company.id,
          department: 'Marketing',
          position: 'Chef de Projet Digital',
          salary: 55000,
          performanceScore: 92,
          riskScore: 8,
          riskLevel: 'LOW',
          status: 'ACTIVE'
        }
      })
    ]);

    console.log('Created employees');

    // Create workflow states for candidates
    await Promise.all([
      prisma.workflowState.create({
        data: {
          candidateId: candidates[0].id,
          companyId: company.id,
          state: 'APPLIED',
          history: JSON.stringify([
            { state: 'APPLIED', at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Candidature reçue' }
          ])
        }
      }),
      
      prisma.workflowState.create({
        data: {
          candidateId: candidates[1].id,
          companyId: company.id,
          state: 'EVALUATED',
          history: JSON.stringify([
            { state: 'APPLIED', at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), note: 'Candidature reçue' },
            { state: 'CHATBOT_DONE', at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), note: 'Entretien chatbot terminé' },
            { state: 'EVALUATED', at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Évaluation technique positive' }
          ])
        }
      }),
      
      prisma.workflowState.create({
        data: {
          candidateId: candidates[2].id,
          companyId: company.id,
          state: 'EMPLOYEE',
          history: JSON.stringify([
            { state: 'APPLIED', at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), note: 'Candidature reçue' },
            { state: 'CHATBOT_DONE', at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), note: 'Entretien chatbot réussi' },
            { state: 'EVALUATED', at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), note: 'Évaluation excellente' },
            { state: 'APPROVED', at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Approuvé pour embauche' },
            { state: 'EMPLOYEE', at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Intégré comme employé' }
          ])
        }
      })
    ]);

    console.log('Created workflow states');

    // Create evaluations
    await Promise.all([
      prisma.evaluation.create({
        data: {
          candidateId: candidates[0].id,
          evaluatorId: users.rh.id,
          companyId: company.id,
          technicalScore: 85,
          softSkillScore: 80,
          motivationScore: 90,
          globalScore: 85,
          notes: 'Excellent profil technique, bonne motivation',
          feedback: 'Recommandé pour entretien technique approfondi',
          decision: 'CONSIDER'
        }
      }),
      
      prisma.evaluation.create({
        data: {
          candidateId: candidates[1].id,
          evaluatorId: users.manager1.id,
          companyId: company.id,
          technicalScore: 88,
          softSkillScore: 95,
          motivationScore: 92,
          globalScore: 92,
          notes: 'Leadership confirmé, excellente communication',
          feedback: 'Profil idéal pour le poste',
          decision: 'HIRE'
        }
      })
    ]);

    console.log('Created evaluations');

    // Create documents
    await Promise.all([
      prisma.document.create({
        data: {
          type: 'CONTRACT',
          title: 'Contrat de travail - Nicolas Mercier',
          content: 'Contrat à durée indéterminée pour le poste de Data Analyst...',
          candidateId: candidates[2].id,
          companyId: company.id,
          status: 'SIGNED'
        }
      }),
      
      prisma.document.create({
        data: {
          type: 'OFFER',
          title: 'Offre d\'emploi - Camille Leroy',
          content: 'Offre pour le poste de Chef de Projet Digital...',
          candidateId: candidates[1].id,
          companyId: company.id,
          status: 'GENERATED'
        }
      })
    ]);

    console.log('Created documents');

    console.log('\n=== SEEDING COMPLETED ===');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@techcorp.fr / password123');
    console.log('RH: rh@techcorp.fr / password123');
    console.log('Manager Tech: manager.tech@techcorp.fr / password123');
    console.log('Manager Marketing: manager.marketing@techcorp.fr / password123');
    console.log('Candidate: dev1@techcorp.fr / password123');
    console.log('Candidate: dev2@techcorp.fr / password123');
    console.log('\n=== DATA SUMMARY ===');
    console.log(`Company: ${company.name}`);
    console.log(`Users: ${Object.keys(users).length}`);
    console.log(`Jobs: ${jobs.length}`);
    console.log(`Candidates: ${candidates.length}`);
    console.log(`Employees: ${employees.length}`);
    console.log('\nChatbot is now functional with mock responses!');

  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
};

seedData()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
