import { 
  mockUsers, 
  mockCompanies, 
  mockJobs, 
  mockApplications, 
  mockDocuments, 
  mockPerformanceData,
  getChatbotResponse
} from '../data/mockData';

class SimpleSQLiteService {
  private static instance: SimpleSQLiteService;
  private users: any[] = [];
  private companies: any[] = [];
  private jobs: any[] = [];
  private applications: any[] = [];
  private documents: any[] = [];
  private performanceData: any[] = [];

  private constructor() {
    this.initData();
  }

  static getInstance(): SimpleSQLiteService {
    if (!SimpleSQLiteService.instance) {
      SimpleSQLiteService.instance = new SimpleSQLiteService();
    }
    return SimpleSQLiteService.instance;
  }

  private initData() {
    console.log('Initializing SQLite data with mock data...');
    
    // Initialize with mock data
    this.users = [...mockUsers];
    this.companies = [...mockCompanies];
    this.jobs = [...mockJobs];
    this.applications = [...mockApplications];
    this.documents = [...mockDocuments];
    this.performanceData = [...mockPerformanceData];
    
    console.log(`Initialized ${this.users.length} users, ${this.companies.length} companies, ${this.jobs.length} jobs`);
  }

  // Users
  async getAllUsers() {
    return this.users;
  }

  async getUserById(id: string) {
    return this.users.find(user => user.id === id);
  }

  async getUserByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  async getUsersByRole(role: string) {
    return this.users.filter(user => user.role === role);
  }

  async getUsersByCompany(companyId: string) {
    return this.users.filter(user => user.companyId === companyId);
  }

  async createUser(userData: any) {
    const newUser = {
      id: (this.users.length + 1).toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      status: 'ACTIVE'
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: any) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      return this.users[userIndex];
    }
    return null;
  }

  async deleteUser(id: string) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      return this.users.splice(userIndex, 1)[0];
    }
    return null;
  }

  // Companies
  async getAllCompanies() {
    return this.companies;
  }

  async getCompanyById(id: string) {
    return this.companies.find(company => company.id === id);
  }

  async createCompany(companyData: any) {
    const newCompany = {
      id: (this.companies.length + 1).toString(),
      ...companyData,
      createdAt: new Date().toISOString(),
      userCount: 0,
      status: 'ACTIVE'
    };
    
    this.companies.push(newCompany);
    return newCompany;
  }

  // Jobs
  async getAllJobs() {
    return this.jobs;
  }

  async getJobById(id: string) {
    return this.jobs.find(job => job.id === id);
  }

  async getJobsByCompany(companyId: string) {
    return this.jobs.filter(job => job.companyId === companyId);
  }

  async createJob(jobData: any) {
    const newJob = {
      id: (this.jobs.length + 1).toString(),
      ...jobData,
      createdAt: new Date().toISOString(),
      applications: []
    };
    
    this.jobs.push(newJob);
    return newJob;
  }

  // Applications
  async getAllApplications() {
    return this.applications;
  }

  async getApplicationById(id: string) {
    return this.applications.find(app => app.id === id);
  }

  async getApplicationsByJob(jobId: string) {
    return this.applications.filter(app => app.jobId === jobId);
  }

  async getApplicationsByCandidate(candidateId: string) {
    return this.applications.filter(app => app.candidateId === candidateId);
  }

  async createApplication(applicationData: any) {
    const newApplication = {
      id: (this.applications.length + 1).toString(),
      ...applicationData,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'APPLIED',
      matchingScore: Math.floor(Math.random() * 30) + 70
    };
    
    this.applications.push(newApplication);
    return newApplication;
  }

  // Documents
  async getAllDocuments() {
    return this.documents;
  }

  async getDocumentById(id: string) {
    return this.documents.find(doc => doc.id === id);
  }

  async getDocumentsByUser(userId: string) {
    return this.documents.filter(doc => doc.requestedBy === userId);
  }

  async getPendingDocuments() {
    return this.documents.filter(doc => doc.status === 'PENDING');
  }

  async createDocument(documentData: any) {
    const newDocument = {
      id: (this.documents.length + 1).toString(),
      ...documentData,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      urgency: documentData.urgency || 'NORMAL'
    };
    
    this.documents.push(newDocument);
    return newDocument;
  }

  async updateDocument(id: string, documentData: any) {
    const docIndex = this.documents.findIndex(doc => doc.id === id);
    if (docIndex !== -1) {
      this.documents[docIndex] = { 
        ...this.documents[docIndex], 
        ...documentData,
        processedAt: documentData.status !== 'PENDING' ? new Date().toISOString() : null
      };
      return this.documents[docIndex];
    }
    return null;
  }

  async approveDocument(id: string, approvedBy: string) {
    const doc = await this.updateDocument(id, {
      status: 'APPROVED',
      approvedBy,
      documentUrl: `/documents/approved_${id}.pdf`
    });
    return doc;
  }

  async rejectDocument(id: string, approvedBy: string, rejectionReason: string) {
    const doc = await this.updateDocument(id, {
      status: 'REJECTED',
      approvedBy,
      rejectionReason
    });
    return doc;
  }

  // Performance Data
  async getAllPerformanceData() {
    return this.performanceData;
  }

  async getPerformanceDataByEmployee(employeeId: string) {
    return this.performanceData.find(p => p.employeeId === employeeId);
  }

  async updatePerformanceData(employeeId: string, performanceData: any) {
    const perfIndex = this.performanceData.findIndex(p => p.employeeId === employeeId);
    if (perfIndex !== -1) {
      this.performanceData[perfIndex] = { 
        ...this.performanceData[perfIndex], 
        ...performanceData
      };
      return this.performanceData[perfIndex];
    }
    return null;
  }

  // Analytics
  async getDashboardStats(userRole: string, companyId?: string) {
    const users = companyId ? await this.getUsersByCompany(companyId) : await this.getAllUsers();
    const jobs = companyId ? await this.getJobsByCompany(companyId) : await this.getAllJobs();
    const applications = companyId ? 
      this.applications.filter(app => {
        const job = this.jobs.find(j => j.id === app.jobId);
        return job && job.companyId === companyId;
      }) : 
      await this.getAllApplications();

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'ACTIVE').length,
      totalJobs: jobs.length,
      activeJobs: jobs.filter(j => j.status === 'ACTIVE').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'APPLIED').length,
      screeningApplications: applications.filter(a => a.status === 'SCREENING').length,
      interviewApplications: applications.filter(a => a.status === 'INTERVIEW').length,
      offerApplications: applications.filter(a => a.status === 'OFFER').length,
      hiredApplications: applications.filter(a => a.status === 'HIRED').length,
      rejectedApplications: applications.filter(a => a.status === 'REJECTED').length,
      conversionRate: applications.length > 0 ? 
        Math.round((applications.filter(a => ['OFFER', 'HIRED'].includes(a.status)).length / applications.length) * 100) : 0
    };
  }

  async getSystemStats() {
    const users = await this.getAllUsers();
    const companies = await this.getAllCompanies();
    
    return {
      totalUsers: users.length,
      totalCompanies: companies.length,
      activeUsers: users.filter(u => u.status === 'ACTIVE').length,
      suspendedUsers: users.filter(u => u.status === 'SUSPENDED').length,
      totalLogins: 2847,
      securityAlerts: 12,
      systemUptime: '99.8%',
      databaseSize: '2.4 GB',
      apiCalls: 45678,
      errorRate: 0.02,
      lastBackup: '2026-04-19 02:30',
      serverStatus: 'ONLINE'
    };
  }

  // Chatbot
  async getChatbotResponse(message: string, userRole: string) {
    return getChatbotResponse(message, userRole);
  }

  // Search
  async searchUsers(query: string, filters?: any) {
    let results = this.users;
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(user => 
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.department?.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (filters?.role) {
      results = results.filter(user => user.role === filters.role);
    }
    
    if (filters?.status) {
      results = results.filter(user => user.status === filters.status);
    }
    
    return results;
  }

  async searchJobs(query: string, filters?: any) {
    let results = this.jobs;
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(lowerQuery) ||
        job.description.toLowerCase().includes(lowerQuery) ||
        job.location.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (filters?.type) {
      results = results.filter(job => job.type === filters.type);
    }
    
    if (filters?.status) {
      results = results.filter(job => job.status === filters.status);
    }
    
    return results;
  }

  async searchApplications(query: string, filters?: any) {
    let results = this.applications;
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(app => {
        const job = this.jobs.find(j => j.id === app.jobId);
        const candidate = this.users.find(u => u.id === app.candidateId);
        return job?.title.toLowerCase().includes(lowerQuery) ||
               candidate?.name.toLowerCase().includes(lowerQuery) ||
               app.status.toLowerCase().includes(lowerQuery);
      });
    }
    
    if (filters?.status) {
      results = results.filter(app => app.status === filters.status);
    }
    
    if (filters?.jobId) {
      results = results.filter(app => app.jobId === filters.jobId);
    }
    
    return results;
  }
}

export default SimpleSQLiteService;
