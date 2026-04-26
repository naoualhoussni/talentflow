import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Search, Edit3, Trash2, X, Users } from 'lucide-react';
import { jobsAPI } from '../services/api';

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', description: '', requirements: '', department: '', salary: '', status: 'OPEN' });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    try {
      const { data } = await jobsAPI.list();
      setJobs(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) { await jobsAPI.update(editId, form); }
      else { await jobsAPI.create(form); }
      setShowModal(false);
      setEditId(null);
      setForm({ title: '', description: '', requirements: '', department: '', salary: '', status: 'OPEN' });
      loadJobs();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (job: any) => {
    setForm({ title: job.title, description: job.description, requirements: job.requirements, department: job.department || '', salary: job.salary || '', status: job.status });
    setEditId(job.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce poste ?')) return;
    await jobsAPI.delete(id);
    loadJobs();
  };

  const statusColors: Record<string, string> = {
    'OPEN': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'CLOSED': 'bg-red-500/10 text-red-400 border-red-500/30',
    'DRAFT': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  const filtered = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.department?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offres d'emploi</h1>
          <p className="text-slate-500 text-sm mt-1">{jobs.length} postes au total</p>
        </div>
        <button onClick={() => { setEditId(null); setForm({ title: '', description: '', requirements: '', department: '', salary: '', status: 'OPEN' }); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau poste
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un poste..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Briefcase className="w-16 h-16 mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400 text-lg font-medium">Aucun poste trouvé</p>
          <p className="text-slate-600 text-sm mt-1">Créez votre premier poste pour démarrer le recrutement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((job) => (
            <div key={job.id} className="glass-card p-6 hover:border-slate-700 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-400" />
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[job.status]}`}>
                  {job.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-violet-400 transition-colors">{job.title}</h3>
              {job.department && <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">{job.department}</p>}
              <p className="text-sm text-slate-400 line-clamp-2 mb-4">{job.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  <span>{job._count?.candidates || 0} candidats</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(job)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-violet-400 transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{editId ? 'Modifier le poste' : 'Nouveau poste'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Titre', key: 'title', type: 'text', required: true },
                { label: 'Département', key: 'department', type: 'text' },
                { label: 'Salaire', key: 'salary', type: 'text' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" required={f.required} />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all resize-none" required />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Exigences</label>
                <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all resize-none" required />
              </div>
              <button type="submit" className="w-full btn-primary py-3">{editId ? 'Mettre à jour' : 'Créer le poste'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
