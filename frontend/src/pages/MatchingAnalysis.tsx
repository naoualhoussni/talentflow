import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, CheckCircle, AlertCircle, FileText, Download, Eye, BarChart3, PieChart, Target, Zap, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/api';

interface MatchingResult {
  jobTitle: string;
  company: string;
  overallMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  locationMatch: number;
  personalityMatch: number;
  cultureFit: number;
  salaryAlignment: number;
  recommendations: string[];
  strengths: string[];
  gaps: string[];
  marketInsights: {
    demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    competitionLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    growthPotential: 'HIGH' | 'MEDIUM' | 'LOW';
    salaryBenchmark: string;
  };
  skillBreakdown: {
    technical: number;
    soft: number;
    domain: number;
    leadership: number;
  };
}

interface SkillAnalysis {
  skill: string;
  level: number;
  relevance: number;
  demand: number;
}

const MatchingAnalysis: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'charts' | 'recommendations'>('overview');
  const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // CV Upload Flow States
  const [cvText, setCvText] = useState('');
  const [isCVUploaded, setIsCVUploaded] = useState(false);
  const [jobTarget, setJobTarget] = useState('Senior React Developer');

  const handleAnalyzeCV = async () => {
    if (!cvText.trim()) {
      setError("Veuillez coller le contenu de votre CV.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setIsCVUploaded(true);
      
      const response = await aiAPI.matchingAnalysis({
        cvText,
        candidateProfile: { name: user?.name, role: user?.role },
        jobTitle: jobTarget,
        company: 'TalentFlow Tech'
      });
      setMatchingResult(response.data);
    } catch (err: any) {
      console.error('Error fetching matching analysis', err);
      setError('Impossible de charger l\'analyse de matching. Vérifiez votre connexion.');
      setIsCVUploaded(false);
    } finally {
      setLoading(false);
    }
  };

  const skillsData: SkillAnalysis[] = [
    { skill: 'React', level: 90, relevance: 95, demand: 88 },
    { skill: 'TypeScript', level: 85, relevance: 92, demand: 75 },
    { skill: 'JavaScript', level: 88, relevance: 85, demand: 70 },
    { skill: 'Node.js', level: 75, relevance: 80, demand: 65 },
    { skill: 'CSS/Tailwind', level: 92, relevance: 88, demand: 80 },
    { skill: 'Git', level: 80, relevance: 75, demand: 70 },
    { skill: 'Testing', level: 60, relevance: 70, demand: 85 },
    { skill: 'Cloud (AWS)', level: 45, relevance: 65, demand: 90 },
    { skill: 'CI/CD', level: 50, relevance: 60, demand: 80 }
  ];

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-400';
    if (percentage >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getMatchBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500/10 border-emerald-500/30';
    if (percentage >= 60) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 glass-card p-12 max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-emerald-500 p-[2px] animate-spin-slow">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">L'IA parcourt votre CV</h3>
            <p className="text-slate-400 text-sm">Extraction des compétences, parsing des expériences et calcul du matching avec les offres...</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 w-full animate-shimmer origin-left"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isCVUploaded || (!matchingResult && !error)) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Parsing de CV et Matching IA</h1>
          <p className="text-slate-400">
            Copiez-collez votre CV ci-dessous. Notre IA extraira vos compétences et analysera votre profil pour vous proposer les meilleures offres.
          </p>
        </div>

        <div className="glass-card p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Offre ciblée (Optionnel pour le matching direct)</label>
              <select 
                title="Séléctionnez une offre de base"
                value={jobTarget}
                onChange={(e) => setJobTarget(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                <option value="Senior React Developer">Développeur Frontend Senior (React)</option>
                <option value="Full Stack Node.js Engineer">Ingénieur Full Stack (Node.js)</option>
                <option value="Product Manager HR">Product Manager RH</option>
                <option value="Marketing Digital Manager">Responsable Marketing Digital</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Contenu du CV
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer text-sm text-emerald-400 flex items-center gap-1 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                    <Upload className="w-4 h-4" />
                    <span>Uploader un document (PDF/Doc)</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        // Simulation d'extraction textuelle pour la démo
                        if (file.type.includes('pdf') || file.type.includes('word') || file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
                          setCvText(`[Texte extrait automatiquement de ${file.name}]\n\nDéveloppeur passionné avec 5 ans d'expérience en développement web. Compétences principales: React, Node.js, TypeScript, AWS, MongoDB. Excellentes capacités de communication et travail en équipe. Master en Ingénierie Logicielle obtenu avec mention.`);
                        } else {
                          // Lecture réelle pour les fichiers texte purs (.txt)
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setCvText(event.target.result as string);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                  <span className="text-violet-400 flex items-center gap-1 text-sm"><FileText className="w-4 h-4"/> Parsing intelligent</span>
                </div>
              </div>
              <textarea
                title="Copiez-collez le contenu de votre CV ici"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Exemple: Développeur passionné avec 5 ans d'expérience en React, Node.js et TypeScript..."
                className="w-full h-64 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-y"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={handleAnalyzeCV}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Lancer l'analyse du CV
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !matchingResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-red-400 flex flex-col items-center gap-3 glass-card p-8">
          <AlertCircle className="w-10 h-10" />
          <p className="font-semibold">{error || 'Analyse non disponible.'}</p>
          <button 
            onClick={() => { setIsCVUploaded(false); setError(null); }}
            className="mt-4 px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            Réessayer avec un autre CV
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Rapport d'Analyse CV & Matching IA</h1>
          <p className="text-slate-400">
            Résultats de l'extraction de vos données et évaluation de compatibilité.
          </p>
        </div>
        <button 
          onClick={() => { setIsCVUploaded(false); setCvText(''); }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Analyser un nouveau CV
        </button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-violet-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Score Global</h3>
                <p className="text-3xl font-bold text-violet-400">{matchingResult?.overallMatch || 0}%</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-slate-400">Compatibilité globale</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Compétences</h3>
                <p className="text-3xl font-bold text-emerald-400">{matchingResult?.skillsMatch || 0}%</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-slate-400">Matching technique</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Expérience</h3>
                <p className="text-3xl font-bold text-amber-400">{matchingResult?.experienceMatch || 0}%</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-slate-400">Adéquation expérience</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Formation</h3>
                <p className="text-3xl font-bold text-blue-400">{matchingResult?.educationMatch || 0}%</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-slate-400">Matching formation</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Personnalité</h3>
                <p className="text-3xl font-bold text-purple-400">{matchingResult?.personalityMatch || 0}%</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-slate-400">Fit culturel</p>
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Analyse Avancée</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Culture d'entreprise</span>
              <span className={`text-lg font-medium ${matchingResult?.cultureFit && matchingResult.cultureFit > 80 ? 'text-emerald-400' : matchingResult?.cultureFit && matchingResult.cultureFit > 60 ? 'text-amber-400' : 'text-red-400'}`}>
                {matchingResult?.cultureFit || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Alignement salarial</span>
              <span className={`text-lg font-medium ${matchingResult?.salaryAlignment && matchingResult.salaryAlignment > 80 ? 'text-emerald-400' : matchingResult?.salaryAlignment && matchingResult.salaryAlignment > 60 ? 'text-amber-400' : 'text-red-400'}`}>
                {matchingResult?.salaryAlignment || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Potentiel de croissance</span>
              <span className={`text-lg font-medium ${matchingResult?.marketInsights.growthPotential === 'HIGH' ? 'text-emerald-400' : matchingResult?.marketInsights.growthPotential === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'}`}>
                {matchingResult?.marketInsights.growthPotential || 'LOW'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Insights Marché</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Niveau de demande</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                matchingResult?.marketInsights.demandLevel === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                matchingResult?.marketInsights.demandLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                {matchingResult?.marketInsights.demandLevel || 'LOW'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Concurrence</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                matchingResult?.marketInsights.competitionLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                matchingResult?.marketInsights.competitionLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                {matchingResult?.marketInsights.competitionLevel || 'HIGH'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Benchmark salarial</span>
              <span className="text-lg font-medium text-emerald-400">
                {matchingResult?.marketInsights.salaryBenchmark || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
          { id: 'skills', label: 'Analyse des compétences', icon: Brain },
          { id: 'charts', label: 'Graphiques détaillés', icon: PieChart },
          { id: 'recommendations', label: 'Recommandations', icon: Target }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Détails du Matching</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Poste</span>
                <span className="text-slate-200 font-medium">{matchingResult?.jobTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Entreprise</span>
                <span className="text-slate-200 font-medium">{matchingResult?.company}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Localisation</span>
                <span className="text-slate-200 font-medium">Paris, France</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Date d'analyse</span>
                <span className="text-slate-200 font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Points Forts</h2>
            
            <div className="space-y-4">
              {matchingResult?.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <span className="text-slate-300">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Axes d'Amélioration</h2>
            
            <div className="space-y-4">
              {matchingResult?.gaps.map((gap, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <span className="text-slate-300">{gap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Analyse Détaillée des Compétences</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Compétence</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Votre niveau</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pertinence</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Demande</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Écart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {skillsData.map((skill, index) => (
                  <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-300 ml-3">{skill.level}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchBg(skill.relevance)}`}>
                        {skill.relevance}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchBg(skill.demand)}`}>
                        {skill.demand}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getMatchColor(skill.level - skill.demand)}`}>
                        {skill.level > skill.demand ? '+' : ''}{skill.level - skill.demand}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Répartition des Compétences</h2>
            
            <div className="space-y-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300">Compétences Techniques</span>
                  <span className="text-2xl font-bold text-emerald-400">{matchingResult?.skillBreakdown.technical || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${matchingResult?.skillBreakdown.technical || 0}%` }}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300">Compétences Douces</span>
                  <span className="text-2xl font-bold text-blue-400">{matchingResult?.skillBreakdown.soft || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${matchingResult?.skillBreakdown.soft || 0}%` }}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300">Expertise Domaine</span>
                  <span className="text-2xl font-bold text-amber-400">{matchingResult?.skillBreakdown.domain || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${matchingResult?.skillBreakdown.domain || 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300">Leadership</span>
                  <span className="text-2xl font-bold text-purple-400">{matchingResult?.skillBreakdown.leadership || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${matchingResult?.skillBreakdown.leadership || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Analyse Comparative</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Votre Profil</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Expérience</span>
                      <span className="text-emerald-400">5 ans</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Formation</span>
                      <span className="text-emerald-400">Master</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Localisation</span>
                      <span className="text-emerald-400">Paris</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Exigences Poste</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Expérience requise</span>
                      <span className="text-amber-400">3-5 ans</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Formation requise</span>
                      <span className="text-amber-400">Bac+3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Localisation</span>
                      <span className="text-amber-400">Paris/Remote</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400 mb-4">Score de Compatibilité</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300">Match Global</span>
                    <div className="flex-1">
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${matchingResult?.overallMatch || 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-lg font-bold text-violet-400 ml-3">{matchingResult?.overallMatch || 0}%</span>
                  </div>
                  
                  <div className="text-sm text-slate-300 mt-4">
                    <p className="mb-2">• Score excellent (80%+) : Forte probabilité d'entretien</p>
                    <p className="mb-2">• Score bon (60-79%) : Chance raisonnable</p>
                    <p>• Score faible (&lt;60%) : Amélioration nécessaire</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recommandations Personnalisées</h2>
          
          <div className="space-y-6">
            {matchingResult?.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-violet-500/10 rounded-lg border border-violet-500/30">
                <Zap className="w-5 h-5 text-violet-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-slate-200 mb-2">Recommandation {index + 1}</h3>
                  <p className="text-slate-300 mb-3">{recommendation}</p>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Plan d'action suggéré:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">Court terme (1-3 mois)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">Moyen terme (3-6 mois)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">Long terme (6+ mois)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button 
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors text-sm"
                      onClick={() => alert(`Analyse détaillée de la recommandation ${index + 1}:\n\n${recommendation}\n\nImpact potentiel: +15% de matching\nTemps estimé: 2-3 mois`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Analyse détaillée
                    </button>
                    <button 
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm"
                      onClick={() => alert(`Plan d'action généré pour la recommandation ${index + 1}\n\nPriorité: Haute\nRessources requises: Formation, Temps, Budget`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Plan d'action
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
          onClick={() => {
            const reportData = {
              analysisDate: new Date().toLocaleDateString('fr-FR'),
              jobTitle: matchingResult?.jobTitle,
              company: matchingResult?.company,
              overallMatch: matchingResult?.overallMatch,
              skillsMatch: matchingResult?.skillsMatch,
              experienceMatch: matchingResult?.experienceMatch,
              educationMatch: matchingResult?.educationMatch,
              locationMatch: matchingResult?.locationMatch,
              personalityMatch: matchingResult?.personalityMatch,
              cultureFit: matchingResult?.cultureFit,
              salaryAlignment: matchingResult?.salaryAlignment,
              marketInsights: matchingResult?.marketInsights,
              skillBreakdown: matchingResult?.skillBreakdown,
              recommendations: matchingResult?.recommendations,
              strengths: matchingResult?.strengths,
              gaps: matchingResult?.gaps
            };
            
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`RAPPORT D'ANALYSE IA DE MATCHING\n\nDate: ${reportData.analysisDate}\nPoste: ${reportData.jobTitle}\nEntreprise: ${reportData.company}\n\nSCORES:\n- Score Global: ${reportData.overallMatch}%\n- Compétences: ${reportData.skillsMatch}%\n- Expérience: ${reportData.experienceMatch}%\n- Formation: ${reportData.educationMatch}%\n- Localisation: ${reportData.locationMatch}%\n- Personnalité: ${reportData.personalityMatch}%\n- Culture d'entreprise: ${reportData.cultureFit}%\n- Alignement salarial: ${reportData.salaryAlignment}%\n\nINSIGHTS MARCHÉ:\n- Demande: ${reportData.marketInsights.demandLevel}\n- Concurrence: ${reportData.marketInsights.competitionLevel}\n- Potentiel de croissance: ${reportData.marketInsights.growthPotential}\n- Benchmark salarial: ${reportData.marketInsights.salaryBenchmark}\n\nFORCES:\n${reportData.strengths.map(s => `- ${s}`).join('\n')}\n\nPOINTS D'AMÉLIORATION:\n${reportData.gaps.map(g => `- ${g}`).join('\n')}\n\nRECOMMANDATIONS:\n${reportData.recommendations.map((r, i) => `${i+1}. ${r}`).join('\n')}`);
            link.download = `Rapport_Analysis_${reportData.jobTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
            link.click();
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Télécharger le rapport complet
        </button>
        <button 
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          onClick={() => {
            const shareData = {
              title: `Analyse IA de Matching - ${matchingResult?.jobTitle} chez ${matchingResult?.company}`,
              text: `Score de compatibilité: ${matchingResult?.overallMatch}%\nPoste: ${matchingResult?.jobTitle}\nEntreprise: ${matchingResult?.company}\n\nCompétences matching: ${matchingResult?.skillsMatch}%\nExpérience: ${matchingResult?.experienceMatch}%\n\nDécouvrez mon profil complet et mes compétences!`,
              url: window.location.href
            };
            
            if (navigator.share) {
              navigator.share(shareData);
            } else {
                alert('Lien de partage copié dans le presse-papiers!');
                navigator.clipboard.writeText(shareData.text);
              }
          }}
        >
          <Eye className="w-4 h-4 mr-2" />
          Partager avec un recruteur
        </button>
      </div>
    </div>
  );
};

export default MatchingAnalysis;
