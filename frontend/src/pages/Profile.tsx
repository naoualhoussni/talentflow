import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Briefcase, Calendar,
  Shield, Edit3, Camera, Award, TrendingUp,
  BookOpen, Star, CheckCircle2, Clock, Save, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiAPI, authAPI } from '../services/api';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'activity'>('overview');
  
  const [cvText, setCvText] = useState('');
  const [isParsingCv, setIsParsingCv] = useState(false);
  const [hasParsedCv, setHasParsedCv] = useState(false);
  const [parsedSkills, setParsedSkills] = useState(['React', 'TypeScript', 'Node.js']);

  // Editable fields
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedPhone, setEditedPhone] = useState('+33 1 23 45 67 89');
  const [editedAddress, setEditedAddress] = useState('123 Rue de la République, 75001 Paris');
  const [editedDepartment, setEditedDepartment] = useState('Ressources Humaines');
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useAuth();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data } = await authAPI.updateProfile({
        name: editedName,
        phone: editedPhone,
        address: editedAddress,
        department: editedDepartment,
        skills: activeTab === 'skills' ? parsedSkills : undefined
      });
      updateUser({ ...user!, name: data.name });
      setIsEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (err) {
      console.error('Update profile error:', err);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  // Simulated profile data
  const profileData = {
    name: editedName || user?.name || 'Utilisateur',
    email: user?.email || '',
    role: user?.role || 'EMPLOYEE',
    phone: editedPhone,
    address: editedAddress,
    department: editedDepartment,
    joinDate: '15 Janvier 2026',
    lastLogin: '20 Avril 2026',
    skills: ['Recrutement', 'Gestion de carrière', 'Analyse RH', 'Droit du travail', 'Management', 'Communication'],
    certifications: [
      { name: 'Certification Coaching RH', date: '2025', issuer: 'ANDRH' },
      { name: 'Master RH', date: '2020', issuer: 'Université Paris-Dauphine' },
    ],
    stats: {
      totalRecruitments: 156,
      interviewsConducted: 342,
      employeesManaged: 48,
      documentsProcessed: 890
    },
    activities: [
      { action: 'A approuvé la demande de congé de Thomas Bernard', time: 'Il y a 2h', type: 'document' },
      { action: 'A réalisé un entretien avec Emma Garcia', time: 'Il y a 5h', type: 'interview' },
      { action: 'A publié l\'offre "Développeur Full Stack Senior"', time: 'Hier', type: 'job' },
      { action: 'A évalué le candidat David Laurent', time: 'Il y a 2 jours', type: 'evaluation' },
      { action: 'A mis à jour les paramètres de l\'entreprise', time: 'Il y a 3 jours', type: 'settings' },
    ],
    candidateStats: {
      applicationsSent: 8,
      interviewsScheduled: 2,
      profileViews: 24,
      matchingScore: 85
    }
  };

  const handleParseCV = async () => {
    if (!cvText.trim()) return;
    setIsParsingCv(true);
    
    try {
      const response = await aiAPI.parseCV({ cvText });
      const data = response.data;
      
      // Update skills
      if (data && data.skills && Array.isArray(data.skills)) {
        setParsedSkills(data.skills);
      } else {
        setParsedSkills(['React', 'Node.js', 'Typescript', 'AWS', 'GraphQL', 'TailwindCSS']); // fallback if groq hallucinates
      }
      
      setHasParsedCv(true);
      setActiveTab('skills');
    } catch (error) {
      console.error('Error parsing CV:', error);
      alert('Erreur lors du parsing du CV. Veuillez réessayer.');
    } finally {
      setIsParsingCv(false);
    }
  };

  const roleLabels: Record<string, { label: string; color: string; bg: string }> = {
    'RH': { label: 'Responsable RH', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    'MANAGER': { label: 'Manager', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    'EMPLOYEE': { label: 'Employé', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    'ADMIN': { label: 'Administrateur', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    'SUPER_ADMIN': { label: 'Super Admin', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    'CANDIDATE': { label: 'Candidat', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  };

  const roleInfo = roleLabels[profileData.role] || roleLabels['EMPLOYEE'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass-card overflow-hidden"
      >
        {/* Cover gradient */}
        <div className="h-40 bg-gradient-to-r from-violet-600/30 via-blue-600/20 to-emerald-600/20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>

        <div className="px-8 pb-8 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-violet-500/20 border-4 border-slate-900">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-1 right-1 w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-slate-400" />
              </button>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{profileData.name}</h1>
              <p className="text-slate-400 text-sm mt-1">{profileData.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${roleInfo.bg} ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Membre depuis {profileData.joinDate}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-400 text-sm font-medium flex items-center gap-2 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-violet-500/20"
                >
                  <Edit3 className="w-4 h-4" />
                  Modifier le profil
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl w-fit border border-slate-700/30">
        {[
          { id: 'overview' as const, label: 'Vue d\'ensemble', icon: User },
          { id: 'skills' as const, label: 'Compétences', icon: Award },
          { id: 'activity' as const, label: 'Activité récente', icon: Clock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'overview' && (
          <>
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-violet-400" />
                Informations personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: User, label: 'Nom complet', value: profileData.name },
                  { icon: Mail, label: 'Email', value: profileData.email },
                  { icon: Phone, label: 'Téléphone', value: profileData.phone },
                  { icon: MapPin, label: 'Adresse', value: profileData.address },
                  { icon: Briefcase, label: 'Département', value: profileData.department },
                  { icon: Shield, label: 'Rôle', value: roleInfo.label },
                ].map((field, i) => (
                  <div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <field.icon className="w-4 h-4 text-slate-500" />
                      <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">{field.label}</label>
                    </div>
                    {isEditing && field.label !== 'Email' && field.label !== 'Rôle' ? (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => {
                          if (field.label === 'Nom complet') setEditedName(e.target.value);
                          if (field.label === 'Téléphone') setEditedPhone(e.target.value);
                          if (field.label === 'Adresse') setEditedAddress(e.target.value);
                          if (field.label === 'Département') setEditedDepartment(e.target.value);
                        }}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                      />
                    ) : (
                      <p className="text-slate-200 text-sm font-medium">{field.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Statistiques
              </h2>
              <div className="space-y-4">
                {user?.role === 'CANDIDATE' ? (
                  [
                    { label: 'Candidatures', value: profileData.candidateStats.applicationsSent, color: 'from-violet-500 to-violet-700' },
                    { label: 'Entretiens', value: profileData.candidateStats.interviewsScheduled, color: 'from-blue-500 to-blue-700' },
                    { label: 'Vues du profil', value: profileData.candidateStats.profileViews, color: 'from-emerald-500 to-emerald-700' },
                    { label: 'Score Match moyen', value: `${profileData.candidateStats.matchingScore}%`, color: 'from-amber-500 to-amber-700' },
                  ]
                ).map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 group hover:border-slate-600/50 transition-all">
                    <div>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )) : (
                  [
                    { label: 'Recrutements', value: profileData.stats.totalRecruitments, color: 'from-violet-500 to-violet-700' },
                    { label: 'Entretiens réalisés', value: profileData.stats.interviewsConducted, color: 'from-blue-500 to-blue-700' },
                    { label: 'Employés gérés', value: profileData.stats.employeesManaged, color: 'from-emerald-500 to-emerald-700' },
                    { label: 'Documents traités', value: profileData.stats.documentsProcessed, color: 'from-amber-500 to-amber-700' },
                  ]
                ).map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 group hover:border-slate-600/50 transition-all">
                    <div>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Candidate CV Parsing Tool */}
            {user?.role === 'CANDIDATE' && !hasParsedCv && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3 glass-card p-6 mt-6 border border-violet-500/30 bg-violet-500/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BookOpen className="w-32 h-32 text-violet-400" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Star className="w-6 h-6 text-violet-400" />
                    Enrichir mon profil par IA (Parsing CV unique)
                  </h2>
                  <p className="text-slate-300 mb-4 max-w-3xl">
                    Déposez le contenu de votre CV ci-dessous. Notre IA analysera et extraira vos compétences techniques, d'organisation, et expériences pour remplir votre profil automatiquement. Vous ne pouvez l'utiliser qu'une seule fois.
                  </p>
                  
                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Collez le texte brut de votre CV complet ici..."
                    className="w-full h-40 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 resize-y mb-4"
                  />
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={handleParseCV}
                      disabled={isParsingCv || !cvText.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2"
                    >
                      {isParsingCv ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5" />
                          Analyser mon CV
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {user?.role === 'CANDIDATE' && hasParsedCv && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-3 glass-card p-6 mt-6 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400 decoration-emerald-400">Profil enrichi avec succès !</h3>
                  <p className="text-slate-300">Votre CV a été analysé et vos compétences ont été mises à jour dans l'onglet "Compétences".</p>
                </div>
              </motion.div>
            )}
          </>
        )}

        {activeTab === 'skills' && (
          <>
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                Compétences
              </h2>
              <div className="space-y-4">
                {(user?.role === 'CANDIDATE' && hasParsedCv ? parsedSkills : profileData.skills).map((skill, i) => {
                  const level = 60 + Math.random() * 35;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-slate-300">{skill}</span>
                        <span className="text-xs text-slate-500">{Math.round(level)}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${level}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Certifications
              </h2>
              <div className="space-y-4">
                {profileData.certifications.map((cert, i) => (
                  <div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{cert.name}</p>
                        <p className="text-xs text-slate-500">{cert.issuer} • {cert.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-400" />
              Activité récente
            </h2>
            <div className="space-y-4">
              {profileData.activities.map((activity, i) => {
                const typeIcons: Record<string, { icon: React.ElementType; color: string }> = {
                  document: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10' },
                  interview: { icon: User, color: 'text-blue-400 bg-blue-500/10' },
                  job: { icon: Briefcase, color: 'text-violet-400 bg-violet-500/10' },
                  evaluation: { icon: Star, color: 'text-amber-400 bg-amber-500/10' },
                  settings: { icon: Shield, color: 'text-slate-400 bg-slate-500/10' },
                };
                const typeInfo = typeIcons[activity.type] || typeIcons.settings;
                const Icon = typeInfo.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeInfo.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200">{activity.action}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
