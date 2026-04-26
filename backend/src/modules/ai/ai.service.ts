import prisma from '../../utils/prisma';
import { eventBus, TalentEvent } from '../../core/EventBus';

export class AIService {
  static async parseResume(candidateId: string, companyId: string) {
    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate) return;

    console.log(`[AI] Parsing resume for candidate: ${candidate.name}`);
    
    // Simulate AI parsing logic
    const mockSkills = ['React', 'Node.js', 'TypeScript', 'Prisma'];
    const mockSummary = `${candidate.name} is a senior developer with experience in full-stack web applications.`;
    const mockScore = 85;

    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        skills: JSON.stringify(mockSkills),
        aiSummary: mockSummary,
        score: mockScore,
      }
    });

    eventBus.emitEvent(TalentEvent.CHATBOT_COMPLETED, { candidateId, companyId, score: mockScore });
  }

  static async analyzeTurnover(employeeId: string) {
    // Simulate turnover prediction
    const riskScore = Math.random() * 100;
    const riskLevel = riskScore > 70 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW';

    await prisma.employee.update({
      where: { id: employeeId },
      data: { riskScore, riskLevel }
    });

    if (riskLevel === 'HIGH') {
      eventBus.emitEvent(TalentEvent.RISK_DETECTED, { employeeId, riskScore });
    }
  }
}
