import React, { useState, useEffect } from 'react';
import { FileText, Download, Send, Calendar, Users, Shield, Heart, Home, Car, Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { documentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface DocumentRequest {
  id: string;
  type: string;
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'GENERATED';
  requestedAt: string;
  processedAt?: string;
  documentUrl?: string;
  rejectionReason?: string;
}

const documentTypes = [
  { id: 'conge', title: 'Congé', icon: Calendar, description: 'Demande de congés payés', color: 'blue' },
  { id: 'mutuelle', title: 'Mutuelle', icon: Heart, description: 'Attestation de mutuelle', color: 'red' },
  { id: 'salaire', title: 'Fiche de Paie', icon: FileText, description: 'Bulletin de salaire', color: 'green' },
  { id: 'contrat', title: 'Contrat', icon: Shield, description: 'Contrat de travail', color: 'purple' },
  { id: 'habitation', title: 'Logement', icon: Home, description: 'Justificatif de logement', color: 'orange' },
  { id: 'transport', title: 'Transport', icon: Car, description: 'Justificatif de transport', color: 'cyan' },
  { id: 'certificat', title: 'Certificat', icon: Users, description: 'Certificat de travail', color: 'indigo' }
];

const MyDocuments: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', urgency: 'normal' });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // Simulate employee personal documents only (not HR management documents)
      const mockDocuments: DocumentRequest[] = [
        {
          id: '1',
          type: 'conge',
          title: 'Congé Annuel 2026',
          description: 'Demande de congé payé pour vacances d\'été',
          status: 'APPROVED',
          requestedAt: '2026-04-01',
          processedAt: '2026-04-05',
          documentUrl: '/documents/conge_2026.pdf'
        },
        {
          id: '2',
          type: 'mutuelle',
          title: 'Attestation Mutuelle',
          description: 'Attestation de couverture santé mutuelle',
          status: 'APPROVED',
          requestedAt: '2026-03-15',
          processedAt: '2026-03-18',
          documentUrl: '/documents/mutuelle_2026.pdf'
        },
        {
          id: '3',
          type: 'salaire',
          title: 'Fiche de Paie Mars 2026',
          description: 'Bulletin de salaire du mois de mars 2026',
          status: 'GENERATED',
          requestedAt: '2026-04-10',
          processedAt: '2026-04-10',
          documentUrl: '/documents/paie_mars_2026.pdf'
        },
        {
          id: '4',
          type: 'certificat',
          title: 'Attestation de Travail',
          description: 'Attestation de travail pour démarches personnelles',
          status: 'PENDING',
          requestedAt: '2026-04-20',
          documentUrl: undefined
        },
        {
          id: '5',
          type: 'formation',
          title: 'Attestation Formation',
          description: 'Attestation de participation à la formation React Avancé',
          status: 'APPROVED',
          requestedAt: '2026-03-20',
          processedAt: '2026-03-25',
          documentUrl: '/documents/formation_react.pdf'
        }
      ];
      
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedType || !formData.title.trim()) {
      alert('Veuillez sélectionner un type de document et remplir le titre');
      return;
    }

    try {
      await documentAPI.create({
        type: selectedType.id,
        title: formData.title,
        description: formData.description,
        urgency: formData.urgency
      });

      setShowModal(false);
      setFormData({ title: '', description: '', urgency: 'normal' });
      setSelectedType(null);
      loadDocuments();
    } catch (error) {
      alert('Erreur lors de la demande de document');
    }
  };

  const handleDownload = async (request: DocumentRequest) => {
    if (request.documentUrl) {
      window.open(request.documentUrl, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'APPROVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'GENERATED': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'GENERATED': return <Download className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredRequests = documents.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filter === 'all' || request.status === filter;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-3xl font-bold text-white mb-2">Mes Documents</h1>
        <p className="text-slate-400">Gérez vos demandes de documents administratifs</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Demandes Rapides</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Demande
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documentTypes.slice(0, 8).map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedType(type);
                  setFormData(prev => ({
                    ...prev,
                    title: type.title,
                    description: `Demande de ${type.title}`
                  }));
                  setShowModal(true);
                }}
                className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
              >
                <div className={`w-12 h-12 bg-${type.color}-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-${type.color}-500/30 transition-colors`}>
                  <Icon className={`w-6 h-6 text-${type.color}-400`} />
                </div>
                <h3 className="text-white font-medium mb-1">{type.title}</h3>
                <p className="text-slate-400 text-sm">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une demande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            <option value="all">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Approuvé</option>
            <option value="REJECTED">Rejeté</option>
            <option value="GENERATED">Généré</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p>Aucune demande de document trouvée</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const docType = documentTypes.find(t => t.id === request.type);
                  const Icon = docType?.icon || FileText;
                  return (
                    <tr key={request.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-${docType?.color || 'slate'}-500/20 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 text-${docType?.color || 'slate'}-400`} />
                          </div>
                          <span className="text-slate-200">{docType?.title || request.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-200">{request.title}</p>
                          {request.description && (
                            <p className="text-sm text-slate-400">{request.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status === 'PENDING' && 'En attente'}
                          {request.status === 'APPROVED' && 'Approuvé'}
                          {request.status === 'REJECTED' && 'Rejeté'}
                          {request.status === 'GENERATED' && 'Généré'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(request.requestedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {request.status === 'GENERATED' && request.documentUrl && (
                            <button
                              onClick={() => handleDownload(request)}
                              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                              title="Télécharger"
                            >
                              <Download className="w-4 h-4 text-slate-400" />
                            </button>
                          )}
                          {request.status === 'REJECTED' && request.rejectionReason && (
                            <button
                              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                              title={`Raison: ${request.rejectionReason}`}
                            >
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-800 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Nouvelle Demande</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-2 block">Type de document</label>
                <div className="grid grid-cols-2 gap-2">
                  {documentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType?.id === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedType(type);
                          if (!formData.title) setFormData(prev => ({ ...prev, title: type.title }));
                        }}
                        className={`p-2.5 rounded-xl border transition-all flex items-center gap-3 text-left ${
                          isSelected
                            ? 'border-violet-500 bg-violet-500/10 ring-1 ring-violet-500/20'
                            : 'border-slate-700 hover:border-slate-600 bg-slate-800/40'
                        }`}
                      >
                        <div className={`w-8 h-8 bg-${type.color}-500/10 rounded-lg flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 text-${type.color}-400`} />
                        </div>
                        <span className={`text-xs font-medium transition-colors ${isSelected ? 'text-violet-400' : 'text-slate-400'}`}>
                          {type.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
 
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-2 block">Titre de la demande</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                  placeholder="Ex: Congé été 2024"
                />
              </div>
 
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-2 block">Description / Détails</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all resize-none"
                  rows={3}
                  placeholder="Précisez votre demande ici..."
                />
              </div>
 
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-2 block">Degré d'urgence</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all appearance-none"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitRequest}
                className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Envoyer la demande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDocuments;
