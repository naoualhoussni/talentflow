import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, TrendingDown, Users } from 'lucide-react';
import { employeesAPI } from '../services/api';

const EmployeeRisk: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState('');
  const [assessing, setAssessing] = useState<string | null>(null);

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    try {
      const { data } = await employeesAPI.list();
      setEmployees(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAssessRisk = async (emp: any) => {
    setAssessing(emp.id);
    try {
      const performanceScore = Math.random() * 40 + 60; // mock
      const attendanceRate = Math.random() * 20 + 80;
      const satisfactionScore = Math.random() * 30 + 60;
      const { data } = await employeesAPI.assessRisk(emp.id, { performanceScore, attendanceRate, satisfactionScore });
      alert(`Risque: ${data.riskLevel} (Score: ${data.riskScore.toFixed(1)})`);
      loadEmployees();
    } catch (err) { console.error(err); }
    finally { setAssessing(null); }
  };

  const riskColors: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
    LOW: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle },
    MEDIUM: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: AlertTriangle },
    HIGH: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: ShieldAlert },
  };

  const filtered = employees.filter(e => !filterRisk || e.riskLevel === filterRisk);

  const riskSummary = {
    low: employees.filter(e => e.riskLevel === 'LOW').length,
    medium: employees.filter(e => e.riskLevel === 'MEDIUM').length,
    high: employees.filter(e => e.riskLevel === 'HIGH').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <ShieldAlert className="w-7 h-7 text-violet-400" /> Gestion des risques employés
        </h1>
        <p className="text-slate-500 text-sm mt-1">{employees.length} employés suivis</p>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Risque faible', count: riskSummary.low, color: 'from-emerald-500 to-emerald-600', icon: CheckCircle },
          { label: 'Risque moyen', count: riskSummary.medium, color: 'from-amber-500 to-amber-600', icon: AlertTriangle },
          { label: 'Risque élevé', count: riskSummary.high, color: 'from-red-500 to-red-600', icon: ShieldAlert },
        ].map((item, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-3xl font-bold text-slate-100">{item.count}</p>
            </div>
            <p className="text-sm text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filter buttons */}
      <div className="flex gap-3">
        {['', 'LOW', 'MEDIUM', 'HIGH'].map((f) => (
          <button key={f} onClick={() => setFilterRisk(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterRisk === f ? 'bg-violet-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
            {f === '' ? 'Tous' : f === 'LOW' ? 'Faible' : f === 'MEDIUM' ? 'Moyen' : 'Élevé'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Users className="w-16 h-16 mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400 text-lg">Aucun employé trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((emp) => {
            const risk = riskColors[emp.riskLevel] || riskColors.LOW;
            const RiskIcon = risk.icon;
            return (
              <div key={emp.id} className="glass-card p-6 hover:border-slate-700 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                      {emp.candidate?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{emp.candidate?.name || 'Employé'}</p>
                      <p className="text-xs text-slate-500">{emp.position || 'Position non définie'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${risk.bg} ${risk.text} ${risk.border} flex items-center gap-1`}>
                    <RiskIcon className="w-3 h-3" /> {emp.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-800/30 rounded-xl">
                    <p className="text-xs text-slate-500">Performance</p>
                    <p className="text-lg font-bold text-slate-200">{emp.performanceScore?.toFixed(0) || 0}%</p>
                  </div>
                  <div className="p-3 bg-slate-800/30 rounded-xl">
                    <p className="text-xs text-slate-500">Score Risque</p>
                    <p className={`text-lg font-bold ${risk.text}`}>{emp.riskScore?.toFixed(1) || 0}</p>
                  </div>
                </div>

                {emp.department && <p className="text-xs text-slate-500 mb-3">Département: {emp.department}</p>}

                <button onClick={() => handleAssessRisk(emp)} disabled={assessing === emp.id}
                  className="w-full py-2.5 bg-slate-800/50 hover:bg-violet-600/20 rounded-xl text-sm font-medium text-slate-300 hover:text-violet-400 border border-slate-700/50 hover:border-violet-500/30 transition-all disabled:opacity-30 flex items-center justify-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  {assessing === emp.id ? 'Évaluation...' : 'Réévaluer le risque'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeRisk;
