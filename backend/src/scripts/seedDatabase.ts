import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { 
  mockUsers, 
  mockCompanies, 
  mockJobs, 
  mockApplications, 
  mockDocuments, 
  mockPerformanceData 
} from '../data/mockData';

// Import models (assuming they exist)
// import User from '../models/User';
// import Company from '../models/Company';
// import Job from '../models/Job';
// import Application from '../models/Application';
// import Document from '../models/Document';
// import PerformanceData from '../models/PerformanceData';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/talentflow';

class DatabaseSeeder {
  static async connect() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  static async disconnect() {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }

  static async clearDatabase() {
    console.log('Clearing existing data...');
    
    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    
    console.log('Database cleared');
  }

  static async seedUsers() {
    console.log('Seeding users...');
    
    // Hash passwords for all users
    const usersWithHashedPasswords = await Promise.all(
      mockUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash('password123', 12), // Default password for all users
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : null
      }))
    );

    // Insert users (using raw MongoDB for now since models might not exist)
    const db = mongoose.connection.db;
    await db.collection('users').insertMany(usersWithHashedPasswords);
    
    console.log(`Seeded ${usersWithHashedPasswords.length} users`);
  }

  static async seedCompanies() {
    console.log('Seeding companies...');
    
    const companiesWithDates = mockCompanies.map(company => ({
      ...company,
      createdAt: new Date(company.createdAt)
    }));

    const db = mongoose.connection.db;
    await db.collection('companies').insertMany(companiesWithDates);
    
    console.log(`Seeded ${companiesWithDates.length} companies`);
  }

  static async seedJobs() {
    console.log('Seeding jobs...');
    
    const jobsWithDates = mockJobs.map(job => ({
      ...job,
      createdAt: new Date(job.createdAt),
      salary: job.salary,
      requirements: job.requirements,
      skills: job.skills
    }));

    const db = mongoose.connection.db;
    await db.collection('jobs').insertMany(jobsWithDates);
    
    console.log(`Seeded ${jobsWithDates.length} jobs`);
  }

  static async seedApplications() {
    console.log('Seeding applications...');
    
    const applicationsWithDates = mockApplications.map(app => ({
      ...app,
      appliedAt: new Date(app.appliedAt),
      updatedAt: new Date(app.updatedAt),
      interviewDates: app.interviewDates.map(date => new Date(date)),
      documents: app.documents,
      matchingScore: app.matchingScore
    }));

    const db = mongoose.connection.db;
    await db.collection('applications').insertMany(applicationsWithDates);
    
    console.log(`Seeded ${applicationsWithDates.length} applications`);
  }

  static async seedDocuments() {
    console.log('Seeding documents...');
    
    const documentsWithDates = mockDocuments.map(doc => ({
      ...doc,
      requestedAt: new Date(doc.requestedAt),
      processedAt: doc.processedAt ? new Date(doc.processedAt) : null,
      urgency: doc.urgency || 'NORMAL'
    }));

    const db = mongoose.connection.db;
    await db.collection('documents').insertMany(documentsWithDates);
    
    console.log(`Seeded ${documentsWithDates.length} documents`);
  }

  static async seedPerformanceData() {
    console.log('Seeding performance data...');
    
    const performanceWithDates = mockPerformanceData.map(perf => ({
      ...perf,
      lastReview: new Date(perf.lastReview),
      nextReview: new Date(perf.nextReview),
      goals: perf.goals.map(goal => ({
        ...goal,
        target: new Date(goal.target)
      }))
    }));

    const db = mongoose.connection.db;
    await db.collection('performancedata').insertMany(performanceWithDates);
    
    console.log(`Seeded ${performanceWithDates.length} performance records`);
  }

  static async seedAll() {
    try {
      await this.connect();
      
      // Clear existing data
      await this.clearDatabase();
      
      // Seed all data
      await this.seedCompanies();
      await this.seedUsers();
      await this.seedJobs();
      await this.seedApplications();
      await this.seedDocuments();
      await this.seedPerformanceData();
      
      console.log('Database seeding completed successfully!');
      
      // Print summary
      console.log('\n=== Seeding Summary ===');
      console.log(`Users: ${mockUsers.length}`);
      console.log(`Companies: ${mockCompanies.length}`);
      console.log(`Jobs: ${mockJobs.length}`);
      console.log(`Applications: ${mockApplications.length}`);
      console.log(`Documents: ${mockDocuments.length}`);
      console.log(`Performance Records: ${mockPerformanceData.length}`);
      console.log('\n=== Login Credentials ===');
      console.log('Email: je.dupont@talentflow.com | Password: password123 | Role: RH');
      console.log('Email: marie.martin@talentflow.com | Password: password123 | Role: MANAGER');
      console.log('Email: pierre.durand@talentflow.com | Password: password123 | Role: ADMIN');
      console.log('Email: sophie.petit@talentflow.com | Password: password123 | Role: SUPER_ADMIN');
      console.log('Email: thomas.bernard@talentflow.com | Password: password123 | Role: EMPLOYEE');
      console.log('Email: david.laurent@email.com | Password: password123 | Role: CANDIDATE');
      
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  DatabaseSeeder.seedAll().catch(console.error);
}

export default DatabaseSeeder;
