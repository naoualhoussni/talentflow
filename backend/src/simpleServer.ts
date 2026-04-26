import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { 
  mockUsers, 
  mockCompanies, 
  mockJobs, 
  mockApplications, 
  mockDocuments, 
  mockPerformanceData,
  getChatbotResponse
} from './data/mockData';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'talentflow-security-key-2025';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory database
let users = [...mockUsers];
let companies = [...mockCompanies];
let jobs = [...mockJobs];
let applications = [...mockApplications];
let documents = [...mockDocuments];
let performanceData = [...mockPerformanceData];

// Helper functions
const findUserByEmail = (email: string) => users.find(u => u.email === email);
const findUserById = (id: string) => users.find(u => u.id === id);
const generateToken = (user: any) => jwt.sign(
  { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Routes
app.get('/health', (_req, res) => {
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

    // For demo purposes, accept any password for mock users
    const valid = await bcrypt.compare(password, user.password).catch(() => true);
    
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
  } catch (error: any) {
    console.error('[auth] register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    const { role, companyId } = req.query;
    let filteredUsers = users;

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
    const { companyId } = req.query;
    let filteredJobs = jobs;

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
    const { jobId, candidateId } = req.query;
    let filteredApplications = applications;

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
    const { requestedBy, status } = req.query;
    let filteredDocuments = documents;

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
    const filteredJobs = companyId ? jobs.filter(j => j.companyId === companyId) : jobs;
    const filteredApplications = companyId ? 
      applications.filter(app => {
        const job = jobs.find(j => j.id === app.jobId);
        return job && job.companyId === companyId;
      }) : applications;

    const stats = {
      totalUsers: filteredUsers.length,
      activeUsers: filteredUsers.filter(u => u.status === 'ACTIVE').length,
      totalJobs: filteredJobs.length,
      activeJobs: filteredJobs.filter(j => j.status === 'ACTIVE').length,
      totalApplications: filteredApplications.length,
      pendingApplications: filteredApplications.filter(a => a.status === 'APPLIED').length,
      screeningApplications: filteredApplications.filter(a => a.status === 'SCREENING').length,
      interviewApplications: filteredApplications.filter(a => a.status === 'INTERVIEW').length,
      offerApplications: filteredApplications.filter(a => a.status === 'OFFER').length,
      hiredApplications: filteredApplications.filter(a => a.status === 'HIRED').length,
      rejectedApplications: filteredApplications.filter(a => a.status === 'REJECTED').length,
      conversionRate: filteredApplications.length > 0 ? 
        Math.round((filteredApplications.filter(a => ['OFFER', 'HIRED'].includes(a.status)).length / filteredApplications.length) * 100) : 0
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
    const { employeeId } = req.query;
    
    if (employeeId) {
      const perf = performanceData.find(p => p.employeeId === employeeId);
      return res.json(perf || null);
    }

    return res.json(performanceData);
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
  console.log(`Companies loaded: ${companies.length}`);
  console.log(`Jobs loaded: ${jobs.length}`);
  console.log(`Applications loaded: ${applications.length}`);
  console.log(`\n=== Available Login Credentials ===`);
  console.log(`RH: rh@techcorp.com / password123`);
  console.log(`Manager: manager@techcorp.com / password123`);
  console.log(`Employee: employee@techcorp.com / password123`);
  console.log(`Admin: admin@techcorp.com / password123`);
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

export default app;
