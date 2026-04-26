import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Lock, 
  Activity, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Key,
  UserPlus,
  UserX,
  RefreshCw,
  Database,
  Server,
  Globe,
  Clock
} from 'lucide-react';
import { adminAPI, companiesAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
  createdAt: string;
  lastLogin?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

interface Company {
  id: string;
  name: string;
  domain: string;
  plan: string;
  createdAt: string;
  userCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

interface SystemStats {
  totalUsers: number;
  totalCompanies: number;
  activeUsers: number;
  suspendedUsers: number;
  totalLogins: number;
  securityAlerts: number;
  systemUptime: string;
  databaseSize: string;
  apiCalls: number;
  errorRate: number;
  lastBackup: string;
  serverStatus: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
}

const Administration: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'companies' | 'security' | 'system'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalCompanies: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalLogins: 0,
    securityAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        await loadUsers();
      } else if (activeTab === 'companies') {
        await loadCompanies();
      } else if (activeTab === 'system') {
        await loadSystemStats();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadCompanies = async () => {
    try {
      const { data } = await adminAPI.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadSystemStats = async () => {
    try {
      // Simulate comprehensive system data for super admin
      setStats({
        totalUsers: 156,
        totalCompanies: 24,
        activeUsers: 142,
        suspendedUsers: 8,
        totalLogins: 2847,
        securityAlerts: 12,
        systemUptime: '99.8%',
        databaseSize: '2.4 GB',
        apiCalls: 45678,
        errorRate: 0.02,
        lastBackup: '2026-04-19 02:30',
        serverStatus: 'ONLINE'
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      await adminAPI.createUser(userData);
      setShowUserModal(false);
      loadUsers();
    } catch (error) {
      alert('Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      await adminAPI.updateUser(selectedUser?.id || '', userData);
      setShowUserModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      alert('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      loadUsers();
    } catch (error) {
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      await adminAPI.updateUserStatus(userId, { status: 'SUSPENDED' });
      loadUsers();
    } catch (error) {
      alert('Erreur lors de la suspension de l\'utilisateur');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await adminAPI.updateUserStatus(userId, { status: 'ACTIVE' });
      loadUsers();
    } catch (error) {
      alert('Erreur lors de l\'activation de l\'utilisateur');
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur?')) return;
    
    try {
      await adminAPI.resetUserPassword(userId, { newPassword: 'tempPassword123' });
      alert('Mot de passe réinitialisé avec succès');
    } catch (error) {
      alert('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'INACTIVE': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'SUSPENDED': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'RH': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'MANAGER': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'EMPLOYEE': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'CANDIDATE': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-violet-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Administration Système</h1>
        <p className="text-slate-400">Gestion des comptes, sécurité et configuration système</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 border-b border-slate-800">
        {[
          { id: 'users', label: 'Utilisateurs', icon: Users },
          { id: 'companies', label: 'Entreprises', icon: Globe },
          { id: 'security', label: 'Sécurité', icon: Shield },
          { id: 'system', label: 'Système', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              >
                <option value="all">Tous les rôles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="RH">RH</option>
                <option value="MANAGER">Manager</option>
                <option value="EMPLOYEE">Employé</option>
                <option value="CANDIDATE">Candidat</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              >
                <option value="all">Tous les statuts</option>
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="SUSPENDED">Suspendu</option>
              </select>
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter un utilisateur
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dernière connexion</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-200 font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${getStatusColor(user.status)}`}>
                        {user.status === 'ACTIVE' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {user.status === 'INACTIVE' && <XCircle className="w-3 h-3 mr-1" />}
                        {user.status === 'SUSPENDED' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Réinitialiser mot de passe"
                        >
                          <Key className="w-4 h-4 text-amber-400" />
                        </button>
                        {user.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Suspendre"
                          >
                            <UserX className="w-4 h-4 text-red-400" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(user.id)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Activer"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Gestion des Entreprises</h2>
            <button
              onClick={() => setShowCompanyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              Ajouter une entreprise
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                    <p className="text-slate-400 text-sm">{company.domain}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${getStatusColor(company.status)}`}>
                    {company.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Plan:</span>
                    <span className="text-slate-200">{company.plan}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Utilisateurs:</span>
                    <span className="text-slate-200">{company.userCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Créée le:</span>
                    <span className="text-slate-200">{new Date(company.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Sécurité Système</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Alertes de sécurité</h3>
                  <p className="text-2xl font-bold text-red-400">2</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">2 alertes nécessitent une attention immédiate</p>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Connexions suspectes</h3>
                  <p className="text-2xl font-bold text-amber-400">5</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">5 connexions suspectes détectées cette semaine</p>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Sécurité active</h3>
                  <p className="text-2xl font-bold text-emerald-400">98%</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">98% des mesures de sécurité sont actives</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Actions de sécurité récentes</h3>
            <div className="space-y-3">
              {[
                { action: 'Tentative de connexion multiple', user: 'user@example.com', time: 'Il y a 5 min', severity: 'high' },
                { action: 'Mot de passe réinitialisé', user: 'admin@company.com', time: 'Il y a 1h', severity: 'medium' },
                { action: 'Nouvel appareil connecté', user: 'manager@company.com', time: 'Il y a 3h', severity: 'low' }
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      log.severity === 'high' ? 'bg-red-400' :
                      log.severity === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    <div>
                      <p className="text-slate-200">{log.action}</p>
                      <p className="text-slate-400 text-sm">{log.user}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Statistiques Système</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Utilisateurs totaux</h3>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Entreprises</h3>
                  <p className="text-2xl font-bold text-emerald-400">{stats.totalCompanies}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Connexions/jour</h3>
                  <p className="text-2xl font-bold text-violet-400">{stats.totalLogins}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Alertes sécurité</h3>
                  <p className="text-2xl font-bold text-red-400">{stats.securityAlerts}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">État du système</h3>
              <div className="space-y-3">
                {[
                  { service: 'Base de données', status: 'Opérationnelle', uptime: '99.9%' },
                  { service: 'API', status: 'Opérationnelle', uptime: '99.8%' },
                  { service: 'Authentification', status: 'Opérationnelle', uptime: '100%' },
                  { service: 'Notifications', status: 'Opérationnelle', uptime: '98.5%' }
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-slate-200">{service.service}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-300 text-sm">{service.status}</p>
                      <p className="text-slate-400 text-xs">{service.uptime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions système</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-200">Sauvegarder la base de données</span>
                  </div>
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-amber-400" />
                    <span className="text-slate-200">Redémarrer les services</span>
                  </div>
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-400" />
                    <span className="text-slate-200">Scanner de sécurité</span>
                  </div>
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administration;
