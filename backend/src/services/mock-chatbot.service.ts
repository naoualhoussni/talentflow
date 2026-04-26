interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContext {
  userRole: string;
  companyId?: string;
  userId: string;
}

export class MockChatbotService {
  private static conversations = new Map<string, ChatMessage[]>();
  
  static async sendMessage(
    userId: string, 
    message: string, 
    context: ChatContext
  ): Promise<string> {
    // Get or create conversation history
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, []);
    }
    const conversation = this.conversations.get(userId)!;
    
    // Add user message
    conversation.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Generate mock response based on role and message
    const response = this.generateMockResponse(message, context);
    
    // Add assistant response to conversation
    conversation.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    // Keep only last 20 messages
    if (conversation.length > 20) {
      conversation.splice(0, conversation.length - 20);
    }

    return response;
  }

  private static generateMockResponse(message: string, context: ChatContext): string {
    const lowerMessage = message.toLowerCase();
    
    switch (context.userRole) {
      case 'RH':
        return this.generateHRResponse(lowerMessage);
      case 'MANAGER':
        return this.generateManagerResponse(lowerMessage);
      case 'ADMIN':
        return this.generateAdminResponse(lowerMessage);
      case 'CANDIDATE':
        return this.generateCandidateResponse(lowerMessage);
      default:
        return this.generateDefaultResponse(lowerMessage);
    }
  }

  private static generateHRResponse(message: string): string {
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return `Bonjour ! Je suis votre assistant RH spécialisé TalentFlow-AI. 

Je peux vous aider avec :
- Analyse de CV et évaluation des candidats
- Création de descriptions de poste attractives
- Génération de questions d'entretien pertinentes
- Processus de recrutement optimisé
- Évaluation des risques employés
- Statistiques et rapports RH personnalisés

Comment puis-je vous assister dans vos tâches RH aujourd'hui ?`;
    }
    
    if (message.includes('cv') || message.includes('candidat') || message.includes('évaluation')) {
      return `Pour l'évaluation de candidats, je vous recommande de :

1. **Analyse automatique du CV** : Utilisez notre fonction de parsing IA pour extraire les compétences clés
2. **Score de matching** : Comparez le profil aux exigences du poste
3. **Questions d'entretien** : Générez des questions personnalisées basées sur le CV
4. **Évaluation des soft skills** : Évaluez la compatibilité culturelle

Souhaitez-vous que je vous aide à analyser un CV spécifique ou à créer une grille d'évaluation ?`;
    }
    
    if (message.includes('poste') || message.includes('description')) {
      return `Pour créer une description de poste efficace, incluez :

**Structure recommandée :**
- Titre clair et attractif
- Mission principale (2-3 lignes)
- 5-7 responsabilités principales
- Compétences techniques requises
- Qualifications et expérience
- Avantages et culture d'entreprise
- Processus de recrutement

**Exemple pour un développeur senior :**
"Nous recherchons un Développeur Full Stack Senior pour rejoindre notre équipe innovante..."

Voulez-vous que je vous aide à rédiger une description pour un poste spécifique ?`;
    }
    
    if (message.includes('entretien') || message.includes('questions')) {
      return `Voici une structure d'entretien équilibrée :

**Questions techniques (40%) :**
- "Décrivez votre projet le plus complexe"
- "Comment optimiserez-vous cette performance ?"
- "Quelles technologies maîtrisez-vous ?"

**Questions comportementales (30%) :**
- "Comment gérez-vous les conflits d'équipe ?"
- "Décrivez une situation où vous avez échoué"
- "Qu'est-ce qui vous motive dans votre travail ?"

**Questions culturelles (30%) :**
- "Pourquoi voulez-vous nous rejoindre ?"
- "Comment décririez-vous votre style de travail ?"

Besoin de questions spécifiques pour un poste particulier ?`;
    }
    
    return `En tant qu'expert RH, je peux vous optimiser vos processus de recrutement. 

Pour aller plus loin, je peux :
- Analyser des CV en détail
- Créer des évaluations personnalisées
- Générer des rapports de performance
- Vous conseiller sur la stratégie RH

Quelle fonctionnalité souhaitez-vous explorer ?`;
  }

  private static generateManagerResponse(message: string): string {
    if (message.includes('bonjour') || message.includes('salut')) {
      return `Bonjour Manager ! Je suis votre coach IA TalentFlow-AI.

Je peux vous aider avec :
- Évaluation des candidats pour votre équipe
- Analyse des performances d'équipe
- Gestion des risques et succession planning
- Recrutement ciblé pour vos besoins
- Planification des compétences

Comment puis-je optimiser votre management d'équipe aujourd'hui ?`;
    }
    
    if (message.includes('candidat') || message.includes('recrutement')) {
      return `Pour le recrutement d'équipe, concentrez-vous sur :

**Critères essentiels :**
- Compétences techniques alignées avec vos projets actuels
- Compatibilité avec la culture d'équipe existante
- Potentiel de croissance et autonomie
- Capacité de collaboration

**Processus recommandé :**
1. Définir les compétences clés manquantes
2. Évaluer les candidats sur 3 critères : technique, culturel, potentiel
3. Interview avec l'équipe existante
4. Période d'essai avec projets concrets

Besoin d'aide pour évaluer un candidat spécifique ?`;
    }
    
    if (message.includes('performance') || message.includes('équipe')) {
      return `Pour optimiser la performance d'équipe :

**Indicateurs clés à suivre :**
- Productivité par projet
- Satisfaction et engagement
- Taux de rotation
- Qualité des livrables
- Collaboration interne

**Actions d'amélioration :**
- Feedback régulier (1-1 mensuels)
- Formation continue ciblée
- Reconnaissance des réussites
- Équilibre vie pro/perso

Voulez-vous analyser la performance d'un membre spécifique ou de toute l'équipe ?`;
    }
    
    return `En tant que coach manager, je vous aide à prendre les bonnes décisions pour votre équipe.

Focus sur les résultats, le développement des talents et la culture d'entreprise. Sur quel défi d'équipe souhaitez-vous travailler ?`;
  }

  private static generateAdminResponse(message: string): string {
    if (message.includes('bonjour') || message.includes('salut')) {
      return `Bonjour Administrateur ! Je suis votre support système TalentFlow-AI.

Je peux vous assister avec :
- Configuration et administration de la plateforme
- Gestion des utilisateurs et permissions
- Analyse des données globales et KPIs
- Rapports administratifs et conformité
- Support technique et dépannage

Quelle tâche administrative puis-je vous aider à accomplir ?`;
    }
    
    if (message.includes('statistique') || message.includes('rapport') || message.includes('kpi')) {
      return `**Vue d'ensemble des KPIs TalentFlow-AI :**

**Recrutement :**
- Taux de conversion : 67%
- Temps moyen d'embauche : 23 jours
- Satisfaction candidats : 4.2/5
- Coût par recrutement : 3,200$

**Effectif :**
- Total employés : 156
- Taux de rotation : 12%/an
- Score de performance moyen : 78%
- Risques identifiés : 8 employés

**Plateforme :**
- Utilisateurs actifs : 89%
- CV traités ce mois : 234
- Entretiens planifiés : 47

Besoin d'un rapport détaillé sur un aspect spécifique ?`;
    }
    
    if (message.includes('utilisateur') || message.includes('permission')) {
      return `**Gestion des utilisateurs et permissions :**

**Rôles disponibles :**
- **ADMIN** : Accès complet à toutes les fonctionnalités
- **RH** : Recrutement, évaluation, gestion employés
- **MANAGER** : Recrutement d'équipe, évaluation performance
- **CANDIDATE** : Postuler, suivi candidature

**Actions possibles :**
- Créer/Modifier des comptes utilisateurs
- Réinitialiser les mots de passe
- Gérer les accès par entreprise
- Exporter les logs d'activité

Voulez-vous gérer un utilisateur spécifique ?`;
    }
    
    return `En tant qu'administrateur système, j'ai accès à toutes les fonctionnalités de TalentFlow-AI.

Je peux vous aider avec la configuration, la maintenance, les rapports et le support technique. Quelle opération système souhaitez-vous effectuer ?`;
  }

  private static generateCandidateResponse(message: string): string {
    if (message.includes('bonjour') || message.includes('salut')) {
      return `Bonjour ! Je suis votre coach carrière TalentFlow-AI.

Je peux vous aider avec :
- Préparation aux entretiens
- Optimisation de votre CV
- Conseils en recherche d'emploi
- Questions sur le processus de recrutement
- Développement de compétences

Comment puis-je vous accompagner dans votre recherche d'emploi ?`;
    }
    
    if (message.includes('entretien') || message.includes('préparation')) {
      return `**Préparation entretien - Guide complet :**

**Avant l'entretien :**
- Recherchez l'entreprise (valeurs, projets, actualité)
- Préparez 5 questions sur l'entreprise
- Révisez votre expérience et projets clés
- Préparez des exemples concrets (méthode STAR)

**Pendant l'entretien :**
- Écoutez attentivement les questions
- Structurez vos réponses (Situation, Tâche, Action, Résultat)
- Montrez votre enthousiasme et curiosité
- Posez des questions intelligentes

**Questions fréquentes à préparer :**
- "Parlez-moi de vous"
- "Pourquoi cette entreprise ?"
- "Vos forces et faiblesses ?"
- "Où vous voyez-vous dans 5 ans ?"

Besoin de conseils pour un type d'entretien spécifique ?`;
    }
    
    if (message.includes('cv') || message.includes('optimisation')) {
      return `**Optimisation CV - Conseils experts :**

**Structure efficace :**
1. **Header** : Nom, contact, LinkedIn, portfolio
2. **Résumé** : 3 lignes maximum, mots-clés du poste
3. **Expérience** : Résultats chiffrés, verbes d'action
4. **Compétences** : Techniques et soft skills
5. **Formation** : Pertinente et récente
6. **Projets** : 2-3 projets significatifs

**À éviter :**
- Informations personnelles (âge, situation familiale)
- Photo (sauf pour secteurs spécifiques)
- Paragraphes trop longs
- Fautes d'orthographe

**Exemple de réalisation :**
"Augmenté de 25% la conversion du site e-commerce" plutôt que "Géré le site web"

Voulez-vous que je vous aide à reformuler une section spécifique ?`;
    }
    
    if (message.includes('recherche') || message.includes('emploi')) {
      return `**Stratégie de recherche d'emploi efficace :**

**1. Préparation (1 semaine) :**
- Définir votre projet professionnel
- Mettre à jour CV et LinkedIn
- Identifier entreprises cibles (20-30)

**2. Candidatures (2-3 semaines) :**
- 5-10 candidatures qualifiées/jour
- Personnaliser chaque lettre de motivation
- Suivi des candidatures (tableau de bord)

**3. Réseautage :**
- Contactez 3 personnes par semaine sur LinkedIn
- Participez à des événements du secteur
- Sollicitez des entretiens informatifs

**4. Entretiens :**
- Entraînez-vous régulièrement
- Demandez du feedback après chaque entretien
- Continuez même après des refus

Quel aspect de votre recherche souhaitez-vous approfondir ?`;
    }
    
    return `Votre succès professionnel est ma priorité ! 

Je vous accompagne à chaque étape : CV, entretiens, négociation, intégration.

N'hésitez pas à me poser toutes vos questions sur la recherche d'emploi. Comment puis-je vous aider concrètement ?`;
  }

  private static generateDefaultResponse(message: string): string {
    if (message.includes('bonjour') || message.includes('salut')) {
      return `Bonjour ! Bienvenue sur TalentFlow-AI, votre plateforme RH intelligente.

Je suis votre assistant IA et je m'adapte à votre profil utilisateur. Que vous soyez :
- Candidat en recherche d'emploi
- Manager d'équipe
- Professionnel RH
- Administrateur système

Je peux vous aider avec des conseils personnalisés et des outils intelligents.

Comment puis-je vous assister aujourd'hui ?`;
    }
    
    return `Je suis là pour vous aider sur TalentFlow-AI ! 

Selon votre profil, je peux vous proposer des conseils et outils adaptés. N'hésitez pas à me dire quel est votre rôle et ce dont vous avez besoin.

Quelle est votre question ou votre besoin spécifique ?`;
  }

  static getConversationHistory(userId: string): ChatMessage[] {
    return this.conversations.get(userId) || [];
  }

  static clearConversation(userId: string): void {
    this.conversations.delete(userId);
  }
}
