import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Trash2, ChevronDown, X, Users, Brain, FileText, TrendingUp, Download } from 'lucide-react';
import { candidatesAPI, jobsAPI, aiAPI } from '../services/api';
import RHApprovalForm from '../components/RHApprovalForm';

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [screening, setScreening] = useState<string | null>(null);
  const [parsingCV, setParsingCV] = useState<string | null>(null);
  const [deepAnalyzing, setDeepAnalyzing] = useState<string | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', jobId: '', experienceYears: 0, resumeText: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [cRes, jRes] = await Promise.all([candidatesAPI.list(), jobsAPI.list()]);
      setCandidates(cRes.data);
      setJobs(jRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await candidatesAPI.create(form);
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', jobId: '', experienceYears: 0, resumeText: '' });
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce candidat ?')) return;
    await candidatesAPI.delete(id);
    loadData();
  };

  const handleScreen = async (candidate: any) => {
    setScreening(candidate.id);
    try {
      const job = jobs.find(j => j.id === candidate.jobId);
      const { data } = await aiAPI.screen({
        candidateId: candidate.id,
        resumeText: candidate.resumeText || `${candidate.name} - ${candidate.experienceYears} years experience`,
        jobTitle: job?.title,
        jobRequirements: job?.requirements,
      });
      alert(`Score IA: ${data.score}/100\nRecommandation: ${data.recommendation}\n${data.summary}`);
      loadData();
    } catch (err: any) {
      alert('Erreur IA: ' + (err.response?.data?.message || err.message));
    } finally { setScreening(null); }
  };

  const handleParseCV = async (candidate: any) => {
    setParsingCV(candidate.id);
    try {
      const { data } = await aiAPI.parseCV({
        cvText: candidate.resumeText || `Profil de ${candidate.name}, ${candidate.experienceYears} ans d'expérience. Expérience en développement, communication et gestion de projet.`
      });
      
      // Update candidate form with parsed data
      setForm(prev => ({
        ...prev,
        name: data.name || prev.name,
        email: data.email || prev.email,
        experienceYears: data.experienceYears || prev.experienceYears,
        resumeText: candidate.resumeText || ''
      }));
      
      alert(`CV analysé avec succès!\n\nNom: ${data.name}\nEmail: ${data.email}\nExpérience: ${data.experienceYears} ans\nCompétences: ${data.skills?.join(', ') || 'N/A'}\n${data.summary ? `\nRésumé: ${data.summary}` : ''}`);
    } catch (err: any) {
      alert('Erreur parsing CV: ' + (err.response?.data?.message || err.message));
    } finally { 
      setParsingCV(null); 
    }
  };

  const handleDeepAnalysis = async (candidate: any) => {
    setDeepAnalyzing(candidate.id);
    try {
      const job = jobs.find(j => j.id === candidate.jobId);
      const { data } = await aiAPI.deepCVAnalysis({
        cvText: candidate.resumeText || `Profil de ${candidate.name}, ${candidate.experienceYears} ans d'expérience. Très bonnes compétences techniques et humaines. Motivé pour ce nouveau défi professionnel.`,
        jobRequirements: job?.requirements || ''
      });
      
      setAnalysisResult(data);
      setShowAnalysisModal(true);
    } catch (err: any) {
      alert('Erreur analyse approfondie: ' + (err.response?.data?.message || err.message));
    } finally { 
      setDeepAnalyzing(null); 
    }
  };

  const statusColors: Record<string, string> = {
    APPLIED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    CHATBOT_DONE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    EVALUATED: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    APPROVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
    EMPLOYEE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  const filtered = candidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Candidats</h1>
          <p className="text-slate-500 text-sm mt-1">{candidates.length} candidats au total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un candidat
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all">
            <option value="">Tous les statuts</option>
            <option value="APPLIED">Postulé</option>
            <option value="CHATBOT_DONE">Chatbot terminé</option>
            <option value="EVALUATED">Évalué</option>
            <option value="APPROVED">Approuvé</option>
            <option value="REJECTED">Rejeté</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Users className="w-16 h-16 mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400 text-lg">Aucun candidat trouvé</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Candidat', 'Poste', 'Statut', 'Score IA', 'Expérience', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{c.job?.title || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${c.score >= 70 ? 'text-emerald-400' : c.score >= 40 ? 'text-amber-400' : 'text-slate-500'}`}>
                        {c.score > 0 ? `${c.score}/100` : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{c.experienceYears} ans</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => setShowDetail(c)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-violet-400 transition-all" title="Détails">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleParseCV(c)} disabled={parsingCV === c.id}
                          className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-all disabled:opacity-30" title="Parser CV">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeepAnalysis(c)} disabled={deepAnalyzing === c.id}
                          className="p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition-all disabled:opacity-30" title="Analyse Approfondie">
                          <TrendingUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleScreen(c)} disabled={screening === c.id}
                          className="p-1.5 rounded-lg hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 transition-all disabled:opacity-30" title="Screening IA">
                          <Brain className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowApprovalForm(c)}
                          className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-all" title="Générer Demande d'Approbation">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
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

      {/* Add Candidate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Ajouter un candidat</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Nom</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" required />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Téléphone</label>
                  <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Expérience (ans)</label>
                  <input type="number" value={form.experienceYears} onChange={e => setForm({...form, experienceYears: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Poste visé</label>
                <select value={form.jobId} onChange={e => setForm({...form, jobId: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all">
                  <option value="">Aucun poste spécifique</option>
                  {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">CV / Résumé</label>
                <textarea value={form.resumeText} onChange={e => setForm({...form, resumeText: e.target.value})} rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all resize-none"
                  placeholder="Collez le contenu du CV ici..." />
              </div>
              <button type="submit" className="w-full btn-primary py-3">Ajouter le candidat</button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(null)}>
          <div className="glass-card w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{showDetail.name}</h2>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/30 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-sm text-slate-200">{showDetail.email}</p>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Statut</p>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[showDetail.status]}`}>{showDetail.status}</span>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Score IA</p>
                  <p className="text-lg font-bold gradient-text">{showDetail.score || 0}/100</p>
                </div>
                <div className="p-3 bg-slate-800/30 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Expérience</p>
                  <p className="text-sm text-slate-200">{showDetail.experienceYears} ans</p>
                </div>
              </div>
              {showDetail.aiSummary && (
                <div className="p-4 bg-violet-500/5 rounded-xl border border-violet-500/20">
                  <p className="text-xs text-violet-400 font-medium mb-2">Résumé IA</p>
                  <p className="text-sm text-slate-300">{showDetail.aiSummary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deep Analysis Modal */}
      {showAnalysisModal && analysisResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Analyse Approfondie avec Groq AI
              </h3>
              <button onClick={() => setShowAnalysisModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Profile Match Score */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-xl border border-blue-500/30">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-white">Score de Compatibilité</h4>
                <span className={`text-2xl font-bold ${
                  analysisResult.profileMatch >= 80 ? 'text-emerald-400' :
                  analysisResult.profileMatch >= 60 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {analysisResult.profileMatch}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    analysisResult.profileMatch >= 80 ? 'bg-emerald-400' :
                    analysisResult.profileMatch >= 60 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${analysisResult.profileMatch}%` }}
                />
              </div>
            </div>

            {/* Technical Skills */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-3">Compétences Techniques</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Score</span>
                <span className="text-blue-400 font-semibold">{analysisResult.technicalSkills.score}%</span>
              </div>
              <div className="mb-3">
                <p className="text-sm text-slate-400 mb-2">Détails:</p>
                <ul className="space-y-1">
                  {analysisResult.technicalSkills.details.map((skill: string, index: number) => (
                    <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              {analysisResult.technicalSkills.gaps.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Compétences à développer:</p>
                  <ul className="space-y-1">
                    {analysisResult.technicalSkills.gaps.map((gap: string, index: number) => (
                      <li key={index} className="text-sm text-amber-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Soft Skills */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-3">Soft Skills</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Score</span>
                <span className="text-emerald-400 font-semibold">{analysisResult.softSkills.score}%</span>
              </div>
              <div className="mb-3">
                <p className="text-sm text-slate-400 mb-2">Points forts:</p>
                <ul className="space-y-1">
                  {analysisResult.softSkills.details.map((skill: string, index: number) => (
                    <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              {analysisResult.softSkills.areas.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Axes d'amélioration:</p>
                  <ul className="space-y-1">
                    {analysisResult.softSkills.areas.map((area: string, index: number) => (
                      <li key={index} className="text-sm text-amber-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Potential */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-3">Potentiel de Croissance</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Score de potentiel</span>
                <span className="text-violet-400 font-semibold">{analysisResult.potential.growthScore}%</span>
              </div>
              <div className="mb-3">
                <p className="text-sm text-slate-400 mb-2">Parcours carrière potentiel:</p>
                <ul className="space-y-1">
                  {analysisResult.potential.careerPath.map((step: string, index: number) => (
                    <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                      <div className="w-6 h-6 bg-violet-500/20 rounded-full flex items-center justify-center text-xs text-violet-400">
                        {index + 1}
                      </div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-slate-300">
                <span className="text-slate-400">Temps vers productivité:</span> {analysisResult.potential.timeToProductivity}
              </p>
            </div>

            {/* Cultural Fit */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-3">Adéquation Culturelle</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Score</span>
                <span className="text-cyan-400 font-semibold">{analysisResult.culturalFit.score}%</span>
              </div>
              <div className="mb-3">
                <p className="text-sm text-slate-400 mb-2">Points d'alignement:</p>
                <ul className="space-y-1">
                  {analysisResult.culturalFit.alignment.map((point: string, index: number) => (
                    <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              {analysisResult.culturalFit.concerns.length > 0 && (
                <div>
                  <p className="text-sm text-slate-400 mb-2">Points de vigilance:</p>
                  <ul className="space-y-1">
                    {analysisResult.culturalFit.concerns.map((concern: string, index: number) => (
                      <li key={index} className="text-sm text-red-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recommendation */}
            <div className="p-4 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-xl border border-violet-500/30">
              <h4 className="text-lg font-semibold text-white mb-3">Recommandation Finale</h4>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analysisResult.overallRecommendation === 'HIRE' ? 'bg-emerald-500/20 text-emerald-400' :
                  analysisResult.overallRecommendation === 'CONSIDER' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {analysisResult.overallRecommendation === 'HIRE' ? 'EMBAUCHER' :
                   analysisResult.overallRecommendation === 'CONSIDER' ? 'À CONSIDÉRER' : 'REJETER'}
                </span>
              </div>
              <p className="text-sm text-slate-300">{analysisResult.reasoning}</p>
            </div>
          </div>
        </div>
      )}
      {/* RH Approval Form Modal */}
      {showApprovalForm && (
        <RHApprovalForm 
          candidate={showApprovalForm} 
          onClose={() => setShowApprovalForm(null)} 
        />
      )}
    </div>
  );
};

export default Candidates;
