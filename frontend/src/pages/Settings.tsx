import React from 'react';
import { Settings as SettingsIcon, User, Building2, Key, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-violet-400" /> Paramètres
        </h1>
        <p className="text-slate-500 text-sm mt-1">Gérez votre profil et les préférences de l'application</p>
      </div>

      {/* Profile Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold">Profil utilisateur</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Nom</label>
            <input type="text" value={user?.name || ''} readOnly
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Email</label>
            <input type="email" value={user?.email || ''} readOnly
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Rôle</label>
            <input type="text" value={user?.role || ''} readOnly
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Company ID</label>
            <input type="text" value={user?.companyId || 'N/A'} readOnly
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Application Info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold">Application</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl">
            <span className="text-sm text-slate-400">Version</span>
            <span className="text-sm font-medium text-slate-200">1.0.0</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl">
            <span className="text-sm text-slate-400">Backend API</span>
            <span className="text-sm font-medium text-emerald-400">http://localhost:5000</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl">
            <span className="text-sm text-slate-400">Moteur IA</span>
            <span className="text-sm font-medium text-violet-400">Groq / Llama 3.3 70B</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl">
            <span className="text-sm text-slate-400">Base de données</span>
            <span className="text-sm font-medium text-slate-200">SQLite (Prisma ORM)</span>
          </div>
        </div>
      </div>

      {/* API Key Config */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold">Configuration IA</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">La clé API Groq est configurée dans le backend (.env). Contactez l'administrateur pour la modifier.</p>
        <div className="p-4 bg-violet-500/5 rounded-xl border border-violet-500/20">
          <p className="text-sm text-violet-300">
            💡 L'IA est utilisée pour le screening des candidats, le chatbot d'entretien initial, et la génération de résumés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
