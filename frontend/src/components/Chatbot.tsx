import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Trash2, Sparkles, ChevronDown, Minimize2, Maximize2 } from 'lucide-react';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowCategories(false);

    // Check for automatic responses first
    const automaticResponse = getAutomaticResponses(text);
    if (automaticResponse) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate typing
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: automaticResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      return;
    }

    try {
      // Try Groq AI first
      const { data } = await aiAPI.chatbot({ message: text, userRole: user?.role });
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || 'Je n\'ai pas pu traiter votre demande. Veuillez reformuler.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      // Fallback to intelligent local response
      const fallback = getIntelligentFallback(text);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: fallback,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getQuestionCategories = () => {
    switch (user?.role) {
      case 'RH':
        return {
          '🎯 Recrutement': [
            'Comment optimiser le processus de recrutement ?',
            'Génère des questions pour un entretien technique',
            'Analyse les tendances de recrutement',
          ],
          '📊 Analytics': [
            'Quels sont les KPIs RH importants ?',
            'Comment réduire le turnover ?',
            'Statistiques de recrutement du mois',
          ],
          '📋 Documents': [
            'Comment gérer les demandes de congé ?',
            'Procédure d\'attestation de travail',
            'Gestion des fiches de paie',
          ]
        };
      case 'MANAGER':
        return {
          '👥 Équipe': [
            'Comment évaluer la performance ?',
            'Conseils de management d\'équipe',
            'Comment gérer les conflits ?',
          ],
          '🎯 Objectifs': [
            'Comment fixer des objectifs SMART ?',
            'Préparer un entretien annuel',
            'Suivi de progression des objectifs',
          ],
        };
      case 'EMPLOYEE':
        return {
          '📄 Documents': [
            'Comment demander un congé ?',
            'Accéder à ma fiche de paie',
            'Demander une attestation de travail',
          ],
          '🎓 Carrière': [
            'Comment demander une formation ?',
            'Préparer mon entretien annuel',
            'Conseils d\'évolution professionnelle',
          ],
        };
      case 'CANDIDATE':
        return {
          '💼 Candidature': [
            'Comment préparer un entretien ?',
            'Conseils pour mon CV',
            'Questions fréquentes en entretien',
          ],
          '🚀 Carrière': [
            'Compétences les plus recherchées',
            'Comment négocier son salaire ?',
            'Construire son personal branding',
          ],
        };
      default:
        return {
          '❓ Aide': [
            'Comment utiliser TalentFlow ?',
            'Fonctionnalités principales',
            'Contacter le support',
          ],
        };
    }
  };

  const getAutomaticResponses = (message: string) => {
    const lw = message.toLowerCase();
    
    if (lw.includes('bonjour') || lw.includes('salut') || lw.includes('hello') || lw.includes('hey')) {
      return `Bonjour ${user?.name?.split(' ')[0] || ''} ! 👋\n\nJe suis votre assistant TalentFlow IA. Comment puis-je vous aider aujourd'hui ?\n\nVous pouvez me poser des questions sur :\n• ${user?.role === 'RH' ? 'Le recrutement et la gestion RH' : user?.role === 'EMPLOYEE' ? 'Vos documents et votre carrière' : user?.role === 'CANDIDATE' ? 'La préparation d\'entretiens' : 'La gestion de votre équipe'}`;
    }
    
    if (lw.includes('merci') || lw.includes('thanks')) {
      return `Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. Je suis disponible 24/7 pour vous accompagner.`;
    }

    if (lw.includes('au revoir') || lw.includes('bye')) {
      return `Au revoir ${user?.name?.split(' ')[0]} ! 👋 Bonne continuation. À bientôt sur TalentFlow !`;
    }
    
    return null;
  };

  const getIntelligentFallback = (message: string) => {
    const lw = message.toLowerCase();

    if (lw.includes('congé') || lw.includes('vacances')) {
      return `📅 **Gestion des congés**\n\nPour demander un congé :\n1. Allez dans "Mes Documents"\n2. Cliquez sur "Nouvelle demande"\n3. Sélectionnez le type "Congé"\n4. Renseignez les dates souhaitées\n\nVotre demande sera traitée par votre responsable RH sous 48h.\n\n💡 Conseil : Faites votre demande au moins 2 semaines à l'avance.`;
    }

    if (lw.includes('paie') || lw.includes('salaire') || lw.includes('bulletin')) {
      return `💰 **Fiches de paie**\n\nVos bulletins de salaire sont disponibles dans la section "Mes Documents".\n\nVous pouvez :\n• Consulter vos 12 derniers bulletins\n• Télécharger au format PDF\n• Demander un duplicata\n\nPour toute question sur votre rémunération, contactez le service RH.`;
    }

    if (lw.includes('entretien') || lw.includes('interview')) {
      return `🎯 **Préparation d'entretien**\n\nConseils pour réussir votre entretien :\n\n1. **Recherchez** l'entreprise et le poste\n2. **Préparez** des exemples concrets (méthode STAR)\n3. **Anticipez** les questions techniques\n4. **Posez** des questions pertinentes\n5. **Soyez ponctuel** et professionnel\n\n💡 Utilisez l'analyse IA de TalentFlow pour identifier vos points forts !`;
    }

    if (lw.includes('cv') || lw.includes('curriculum')) {
      return `📄 **Optimisation de CV**\n\nConseils pour un CV impactant :\n\n• **Structure claire** : Expérience, Formation, Compétences\n• **Mots-clés** : Adaptez selon le poste visé\n• **Résultats chiffrés** : "Augmentation de 30% des ventes"\n• **Technologies** : Listez vos compétences techniques\n• **Personnalisation** : Un CV par type de poste\n\n🤖 Utilisez notre outil d'analyse IA pour évaluer votre CV !`;
    }

    if (lw.includes('formation') || lw.includes('cours') || lw.includes('apprendre')) {
      return `🎓 **Formations disponibles**\n\nTalentFlow propose des formations dans plusieurs domaines :\n\n• **Tech** : React, Python, Data Science, Cloud\n• **Management** : Leadership, Gestion d'équipe\n• **Soft Skills** : Communication, Négociation\n• **RH** : Droit du travail, Recrutement\n\nPour demander une formation, rendez-vous dans "Mes Documents" > "Nouvelle demande" > "Formation".`;
    }

    if (lw.includes('statistiques') || lw.includes('stats') || lw.includes('rapport')) {
      if (user?.role === 'RH' || user?.role === 'ADMIN') {
        return `📊 **Statistiques disponibles**\n\n• **Recrutement** : 156 candidats actifs, 34 en entretien\n• **Taux d'embauche** : 67% (+5% vs trimestre précédent)\n• **Temps moyen d'embauche** : 23 jours\n• **Postes ouverts** : 12\n• **Documents traités** : 890 ce mois\n\nConsultez le Dashboard pour des graphiques détaillés.`;
      }
      return `📊 Vos statistiques sont disponibles sur votre tableau de bord. Consultez-le pour un aperçu complet de votre activité.`;
    }

    if (lw.includes('contact') || lw.includes('support') || lw.includes('aide')) {
      return `📞 **Support TalentFlow**\n\n📧 Email : support@talentflow.ai\n📞 Téléphone : 01 23 45 67 89\n💬 Chat : Disponible 24/7\n\n⏰ Horaires du support humain :\nLun-Ven : 9h-18h\n\n⚠️ Pour les urgences, mentionnez "URGENT" dans votre message.`;
    }

    return `Je comprends votre question sur "${message.substring(0, 50)}..."\n\nMalheureusement, je ne dispose pas de toutes les informations pour répondre précisément. Voici ce que je peux faire :\n\n• 📋 Répondre aux questions sur les congés et documents\n• 🎯 Conseiller sur les entretiens et le recrutement\n• 📊 Fournir des statistiques RH\n• 📞 Vous orienter vers le support\n\nEssayez de reformuler votre question ou choisissez une suggestion ci-dessous.`;
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-violet-500/30 transition-all duration-300 group"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
        </motion.button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-6 right-6 w-[420px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col z-50 ${
          isMinimized ? 'h-16' : 'h-[650px]'
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-violet-600 to-blue-600 rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Assistant TalentFlow</h3>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {user?.role === 'RH' && 'Expert RH'}
                {user?.role === 'MANAGER' && 'Coach Manager'}
                {user?.role === 'ADMIN' && 'Support Admin'}
                {user?.role === 'CANDIDATE' && 'Coach Carrière'}
                {user?.role === 'EMPLOYEE' && 'Assistant Personnel'}
                {!user?.role && 'Assistant IA'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Effacer la conversation"
            >
              <Trash2 className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4 text-white/70" /> : <Minimize2 className="w-4 h-4 text-white/70" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-violet-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">Bonjour {user?.name?.split(' ')[0]} !</h4>
                  <p className="text-slate-400 text-sm mb-6">
                    Comment puis-je vous aider ?
                  </p>
                  
                  {/* Categories */}
                  <div className="space-y-3 text-left">
                    {Object.entries(getQuestionCategories()).map(([category, questions]) => (
                      <div key={category}>
                        <p className="text-xs font-semibold text-slate-500 mb-2 px-1">{category}</p>
                        <div className="space-y-1">
                          {(questions as string[]).map((question, index) => (
                            <button
                              key={index}
                              onClick={() => sendMessage(question)}
                              className="w-full text-left px-3 py-2.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-sm text-slate-300 hover:text-white transition-all border border-transparent hover:border-slate-700/50"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-violet-600 text-white rounded-tr-sm'
                        : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700/30'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-[10px] opacity-50 mt-1.5">
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-700/30">
                    <div className="flex gap-1.5">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-slate-500 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-2 h-2 bg-slate-500 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-2 h-2 bg-slate-500 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions after messages */}
            {messages.length > 0 && !isLoading && (
              <div className="px-4 pb-2">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-400 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Suggestions
                  <ChevronDown className={`w-3 h-3 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 flex flex-wrap gap-1.5"
                    >
                      {Object.values(getQuestionCategories()).flat().slice(0, 4).map((q, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(q as string)}
                          className="px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-all border border-slate-700/30"
                        >
                          {q as string}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-800 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-violet-500/20"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;
