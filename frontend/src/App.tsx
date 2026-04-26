import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Chatbot from './components/Chatbot';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import Pipeline from './pages/Pipeline';
import Candidates from './pages/Candidates';
import JobManagement from './pages/JobManagement';
import MyDocuments from './pages/MyDocuments';
import RHDocumentManagement from './pages/RHDocumentManagement';
import EmployeeRisk from './pages/EmployeeRisk';
import NineBoxMatrix from './pages/NineBoxMatrix';
import MatchingAnalysis from './pages/MatchingAnalysis';
import Administration from './pages/Administration';
import CalendarPage from './pages/CalendarPage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/landing'].includes(location.pathname) || (location.pathname === '/' && !user);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/candidate-dashboard" element={<PrivateRoute><CandidateDashboard /></PrivateRoute>} />
        <Route path="/pipeline" element={<PrivateRoute><Pipeline /></PrivateRoute>} />
        <Route path="/candidates" element={<PrivateRoute><Candidates /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><JobManagement /></PrivateRoute>} />
        <Route path="/my-documents" element={<PrivateRoute><MyDocuments /></PrivateRoute>} />
        <Route path="/rh-document-management" element={<PrivateRoute><RHDocumentManagement /></PrivateRoute>} />
        <Route path="/employees" element={<PrivateRoute><EmployeeRisk /></PrivateRoute>} />
        <Route path="/nine-box-matrix" element={<PrivateRoute><NineBoxMatrix /></PrivateRoute>} />
        <Route path="/matching-analysis" element={<PrivateRoute><MatchingAnalysis /></PrivateRoute>} />
        <Route path="/administration" element={<PrivateRoute><Administration /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
