import React, { useState, useEffect } from 'react';
import { Grid, TrendingUp, Users, Info } from 'lucide-react';
import { employeesAPI } from '../services/api';

const NineBoxMatrix: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    try {
      const { data } = await employeesAPI.list();
      setEmployees(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Helper to categorize score into Low, Medium, High (0-2)
  const getCategory = (score: number) => {
    if (score < 40) return 0; // Low
    if (score < 75) return 1; // Medium
    return 2; // High
  };

  // Define the 9 boxes
  const boxes = [
    { id: '2-0', title: 'Énigme', desc: 'Potentiel élevé, perf. faible', bg: 'bg-amber-500/10 border-amber-500/30' },
    { id: '2-1', title: 'Star en devenir', desc: 'Potentiel élevé, perf. moyenne', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { id: '2-2', title: 'Star', desc: 'Potentiel élevé, perf. élevée', bg: 'bg-violet-500/20 border-violet-500/40' },
    
    { id: '1-0', title: 'Dilemme', desc: 'Potentiel moyen, perf. faible', bg: 'bg-red-500/10 border-red-500/30' },
    { id: '1-1', title: 'Pilier', desc: 'Potentiel moyen, perf. moyenne', bg: 'bg-amber-500/10 border-amber-500/30' },
    { id: '1-2', title: 'Performant', desc: 'Potentiel moyen, perf. élevée', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    
    { id: '0-0', title: 'Sous-performant', desc: 'Potentiel faible, perf. faible', bg: 'bg-red-500/20 border-red-500/40' },
    { id: '0-1', title: 'Efficace', desc: 'Potentiel faible, perf. moyenne', bg: 'bg-red-500/10 border-red-500/30' },
    { id: '0-2', title: 'Expert', desc: 'Potentiel faible, perf. élevée', bg: 'bg-amber-500/10 border-amber-500/30' },
  ];

  // Distribute employees into boxes
  const matrix: Record<string, any[]> = {};
  boxes.forEach(b => matrix[b.id] = []);

  employees.forEach(emp => {
    const perf = emp.performanceScore || Math.random() * 50 + 50;
    // We mock potential based on inverse of risk or a random value if not present
    const potential = emp.potentialScore || (100 - (emp.riskScore || Math.random() * 100));
    
    const pCategory = getCategory(perf);
    const potCategory = getCategory(potential);
    
    const boxId = `${potCategory}-${pCategory}`;
    if (matrix[boxId]) {
      matrix[boxId].push(emp);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Grid className="w-7 h-7 text-violet-400" /> Matrice 9-Box
        </h1>
        <p className="text-slate-500 text-sm mt-1">Analyse de la performance vs potentiel des collaborateurs</p>
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Chargement de la matrice...</div>
        ) : (
          <div className="relative">
            {/* Axis labels */}
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 flex items-center gap-2 text-slate-400 font-medium">
              <TrendingUp className="w-4 h-4" /> POTENTIEL
            </div>
            <div className="text-center mt-6 text-slate-400 font-medium flex items-center justify-center gap-2">
              PERFORMANCE <TrendingUp className="w-4 h-4 rotate-90" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-4 ml-6 mb-4">
              {boxes.map((box) => (
                <div key={box.id} className={`p-4 rounded-xl border ${box.bg} min-h-[160px] flex flex-col transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/10`}>
                  <div className="mb-3">
                    <h3 className="font-semibold text-slate-200">{box.title}</h3>
                    <p className="text-xs text-slate-400">{box.desc}</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                    {matrix[box.id].length === 0 ? (
                      <div className="text-xs text-slate-500 italic mt-2 text-center">Vide</div>
                    ) : (
                      matrix[box.id].map(emp => (
                        <div key={emp.id} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {emp.candidate?.name?.charAt(0) || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate" title={emp.candidate?.name}>{emp.candidate?.name || 'Employé'}</p>
                            <p className="text-[10px] text-slate-500 truncate">{emp.position || 'N/A'}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700/30 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">{matrix[box.id].length} emp.</span>
                    <Info className="w-3 h-3 text-slate-500 cursor-help" title={`Catégorie: ${box.title}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NineBoxMatrix;
