import sqlite3 from 'sqlite3';
import { promisify } from 'util';

// Type definitions for sqlite3
interface Database {
  run(sql: string, params?: any[], callback?: (err: Error | null, result: any) => void): void;
  get(sql: string, params?: any[], callback?: (err: Error | null, row: any) => void): void;
  all(sql: string, params?: any[], callback?: (err: Error | null, rows: any[]) => void): void;
  close(): void;
}

interface Sqlite3 {
  Database: new (filename: string, mode?: number, callback?: (err: Error | null) => void) => Database;
}

declare const sqlite3: Sqlite3;
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

const DB_PATH = process.env.DATABASE_URL || './dev.db';

class SQLiteService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
    this.initDatabase();
  }

  private initDatabase() {
    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');
    
    // Create tables
    this.createTables();
    
    // Seed data if empty
    this.seedData();
  }

  private createTables() {
    // Users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        companyId TEXT,
        department TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastLogin DATETIME,
        status TEXT DEFAULT 'ACTIVE',
        profile TEXT
      )
    `);

    // Companies table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        domain TEXT NOT NULL,
        plan TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        userCount INTEGER DEFAULT 0,
        status TEXT DEFAULT 'ACTIVE',
        settings TEXT
      )
    `);

    // Jobs table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT,
        skills TEXT,
        experience INTEGER,
        salary TEXT,
        location TEXT,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'ACTIVE',
        companyId TEXT NOT NULL,
        createdBy TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (companyId) REFERENCES companies (id),
        FOREIGN KEY (createdBy) REFERENCES users (id)
      )
    `);

    // Applications table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        jobId TEXT NOT NULL,
        candidateId TEXT NOT NULL,
        status TEXT DEFAULT 'APPLIED',
        appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        documents TEXT,
        matchingScore INTEGER,
        interviewDates TEXT,
        FOREIGN KEY (jobId) REFERENCES jobs (id),
        FOREIGN KEY (candidateId) REFERENCES users (id)
      )
    `);

    // Documents table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'PENDING',
        requestedBy TEXT NOT NULL,
        approvedBy TEXT,
        requestedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        processedAt DATETIME,
        documentUrl TEXT,
        rejectionReason TEXT,
        urgency TEXT DEFAULT 'NORMAL',
        FOREIGN KEY (requestedBy) REFERENCES users (id),
        FOREIGN KEY (approvedBy) REFERENCES users (id)
      )
    `);

    // Performance data table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS performanceData (
        employeeId TEXT PRIMARY KEY,
        performance INTEGER NOT NULL,
        potential INTEGER NOT NULL,
        lastReview DATETIME,
        nextReview DATETIME,
        skills TEXT,
        riskLevel TEXT,
        goals TEXT,
        FOREIGN KEY (employeeId) REFERENCES users (id)
      )
    `);
  }

  private async seedData() {
    // Check if data already exists
    const userCount = await this.getAsync('SELECT COUNT(*) as count FROM users');
    if (userCount.count > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database with mock data...');

    // Seed companies
    for (const company of mockCompanies) {
      await this.runAsync(
        'INSERT OR IGNORE INTO companies (id, name, domain, plan, createdAt, userCount, status, settings) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          company.id,
          company.name,
          company.domain,
          company.plan,
          company.createdAt.toISOString(),
          company.userCount,
          company.status,
          JSON.stringify(company.settings)
        ]
      );
    }

    // Seed users
    for (const user of mockUsers) {
      await this.runAsync(
        'INSERT OR IGNORE INTO users (id, name, email, password, role, companyId, department, createdAt, lastLogin, status, profile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          user.id,
          user.name,
          user.password,
          user.role,
          user.companyId,
          user.department,
          user.createdAt.toISOString(),
          user.lastLogin?.toISOString(),
          user.status,
          JSON.stringify(user.profile)
        ]
      );
    }

    // Seed jobs
    for (const job of mockJobs) {
      await this.runAsync(
        'INSERT OR IGNORE INTO jobs (id, title, description, requirements, skills, experience, salary, location, type, status, companyId, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          job.id,
          job.title,
          job.description,
          JSON.stringify(job.requirements),
          JSON.stringify(job.skills),
          job.experience,
          JSON.stringify(job.salary),
          job.location,
          job.type,
          job.status,
          job.companyId,
          job.createdBy,
          job.createdAt.toISOString()
        ]
      );
    }

    // Seed applications
    for (const application of mockApplications) {
      await this.runAsync(
        'INSERT OR IGNORE INTO applications (id, jobId, candidateId, status, appliedAt, updatedAt, notes, documents, matchingScore, interviewDates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          application.id,
          application.jobId,
          application.candidateId,
          application.status,
          application.appliedAt.toISOString(),
          application.updatedAt.toISOString(),
          application.notes,
          JSON.stringify(application.documents),
          application.matchingScore,
          JSON.stringify(application.interviewDates)
        ]
      );
    }

    // Seed documents
    for (const document of mockDocuments) {
      await this.runAsync(
        'INSERT OR IGNORE INTO documents (id, type, title, description, status, requestedBy, approvedBy, requestedAt, processedAt, documentUrl, rejectionReason, urgency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          document.id,
          document.type,
          document.title,
          document.description,
          document.status,
          document.requestedBy,
          document.approvedBy,
          document.requestedAt.toISOString(),
          document.processedAt?.toISOString(),
          document.documentUrl,
          document.rejectionReason,
          document.urgency
        ]
      );
    }

    // Seed performance data
    for (const perf of mockPerformanceData) {
      await this.runAsync(
        'INSERT OR IGNORE INTO performanceData (employeeId, performance, potential, lastReview, nextReview, skills, riskLevel, goals) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          perf.employeeId,
          perf.performance,
          perf.potential,
          perf.lastReview.toISOString(),
          perf.nextReview.toISOString(),
          JSON.stringify(perf.skills),
          perf.riskLevel,
          JSON.stringify(perf.goals)
        ]
      );
    }

    console.log('Database seeded successfully');
  }

  private runAsync(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  private getAsync(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, function(err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  private allAsync(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, function(err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Users
  async getAllUsers() {
    return this.allAsync('SELECT * FROM users');
  }

  async getUserById(id: string) {
    return this.getAsync('SELECT * FROM users WHERE id = ?', [id]);
  }

  async getUserByEmail(email: string) {
    return this.getAsync('SELECT * FROM users WHERE email = ?', [email]);
  }

  async getUsersByRole(role: string) {
    return this.allAsync('SELECT * FROM users WHERE role = ?', [role]);
  }

  async getUsersByCompany(companyId: string) {
    return this.allAsync('SELECT * FROM users WHERE companyId = ?', [companyId]);
  }

  async createUser(userData: any) {
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      status: 'ACTIVE'
    };
    
    await this.runAsync(
      'INSERT INTO users (id, name, email, password, role, companyId, department, createdAt, lastLogin, status, profile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newUser.id,
        newUser.name,
        newUser.password,
        newUser.role,
        newUser.companyId,
        newUser.department,
        newUser.createdAt,
        newUser.lastLogin,
        newUser.status,
        JSON.stringify(newUser.profile || {})
      ]
    );
    
    return newUser;
  }

  async updateUser(id: string, userData: any) {
    await this.runAsync('UPDATE users SET name = ?, email = ?, role = ?, companyId = ?, department = ?, status = ?, profile = ? WHERE id = ?', 
      [userData.name, userData.email, userData.role, userData.companyId, userData.department, userData.status, JSON.stringify(userData.profile), id]);
    return this.getUserById(id);
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    await this.runAsync('DELETE FROM users WHERE id = ?', [id]);
    return user;
  }

  // Companies
  async getAllCompanies() {
    return this.allAsync('SELECT * FROM companies');
  }

  async getCompanyById(id: string) {
    return this.getAsync('SELECT * FROM companies WHERE id = ?', [id]);
  }

  async createCompany(companyData: any) {
    const newCompany = {
      id: (mockCompanies.length + 1).toString(),
      ...companyData,
      createdAt: new Date().toISOString(),
      userCount: 0,
      status: 'ACTIVE'
    };
    
    await this.runAsync(
      'INSERT INTO companies (id, name, domain, plan, createdAt, userCount, status, settings) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newCompany.id, newCompany.name, newCompany.domain, newCompany.plan, newCompany.createdAt, newCompany.userCount, newCompany.status, JSON.stringify(newCompany.settings || {})]
    );
    
    return newCompany;
  }

  // Jobs
  async getAllJobs() {
    return this.allAsync('SELECT * FROM jobs');
  }

  async getJobById(id: string) {
    return this.getAsync('SELECT * FROM jobs WHERE id = ?', [id]);
  }

  async getJobsByCompany(companyId: string) {
    return this.allAsync('SELECT * FROM jobs WHERE companyId = ?', [companyId]);
  }

  async createJob(jobData: any) {
    const newJob = {
      id: (mockJobs.length + 1).toString(),
      ...jobData,
      createdAt: new Date().toISOString(),
      applications: []
    };
    
    await this.runAsync(
      'INSERT INTO jobs (id, title, description, requirements, skills, experience, salary, location, type, status, companyId, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newJob.id,
        newJob.title,
        newJob.description,
        JSON.stringify(newJob.requirements),
        JSON.stringify(newJob.skills),
        newJob.experience,
        JSON.stringify(newJob.salary),
        newJob.location,
        newJob.type,
        newJob.status,
        newJob.companyId,
        newJob.createdBy,
        newJob.createdAt
      ]
    );
    
    return newJob;
  }

  // Applications
  async getAllApplications() {
    return this.allAsync('SELECT * FROM applications');
  }

  async getApplicationById(id: string) {
    return this.getAsync('SELECT * FROM applications WHERE id = ?', [id]);
  }

  async getApplicationsByJob(jobId: string) {
    return this.allAsync('SELECT * FROM applications WHERE jobId = ?', [jobId]);
  }

  async getApplicationsByCandidate(candidateId: string) {
    return this.allAsync('SELECT * FROM applications WHERE candidateId = ?', [candidateId]);
  }

  async createApplication(applicationData: any) {
    const newApplication = {
      id: (mockApplications.length + 1).toString(),
      ...applicationData,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'APPLIED',
      matchingScore: Math.floor(Math.random() * 30) + 70
    };
    
    await this.runAsync(
      'INSERT INTO applications (id, jobId, candidateId, status, appliedAt, updatedAt, notes, documents, matchingScore, interviewDates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newApplication.id,
        newApplication.jobId,
        newApplication.candidateId,
        newApplication.status,
        newApplication.appliedAt,
        newApplication.updatedAt,
        newApplication.notes,
        JSON.stringify(newApplication.documents),
        newApplication.matchingScore,
        JSON.stringify(newApplication.interviewDates || [])
      ]
    );
    
    return newApplication;
  }

  // Documents
  async getAllDocuments() {
    return this.allAsync('SELECT * FROM documents');
  }

  async getDocumentById(id: string) {
    return this.getAsync('SELECT * FROM documents WHERE id = ?', [id]);
  }

  async getDocumentsByUser(userId: string) {
    return this.allAsync('SELECT * FROM documents WHERE requestedBy = ?', [userId]);
  }

  async getPendingDocuments() {
    return this.allAsync('SELECT * FROM documents WHERE status = ?', ['PENDING']);
  }

  async createDocument(documentData: any) {
    const newDocument = {
      id: (mockDocuments.length + 1).toString(),
      ...documentData,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      urgency: documentData.urgency || 'NORMAL'
    };
    
    await this.runAsync(
      'INSERT INTO documents (id, type, title, description, status, requestedBy, approvedBy, requestedAt, processedAt, documentUrl, rejectionReason, urgency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newDocument.id,
        newDocument.type,
        newDocument.title,
        newDocument.description,
        newDocument.status,
        newDocument.requestedBy,
        newDocument.approvedBy,
        newDocument.requestedAt,
        newDocument.processedAt,
        newDocument.documentUrl,
        newDocument.rejectionReason,
        newDocument.urgency
      ]
    );
    
    return newDocument;
  }

  async updateDocument(id: string, documentData: any) {
    await this.runAsync('UPDATE documents SET status = ?, approvedBy = ?, processedAt = ?, documentUrl = ?, rejectionReason = ? WHERE id = ?', 
      [documentData.status, documentData.approvedBy, documentData.processedAt, documentData.documentUrl, documentData.rejectionReason, id]);
    return this.getDocumentById(id);
  }

  async approveDocument(id: string, approvedBy: string) {
    const doc = await this.updateDocument(id, {
      status: 'APPROVED',
      approvedBy,
      processedAt: new Date().toISOString(),
      documentUrl: `/documents/approved_${id}.pdf`
    });
    return doc;
  }

  async rejectDocument(id: string, approvedBy: string, rejectionReason: string) {
    const doc = await this.updateDocument(id, {
      status: 'REJECTED',
      approvedBy,
      processedAt: new Date().toISOString(),
      rejectionReason
    });
    return doc;
  }

  // Performance Data
  async getAllPerformanceData() {
    return this.allAsync('SELECT * FROM performanceData');
  }

  async getPerformanceDataByEmployee(employeeId: string) {
    return this.getAsync('SELECT * FROM performanceData WHERE employeeId = ?', [employeeId]);
  }

  async updatePerformanceData(employeeId: string, performanceData: any) {
    await this.runAsync('UPDATE performanceData SET performance = ?, potential = ?, lastReview = ?, nextReview = ?, skills = ?, riskLevel = ?, goals = ? WHERE employeeId = ?', 
      [performanceData.performance, performanceData.potential, performanceData.lastReview, performanceData.nextReview, JSON.stringify(performanceData.skills), performanceData.riskLevel, JSON.stringify(performanceData.goals), employeeId]);
    return this.getPerformanceDataByEmployee(employeeId);
  }

  // Analytics
  async getDashboardStats(userRole: string, companyId?: string) {
    const users = companyId ? await this.getUsersByCompany(companyId) : await this.getAllUsers();
    const jobs = companyId ? await this.getJobsByCompany(companyId) : await this.getAllJobs();
    const applications = companyId ? 
      await this.allAsync('SELECT a.* FROM applications a JOIN jobs j ON a.jobId = j.id WHERE j.companyId = ?', [companyId]) : 
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
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params: any[] = [];
    
    if (query) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR department LIKE ?)';
      params.push(`%${query}%`, `%${query}%`, `%${query}%`);
    }
    
    if (filters?.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }
    
    if (filters?.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    
    return this.allAsync(sql, params);
  }

  async searchJobs(query: string, filters?: any) {
    let sql = 'SELECT * FROM jobs WHERE 1=1';
    const params: any[] = [];
    
    if (query) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      params.push(`%${query}%`, `%${query}%`, `%${query}%`);
    }
    
    if (filters?.type) {
      sql += ' AND type = ?';
      params.push(filters.type);
    }
    
    if (filters?.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    
    return this.allAsync(sql, params);
  }

  async searchApplications(query: string, filters?: any) {
    let sql = 'SELECT a.*, j.title as jobTitle, u.name as candidateName FROM applications a JOIN jobs j ON a.jobId = j.id JOIN users u ON a.candidateId = u.id WHERE 1=1';
    const params: any[] = [];
    
    if (query) {
      sql += ' AND (j.title LIKE ? OR u.name LIKE ? OR a.status LIKE ?)';
      params.push(`%${query}%`, `%${query}%`, `%${query}%`);
    }
    
    if (filters?.status) {
      sql += ' AND a.status = ?';
      params.push(filters.status);
    }
    
    if (filters?.jobId) {
      sql += ' AND a.jobId = ?';
      params.push(filters.jobId);
    }
    
    return this.allAsync(sql, params);
  }

  close() {
    this.db.close();
  }
}

export { SQLiteService };
