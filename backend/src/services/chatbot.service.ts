import { DeepSeekService } from './deepseek.service';
import { MockChatbotService } from './mock-chatbot.service';

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

export class ChatbotService {
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

    // Generate system prompt based on user role
    const systemPrompt = this.generateSystemPrompt(context);
    
    // Prepare messages for AI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    try {
      const response = await this.callAI(messages);
      
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
    } catch (error) {
      console.log('DeepSeek API failed, using mock service:', error);
      // Fallback to mock service
      const mockResponse = await MockChatbotService.sendMessage(userId, message, context);
      
      // Update conversation with mock response
      conversation.push({
        role: 'assistant',
        content: mockResponse,
        timestamp: new Date()
      });

      return mockResponse;
    }
  }

  private static generateSystemPrompt(context: ChatContext): string {
    const basePrompt = `Tu es un assistant IA intelligent pour TalentFlow-AI, une plateforme RH moderne. 
Tu es serviable, professionnel et tu aides les utilisateurs selon leur rôle.
Réponds en français de manière claire et concise.
La date actuelle est ${new Date().toLocaleDateString('fr-FR')}.`;

    switch (context.userRole) {
      case 'RH':
        return `${basePrompt}
        
En tant qu'assistant pour les RH, tu peux aider avec:
- Analyse de CV et évaluation des candidats
- Création de descriptions de poste
- Questions d'entretien
- Processus de recrutement
- Évaluation des risques employés
- Statistiques et rapports RH

Tu as accès aux données de l'entreprise ${context.companyId} et tu peux fournir des analyses personnalisées.`;

      case 'MANAGER':
        return `${basePrompt}
        
En tant qu'assistant pour les managers, tu peux aider avec:
- Évaluation des candidats pour leur équipe
- Analyse des performances
- Gestion des risques d'équipe
- Recrutement pour des postes spécifiques
- Planification des besoins en personnel

Tu focuses sur les aspects opérationnels et stratégiques du management.`;

      case 'ADMIN':
        return `${basePrompt}
        
En tant qu'assistant administrateur, tu peux aider avec:
- Configuration de la plateforme
- Gestion des utilisateurs et permissions
- Analyse des données globales
- Rapports administratifs
- Support technique

Tu as un accès complet à toutes les fonctionnalités du système.`;

      case 'CANDIDATE':
        return `${basePrompt}
        
En tant qu'assistant pour les candidats, tu peux aider avec:
- Conseils pour les entretiens
- Optimisation de CV
- Préparation aux tests techniques
- Information sur le processus de recrutement
- Questions sur les postes disponibles

Tu es encourageant et tu aides les candidats à réussir leur recherche d'emploi.`;

      default:
        return `${basePrompt}
        
Tu peux aider avec les questions générales sur la plateforme TalentFlow-AI et les processus RH.`;
    }
  }

  private static async callAI(messages: any[]): Promise<string> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    return data.choices[0].message.content;
  }

  static getConversationHistory(userId: string): ChatMessage[] {
    return this.conversations.get(userId) || [];
  }

  static clearConversation(userId: string): void {
    this.conversations.delete(userId);
  }

  // Helper functions for specific tasks
  static async parseCVWithChatbot(cvText: string): Promise<string> {
    const systemPrompt = `Tu es un expert en analyse de CV. Analyse le texte du CV fourni et donne:
1. Un résumé du profil (2-3 phrases)
2. Les compétences principales (liste)
3. Les points forts
4. Les axes d'amélioration
5. Une recommandation (HIRE/CONSIDER/REJECT) avec justification

Sois précis et constructif dans ton analyse.`;

    const response = await this.callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: cvText }
    ]);

    return response;
  }

  static async generateJobDescription(jobTitle: string, requirements: string): Promise<string> {
    const systemPrompt = `Tu es un expert en rédaction de descriptions de poste. Crée une description de poste attractive et professionnelle incluant:
- Titre du poste
- Mission principale
- Responsabilités principales
- Compétences requises
- Qualifications
- Avantages offerts

Sois persuasif et professionnel.`;

    const response = await this.callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Titre: ${jobTitle}\nExigences: ${requirements}` }
    ]);

    return response;
  }
}
