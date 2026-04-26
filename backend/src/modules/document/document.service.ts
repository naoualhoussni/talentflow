import prisma from '../../utils/prisma';
import { eventBus, TalentEvent } from '../../core/EventBus';

export class DocumentService {
  static async generateInterviewReport(candidateId: string, companyId: string) {
    const candidate = await prisma.candidate.findUnique({ 
      where: { id: candidateId },
      include: { evaluations: true }
    });

    if (!candidate) return;

    const content = `
      <h1>Interview Report: ${candidate.name}</h1>
      <p>Job ID: ${candidate.jobId}</p>
      <p>AI Score: ${candidate.score}</p>
      <h2>Evaluations</h2>
      ${candidate.evaluations.map(e => `
        <div>
          <p>Global Score: ${e.globalScore}</p>
          <p>Feedback: ${e.feedback}</p>
        </div>
      `).join('')}
    `;

    const doc = await prisma.document.create({
      data: {
        type: 'INTERVIEW_REPORT',
        title: `Interview Report - ${candidate.name}`,
        content,
        candidateId,
        companyId,
      }
    });

    eventBus.emitEvent(TalentEvent.DOCUMENT_GENERATED, { documentId: doc.id, candidateId, companyId });
    return doc;
  }
}
