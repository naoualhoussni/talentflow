import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  AlertTriangle, 
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  User,
  Target,
  Award,
  Zap,
  Shield
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  performance: number; // 1-5
  potential: number; // 1-5
  lastReview: string;
  nextReview: string;
  skills: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface BoxData {
  title: string;
  description: string;
  color: string;
  icon: React.ElementType;
  employees: Employee[];
  action: string;
}

const NineBoxMatrix: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      // Simulate employee data for 9-box matrix
      const mockEmployees: Employee[] = [
        {
          id: '1',
          name: 'Jean Dupont',
          email: 'jean.dupont@company.com',
          department: 'Développement',
          position: 'Senior Developer',
          performance: 5,
          potential: 5,
          lastReview: '2026-03-15',
          nextReview: '2026-09-15',
          skills: ['React', 'Node.js', 'TypeScript', 'Leadership'],
          riskLevel: 'LOW'
        },
        {
          id: '2',
          name: 'Marie Martin',
          email: 'marie.martin@company.com',
          department: 'Marketing',
          position: 'Marketing Manager',
          performance: 4,
          potential: 5,
          lastReview: '2026-02-20',
          nextReview: '2026-08-20',
          skills: ['Digital Marketing', 'Analytics', 'Strategy', 'Team Management'],
          riskLevel: 'LOW'
        },
        {
          id: '3',
          name: 'Pierre Durand',
          email: 'pierre.durand@company.com',
          department: 'Ventes',
          position: 'Sales Representative',
          performance: 3,
          potential: 5,
          lastReview: '2026-01-10',
          nextReview: '2026-07-10',
          skills: ['Sales', 'CRM', 'Negotiation', 'Customer Relations'],
          riskLevel: 'MEDIUM'
        },
        {
          id: '4',
          name: 'Sophie Petit',
          email: 'sophie.petit@company.com',
          department: 'RH',
          position: 'HR Specialist',
          performance: 5,
          potential: 4,
          lastReview: '2026-03-01',
          nextReview: '2026-09-01',
          skills: ['Recruitment', 'Training', 'Employee Relations', 'HRIS'],
          riskLevel: 'LOW'
        },
        {
          id: '5',
          name: 'Thomas Bernard',
          email: 'thomas.bernard@company.com',
          department: 'Finance',
          position: 'Financial Analyst',
          performance: 4,
          potential: 4,
          lastReview: '2026-02-15',
          nextReview: '2026-08-15',
          skills: ['Financial Analysis', 'Excel', 'Reporting', 'Budgeting'],
          riskLevel: 'LOW'
        },
        {
          id: '6',
          name: 'Camille Leroy',
          email: 'camille.leroy@company.com',
          department: 'Développement',
          position: 'Frontend Developer',
          performance: 3,
          potential: 4,
          lastReview: '2026-01-25',
          nextReview: '2026-07-25',
          skills: ['React', 'CSS', 'JavaScript', 'UI/UX'],
          riskLevel: 'MEDIUM'
        },
        {
          id: '7',
          name: 'Nicolas Rousseau',
          email: 'nicolas.rousseau@company.com',
          department: 'Support',
          position: 'Support Specialist',
          performance: 2,
          potential: 4,
          lastReview: '2026-02-10',
          nextReview: '2026-08-10',
          skills: ['Customer Support', 'Troubleshooting', 'Communication'],
          riskLevel: 'HIGH'
        },
        {
          id: '8',
          name: 'Isabelle Moreau',
          email: 'isabelle.moreau@company.com',
          department: 'Opérations',
          position: 'Operations Manager',
          performance: 4,
          potential: 3,
          lastReview: '2026-03-10',
          nextReview: '2026-09-10',
          skills: ['Operations', 'Process Optimization', 'Team Leadership'],
          riskLevel: 'LOW'
        },
        {
          id: '9',
          name: 'David Laurent',
          email: 'david.laurent@company.com',
          department: 'Développement',
          position: 'Junior Developer',
          performance: 3,
          potential: 3,
          lastReview: '2026-02-05',
          nextReview: '2026-08-05',
          skills: ['JavaScript', 'React', 'Git', 'Basic Programming'],
          riskLevel: 'MEDIUM'
        },
        {
          id: '10',
          name: 'Emma Garcia',
          email: 'emma.garcia@company.com',
          department: 'Design',
          position: 'UX Designer',
          performance: 5,
          potential: 3,
          lastReview: '2026-03-20',
          nextReview: '2026-09-20',
          skills: ['UX Design', 'Figma', 'User Research', 'Prototyping'],
          riskLevel: 'LOW'
        },
        {
          id: '11',
          name: 'Lucas Petit',
          email: 'lucas.petit@company.com',
          department: 'Ventes',
          position: 'Sales Associate',
          performance: 2,
          potential: 3,
          lastReview: '2026-01-15',
          nextReview: '2026-07-15',
          skills: ['Sales', 'Communication', 'CRM'],
          riskLevel: 'HIGH'
        },
        {
          id: '12',
          name: 'Chloe Dubois',
          email: 'chloe.dubois@company.com',
          department: 'Marketing',
          position: 'Content Manager',
          performance: 3,
          potential: 2,
          lastReview: '2026-02-25',
          nextReview: '2026-08-25',
          skills: ['Content Creation', 'SEO', 'Social Media'],
          riskLevel: 'MEDIUM'
        }
      ];
      
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBoxData = (performance: number, potential: number): BoxData => {
    const boxes: Record<string, BoxData> = {
      '5-5': {
        title: 'Stars',
        description: 'Haute performance, haut potentiel',
        color: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
        icon: Star,
        employees: employees.filter(e => e.performance === 5 && e.potential === 5),
        action: 'Développer pour leadership'
      },
      '4-5': {
        title: 'High Potentials',
        description: 'Bonne performance, haut potentiel',
        color: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
        icon: TrendingUp,
        employees: employees.filter(e => e.performance === 4 && e.potential === 5),
        action: 'Programme de développement'
      },
      '3-5': {
        title: 'Future Stars',
        description: 'Performance moyenne, haut potentiel',
        color: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
        icon: Zap,
        employees: employees.filter(e => e.performance === 3 && e.potential === 5),
        action: 'Coaching intensif'
      },
      '5-4': {
        title: 'Solid Performers',
        description: 'Haute performance, bon potentiel',
        color: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
        icon: Award,
        employees: employees.filter(e => e.performance === 5 && e.potential === 4),
        action: 'Maintenir et récompenser'
      },
      '4-4': {
        title: 'Core Employees',
        description: 'Bonne performance, bon potentiel',
        color: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400',
        icon: Shield,
        employees: employees.filter(e => e.performance === 4 && e.potential === 4),
        action: 'Développement continu'
      },
      '3-4': {
        title: 'Promising',
        description: 'Performance moyenne, bon potentiel',
        color: 'bg-violet-500/20 border-violet-500/50 text-violet-400',
        icon: ArrowUp,
        employees: employees.filter(e => e.performance === 3 && e.potential === 4),
        action: 'Plan de progression'
      },
      '5-3': {
        title: 'Experts',
        description: 'Haute performance, potentiel moyen',
        color: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
        icon: Target,
        employees: employees.filter(e => e.performance === 5 && e.potential === 3),
        action: 'Reconnaître expertise'
      },
      '4-3': {
        title: 'Reliable',
        description: 'Bonne performance, potentiel moyen',
        color: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
        icon: CheckCircle,
        employees: employees.filter(e => e.performance === 4 && e.potential === 3),
        action: 'Maintenir engagement'
      },
      '3-3': {
        title: 'Solid Contributors',
        description: 'Performance moyenne, potentiel moyen',
        color: 'bg-slate-500/20 border-slate-500/50 text-slate-400',
        icon: Users,
        employees: employees.filter(e => e.performance === 3 && e.potential === 3),
        action: 'Développement de compétences'
      },
      '2-5': {
        title: 'Question Marks',
        description: 'Basse performance, haut potentiel',
        color: 'bg-red-500/20 border-red-500/50 text-red-400',
        icon: AlertTriangle,
        employees: employees.filter(e => e.performance === 2 && e.potential === 5),
        action: 'Diagnostic et soutien'
      },
      '2-4': {
        title: 'Underperformers',
        description: 'Basse performance, bon potentiel',
        color: 'bg-rose-500/20 border-rose-500/50 text-rose-400',
        icon: TrendingDown,
        employees: employees.filter(e => e.performance === 2 && e.potential === 4),
        action: 'Plan d\'amélioration'
      },
      '2-3': {
        title: 'At Risk',
        description: 'Basse performance, potentiel moyen',
        color: 'bg-red-600/20 border-red-600/50 text-red-400',
        icon: AlertTriangle,
        employees: employees.filter(e => e.performance === 2 && e.potential === 3),
        action: 'Intervention urgente'
      },
      '1-5': {
        title: 'Misplaced Stars',
        description: 'Très basse performance, haut potentiel',
        color: 'bg-red-700/20 border-red-700/50 text-red-400',
        icon: AlertTriangle,
        employees: employees.filter(e => e.performance === 1 && e.potential === 5),
        action: 'Réaffectation ou coaching'
      },
      '1-4': {
        title: 'Problematic',
        description: 'Très basse performance, bon potentiel',
        color: 'bg-red-800/20 border-red-800/50 text-red-400',
        icon: AlertTriangle,
        employees: employees.filter(e => e.performance === 1 && e.potential === 4),
        action: 'Plan de performance'
      },
      '1-3': {
        title: 'Poor Performers',
        description: 'Très basse performance, potentiel moyen',
        color: 'bg-red-900/20 border-red-900/50 text-red-400',
        icon: AlertTriangle,
        employees: employees.filter(e => e.performance === 1 && e.potential === 3),
        action: 'PIP ou transition'
      }
    };

    return boxes[`${performance}-${potential}`] || boxes['3-3'];
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'HIGH': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const renderBox = (performance: number, potential: number) => {
    const boxData = getBoxData(performance, potential);
    const Icon = boxData.icon;
    const boxKey = `${performance}-${potential}`;
    
    return (
      <div
        key={boxKey}
        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${boxData.color} ${
          selectedBox === parseInt(boxKey) ? 'ring-2 ring-white ring-opacity-50' : ''
        }`}
        onClick={() => setSelectedBox(parseInt(boxKey))}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5" />
          <h4 className="font-semibold text-sm">{boxData.title}</h4>
        </div>
        <p className="text-xs opacity-80 mb-3">{boxData.description}</p>
        
        <div className="space-y-1">
          {boxData.employees.slice(0, 3).map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-1 rounded hover:bg-white/10 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEmployee(employee);
              }}
            >
              <span className="text-xs truncate flex-1">{employee.name}</span>
              <div className={`w-2 h-2 rounded-full ${
                employee.riskLevel === 'LOW' ? 'bg-emerald-400' :
                employee.riskLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-red-400'
              }`} />
            </div>
          ))}
          {boxData.employees.length > 3 && (
            <div className="text-xs opacity-60 text-center">
              +{boxData.employees.length - 3} autres
            </div>
          )}
        </div>
        
        <div className="mt-2 text-xs font-medium">
          {boxData.employees.length} employé(s)
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-violet-500">Chargement de la matrice de performance...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Matrice 9 Box - Performance & Potentiel</h1>
        <p className="text-slate-400">Analysez la performance et le potentiel de vos employés pour optimiser le développement des talents</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Employés</p>
              <p className="text-2xl font-bold text-white">{employees.length}</p>
            </div>
            <Users className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Haut Potentiel</p>
              <p className="text-2xl font-bold text-emerald-400">
                {employees.filter(e => e.potential >= 4).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Haute Performance</p>
              <p className="text-2xl font-bold text-blue-400">
                {employees.filter(e => e.performance >= 4).length}
              </p>
            </div>
            <Star className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">À Risque</p>
              <p className="text-2xl font-bold text-red-400">
                {employees.filter(e => e.riskLevel === 'HIGH').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* 9-Box Matrix */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Matrice de Performance</h2>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full" />
              <span>Performance Élevée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full" />
              <span>Performance Moyenne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span>Performance Faible</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* High Performance Row */}
          <div className="space-y-4">
            {renderBox(5, 5)}
            {renderBox(5, 4)}
            {renderBox(5, 3)}
          </div>
          
          {/* Medium Performance Row */}
          <div className="space-y-4">
            {renderBox(4, 5)}
            {renderBox(4, 4)}
            {renderBox(4, 3)}
          </div>
          
          {/* Low Performance Row */}
          <div className="space-y-4">
            {renderBox(3, 5)}
            {renderBox(3, 4)}
            {renderBox(3, 3)}
          </div>
        </div>

        {/* Axis Labels */}
        <div className="mt-6 flex justify-between text-sm text-slate-400">
          <div className="flex flex-col items-center">
            <ArrowUp className="w-4 h-4 mb-1" />
            <span>Potentiel Élevé</span>
          </div>
          <div className="flex flex-col items-center">
            <Minus className="w-4 h-4 mb-1" />
            <span>Potentiel Moyen</span>
          </div>
          <div className="flex flex-col items-center">
            <ArrowDown className="w-4 h-4 mb-1" />
            <span>Potentiel Faible</span>
          </div>
        </div>
      </div>

      {/* Selected Box Details */}
      {selectedBox && (
        <div className="mt-8 bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Détails - {getBoxData(Math.floor(selectedBox / 10) || 3, (selectedBox % 10) || 3).title}
          </h3>
          <p className="text-slate-400 mb-4">
            {getBoxData(Math.floor(selectedBox / 10) || 3, (selectedBox % 10) || 3).description}
          </p>
          
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full border text-sm bg-violet-500/10 text-violet-400 border-violet-500/30">
              Action recommandée: {getBoxData(Math.floor(selectedBox / 10) || 3, (selectedBox % 10) || 3).action}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getBoxData(Math.floor(selectedBox / 10) || 3, (selectedBox % 10) || 3).employees.map((employee) => (
              <div
                key={employee.id}
                className="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => setSelectedEmployee(employee)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{employee.name}</h4>
                      <p className="text-sm text-slate-400">{employee.position}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs border ${getRiskColor(employee.riskLevel)}`}>
                    {employee.riskLevel}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Département:</span>
                    <span className="text-slate-200">{employee.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dernière évaluation:</span>
                    <span className="text-slate-200">{new Date(employee.lastReview).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prochaine évaluation:</span>
                    <span className="text-slate-200">{new Date(employee.nextReview).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full mx-4 border border-slate-800 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white">Détails Employé</h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{selectedEmployee.name}</h4>
                  <p className="text-slate-400">{selectedEmployee.position}</p>
                  <p className="text-sm text-slate-500">{selectedEmployee.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Performance</h5>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-400 h-2 rounded-full" 
                        style={{ width: `${(selectedEmployee.performance / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-emerald-400 font-medium">{selectedEmployee.performance}/5</span>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Potentiel</h5>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full" 
                        style={{ width: `${(selectedEmployee.potential / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-blue-400 font-medium">{selectedEmployee.potential}/5</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-slate-300 mb-2">Compétences</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/30 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Département</h5>
                  <p className="text-slate-200">{selectedEmployee.department}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Niveau de Risque</h5>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${getRiskColor(selectedEmployee.riskLevel)}`}>
                    {selectedEmployee.riskLevel}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Dernière Évaluation</h5>
                  <p className="text-slate-200">{new Date(selectedEmployee.lastReview).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Prochaine Évaluation</h5>
                  <p className="text-slate-200">{new Date(selectedEmployee.nextReview).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Fermer
              </button>
              <button
                className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
              >
                Voir le Profil Complet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NineBoxMatrix;
