import { 
  mockUsers, 
  mockCompanies, 
  mockJobs, 
  mockApplications, 
  mockDocuments, 
  mockPerformanceData,
  getRandomUser,
  getRandomJob,
  getRandomApplication,
  getPerformanceData,
  getChatbotResponse
} from '../data/mockData';

export class DataService {
  // Users
  static async getAllUsers() {
    return mockUsers;
  }

  static async getUserById(id: string) {
    return mockUsers.find(user => user.id === id);
  }

  static async getUserByEmail(email: string) {
    return mockUsers.find(user => user.email === email);
  }

  static async getUsersByRole(role: string) {
    return mockUsers.filter(user => user.role === role);
  }

  static async getUsersByCompany(companyId: string) {
    return mockUsers.filter(user => user.companyId === companyId);
  }

  static async createUser(userData: any) {
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      ...userData,
      createdAt: new Date(),
      lastLogin: null,
      status: 'ACTIVE'
    };
    mockUsers.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, userData: any) {
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      return mockUsers[userIndex];
    }
    return null;
  }

  static async deleteUser(id: string) {
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      return mockUsers.splice(userIndex, 1)[0];
    }
    return null;
  }

  // Companies
  static async getAllCompanies() {
    return mockCompanies;
  }

  static async getCompanyById(id: string) {
    return mockCompanies.find(company => company.id === id);
  }

  static async createCompany(companyData: any) {
    const newCompany = {
      id: (mockCompanies.length + 1).toString(),
      ...companyData,
      createdAt: new Date(),
      userCount: 0,
      status: 'ACTIVE'
    };
    mockCompanies.push(newCompany);
    return newCompany;
  }

  static async updateCompany(id: string, companyData: any) {
    const companyIndex = mockCompanies.findIndex(company => company.id === id);
    if (companyIndex !== -1) {
      mockCompanies[companyIndex] = { ...mockCompanies[companyIndex], ...companyData };
      return mockCompanies[companyIndex];
    }
    return null;
  }

  static async deleteCompany(id: string) {
    const companyIndex = mockCompanies.findIndex(company => company.id === id);
    if (companyIndex !== -1) {
      return mockCompanies.splice(companyIndex, 1)[0];
    }
    return null;
  }

  // Jobs
  static async getAllJobs() {
    return mockJobs;
  }

  static async getJobById(id: string) {
    return mockJobs.find(job => job.id === id);
  }

  static async getJobsByCompany(companyId: string) {
    return mockJobs.filter(job => job.companyId === companyId);
  }

  static async createJob(jobData: any) {
    const newJob = {
      id: (mockJobs.length + 1).toString(),
      ...jobData,
      createdAt: new Date(),
      applications: []
    };
    mockJobs.push(newJob);
    return newJob;
  }

  static async updateJob(id: string, jobData: any) {
    const jobIndex = mockJobs.findIndex(job => job.id === id);
    if (jobIndex !== -1) {
      mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...jobData };
      return mockJobs[jobIndex];
    }
    return null;
  }

  static async deleteJob(id: string) {
    const jobIndex = mockJobs.findIndex(job => job.id === id);
    if (jobIndex !== -1) {
      return mockJobs.splice(jobIndex, 1)[0];
    }
    return null;
  }

  // Applications
  static async getAllApplications() {
    return mockApplications;
  }

  static async getApplicationById(id: string) {
    return mockApplications.find(app => app.id === id);
  }

  static async getApplicationsByJob(jobId: string) {
    return mockApplications.filter(app => app.jobId === jobId);
  }

  static async getApplicationsByCandidate(candidateId: string) {
    return mockApplications.filter(app => app.candidateId === candidateId);
  }

  static async createApplication(applicationData: any) {
    const newApplication = {
      id: (mockApplications.length + 1).toString(),
      ...applicationData,
      appliedAt: new Date(),
      updatedAt: new Date(),
      status: 'APPLIED',
      matchingScore: Math.floor(Math.random() * 30) + 70 // 70-100
    };
    mockApplications.push(newApplication);
    return newApplication;
  }

  static async updateApplication(id: string, applicationData: any) {
    const appIndex = mockApplications.findIndex(app => app.id === id);
    if (appIndex !== -1) {
      mockApplications[appIndex] = { 
        ...mockApplications[appIndex], 
        ...applicationData,
        updatedAt: new Date()
      };
      return mockApplications[appIndex];
    }
    return null;
  }

  static async deleteApplication(id: string) {
    const appIndex = mockApplications.findIndex(app => app.id === id);
    if (appIndex !== -1) {
      return mockApplications.splice(appIndex, 1)[0];
    }
    return null;
  }

  // Documents
  static async getAllDocuments() {
    return mockDocuments;
  }

  static async getDocumentById(id: string) {
    return mockDocuments.find(doc => doc.id === id);
  }

  static async getDocumentsByUser(userId: string) {
    return mockDocuments.filter(doc => doc.requestedBy === userId);
  }

  static async getPendingDocuments() {
    return mockDocuments.filter(doc => doc.status === 'PENDING');
  }

  static async createDocument(documentData: any) {
    const newDocument = {
      id: (mockDocuments.length + 1).toString(),
      ...documentData,
      requestedAt: new Date(),
      status: 'PENDING',
      urgency: documentData.urgency || 'NORMAL'
    };
    mockDocuments.push(newDocument);
    return newDocument;
  }

  static async updateDocument(id: string, documentData: any) {
    const docIndex = mockDocuments.findIndex(doc => doc.id === id);
    if (docIndex !== -1) {
      mockDocuments[docIndex] = { 
        ...mockDocuments[docIndex], 
        ...documentData,
        processedAt: documentData.status !== 'PENDING' ? new Date() : null
      };
      return mockDocuments[docIndex];
    }
    return null;
  }

  static async approveDocument(id: string, approvedBy: string) {
    const doc = await this.updateDocument(id, {
      status: 'APPROVED',
      approvedBy,
      documentUrl: `/documents/approved_${id}.pdf`
    });
    return doc;
  }

  static async rejectDocument(id: string, approvedBy: string, rejectionReason: string) {
    const doc = await this.updateDocument(id, {
      status: 'REJECTED',
      approvedBy,
      rejectionReason
    });
    return doc;
  }

  // Performance Data
  static async getAllPerformanceData() {
    return mockPerformanceData;
  }

  static async getPerformanceDataByEmployee(employeeId: string) {
    return mockPerformanceData.find(p => p.employeeId === employeeId);
  }

  static async updatePerformanceData(employeeId: string, performanceData: any) {
    const perfIndex = mockPerformanceData.findIndex(p => p.employeeId === employeeId);
    if (perfIndex !== -1) {
      mockPerformanceData[perfIndex] = { 
        ...mockPerformanceData[perfIndex], 
        ...performanceData
      };
      return mockPerformanceData[perfIndex];
    }
    return null;
  }

  // Analytics
  static async getDashboardStats(userRole: string, companyId?: string) {
    const users = companyId ? await this.getUsersByCompany(companyId) : mockUsers;
    const jobs = companyId ? await this.getJobsByCompany(companyId) : mockJobs;
    const applications = companyId ? 
      mockApplications.filter(app => {
        const job = mockJobs.find(j => j.id === app.jobId);
        return job && job.companyId === companyId;
      }) : mockApplications;

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

  static async getSystemStats() {
    return {
      totalUsers: mockUsers.length,
      totalCompanies: mockCompanies.length,
      activeUsers: mockUsers.filter(u => u.status === 'ACTIVE').length,
      suspendedUsers: mockUsers.filter(u => u.status === 'SUSPENDED').length,
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
  static async getChatbotResponse(message: string, userRole: string) {
    return getChatbotResponse(message, userRole);
  }

  // Search
  static async searchUsers(query: string, filters?: any) {
    let results = mockUsers;
    
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

  static async searchJobs(query: string, filters?: any) {
    let results = mockJobs;
    
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

  static async searchApplications(query: string, filters?: any) {
    let results = mockApplications;
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(app => {
        const job = mockJobs.find(j => j.id === app.jobId);
        const candidate = mockUsers.find(u => u.id === app.candidateId);
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

export default DataService;
