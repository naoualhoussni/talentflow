import React, { useState, useEffect } from 'react';
import { Workflow, Users, ArrowRight, ChevronRight } from 'lucide-react';
import { workflowAPI } from '../services/api';

const stages = [
  { key: 'APPLIED', label: 'Postulé', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  { key: 'CHATBOT_DONE', label: 'Chatbot', color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  { key: 'EVALUATED', label: 'Évalué', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  { key: 'APPROVED', label: 'Approuvé', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { key: 'REJECTED', label: 'Rejeté', color: 'from-red-500 to-red-600', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  { key: 'EMPLOYEE', label: 'Embauché', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
];

const Pipeline: React.FC = () => {
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    try {
      const { data } = await workflowAPI.pipeline();
      setPipeline(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getStageData = (key: string) => pipeline.find(p => p.stage === key) || { count: 0, candidates: [] };
  const totalCandidates = pipeline.reduce((s, p) => s + p.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Workflow className="w-7 h-7 text-violet-400" />
            Pipeline de recrutement
          </h1>
          <p className="text-slate-500 text-sm mt-1">{totalCandidates} candidats dans le pipeline</p>
        </div>
      </div>

      {/* Stage Flow Arrows */}
      <div className="hidden lg:flex items-center justify-between gap-2 px-4">
        {stages.map((stage, i) => {
          const data = getStageData(stage.key);
          return (
            <React.Fragment key={stage.key}>
              <div className={`flex-1 text-center p-3 rounded-xl ${stage.bg} border ${stage.border}`}>
                <p className={`text-2xl font-bold ${stage.text}`}>{data.count}</p>
                <p className="text-xs text-slate-400 mt-1">{stage.label}</p>
              </div>
              {i < stages.length - 1 && <ChevronRight className="w-5 h-5 text-slate-700 shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Chargement du pipeline...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stages.map((stage) => {
            const data = getStageData(stage.key);
            return (
              <div key={stage.key} className="glass-card overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${stage.color}`}></div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${stage.text}`}>{stage.label}</h3>
                    <span className={`w-8 h-8 rounded-lg ${stage.bg} flex items-center justify-center text-sm font-bold ${stage.text}`}>
                      {data.count}
                    </span>
                  </div>

                  {data.candidates?.length > 0 ? (
                    <div className="space-y-3">
                      {data.candidates.map((c: any) => (
                        <div key={c.id} className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center text-xs font-bold text-white`}>
                              {c.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-200 truncate">{c.name}</p>
                              <p className="text-xs text-slate-500 truncate">{c.job?.title || 'Poste non spécifié'}</p>
                            </div>
                            {c.score > 0 && (
                              <span className={`text-xs font-bold ${c.score >= 70 ? 'text-emerald-400' : c.score >= 40 ? 'text-amber-400' : 'text-slate-500'}`}>
                                {c.score}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Users className="w-8 h-8 mx-auto text-slate-700 mb-2" />
                      <p className="text-xs text-slate-600">Aucun candidat</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Pipeline;
