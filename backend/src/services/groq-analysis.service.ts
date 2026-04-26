interface AnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  insights: string[];
}

interface TeamAnalysisResult {
  teamPerformance: number;
  teamDynamics: string;
  skillGaps: string[];
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
}

interface CandidateDeepAnalysis {
  profileMatch: number;
  technicalSkills: {
    score: number;
    details: string[];
    gaps: string[];
  };
  softSkills: {
    score: number;
    details: string[];
    areas: string[];
  };
  potential: {
    growthScore: number;
    careerPath: string[];
    timeToProductivity: string;
  };
  culturalFit: {
    score: number;
    alignment: string[];
    concerns: string[];
  };
  overallRecommendation: 'HIRE' | 'CONSIDER' | 'REJECT';
  reasoning: string;
}

export class GroqAnalysisService {
  private static readonly GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  private static readonly GROQ_MODEL = 'llama-3.3-70b-versatile';

  private static async callGroq(systemPrompt: string, userMessage: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const response = await fetch(this.GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const data: any = await response.json();
    return data.choices[0].message.content;
  }

  // Analyse approfondie de CV avec Groq
  static async deepAnalyzeCV(cvText: string, jobRequirements?: string): Promise<CandidateDeepAnalysis> {
    const systemPrompt = `Tu es un expert en analyse de CV et évaluation de talents avec 15 ans d'expérience en RH et recrutement technologique. 
Analyse le CV en profondeur et fournis une évaluation structurée et détaillée.

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "profileMatch": nombre_0_100,
  "technicalSkills": {
    "score": nombre_0_100,
    "details": ["compétence1 avec niveau", "compétence2 avec niveau"],
    "gaps": ["compétence manquante1", "compétence manquante2"]
  },
  "softSkills": {
    "score": nombre_0_100,
    "details": ["soft skill1 avec preuve", "soft skill2 avec preuve"],
    "areas": ["domaine d'amélioration1", "domaine d'amélioration2"]
  },
  "potential": {
    "growthScore": nombre_0_100,
    "careerPath": ["étape1", "étape2", "étape3"],
    "timeToProductivity": "description"
  },
  "culturalFit": {
    "score": nombre_0_100,
    "alignment": ["point fort1", "point fort2"],
    "concerns": ["concern1", "concern2"]
  },
  "overallRecommendation": "HIRE" ou "CONSIDER" ou "REJECT",
  "reasoning": "raisonnement détaillé de 3-4 phrases"
}`;

    const userPrompt = jobRequirements 
      ? `CV à analyser:\n${cvText}\n\nExigences du poste:\n${jobRequirements}\n\nFournis une analyse détaillée et objective.`
      : `CV à analyser:\n${cvText}\n\nFournis une analyse détaillée et objective sans référence à un poste spécifique.`;

    try {
      const response = await this.callGroq(systemPrompt, userPrompt);
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        // Fallback parsing
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to parse Groq response');
      }
    } catch (error: any) {
      throw new Error(`Deep CV analysis failed: ${error.message}`);
    }
  }

  // Analyse de performance d'équipe
  static async analyzeTeamPerformance(teamData: any): Promise<TeamAnalysisResult> {
    const systemPrompt = `Tu es un expert en analyse organisationnelle et performance d'équipe avec 10 ans d'expérience en management et consulting.
Analyse les données d'équipe fournies et donne une évaluation complète de la performance, dynamique, et opportunités d'amélioration.

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "teamPerformance": nombre_0_100,
  "teamDynamics": "analyse détaillée de la dynamique d'équipe",
  "skillGaps": ["compétence manquante1", "compétence manquante2"],
  "recommendations": ["recommandation1", "recommandation2", "recommandation3"],
  "riskFactors": ["risque1", "risque2"],
  "opportunities": ["opportunité1", "opportunité2"]
}`;

    const userPrompt = `Données d'équipe à analyser:\n${JSON.stringify(teamData, null, 2)}\n\nFournis une analyse approfondie de la performance et dynamique d'équipe.`;

    try {
      const response = await this.callGroq(systemPrompt, userPrompt);
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to parse team analysis response');
      }
    } catch (error: any) {
      throw new Error(`Team analysis failed: ${error.message}`);
    }
  }

  // Analyse de risque employé avancée
  static async advancedRiskAnalysis(employeeData: any, performanceHistory: any[]): Promise<AnalysisResult> {
    const systemPrompt = `Tu es un expert en gestion des risques RH et analyse prédictive avec expertise en psychologie organisationnelle.
Analyse le profil de l'employé et son historique pour identifier les risques potentiels et fournir des recommandations proactives.

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "summary": "résumé du profil de risque",
  "strengths": ["force1", "force2", "force3"],
  "weaknesses": ["faiblesse1", "faiblesse2"],
  "recommendations": ["recommandation1", "recommandation2", "recommandation3"],
  "score": nombre_0_100,
  "riskLevel": "LOW" ou "MEDIUM" ou "HIGH",
  "insights": ["insight1", "insight2", "insight3"]
}`;

    const userPrompt = `Données employé:\n${JSON.stringify(employeeData, null, 2)}\n\nHistorique de performance:\n${JSON.stringify(performanceHistory, null, 2)}\n\nFournis une analyse de risque détaillée avec recommandations spécifiques.`;

    try {
      const response = await this.callGroq(systemPrompt, userPrompt);
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to parse risk analysis response');
      }
    } catch (error: any) {
      throw new Error(`Risk analysis failed: ${error.message}`);
    }
  }

  // Analyse de marché et benchmarking
  static async marketAnalysis(position: string, skills: string[], experience: number): Promise<AnalysisResult> {
    const systemPrompt = `Tu es un expert en analyse du marché de l'emploi et benchmarking salarial avec connaissance approfondie des tendances technologiques.
Analyse le profil par rapport au marché actuel et fournis des insights sur la compétitivité et opportunités.

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "summary": "positionnement sur le marché",
  "strengths": ["avantage concurrentiel1", "avantage2"],
  "weaknesses": ["point faible1", "point faible2"],
  "recommendations": ["recommandation marché1", "recommandation2"],
  "score": nombre_0_100,
  "riskLevel": "LOW" ou "MEDIUM" ou "HIGH",
  "insights": ["tendance marché1", "tendance2", "opportunité3"]
}`;

    const userPrompt = `Position: ${position}\nCompétences: ${skills.join(', ')}\nExpérience: ${experience} ans\n\nAnalyse ce profil par rapport au marché actuel de l'emploi.`;

    try {
      const response = await this.callGroq(systemPrompt, userPrompt);
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to parse market analysis response');
      }
    } catch (error: any) {
      throw new Error(`Market analysis failed: ${error.message}`);
    }
  }

  // Analyse prédictive de performance
  static async predictivePerformanceAnalysis(candidateProfile: any, similarProfiles: any[]): Promise<AnalysisResult> {
    const systemPrompt = `Tu es un expert en analytics prédictif et science des données appliquée aux RH.
En te basant sur le profil du candidat et des profils similaires, prédis la performance potentielle et identifie les facteurs de succès.

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "summary": "prédiction de performance potentielle",
  "strengths": ["facteur de succès1", "facteur2"],
  "weaknesses": ["risque performance1", "risque2"],
  "recommendations": ["action succès1", "action2"],
  "score": nombre_0_100,
  "riskLevel": "LOW" ou "MEDIUM" ou "HIGH",
  "insights": ["insight prédictif1", "insight2", "insight3"]
}`;

    const userPrompt = `Profil candidat:\n${JSON.stringify(candidateProfile, null, 2)}\n\nProfils similaires et leurs performances:\n${JSON.stringify(similarProfiles, null, 2)}\n\nFournis une analyse prédictive détaillée.`;

    try {
      const response = await this.callGroq(systemPrompt, userPrompt);
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to parse predictive analysis response');
      }
    } catch (error: any) {
      throw new Error(`Predictive analysis failed: ${error.message}`);
    }
  }

  // Analyse de culture d'entreprise
  static async cultureFitAnalysis(candidateProfile: any, companyCulture: any): Promise<AnalysisResult> {
    const systemPrompt = `Tu es un expert en culture d'entreprise et psychologie organisationnelle.
Évalue l'adéquation entre le profil du candidat et la culture d'entreprise pour prédire l'intégration et la rétention.

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "summary": "adéquation culturelle globale",
  "strengths": ["point d'alignement1", "point2"],
  "weaknesses": ["point de friction1", "point2"],
  "recommendations": ["intégration1", "intégration2"],
  "score": nombre_0_100,
  "riskLevel": "LOW" ou "MEDIUM" ou "HIGH",
  "insights": ["insight culture1", "insight2", "insight3"]
}`;

    const userPrompt = `Profil candidat:\n${JSON.stringify(candidateProfile, null, 2)}\n\nCulture d'entreprise:\n${JSON.stringify(companyCulture, null, 2)}\n\nÉvalue l'adéquation culturelle en profondeur.`;

    try {
      const response = await this.callGroq(systemPrompt, userPrompt);
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to parse culture fit analysis response');
      }
    } catch (error: any) {
      throw new Error(`Culture fit analysis failed: ${error.message}`);
    }
  }
}
