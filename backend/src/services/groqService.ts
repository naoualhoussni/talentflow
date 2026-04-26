import { 
  mockUsers, 
  mockCompanies, 
  mockJobs, 
  mockApplications, 
  mockDocuments, 
  mockPerformanceData,
  getChatbotResponse
} from '../data/mockData';

export class GroqService {
  private static apiKey = process.env.GROQ_API_KEY || '';
  private static baseUrl = 'https://api.groq.com/openai/v1';

  private static async makeRequest(endpoint: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw error;
    }
  }

  static async chatCompletion(messages: any[], model: string = 'llama-3.3-70b-versatile') {
    const data = {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    };

    const response = await this.makeRequest('chat/completions', data);
    return response;
  }

  // CV Analysis
  static async analyzeCV(cvText: string) {
    const messages = [
      {
        role: 'system',
        content: 'Tu es un expert en analyse de CV et recrutement. Analyse ce CV et fournis une évaluation détaillée des compétences, de l\'expérience et des recommandations.'
      },
      {
        role: 'user',
        content: `Analyse ce CV :\n\n${cvText}`
      }
    ];

    try {
      const response = await this.chatCompletion(messages);
      
      if (response.choices && response.choices[0]) {
        const analysis = response.choices[0].message.content;
        
        // Parse the analysis into structured data
        return {
          summary: analysis.substring(0, 200) + '...',
          skills: this.extractSkills(analysis),
          experience: this.extractExperience(analysis),
          recommendations: this.extractRecommendations(analysis),
          score: this.calculateScore(analysis),
          strengths: this.extractStrengths(analysis),
          weaknesses: this.extractWeaknesses(analysis)
        };
      }
      
      throw new Error('No response from Groq API');
    } catch (error) {
      console.error('CV Analysis failed:', error);
      // Fallback to mock analysis
      return {
        summary: 'Profil technique solide avec expérience en développement web',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'CSS'],
        experience: '5+ ans en développement full-stack',
        recommendations: ['Approfondir les compétences backend', 'Certifications cloud'],
        score: 85,
        strengths: ['Développement frontend', 'Travail d\'équipe', 'Autonomie'],
        weaknesses: ['Expérience limitée en architecture système', 'Gestion de projet']
      };
    }
  }

  // Job matching
  static async calculateMatching(candidate: any, job: any) {
    const messages = [
      {
        role: 'system',
        content: 'Tu es un expert en matching candidat-emploi. Évalue la compatibilité entre un candidat et une offre d\'emploi en te basant sur les compétences, l\'expérience et les exigences.'
      },
      {
        role: 'user',
        content: `Évalue la compatibilité pour ce candidat et cette offre :\n\nCandidat : ${JSON.stringify(candidate)}\n\nOffre : ${JSON.stringify(job)}`
      }
    ];

    try {
      const response = await this.chatCompletion(messages);
      
      if (response.choices && response.choices[0]) {
        const matching = response.choices[0].message.content;
        
        return {
          overallScore: this.extractScore(matching),
          skillsMatch: this.extractSkillsMatch(matching),
          experienceMatch: this.extractExperienceMatch(matching),
          cultureFit: this.extractCultureFit(matching),
          recommendations: this.extractMatchingRecommendations(matching),
          strengths: this.extractCandidateStrengths(matching),
          gaps: this.extractSkillGaps(matching)
        };
      }
      
      throw new Error('No response from Groq API');
    } catch (error) {
      console.error('Matching calculation failed:', error);
      // Fallback to mock matching
      return {
        overallScore: 78,
        skillsMatch: 85,
        experienceMatch: 75,
        cultureFit: 80,
        recommendations: ['Renforcer les compétences en architecture', 'Certification AWS'],
        strengths: ['Expérience React', 'Projet personnel', 'Autonomie'],
        gaps: ['Compétences backend avancées', 'Expérience en équipe']
      };
    }
  }

  // Interview questions generation
  static async generateInterviewQuestions(job: any) {
    const messages = [
      {
        role: 'system',
        content: 'Tu es un expert en recrutement. Génère des questions d\'entretien pertinentes pour ce poste, incluant des questions techniques, comportementales et de situation.'
      },
      {
        role: 'user',
        content: `Génère des questions d\'entretien pour ce poste :\n\n${JSON.stringify(job)}`
      }
    ];

    try {
      const response = await this.chatCompletion(messages);
      
      if (response.choices && response.choices[0]) {
        const questions = response.choices[0].message.content;
        return this.parseQuestions(questions);
      }
      
      throw new Error('No response from Groq API');
    } catch (error) {
      console.error('Question generation failed:', error);
      // Fallback to mock questions
      return [
        {
          type: 'technical',
          question: 'Quelle est votre expérience avec React Hooks ?',
          category: 'Frontend'
        },
        {
          type: 'behavioral',
          question: 'Décrivez une situation où vous avez dû gérer un conflit d\'équipe.',
          category: 'Soft Skills'
        },
        {
          type: 'situational',
          question: 'Comment aborderiez-vous l\'optimisation des performances d\'une application ?',
          category: 'Problem Solving'
        }
      ];
    }
  }

  // Performance prediction
  static async predictPerformance(employee: any) {
    const messages = [
      {
        role: 'system',
        content: 'Tu es un expert en analyse de performance des employés. Prédit la performance future basée sur l\'historique, les compétences et les objectifs.'
      },
      {
        role: 'user',
        content: `Prédit la performance pour cet employé :\n\n${JSON.stringify(employee)}`
      }
    ];

    try {
      const response = await this.chatCompletion(messages);
      
      if (response.choices && response.choices[0]) {
        const prediction = response.choices[0].message.content;
        return this.parsePrediction(prediction);
      }
      
      throw new Error('No response from Groq API');
    } catch (error) {
      console.error('Performance prediction failed:', error);
      // Fallback to mock prediction
      return {
        predictedScore: 82,
        trend: 'stable',
        riskLevel: 'LOW',
        recommendations: ['Développer les compétences en leadership', 'Formation en gestion de projet'],
        timeline: '6 mois'
      };
    }
  }

  // Chatbot message
  static async chatbotMessage(message: string, userRole: string) {
    // First check for automatic responses
    const automaticResponse = getChatbotResponse(message, userRole);
    if (automaticResponse) {
      return { response: automaticResponse };
    }

    const messages = [
      {
        role: 'system',
        content: `Tu es l'assistant IA de TalentFlow-AI. Tu aides les utilisateurs selon leur rôle : ${userRole}. Sois professionnel, utile et concis.`
      },
      {
        role: 'user',
        content: message
      }
    ];

    try {
      const response = await this.chatCompletion(messages);
      
      if (response.choices && response.choices[0]) {
        return { response: response.choices[0].message.content };
      }
      
      throw new Error('No response from Groq API');
    } catch (error) {
      console.error('Chatbot message failed:', error);
      // Fallback to automatic response
      const fallbackResponse = getChatbotResponse(message, userRole);
      return { response: fallbackResponse || 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer ultérieurement.' };
    }
  }

  // Helper methods for parsing responses
  private static extractSkills(text: string): string[] {
    const skillsMatch = text.match(/compétences?:\s*([^\n]+)/i);
    return skillsMatch ? skillsMatch[1].split(',').map(s => s.trim()) : [];
  }

  private static extractExperience(text: string): string {
    const expMatch = text.match(/expérience?:\s*([^\n]+)/i);
    return expMatch ? expMatch[1].trim() : '';
  }

  private static extractRecommendations(text: string): string[] {
    const recMatch = text.match(/recommandations?:\s*([^\n]+)/i);
    return recMatch ? recMatch[1].split(',').map(r => r.trim()) : [];
  }

  private static calculateScore(text: string): number {
    const scoreMatch = text.match(/score?:\s*(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : 0;
  }

  private static extractStrengths(text: string): string[] {
    const strengthsMatch = text.match(/forces?:\s*([^\n]+)/i);
    return strengthsMatch ? strengthsMatch[1].split(',').map(s => s.trim()) : [];
  }

  private static extractWeaknesses(text: string): string[] {
    const weaknessesMatch = text.match(/faiblesses?:\s*([^\n]+)/i);
    return weaknessesMatch ? weaknessesMatch[1].split(',').map(w => w.trim()) : [];
  }

  private static extractScore(text: string): number {
    const scoreMatch = text.match(/score?:\s*(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : 0;
  }

  private static extractSkillsMatch(text: string): number {
    const matchMatch = text.match(/compétences.*?(\d+)%/i);
    return matchMatch ? parseInt(matchMatch[1]) : 0;
  }

  private static extractExperienceMatch(text: string): number {
    const expMatch = text.match(/expérience.*?(\d+)%/i);
    return expMatch ? parseInt(expMatch[1]) : 0;
  }

  private static extractCultureFit(text: string): number {
    const cultureMatch = text.match(/culture.*?(\d+)%/i);
    return cultureMatch ? parseInt(cultureMatch[1]) : 0;
  }

  private static extractMatchingRecommendations(text: string): string[] {
    const recMatch = text.match(/recommandations?:\s*([^\n]+)/i);
    return recMatch ? recMatch[1].split(',').map(r => r.trim()) : [];
  }

  private static extractCandidateStrengths(text: string): string[] {
    const strengthsMatch = text.match(/forces?:\s*([^\n]+)/i);
    return strengthsMatch ? strengthsMatch[1].split(',').map(s => s.trim()) : [];
  }

  private static extractSkillGaps(text: string): string[] {
    const gapsMatch = text.match(/écarts?:\s*([^\n]+)/i);
    return gapsMatch ? gapsMatch[1].split(',').map(g => g.trim()) : [];
  }

  private static parseQuestions(text: string): any[] {
    const lines = text.split('\n').filter(line => line.trim());
    const questions = [];
    
    for (const line of lines) {
      if (line.includes('?') || line.includes('Question')) {
        questions.push({
          type: 'general',
          question: line.trim(),
          category: 'General'
        });
      }
    }
    
    return questions.length > 0 ? questions : [
      { type: 'technical', question: 'Présentez votre expérience technique', category: 'Technical' },
      { type: 'behavioral', question: 'Comment gérez-vous les conflits ?', category: 'Behavioral' }
    ];
  }

  private static parsePrediction(text: string): any {
    const scoreMatch = text.match(/score.*?(\d+)/i);
    const trendMatch = text.match(/tendance?:\s*([^\n]+)/i);
    const riskMatch = text.match(/risque?:\s*([^\n]+)/i);
    const recMatch = text.match(/recommandations?:\s*([^\n]+)/i);
    const timelineMatch = text.match(/échéance?:\s*([^\n]+)/i);
    
    return {
      predictedScore: scoreMatch ? parseInt(scoreMatch[1]) : 75,
      trend: trendMatch ? trendMatch[1].trim() : 'stable',
      riskLevel: riskMatch ? riskMatch[1].trim().toUpperCase() : 'MEDIUM',
      recommendations: recMatch ? recMatch[1].split(',').map(r => r.trim()) : [],
      timeline: timelineMatch ? timelineMatch[1].trim() : '3 mois'
    };
  }
}

export default GroqService;
