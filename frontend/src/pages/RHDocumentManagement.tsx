import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Send, 
  Calendar, 
  Users, 
  Shield, 
  Heart, 
  Home, 
  Car, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Check,
  X,
  Eye,
  UserCheck
} from 'lucide-react';
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
  employeeName: string;
  employeeEmail: string;
  employeeDepartment: string;
  urgency: 'normal' | 'urgent';
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

const RHDocumentManagement: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // Simulate employee document requests for RH to review
      const mockDocuments: DocumentRequest[] = [
        {
          id: '1',
          type: 'conge',
          title: 'Congé Annuel 2026',
          description: 'Demande de congé payé pour vacances d\'été',
          status: 'PENDING',
          requestedAt: '2026-04-20',
          employeeName: 'Jean Dupont',
          employeeEmail: 'jean.dupont@company.com',
          employeeDepartment: 'Développement',
          urgency: 'normal'
        },
        {
          id: '2',
          type: 'mutuelle',
          title: 'Attestation Mutuelle',
          description: 'Attestation de couverture santé mutuelle pour prêt bancaire',
          status: 'PENDING',
          requestedAt: '2026-04-19',
          employeeName: 'Marie Martin',
          employeeEmail: 'marie.martin@company.com',
          employeeDepartment: 'Marketing',
          urgency: 'urgent'
        },
        {
          id: '3',
          type: 'fiche_paie',
          title: 'Fiche de Paie Mars 2026',
          description: 'Bulletin de salaire du mois de mars 2026',
          status: 'APPROVED',
          requestedAt: '2026-04-10',
          processedAt: '2026-04-11',
          documentUrl: '/documents/paie_mars_2026.pdf',
          employeeName: 'Pierre Durand',
          employeeEmail: 'pierre.durand@company.com',
          employeeDepartment: 'Finance',
          urgency: 'normal'
        },
        {
          id: '4',
          type: 'attestation_travail',
          title: 'Attestation de Travail',
          description: 'Attestation de travail pour démarches administratives',
          status: 'REJECTED',
          requestedAt: '2026-04-18',
          processedAt: '2026-04-19',
          rejectionReason: 'Informations incomplètes dans le formulaire',
          employeeName: 'Sophie Petit',
          employeeEmail: 'sophie.petit@company.com',
          employeeDepartment: 'Ressources Humaines',
          urgency: 'normal'
        },
        {
          id: '5',
          type: 'certificat_medical',
          title: 'Certificat Médical',
          description: 'Certificat médical pour arrêt maladie',
          status: 'PENDING',
          requestedAt: '2026-04-18',
          employeeName: 'Thomas Bernard',
          employeeEmail: 'thomas.bernard@company.com',
          employeeDepartment: 'Support Client',
          urgency: 'urgent'
        },
        {
          id: '6',
          type: 'formation',
          title: 'Attestation Formation',
          description: 'Attestation de participation à la formation React Avancé',
          status: 'APPROVED',
          requestedAt: '2026-03-20',
          processedAt: '2026-03-25',
          documentUrl: '/documents/formation_react.pdf',
          employeeName: 'Camille Leroy',
          employeeEmail: 'camille.leroy@company.com',
          employeeDepartment: 'Développement',
          urgency: 'normal'
        },
        {
          id: '7',
          type: 'evaluation',
          title: 'Évaluation Annuelle',
          description: 'Rapport d\'évaluation de performance 2026',
          status: 'PENDING',
          requestedAt: '2026-04-15',
          employeeName: 'Nicolas Rousseau',
          employeeEmail: 'nicolas.rousseau@company.com',
          employeeDepartment: 'Management',
          urgency: 'normal'
        }
      ];
      
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (documentId: string) => {
    try {
      // Simulate API call to approve document
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'APPROVED', processedAt: new Date().toISOString(), documentUrl: `/documents/${doc.id}.pdf` }
          : doc
      ));
      alert('Document approuvé avec succès');
    } catch (error) {
      alert('Erreur lors de l\'approbation du document');
    }
  };

  const handleReject = async (documentId: string) => {
    if (!rejectionReason.trim()) {
      alert('Veuillez fournir une raison de rejet');
      return;
    }

    try {
      // Simulate API call to reject document
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'REJECTED', processedAt: new Date().toISOString(), rejectionReason }
          : doc
      ));
      setShowRejectModal(false);
      setRejectionReason('');
      alert('Document rejeté');
    } catch (error) {
      alert('Erreur lors du rejet du document');
    }
  };

  const handleViewDetails = (document: DocumentRequest) => {
    setSelectedDocument(document);
    setShowDetailsModal(true);
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'normal': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const filteredDocuments = documents.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase());
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
        <h1 className="text-3xl font-bold text-white mb-2">Gestion des Demandes de Documents</h1>
        <p className="text-slate-400">Consultez et approuvez les demandes de documents des employés</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Demandes en attente</p>
              <p className="text-2xl font-bold text-amber-400">
                {documents.filter(d => d.status === 'PENDING').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Approuvées aujourd'hui</p>
              <p className="text-2xl font-bold text-emerald-400">
                {documents.filter(d => d.status === 'APPROVED' && d.processedAt === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Demandes urgentes</p>
              <p className="text-2xl font-bold text-red-400">
                {documents.filter(d => d.urgency === 'urgent' && d.status === 'PENDING').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total traitées</p>
              <p className="text-2xl font-bold text-blue-400">
                {documents.filter(d => d.status === 'APPROVED' || d.status === 'REJECTED').length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-400" />
          </div>
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

      {/* Documents Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Urgence</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p>Aucune demande de document trouvée</p>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((request) => {
                  const docType = documentTypes.find(t => t.id === request.type);
                  const Icon = docType?.icon || FileText;
                  return (
                    <tr key={request.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-200 font-medium">{request.employeeName}</p>
                          <p className="text-sm text-slate-400">{request.employeeEmail}</p>
                          <p className="text-xs text-slate-500">{request.employeeDepartment}</p>
                        </div>
                      </td>
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
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency === 'urgent' ? 'Urgent' : 'Normal'}
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
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          {request.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
                                title="Approuver"
                              >
                                <Check className="w-4 h-4 text-emerald-400" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDocument(request);
                                  setShowRejectModal(true);
                                }}
                                className="p-2 hover:bg-red-700 rounded-lg transition-colors"
                                title="Rejeter"
                              >
                                <X className="w-4 h-4 text-red-400" />
                              </button>
                            </>
                          )}
                          {request.status === 'APPROVED' && request.documentUrl && (
                            <button
                              onClick={() => window.open(request.documentUrl, '_blank')}
                              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                              title="Télécharger"
                            >
                              <Download className="w-4 h-4 text-slate-400" />
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

      {/* Details Modal */}
      {showDetailsModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full border border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white">Détails de la Demande</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Informations Employé</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nom:</span>
                      <span className="text-slate-200">{selectedDocument.employeeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-slate-200">{selectedDocument.employeeEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Département:</span>
                      <span className="text-slate-200">{selectedDocument.employeeDepartment}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Informations Document</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-slate-200">{documentTypes.find(t => t.id === selectedDocument.type)?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Urgence:</span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getUrgencyColor(selectedDocument.urgency)}`}>
                        {selectedDocument.urgency === 'urgent' ? 'Urgent' : 'Normal'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Statut:</span>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getStatusColor(selectedDocument.status)}`}>
                        {getStatusIcon(selectedDocument.status)}
                        {selectedDocument.status === 'PENDING' && 'En attente'}
                        {selectedDocument.status === 'APPROVED' && 'Approuvé'}
                        {selectedDocument.status === 'REJECTED' && 'Rejeté'}
                        {selectedDocument.status === 'GENERATED' && 'Généré'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Détails de la Demande</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400">Titre:</span>
                    <p className="text-slate-200 mt-1">{selectedDocument.title}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Description:</span>
                    <p className="text-slate-200 mt-1">{selectedDocument.description}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date de demande:</span>
                    <span className="text-slate-200">{new Date(selectedDocument.requestedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {selectedDocument.processedAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date de traitement:</span>
                      <span className="text-slate-200">{new Date(selectedDocument.processedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  {selectedDocument.rejectionReason && (
                    <div>
                      <span className="text-slate-400">Raison du rejet:</span>
                      <p className="text-red-400 mt-1">{selectedDocument.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Fermer
              </button>
              {selectedDocument.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedDocument.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approuver
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowRejectModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rejeter
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showRejectModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">Rejeter la Demande</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Raison du rejet</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  rows={4}
                  placeholder="Expliquez pourquoi cette demande est rejetée..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedDocument(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleReject(selectedDocument.id);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RHDocumentManagement;
