import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject token from localStorage on each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authAPI = {
  login: (data: { email: string; password: string }) => API.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string; role?: string; companyId?: string }) => API.post('/auth/register', data),
  me: () => API.get('/auth/me'),
  updateProfile: (data: any) => API.put('/auth/profile', data),
};

// Jobs
export const jobsAPI = {
  list: (params?: any) => API.get('/jobs', { params }),
  create: (data: any) => API.post('/jobs', data),
  get: (id: string) => API.get(`/jobs/${id}`),
  update: (id: string, data: any) => API.put(`/jobs/${id}`, data),
  delete: (id: string) => API.delete(`/jobs/${id}`),
};

// Recruitment / Candidates
export const candidatesAPI = {
  list: (params?: any) => API.get('/recruitment/candidates', { params }),
  create: (data: any) => API.post('/recruitment/candidates', data),
  get: (id: string) => API.get(`/recruitment/candidates/${id}`),
  updateStatus: (id: string, data: any) => API.put(`/recruitment/candidates/${id}/status`, data),
  delete: (id: string) => API.delete(`/recruitment/candidates/${id}`),
  getDashboard: () => API.get('/recruitment/me/dashboard'),
};

// Evaluations
export const evaluationsAPI = {
  list: (params?: any) => API.get('/evaluations', { params }),
  create: (data: any) => API.post('/evaluations', data),
  get: (id: string) => API.get(`/evaluations/${id}`),
  decide: (id: string, data: any) => API.put(`/evaluations/${id}/decision`, data),
};

// Employees
export const employeesAPI = {
  list: (params?: any) => API.get('/employees', { params }),
  create: (data: any) => API.post('/employees', data),
  get: (id: string) => API.get(`/employees/${id}`),
  update: (id: string, data: any) => API.put(`/employees/${id}`, data),
  assessRisk: (id: string, data: any) => API.post(`/employees/${id}/risk-assessment`, data),
  getDashboard: () => API.get('/employees/me/dashboard'),
};

// Companies
export const companiesAPI = {
  list: (params?: any) => API.get('/companies', { params }),
  create: (data: any) => API.post('/companies', data),
  get: (id: string) => API.get(`/companies/${id}`),
  update: (id: string, data: any) => API.put(`/companies/${id}`, data),
  delete: (id: string) => API.delete(`/companies/${id}`),
};

// Documents
export const documentsAPI = {
  list: (params?: any) => API.get('/documents', { params }),
  generate: (data: any) => API.post('/documents/generate', data),
  get: (id: string) => API.get(`/documents/${id}`),
  updateStatus: (id: string, data: any) => API.put(`/documents/${id}/status`, data),
};

// Document Requests (for employees)
export const documentAPI = {
  list: () => API.get('/requests'),
  create: (data: any) => API.post('/requests', data),
  updateStatus: (id: string, data: any) => API.put(`/requests/${id}/status`, data),
  getAll: (params?: any) => API.get('/requests/all', { params }),
  cancel: (id: string) => API.delete(`/requests/${id}`),
};

// Admin (Super Admin only)
export const adminAPI = {
  // User Management
  getUsers: (params?: any) => API.get('/admin/users', { params }),
  createUser: (data: any) => API.post('/admin/users', data),
  updateUser: (id: string, data: any) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => API.delete(`/admin/users/${id}`),
  updateUserStatus: (id: string, data: any) => API.put(`/admin/users/${id}/status`, data),
  resetUserPassword: (id: string, data: any) => API.post(`/admin/users/${id}/reset-password`, data),
  
  // Company Management
  getCompanies: (params?: any) => API.get('/admin/companies', { params }),
  createCompany: (data: any) => API.post('/admin/companies', data),
  
  // System Management
  getStats: () => API.get('/admin/stats'),
  getSecurityLogs: (params?: any) => API.get('/admin/security-logs', { params }),
};

// AI
export const aiAPI = {
  screen: (data: any) => API.post('/ai/screen', data),
  chatbot: (data: any) => API.post('/ai/chatbot', data),
  interviewQuestions: (data: any) => API.post('/ai/interview-questions', data),
  candidateSummary: (data: any) => API.post('/ai/candidate-summary', data),
  // New DeepSeek and Chatbot endpoints
  parseCV: (data: any) => API.post('/ai/parse-cv', data),
  chatbotMessage: (data: any) => API.post('/ai/chatbot-message', data),
  getChatHistory: () => API.get('/ai/chatbot/history'),
  clearChat: () => API.delete('/ai/chatbot/clear'),
  generateQuestions: (data: any) => API.post('/ai/generate-questions', data),
  analyzeCV: (data: any) => API.post('/ai/cv-analysis', data),
  matchingAnalysis: (data: any) => API.post('/ai/matching-analysis', data),
  // New Groq Deep Analysis endpoints
  deepCVAnalysis: (data: any) => API.post('/ai/deep-cv-analysis', data),
  teamAnalysis: (data: any) => API.post('/ai/team-analysis', data),
  advancedRiskAnalysis: (data: any) => API.post('/ai/advanced-risk-analysis', data),
  marketAnalysis: (data: any) => API.post('/ai/market-analysis', data),
  predictiveAnalysis: (data: any) => API.post('/ai/predictive-analysis', data),
  cultureFitAnalysis: (data: any) => API.post('/ai/culture-fit-analysis', data),
};

// Workflow
export const workflowAPI = {
  pipeline: () => API.get('/workflows/pipeline'),
  candidateWorkflow: (candidateId: string) => API.get(`/workflows/candidates/${candidateId}`),
};

// Company
export const companyAPI = {
  stats: (id: string) => API.get(`/companies/${id}/stats`),
  get: (id: string) => API.get(`/companies/${id}`),
};

export default API;
