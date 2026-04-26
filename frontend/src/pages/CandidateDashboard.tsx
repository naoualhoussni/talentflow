import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Search, Filter, Star, Clock, 
  MapPin, DollarSign, Building, CheckCircle2,
  ChevronRight, ArrowUpRight, Target, FileText, Bot, TrendingUp, Eye, Edit, Plus, Calendar, Download, UserCheck, X
} from 'lucide-react';
import { candidatesAPI } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: string;
  appliedAt: string;
  lastUpdate: string;
  match?: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  type: string;
  department?: string;
  salary?: string;
  requirements: string;
  match?: number;
  createdAt: string;
}

const CandidateDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'jobs'>(
    location.hash === '#jobs' ? 'jobs' : 'dashboard'
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<any>({
    totalApplications: 0,
    interviews: 0,
    avgMatchRate: 0,
    lastActivity: '...'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (location.hash === '#jobs') setActiveTab('jobs');
  }, [location.hash]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await candidatesAPI.getDashboard();
      
      if (res && res.data) {
        const data = res.data;
        
        // Safe mapping for applications
        const mappedApps = (data.applications || []).map((app: any) => ({
          id: app?.id || Math.random().toString(),
          jobId: app?.jobId || '',
          jobTitle: app?.job?.title || 'Poste sans titre',
          company: app?.company?.name || 'TechFlow AI',
          status: app?.status || 'APPLIED',
          appliedAt: app?.createdAt || new Date().toISOString(),
          lastUpdate: app?.updatedAt || new Date().toISOString(),
          match: app?.score || 0
        }));
        
        // Safe mapping for jobs
        const mappedJobs = (data.recommendedJobs || []).map((job: any) => ({
          id: job?.id || Math.random().toString(),
          title: job?.title || 'Offre disponible',
          company: job?.company?.name || 'TechFlow AI',
          location: 'Remote / Hybride',
          type: 'CDI',
          department: job?.department || 'Général',
          salary: job?.salary || 'A négocier',
          requirements: job?.requirements || '',
          match: Math.floor(Math.random() * 15) + 80, // Simulation de matching élevé pour la démo
          createdAt: job?.createdAt || new Date().toISOString()
        }));

        setApplications(mappedApps);
        setRecommendedJobs(mappedJobs);
        setStats(data.stats || {
          totalApplications: mappedApps.length,
          interviews: mappedApps.filter((a: any) => a.status === 'INTERVIEW' || a.status === 'EVALUATED').length,
          avgMatchRate: mappedApps.length > 0 ? Math.round(mappedApps.reduce((acc: number, curr: any) => acc + (curr.match || 0), 0) / mappedApps.length) : 0,
          lastActivity: 'Aujourd\'hui'
        });
      }
    } catch (error: any) {
      console.error('Dashboard Error:', error);
      if (error.response?.status === 401) {
        // Session expired, logout safely
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'SCREENING': case 'EVALUATED': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'INTERVIEW': return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'OFFERED': case 'HIRED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'Candidature envoyée';
      case 'SCREENING': return 'En cours de screening';
      case 'EVALUATED': return 'Évalué par IA';
      case 'INTERVIEW': return 'Entretien planifié';
      case 'OFFERED': return 'Offre reçue';
      case 'HIRED': return 'Recruté';
      case 'REJECTED': return 'Candidature rejetée';
      default: return status;
    }
  };

  // Ultra-safe filter
  const filteredApplications = (applications || []).filter(app => {
    const title = (app?.jobTitle || '').toLowerCase();
    const search = (searchTerm || '').toLowerCase();
    return title.includes(search);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mb-4"></div>
        <div className="text-slate-400 text-sm font-medium animate-pulse">Chargement de votre espace talent...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenue, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-400">
          Suivez vos candidatures et découvrez des opportunités adaptées à votre profil.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 border-b border-slate-800">
        {[
          { id: 'dashboard', label: 'Vue d\'ensemble', icon: TrendingUp },
          { id: 'applications', label: 'Mes Candidatures', icon: FileText },
          { id: 'jobs', label: 'Offres Recommandées', icon: Briefcase }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-400 bg-violet-500/5'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-semibold text-sm uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 border border-white/5 hover:border-violet-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-violet-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-violet-400" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
              </div>
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Candidatures</h3>
              <p className="text-3xl font-bold text-white">{stats.totalApplications}</p>
            </div>

            <div className="glass-card p-6 border border-white/5 hover:border-emerald-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Entretiens</h3>
              <p className="text-3xl font-bold text-white">{stats.interviews}</p>
            </div>

            <div className="glass-card p-6 border border-white/5 hover:border-amber-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-amber-400" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Score Moyen</h3>
              <p className="text-3xl font-bold text-white">{stats.avgMatchRate}%</p>
            </div>

            <div className="glass-card p-6 border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Activité</h3>
              <p className="text-xl font-bold text-white">{stats.lastActivity}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-violet-400" />
                Candidatures Récentes
              </h2>
              <div className="space-y-4">
                {filteredApplications.slice(0, 3).map(app => (
                  <div key={app.id} className="glass-card p-5 border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl font-bold text-violet-400">
                        {app.jobTitle.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{app.jobTitle}</h4>
                        <p className="text-slate-400 text-sm">{app.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                        {getStatusText(app.status)}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                ))}
                {filteredApplications.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
                    <p className="text-slate-500">Aucune candidature pour le moment.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                Conseils IA
              </h2>
              <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20">
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  "Alice, votre profil est en forte adéquation avec le poste de **Senior Developer**. Pensez à mettre en avant vos projets React récents lors de votre prochain entretien."
                </p>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]"></div>
                </div>
                <p className="text-[10px] text-emerald-500 mt-2 font-bold uppercase tracking-widest">Optimisation de profil : 85%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications List Tab */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Suivi des Candidatures</h2>
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par intitulé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-sm"
              />
            </div>
          </div>

          <div className="glass-card overflow-hidden border border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Poste</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Statut</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date d'envoi</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Score IA</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredApplications.map(app => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{app.jobTitle}</div>
                      <div className="text-xs text-slate-500">{app.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(app.status)}`}>
                        {getStatusText(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{app.match}%</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500"
                            style={{ width: `${app.match}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-violet-500/10 rounded-lg text-slate-500 hover:text-violet-400 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Opportunités Recommandées</h2>
              <p className="text-slate-500 text-sm">Offres sélectionnées par notre IA en fonction de votre profil.</p>
            </div>
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filtres Avancés
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map(job => (
              <div key={job.id} className="glass-card p-6 border border-white/5 hover:border-violet-500/50 transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-md border border-emerald-500/20">
                      {job.match}% MATCH
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Budget : {job.salary}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors mb-1">{job.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{job.company} • {job.location}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['CDI', job.department].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-900 text-slate-500 text-[10px] font-bold rounded border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-violet-600/20 group-hover:translate-y-[-2px]">
                  Postuler maintenant
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
