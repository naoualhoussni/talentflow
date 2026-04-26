import React, { useState, useEffect } from 'react';
import { Briefcase, Users, UserCheck, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import { companyAPI, workflowAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (user?.companyId) {
        const [statsRes, pipelineRes] = await Promise.all([
          companyAPI.stats(user.companyId),
          workflowAPI.pipeline(),
        ]);
        setStats(statsRes.data);
        setPipeline(pipelineRes.data);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = user?.role === 'EMPLOYEE' ? [
    { title: 'Mes Documents', value: stats?.myDocuments || 0, icon: Briefcase, change: 'Demandes en cours', color: 'from-violet-500 to-violet-700' },
    { title: 'Demandes approuvées', value: stats?.approvedRequests || 0, icon: UserCheck, change: 'Ce mois-ci', color: 'from-emerald-500 to-emerald-700' },
    { title: 'Évaluations', value: stats?.evaluations || 0, icon: Activity, change: 'Performance', color: 'from-blue-500 to-blue-700' },
    { title: 'Congés restants', value: stats?.remainingLeaves || 0, icon: TrendingUp, change: 'Jours disponibles', color: 'from-amber-500 to-orange-600' },
  ] : [
    { title: 'Postes ouverts', value: stats?.openJobs || 0, icon: Briefcase, change: '+3 ce mois', color: 'from-violet-500 to-violet-700' },
    { title: 'Candidats actifs', value: stats?.candidates || 0, icon: Users, change: '+12 cette semaine', color: 'from-blue-500 to-blue-700' },
    { title: 'Approuvés', value: stats?.approvedCandidates || 0, icon: UserCheck, change: '67% taux', color: 'from-emerald-500 to-emerald-700' },
    { title: 'Employés', value: stats?.employees || 0, icon: TrendingUp, change: 'Effectif total', color: 'from-amber-500 to-orange-600' },
  ];

  const pipelineColors: Record<string, string> = {
    'APPLIED': 'bg-blue-500',
    'CHATBOT_DONE': 'bg-cyan-500',
    'EVALUATED': 'bg-violet-500',
    'INTERVIEW_SCHEDULED': 'bg-amber-500',
    'APPROVED': 'bg-emerald-500',
    'REJECTED': 'bg-red-500',
    'HIRED': 'bg-green-500'
  };

  const pipelineLabels: Record<string, string> = {
    'APPLIED': 'Candidatures',
    'CHATBOT_DONE': 'Chatbot complété',
    'EVALUATED': 'Évalué',
    'INTERVIEW_SCHEDULED': 'Entretien planifié',
    'APPROVED': 'Approuvé',
    'REJECTED': 'Rejeté',
    'HIRED': 'Embauché'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-violet-500 text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {user?.role === 'EMPLOYEE' ? 'Tableau de bord' : 'Dashboard RH'}
        </h1>
        <p className="text-slate-400">
          {user?.role === 'EMPLOYEE' 
            ? 'Bienvenue dans votre espace personnel' 
            : 'Vue d\'ensemble du processus de recrutement'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card p-6 group hover:border-slate-700 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <p className="text-3xl font-bold text-slate-100">{loading ? '—' : card.value}</p>
            <p className="text-sm text-slate-400 mt-1">{card.title}</p>
            <p className="text-xs text-emerald-500/70 mt-2">{card.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {user?.role === 'EMPLOYEE' ? (
          /* Employee Information */
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold">Mes Informations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Profil</h3>
                <p className="text-slate-200">{user?.name}</p>
                <p className="text-sm text-slate-400">{user?.email}</p>
                <p className="text-sm text-emerald-400 mt-1">Statut: Actif</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Accès rapide</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-slate-200 hover:text-violet-400 transition-colors">
                    📄 Mes Documents
                  </button>
                  <button className="w-full text-left text-sm text-slate-200 hover:text-violet-400 transition-colors">
                    ⚙️ Paramètres
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Pipeline Overview */
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold">Pipeline de recrutement</h2>
            </div>
            
            {pipeline.length > 0 ? (
              <div className="space-y-4">
                {pipeline.map((stage: any) => {
                  const total = pipeline.reduce((s: number, p: any) => s + p.count, 0);
                  const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
                  return (
                    <div key={stage.stage} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-slate-300">{pipelineLabels[stage.stage] || stage.stage}</span>
                        <span className="text-sm font-semibold text-slate-200">{stage.count}</span>
                      </div>
                      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pipelineColors[stage.stage] || 'bg-slate-500'} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Aucune donnée dans le pipeline encore.</p>
                <p className="text-sm mt-1">Ajoutez des candidats pour voir le flux.</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6">Statistiques rapides</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <div>
                <p className="text-sm text-slate-400">Total évaluations</p>
                <p className="text-2xl font-bold text-slate-100">{stats?.evaluations || 0}</p>
              </div>
              <div className="text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <div>
                <p className="text-sm text-slate-400">Taux de conversion</p>
                <p className="text-2xl font-bold text-slate-100">
                  {stats?.conversionRate ? `${stats.conversionRate}%` : '0%'}
                </p>
              </div>
              <div className="text-violet-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <div>
                <p className="text-sm text-slate-400">Temps moyen</p>
                <p className="text-2xl font-bold text-slate-100">
                  {stats?.avgTime ? `${stats.avgTime}j` : '0j'}
                </p>
              </div>
              <div className="text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
