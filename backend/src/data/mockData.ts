// Données simulées pour TalentFlow-AI
export const mockUsers = [
  // RH Users
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@talentflow.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.', // password: "rh123"
    role: 'RH',
    companyId: '1',
    department: 'Ressources Humaines',
    createdAt: new Date('2026-01-15'),
    lastLogin: new Date('2026-04-20'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 1 23 45 67 89',
      address: '123 Rue de la République, 75001 Paris',
      skills: ['Recrutement', 'Gestion de carrière', 'Analyse RH', 'Droit du travail'],
      experience: 8,
      education: ['Master RH', 'Certification Coaching']
    }
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@talentflow.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.',
    role: 'MANAGER',
    companyId: '1',
    department: 'Développement',
    createdAt: new Date('2026-02-01'),
    lastLogin: new Date('2026-04-19'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 1 23 45 67 90',
      address: '456 Avenue des Champs-Élysées, 75008 Paris',
      skills: ['Management', 'Agile', 'React', 'Node.js', 'Leadership'],
      experience: 12,
      education: ['Engineering Degree', 'MBA']
    }
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'pierre.durand@talentflow.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.',
    role: 'ADMIN',
    companyId: '1',
    department: 'IT',
    createdAt: new Date('2026-01-10'),
    lastLogin: new Date('2026-04-20'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 1 23 45 67 91',
      address: '789 Boulevard Saint-Germain, 75006 Paris',
      skills: ['System Administration', 'Security', 'Cloud', 'DevOps'],
      experience: 10,
      education: ['Computer Science Degree', 'AWS Certification']
    }
  },
  {
    id: '4',
    name: 'Sophie Petit',
    email: 'sophie.petit@talentflow.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.',
    role: 'SUPER_ADMIN',
    companyId: '1',
    department: 'Direction',
    createdAt: new Date('2026-01-05'),
    lastLogin: new Date('2026-04-20'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 1 23 45 67 92',
      address: '321 Rue de la Paix, 75002 Paris',
      skills: ['Strategic Management', 'Leadership', 'Finance', 'Operations'],
      experience: 15,
      education: ['MBA', 'PhD in Business Administration']
    }
  },
  // Employees
  {
    id: '5',
    name: 'Thomas Bernard',
    email: 'thomas.bernard@talentflow.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.',
    role: 'EMPLOYEE',
    companyId: '1',
    department: 'Développement',
    createdAt: new Date('2026-03-01'),
    lastLogin: new Date('2026-04-19'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 1 23 45 67 93',
      address: '654 Rue de Rivoli, 75004 Paris',
      skills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
      experience: 3,
      education: ['Bachelor in Computer Science']
    }
  },
  {
    id: '6',
    name: 'Camille Leroy',
    email: 'camille.leroy@talentflow.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.',
    role: 'EMPLOYEE',
    companyId: '1',
    department: 'Marketing',
    createdAt: new Date('2026-02-15'),
    lastLogin: new Date('2026-04-18'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 1 23 45 67 94',
      address: '987 Avenue Foch, 75016 Paris',
      skills: ['Digital Marketing', 'SEO', 'Content Creation', 'Analytics'],
      experience: 4,
      education: ['Marketing Degree']
    }
  },
  {
    id: '7',
    name: 'Nicolas Rousseau',
    email: 'nicolas.rousseau@talentflow.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.',
    role: 'EMPLOYEE',
    companyId: '1',
    department: 'Support',
    createdAt: new Date('2026-01-20'),
    lastLogin: new Date('2026-04-17'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 1 23 45 67 95',
      address: '147 Rue de la Tour, 75007 Paris',
      skills: ['Customer Support', 'Troubleshooting', 'Communication'],
      experience: 2,
      education: ['High School Diploma']
    }
  },
  {
    id: '8',
    name: 'Isabelle Moreau',
    email: 'isabelle.moreau@talentflow.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.',
    role: 'EMPLOYEE',
    companyId: '1',
    department: 'Finance',
    createdAt: new Date('2026-02-10'),
    lastLogin: new Date('2026-04-16'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 1 23 45 67 96',
      address: '258 Boulevard Haussmann, 75009 Paris',
      skills: ['Accounting', 'Excel', 'Financial Analysis', 'Reporting'],
      experience: 5,
      education: ['Finance Degree']
    }
  },
  // Candidates
  {
    id: '9',
    name: 'David Laurent',
    email: 'david.laurent@email.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.',
    role: 'CANDIDATE',
    companyId: null,
    department: null,
    createdAt: new Date('2026-03-15'),
    lastLogin: new Date('2026-04-19'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 6 12 34 56 78',
      address: '369 Rue de la Pompe, 75116 Paris',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      experience: 4,
      education: ['Master in Computer Science']
    }
  },
  {
    id: '10',
    name: 'Emma Garcia',
    email: 'emma.garcia@email.com',
    password: '$2b$12$DIdFNlVj8xQGvJLbOKonCOcgpMsWsitZwzt.4VF3svvDAYyM1XGi.',
    role: 'CANDIDATE',
    companyId: null,
    department: null,
    createdAt: new Date('2026-03-20'),
    lastLogin: new Date('2026-04-18'),
    status: 'ACTIVE',
    profile: {
      phone: '+33 6 23 45 67 89',
      address: '741 Avenue des Ternes, 75117 Paris',
      skills: ['UX Design', 'Figma', 'User Research', 'Prototyping'],
      experience: 3,
      education: ['Design Degree']
    }
  }
];

export const mockCompanies = [
  {
    id: '1',
    name: 'TalentFlow Solutions',
    domain: 'talentflow.com',
    plan: 'ENTERPRISE',
    createdAt: new Date('2026-01-01'),
    userCount: 8,
    status: 'ACTIVE',
    settings: {
      maxUsers: 50,
      features: ['AI Matching', 'Document Management', 'Analytics', 'Chatbot'],
      customBranding: true
    }
  },
  {
    id: '2',
    name: 'TechCorp Innovation',
    domain: 'techcorp.com',
    plan: 'PRO',
    createdAt: new Date('2026-02-01'),
    userCount: 25,
    status: 'ACTIVE',
    settings: {
      maxUsers: 30,
      features: ['AI Matching', 'Document Management', 'Analytics'],
      customBranding: false
    }
  }
];

export const mockJobs = [
  {
    id: '1',
    title: 'Développeur Full Stack Senior',
    description: 'Nous recherchons un développeur full stack senior pour rejoindre notre équipe R&D. Vous travaillerez sur des projets innovants en utilisant les dernières technologies.',
    requirements: ['5+ ans d\'expérience', 'React/Node.js', 'TypeScript', 'MongoDB'],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
    experience: 5,
    salary: { min: 55000, max: 75000, currency: 'EUR' },
    location: 'Paris',
    type: 'FULL_TIME',
    status: 'ACTIVE',
    companyId: '1',
    createdBy: '1',
    createdAt: new Date('2026-04-01'),
    applications: ['9', '10']
  },
  {
    id: '2',
    title: 'UX Designer',
    description: 'Rejoignez notre équipe design pour créer des expériences utilisateur exceptionnelles. Vous travaillerez en étroite collaboration avec les développeurs et les product managers.',
    requirements: ['3+ ans d\'expérience', 'Figma', 'User Research', 'Portfolio'],
    skills: ['UX Design', 'Figma', 'User Research', 'Prototyping', 'Adobe Creative Suite'],
    experience: 3,
    salary: { min: 45000, max: 60000, currency: 'EUR' },
    location: 'Paris',
    type: 'FULL_TIME',
    status: 'ACTIVE',
    companyId: '1',
    createdBy: '1',
    createdAt: new Date('2026-04-05'),
    applications: ['10']
  },
  {
    id: '3',
    title: 'Data Scientist',
    description: 'Nous cherchons un data scientist pour développer des modèles de machine learning et analyser des données complexes pour améliorer nos produits.',
    requirements: ['Master/PhD en data science', 'Python', 'Machine Learning', 'Statistics'],
    skills: ['Python', 'TensorFlow', 'Scikit-learn', 'SQL', 'Data Visualization'],
    experience: 4,
    salary: { min: 60000, max: 85000, currency: 'EUR' },
    location: 'Paris',
    type: 'FULL_TIME',
    status: 'ACTIVE',
    companyId: '1',
    createdBy: '1',
    createdAt: new Date('2026-04-10'),
    applications: ['9']
  }
];

export const mockApplications = [
  {
    id: '1',
    jobId: '1',
    candidateId: '9',
    status: 'SCREENING',
    appliedAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-04-18'),
    notes: 'Candidat très prometteur avec une bonne expérience technique',
    documents: {
      cv: '/documents/cv_david_laurent.pdf',
      coverLetter: '/documents/letter_david_laurent.pdf',
      portfolio: 'https://davidlaurent.dev'
    },
    matchingScore: 87,
    interviewDates: [new Date('2026-04-25')]
  },
  {
    id: '2',
    jobId: '1',
    candidateId: '10',
    status: 'APPLIED',
    appliedAt: new Date('2026-04-18'),
    updatedAt: new Date('2026-04-18'),
    notes: 'Profil intéressant mais expérience technique limitée',
    documents: {
      cv: '/documents/cv_emma_garcia.pdf',
      coverLetter: '/documents/letter_emma_garcia.pdf'
    },
    matchingScore: 72,
    interviewDates: []
  },
  {
    id: '3',
    jobId: '2',
    candidateId: '10',
    status: 'INTERVIEW',
    appliedAt: new Date('2026-04-12'),
    updatedAt: new Date('2026-04-20'),
    notes: 'Excellent portfolio, bonne culture design',
    documents: {
      cv: '/documents/cv_emma_garcia.pdf',
      coverLetter: '/documents/letter_emma_garcia.pdf',
      portfolio: 'https://emmagarcia.design'
    },
    matchingScore: 91,
    interviewDates: [new Date('2026-04-22')]
  },
  {
    id: '4',
    jobId: '3',
    candidateId: '9',
    status: 'INTERVIEW',
    appliedAt: new Date('2026-04-08'),
    updatedAt: new Date('2026-04-19'),
    notes: 'Forte compétence en machine learning',
    documents: {
      cv: '/documents/cv_david_laurent.pdf',
      coverLetter: '/documents/letter_david_laurent.pdf'
    },
    matchingScore: 89,
    interviewDates: [new Date('2026-04-23')]
  }
];

export const mockDocuments = [
  // Employee documents
  {
    id: '1',
    type: 'CONGE',
    title: 'Congé Annuel 2026',
    description: 'Demande de congé payé pour vacances d\'été',
    status: 'APPROVED',
    requestedBy: '5',
    approvedBy: '1',
    requestedAt: new Date('2026-04-01'),
    processedAt: new Date('2026-04-05'),
    documentUrl: '/documents/conge_thomas_2026.pdf',
    urgency: 'NORMAL',
    rejectionReason: null
  },
  {
    id: '2',
    type: 'MUTUELLE',
    title: 'Attestation Mutuelle',
    description: 'Attestation de couverture santé mutuelle pour prêt bancaire',
    status: 'APPROVED',
    requestedBy: '6',
    approvedBy: '1',
    requestedAt: new Date('2026-03-15'),
    processedAt: new Date('2026-03-18'),
    documentUrl: '/documents/mutuelle_camille_2026.pdf',
    urgency: 'NORMAL',
    rejectionReason: null
  },
  {
    id: '3',
    type: 'PAIE',
    title: 'Fiche de Paie Mars 2026',
    description: 'Bulletin de salaire du mois de mars 2026',
    status: 'GENERATED',
    requestedBy: '8',
    approvedBy: null,
    requestedAt: new Date('2026-04-10'),
    processedAt: new Date('2026-04-10'),
    documentUrl: '/documents/paie_isabelle_mars_2026.pdf',
    urgency: 'NORMAL',
    rejectionReason: null
  },
  {
    id: '4',
    type: 'ATTESTATION',
    title: 'Attestation de Travail',
    description: 'Attestation de travail pour démarches personnelles',
    status: 'PENDING',
    requestedBy: '7',
    approvedBy: null,
    requestedAt: new Date('2026-04-20'),
    processedAt: null,
    documentUrl: null,
    urgency: 'URGENT',
    rejectionReason: null
  },
  {
    id: '5',
    type: 'FORMATION',
    title: 'Certification React Avancé',
    description: 'Demande de prise en charge pour certification React',
    status: 'PENDING',
    requestedBy: '5',
    approvedBy: null,
    requestedAt: new Date('2026-04-18'),
    processedAt: null,
    documentUrl: null,
    urgency: 'NORMAL',
    rejectionReason: null
  }
];

export const mockPerformanceData = [
  {
    employeeId: '5',
    performance: 4,
    potential: 4,
    lastReview: new Date('2026-03-15'),
    nextReview: new Date('2026-09-15'),
    skills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
    riskLevel: 'LOW',
    goals: [
      { title: 'Master TypeScript', progress: 75, target: new Date('2026-06-30') },
      { title: 'Lead small project', progress: 40, target: new Date('2026-08-31') }
    ]
  },
  {
    employeeId: '6',
    performance: 5,
    potential: 5,
    lastReview: new Date('2026-02-20'),
    nextReview: new Date('2026-08-20'),
    skills: ['Digital Marketing', 'SEO', 'Content Creation', 'Analytics'],
    riskLevel: 'LOW',
    goals: [
      { title: 'Improve SEO rankings', progress: 85, target: new Date('2026-05-31') },
      { title: 'Launch new campaign', progress: 60, target: new Date('2026-07-15') }
    ]
  },
  {
    employeeId: '7',
    performance: 3,
    potential: 4,
    lastReview: new Date('2026-01-10'),
    nextReview: new Date('2026-07-10'),
    skills: ['Customer Support', 'Troubleshooting', 'Communication'],
    riskLevel: 'MEDIUM',
    goals: [
      { title: 'Improve response time', progress: 50, target: new Date('2026-06-30') },
      { title: 'Learn technical skills', progress: 30, target: new Date('2026-09-30') }
    ]
  },
  {
    employeeId: '8',
    performance: 4,
    potential: 3,
    lastReview: new Date('2026-03-10'),
    nextReview: new Date('2026-09-10'),
    skills: ['Accounting', 'Excel', 'Financial Analysis', 'Reporting'],
    riskLevel: 'LOW',
    goals: [
      { title: 'Advanced Excel training', progress: 90, target: new Date('2026-04-30') },
      { title: 'Improve reporting accuracy', progress: 70, target: new Date('2026-06-30') }
    ]
  }
];

export const mockChatbotResponses = {
  greetings: [
    'Bonjour ! Je suis votre assistant TalentFlow. Comment puis-je vous aider aujourd\'hui ?',
    'Salut ! Je suis là pour vous accompagner dans votre expérience TalentFlow.',
    'Hello ! Je suis votre coach IA personnel. Posez-moi vos questions !'
  ],
  help: [
    'Je peux vous aider avec :\n\n\u2022 Questions selon votre rôle\n\u2022 Conversation continue\n\u2022 Recherche d\'informations\n\u2022 Statistiques et rapports\n\nPosez-moi une question spécifique !',
    'Mes compétences incluent :\n\n\u2022 Aide au recrutement\n\u2022 Gestion de carrière\n\u2022 Analyse de performance\n\u2022 Support technique',
    'Je suis votre assistant pour :\n\n\u2022 RH : Recrutement et gestion\n\u2022 Managers : Équipe et performance\n\u2022 Employés : Carrière et documents\n\u2022 Candidats : Préparation entretiens'
  ],
  thanks: [
    'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. Je suis là pour vous aider !',
    'Je vous en prie ! C\'est un plaisir de vous accompagner dans votre parcours TalentFlow.',
    'Super ! N\'hésitez pas à revenir si vous avez besoin d\'aide.'
  ],
  statistics: {
    RH: 'Voici les statistiques RH disponibles :\n\n\ud83d\udcca Recrutement : 156 candidats, 24 en entretien\n\ud83d\udc65 Employés actifs : 142/156\n\ud83d\udcc8 Taux de conversion : 78%\n\nSouhaitez-vous un rapport détaillé ?',
    MANAGER: 'Statistiques équipe :\n\n\ud83d\udcaa Performance moyenne : 4.2/5\n\ud83c\udfaf Objectifs atteints : 85%\n\ud83d\udcc8 Progression : +12%\n\nBesoin de détails spécifiques ?',
    EMPLOYEE: 'Vos statistiques personnelles :\n\n\ud83d\udcda Documents : 5 approuvés\n\ud83c\udfc6 Performance : 4.5/5\n\ud83d\udcc5 Prochaine évaluation : 15/09/2026',
    CANDIDATE: 'Vos statistiques candidature :\n\n\ud83d\udce2 3 candidatures actives\n\ud83d\udccd 2 entretiens programmés\n\ud83c\udfaf Taux de réponse : 67%'
  },
  contact: 'Pour contacter le support TalentFlow :\n\n\ud83d\udce7 Email : support@talentflow.ai\n\ud83d\udcde Téléphone : 01 23 45 67 89\n\ud83d\udcac Chat en direct : 24/7\n\n\u26a0\ufe0f Urgence ? Mentionnez "URGENT" dans votre message'
};

// Helper functions
export const getRandomUser = (role?: string) => {
  const users = role ? mockUsers.filter(u => u.role === role) : mockUsers;
  return users[Math.floor(Math.random() * users.length)];
};

export const getRandomJob = () => {
  return mockJobs[Math.floor(Math.random() * mockJobs.length)];
};

export const getRandomApplication = () => {
  return mockApplications[Math.floor(Math.random() * mockApplications.length)];
};

export const getPerformanceData = (employeeId: string) => {
  return mockPerformanceData.find(p => p.employeeId === employeeId);
};

export const getChatbotResponse = (message: string, userRole: string) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
    return mockChatbotResponses.greetings[Math.floor(Math.random() * mockChatbotResponses.greetings.length)];
  }
  
  if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
    return mockChatbotResponses.help[Math.floor(Math.random() * mockChatbotResponses.help.length)];
  }
  
  if (lowerMessage.includes('merci') || lowerMessage.includes('thanks')) {
    return mockChatbotResponses.thanks[Math.floor(Math.random() * mockChatbotResponses.thanks.length)];
  }
  
  if (lowerMessage.includes('statistiques') || lowerMessage.includes('stats')) {
    return (mockChatbotResponses.statistics as Record<string, string>)[userRole] || mockChatbotResponses.statistics.RH;
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
    return mockChatbotResponses.contact;
  }
  
  return null;
};
