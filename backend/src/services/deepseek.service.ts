interface CVData {
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
  education?: string;
  experience?: string;
  summary?: string;
}

export class DeepSeekService {
  private static readonly API_URL = 'https://api.deepseek.com/v1/chat/completions';
  private static readonly MODEL = 'deepseek-chat';

  static async parseCV(cvText: string): Promise<CVData> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }

    const systemPrompt = `You are an expert CV parser and HR analyst. Extract structured information from the CV text and return a JSON object with the following fields:
- name: Full name of the candidate
- email: Email address
- phone: Phone number (if available)
- skills: Array of technical and soft skills
- experienceYears: Total years of experience (as number)
- education: Education background (if available)
- experience: Work experience summary (if available)
- summary: Professional summary (if available)

Return ONLY valid JSON, no explanations or extra text.`;

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: cvText }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepSeek API error: ${error}`);
    }

    const data: any = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // Fallback parsing if JSON is malformed
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse CV data from DeepSeek response');
    }
  }

  static async generateInterviewQuestions(jobTitle: string, jobRequirements: string, candidateCV: string): Promise<string[]> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }

    const systemPrompt = `You are an expert interviewer. Based on the job description and candidate CV, generate 8-10 relevant interview questions. Return ONLY a JSON array of questions, no explanations.`;

    const userPrompt = `Job Title: ${jobTitle}
Job Requirements: ${jobRequirements}
Candidate CV: ${candidateCV}

Generate interview questions that assess both technical skills and cultural fit.`;

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // Fallback: extract questions manually
      const questions = content.split('\n')
        .filter((line: string) => line.trim() && (line.includes('?') || line.match(/^\d+\./)))
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((q: string) => q.length > 10);
      return questions;
    }
  }
}
