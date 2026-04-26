require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'rh@techcorp.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm',
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
    email: 'manager@techcorp.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm',
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
    email: 'employee@techcorp.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm',
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
    id: '4',
    name: 'David Laurent',
    email: 'david.laurent@email.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm',
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
  }
];

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'talentflow-security-key-2025';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory database
let users = [...mockUsers];

// Helper functions
const findUserByEmail = (email) => users.find(u => u.email === email);
const findUserById = (id) => users.find(u => u.id === id);
const generateToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Chatbot responses
const getChatbotResponse = (message, userRole) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
    return `Bonjour ! Je suis votre assistant TalentFlow. Comment puis-je vous aider aujourd'hui ?`;
  }
  
  if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
    return `Je peux vous aider avec :\n\n\u2022 Questions selon votre rôle\n\u2022 Conversation continue\n\u2022 Recherche d'informations\n\u2022 Statistiques et rapports\n\nPosez-moi une question spécifique !`;
  }
  
  if (lowerMessage.includes('merci') || lowerMessage.includes('thanks')) {
    return `Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Je suis là pour vous aider à optimiser votre expérience avec TalentFlow. \ud83d\ude0a`;
  }
  
  if (lowerMessage.includes('statistiques') || lowerMessage.includes('stats')) {
    if (userRole === 'RH') {
      return `Voici les statistiques RH disponibles :\n\n\ud83d\udcca Recrutement : 156 candidats, 24 en entretien\n\ud83d\udc65 Employés actifs : 142/156\n\ud83d\udcc8 Taux de conversion : 78%\n\nSouhaitez-vous un rapport détaillé ?`;
    }
    return `Je peux générer des statistiques personnalisées selon votre rôle. Que souhaitez-vous savoir exactement ?`;
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
    return `Pour contacter le support TalentFlow :\n\n\ud83d\udce7 Email : support@talentflow.ai\n\ud83d\udcde Téléphone : 01 23 45 67 89\n\ud83d\udcac Chat en direct : 24/7\n\n\u26a0\ufe0f Urgence ? Mentionnez "URGENT" dans votre message`;
  }
  
  return null;
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'TalentFlow-AI', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = findUserByEmail(email);
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For demo purposes, accept password "password123" for all mock users
    let valid = false;
    if (password === 'password123') {
      valid = true;
    } else {
      try {
        valid = await bcrypt.compare(password, user.password);
      } catch (err) {
        console.log('Password comparison error:', err);
        valid = false;
      }
    }
    
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    console.log('Login successful for:', email);
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, companyId: user.companyId },
    });
  } catch (error) {
    console.error('[auth] login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, companyId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: hashedPassword,
      role: role || 'CANDIDATE',
      companyId: companyId || null,
      department: null,
      createdAt: new Date(),
      lastLogin: new Date(),
      status: 'ACTIVE',
      profile: {
        phone: '',
        address: '',
        skills: [],
        experience: 0,
        education: []
      }
    };

    users.push(newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, companyId: newUser.companyId },
    });
  } catch (error) {
    console.error('[auth] register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    const { role, companyId } = req.query;
    let filteredUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      companyId: u.companyId,
      department: u.department,
      status: u.status,
      createdAt: u.createdAt,
      profile: u.profile
    }));

    if (role) {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }
    if (companyId) {
      filteredUsers = filteredUsers.filter(u => u.companyId === companyId);
    }

    return res.json(filteredUsers);
  } catch (error) {
    console.error('[users] get error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Jobs routes
app.get('/api/jobs', async (req, res) => {
  try {
    const mockJobs = [
      {
        id: '1',
        title: 'Développeur Full Stack Senior',
        description: 'Nous recherchons un développeur full stack senior pour rejoindre notre équipe R&D.',
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
      }
    ];

    const { companyId } = req.query;
    let filteredJobs = mockJobs;

    if (companyId) {
      filteredJobs = filteredJobs.filter(j => j.companyId === companyId);
    }

    return res.json(filteredJobs);
  } catch (error) {
    console.error('[jobs] get error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Applications routes
app.get('/api/applications', async (req, res) => {
  try {
    const mockApplications = [
      {
        id: '1',
        jobId: '1',
        candidateId: '4',
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
      }
    ];

    const { jobId, candidateId } = req.query;
    let filteredApplications = mockApplications;

    if (jobId) {
      filteredApplications = filteredApplications.filter(a => a.jobId === jobId);
    }
    if (candidateId) {
      filteredApplications = filteredApplications.filter(a => a.candidateId === candidateId);
    }

    return res.json(filteredApplications);
  } catch (error) {
    console.error('[applications] get error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Documents routes
app.get('/api/documents', async (req, res) => {
  try {
    const mockDocuments = [
      {
        id: '1',
        type: 'CONGE',
        title: 'Congé Annuel 2026',
        description: 'Demande de congé payé pour vacances d\'été',
        status: 'APPROVED',
        requestedBy: '3',
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
        status: 'PENDING',
        requestedBy: '3',
        approvedBy: null,
        requestedAt: new Date('2026-04-20'),
        processedAt: null,
        documentUrl: null,
        urgency: 'URGENT',
        rejectionReason: null
      }
    ];

    const { requestedBy, status } = req.query;
    let filteredDocuments = mockDocuments;

    if (requestedBy) {
      filteredDocuments = filteredDocuments.filter(d => d.requestedBy === requestedBy);
    }
    if (status) {
      filteredDocuments = filteredDocuments.filter(d => d.status === status);
    }

    return res.json(filteredDocuments);
  } catch (error) {
    console.error('[documents] get error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { userRole, companyId } = req.query;
    
    const filteredUsers = companyId ? users.filter(u => u.companyId === companyId) : users;
    
    const stats = {
      totalUsers: filteredUsers.length,
      activeUsers: filteredUsers.filter(u => u.status === 'ACTIVE').length,
      totalJobs: 3,
      activeJobs: 2,
      totalApplications: 4,
      pendingApplications: 1,
      screeningApplications: 1,
      interviewApplications: 1,
      offerApplications: 0,
      hiredApplications: 1,
      rejectedApplications: 1,
      conversionRate: 25
    };

    return res.json(stats);
  } catch (error) {
    console.error('[dashboard] stats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Chatbot route
app.post('/api/ai/chatbot', async (req, res) => {
  try {
    const { message, userRole } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Check for automatic responses first
    const automaticResponse = getChatbotResponse(message, userRole);
    if (automaticResponse) {
      return res.json({ response: automaticResponse });
    }

    // Fallback response
    const fallbackResponse = getChatbotResponse(message, userRole) || 
      'Désolé, je rencontre des difficultés techniques. Veuillez réessayer ultérieurement.';

    return res.json({ response: fallbackResponse });
  } catch (error) {
    console.error('[chatbot] error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Performance data route
app.get('/api/performance', async (req, res) => {
  try {
    const mockPerformanceData = [
      {
        employeeId: '3',
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
      }
    ];

    const { employeeId } = req.query;
    
    if (employeeId) {
      const perf = mockPerformanceData.find(p => p.employeeId === employeeId);
      return res.json(perf || null);
    }

    return res.json(mockPerformanceData);
  } catch (error) {
    console.error('[performance] get error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n=== TalentFlow-AI Backend Server ===`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: In-memory (SQLite simulation)`);
  console.log(`Users loaded: ${users.length}`);
  console.log(`\n=== Available Login Credentials ===`);
  console.log(`RH: rh@techcorp.com / password123`);
  console.log(`Manager: manager@techcorp.com / password123`);
  console.log(`Employee: employee@techcorp.com / password123`);
  console.log(`Candidate: david.laurent@email.com / password123`);
  console.log(`\n=== API Endpoints ===`);
  console.log(`POST /api/auth/login - User login`);
  console.log(`POST /api/auth/register - User registration`);
  console.log(`GET /api/users - Get users`);
  console.log(`GET /api/jobs - Get jobs`);
  console.log(`GET /api/applications - Get applications`);
  console.log(`GET /api/documents - Get documents`);
  console.log(`GET /api/dashboard/stats - Dashboard statistics`);
  console.log(`POST /api/ai/chatbot - Chatbot AI`);
  console.log(`GET /api/performance - Performance data`);
  console.log(`GET /health - Health check`);
  console.log(`\n=====================================\n`);
});

module.exports = app;
