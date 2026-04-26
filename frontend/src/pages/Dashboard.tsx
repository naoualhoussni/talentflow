import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Users, UserCheck, TrendingUp, ArrowUpRight,
  Activity, FileText, Clock, Calendar, ChevronRight,
  BarChart3, Target, Award, Zap, Eye, Star, Bell
} from 'lucide-react';
import { companyAPI, workflowAPI, employeesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  // Redirect candidates to their dedicated dashboard
  if (user?.role === 'CANDIDATE') {
    return <Navigate to="/candidate-dashboard" replace />;
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Use simulated data for all roles
      if (user?.role === 'EMPLOYEE') {
        const res = await employeesAPI.getDashboard();
        setStats(res.data);
        setPipeline(res.data.pipeline || []);
      } else {
        // RH, Manager, Admin
        try {
          const [statsRes, pipelineRes] = await Promise.all([
            companyAPI.stats(user?.companyId || '1'),
            workflowAPI.pipeline(),
          ]);
          setStats(statsRes.data);
          setPipeline(pipelineRes.data);
        } catch {
          // Fallback to realistic simulated data
          setStats({
            openJobs: 12,
            candidates: 156,
            approvedCandidates: 34,
            employees: 48,
            totalApplications: 89,
            interviewsThisWeek: 8,
            hireRate: 67,
            avgTimeToHire: 23,
          });
          setPipeline([
            { stage: 'APPLIED', count: 45 },
            { stage: 'CHATBOT_DONE', count: 32 },
            { stage: 'EVALUATED', count: 24 },
            { stage: 'INTERVIEW_SCHEDULED', count: 18 },
            { stage: 'APPROVED', count: 12 },
            { stage: 'HIRED', count: 8 },
            { stage: 'REJECTED', count: 15 },
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimateStats(true), 100);
    }
  };

  // Recent activities
  const recentActivities = user?.role === 'EMPLOYEE' ? [
    { action: 'Votre demande de congé a été approuvée', time: 'Il y a 1h', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { action: 'Nouvelle fiche de paie disponible', time: 'Il y a 3h', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { action: 'Entretien annuel planifié le 15/09', time: 'Hier', icon: Calendar, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { action: 'Formation React 18 disponible', time: 'Il y a 2j', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { action: 'Évaluation de performance mise à jour', time: 'Il y a 3j', icon: Star, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ] : [
    { action: 'David Laurent a réussi l\'entretien technique', time: 'Il y a 30min', icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { action: 'Nouvelle candidature pour "Dev Full Stack"', time: 'Il y a 2h', icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { action: 'Emma Garcia passe en phase d\'offre', time: 'Il y a 4h', icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { action: 'Entretien programmé avec Lucas Moreau', time: 'Hier', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { action: '3 CV analysés par l\'IA', time: 'Hier', icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { action: 'Rapport mensuel de recrutement généré', time: 'Il y a 2j', icon: BarChart3, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  // Top candidates
  const topCandidates = [
    { name: 'David Laurent', role: 'Dev Full Stack', score: 94, avatar: 'DL', trend: '+5%' },
    { name: 'Emma Garcia', role: 'UX Designer', score: 91, avatar: 'EG', trend: '+3%' },
    { name: 'Lucas Moreau', role: 'Data Scientist', score: 89, avatar: 'LM', trend: '+8%' },
    { name: 'Sophie Blanc', role: 'Chef de Projet', score: 85, avatar: 'SB', trend: '+2%' },
  ];

  const employeeStatCards = [
    { title: 'Mes Documents', value: stats?.myDocuments || 12, icon: FileText, change: '+2 ce mois', color: 'from-violet-500 to-violet-700', percentage: 85 },
    { title: 'Demandes approuvées', value: stats?.approvedRequests || 9, icon: UserCheck, change: '3 en cours', color: 'from-emerald-500 to-emerald-700', percentage: 75 },
    { title: 'Score Performance', value: stats?.performanceScore || '4.2/5', icon: Star, change: '+0.3 vs dernier', color: 'from-blue-500 to-blue-700', percentage: 84 },
    { title: 'Congés restants', value: stats?.remainingLeaves || 18, icon: Calendar, change: 'jours disponibles', color: 'from-amber-500 to-orange-600', percentage: 60 },
  ];

  const rhStatCards = [
    { title: 'Postes ouverts', value: stats?.openJobs || 12, icon: Briefcase, change: '+3 ce mois', color: 'from-violet-500 to-violet-700', percentage: 78 },
    { title: 'Candidats actifs', value: stats?.candidates || 156, icon: Users, change: '+12 cette semaine', color: 'from-blue-500 to-blue-700', percentage: 65 },
    { title: 'Taux d\'embauche', value: `${stats?.hireRate || 67}%`, icon: Target, change: '+5% vs Q3', color: 'from-emerald-500 to-emerald-700', percentage: 67 },
    { title: 'Temps moyen', value: `${stats?.avgTimeToHire || 23}j`, icon: Clock, change: '-3j vs mois dernier', color: 'from-amber-500 to-orange-600', percentage: 45 },
  ];

  const statCards = user?.role === 'EMPLOYEE' ? employeeStatCards : rhStatCards;

  const pipelineColors: Record<string, string> = {
    'APPLIED': 'bg-blue-500',
    'CHATBOT_DONE': 'bg-cyan-500',
    'EVALUATED': 'bg-violet-500',
    'INTERVIEW_SCHEDULED': 'bg-amber-500',
    'APPROVED': 'bg-emerald-500',
    'REJECTED': 'bg-red-500',
    'HIRED': 'bg-green-500',
    'REQUESTED': 'bg-blue-500',
    'PROCESSING': 'bg-amber-500',
  };

  const pipelineLabels: Record<string, string> = {
    'APPLIED': 'Candidatures',
    'CHATBOT_DONE': 'Chatbot complété',
    'EVALUATED': 'Évalué',
    'INTERVIEW_SCHEDULED': 'Entretien planifié',
    'APPROVED': 'Approuvé',
    'REJECTED': 'Rejeté',
    'HIRED': 'Embauché',
    'REQUESTED': 'Demandé',
    'PROCESSING': 'En traitement',
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center animate-pulse">
            <Zap className="w-6 h-6 text-violet-400" />
          </div>
          <p className="text-slate-400 text-sm">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">
            Bonjour, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            {user?.role === 'EMPLOYEE'
              ? 'Voici un résumé de votre espace personnel'
              : 'Voici un aperçu de votre activité RH'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 group hover:border-slate-700 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <p className="text-3xl font-bold text-slate-100">{card.value}</p>
            <p className="text-sm text-slate-400 mt-1">{card.title}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={animateStats ? { width: `${card.percentage}%` } : {}}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                />
              </div>
              <span className="text-xs text-emerald-500/70">{card.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline / Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold">
                {user?.role === 'EMPLOYEE' ? 'Mes demandes' : 'Pipeline de recrutement'}
              </h2>
            </div>
            <button 
              onClick={() => navigate(user?.role === 'EMPLOYEE' ? '/my-documents' : '/pipeline')}
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              Voir tout <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {pipeline.length > 0 ? (
            <div className="space-y-4">
              {pipeline.map((stage: any, i: number) => {
                const total = pipeline.reduce((s: number, p: any) => s + p.count, 0);
                const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
                return (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-slate-300">{pipelineLabels[stage.stage] || stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{pct}%</span>
                        <span className="text-sm font-semibold text-slate-200">{stage.count}</span>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={animateStats ? { width: `${pct}%` } : {}}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        className={`h-full rounded-full ${pipelineColors[stage.stage] || 'bg-slate-500'} transition-all duration-700`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Aucune donnée disponible.</p>
            </div>
          )}

          {/* Mini chart visualization */}
          {user?.role !== 'EMPLOYEE' && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-medium text-slate-400 mb-4">Tendance des candidatures (30 jours)</h3>
              <div className="flex items-end gap-1.5 h-24">
                {[25, 40, 35, 55, 48, 62, 45, 70, 58, 75, 65, 82, 72, 88, 78, 95, 85, 92, 80, 98, 88, 105, 95, 110, 100, 115, 108, 120, 112, 125].map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={animateStats ? { height: `${(val / 130) * 100}%` } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.02 }}
                    className="flex-1 bg-gradient-to-t from-violet-600/60 to-violet-400/30 rounded-sm hover:from-violet-600 hover:to-violet-400 transition-colors cursor-pointer group relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {val}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-600 mt-2">
                <span>25 Mars</span>
                <span>Aujourd'hui</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Top Candidates / Quick Stats */}
          {user?.role !== 'EMPLOYEE' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Top Candidats
                </h2>
                <button 
                  onClick={() => navigate('/candidates')}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Voir tout
                </button>
              </div>
              <div className="space-y-3">
                {topCandidates.map((candidate, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                      {candidate.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{candidate.name}</p>
                      <p className="text-xs text-slate-500 truncate">{candidate.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">{candidate.score}%</p>
                      <p className="text-xs text-emerald-500/70">{candidate.trend}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-400" />
                Mon espace
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Score Performance', value: '4.2/5', icon: Star, color: 'text-amber-400' },
                  { label: 'Prochain entretien', value: stats?.nextReview || '15/09/26', icon: Calendar, color: 'text-violet-400' },
                  { label: 'Documents en cours', value: '2', icon: FileText, color: 'text-blue-400' },
                  { label: 'Formations suivies', value: '3', icon: Award, color: 'text-emerald-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-sm text-slate-400">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-violet-400" />
                Activité récente
              </h2>
            </div>
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-start gap-3 group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.bg}`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-300 leading-tight">{activity.action}</p>
                    <p className="text-xs text-slate-600 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
