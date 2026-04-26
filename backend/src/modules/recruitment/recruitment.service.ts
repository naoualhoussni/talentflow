import prisma from '../../utils/prisma';
import { eventBus, TalentEvent } from '../../core/EventBus';

export class RecruitmentService {
  static async getCandidates(companyId: string) {
    return prisma.candidate.findMany({
      where: { companyId },
      include: { job: true },
    });
  }

  static async createCandidate(data: any) {
    const candidate = await prisma.candidate.create({
      data: {
        ...data,
        status: 'APPLIED',
      },
    });

    eventBus.emitEvent(TalentEvent.CANDIDATE_CREATED, { 
      candidateId: candidate.id, 
      companyId: candidate.companyId 
    });

    return candidate;
  }

  static async evaluateCandidate(candidateId: string, data: any, evaluatorId: string) {
    const evaluation = await prisma.evaluation.create({
      data: {
        ...data,
        candidateId,
        evaluatorId,
        companyId: data.companyId,
      },
    });

    eventBus.emitEvent(TalentEvent.EVALUATION_SUBMITTED, { 
      candidateId, 
      companyId: data.companyId,
      evaluationId: evaluation.id 
    });

    return evaluation;
  }

  static async getCandidateDashboard(email: string) {
    // 1. Get all candidates associated with this email (across any company)
    const candidates = await prisma.candidate.findMany({
      where: { email },
      include: { job: true, company: true }
    });

    // 2. Get recommendations (jobs from companies where the candidate is registered)
    const companyIds = Array.from(new Set(candidates.map(c => c.companyId)));
    const recommendedJobs = await prisma.job.findMany({
      where: {
        companyId: { in: companyIds },
        status: 'OPEN'
      },
      include: { company: true },
      take: 5
    });

    // 3. Calculate stats
    const totalApplications = candidates.length;
    const interviews = candidates.filter(c => c.status === 'EVALUATED').length;
    const scores = candidates.map(c => c.score).filter(s => s > 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return {
      applications: candidates,
      recommendedJobs,
      stats: {
        totalApplications,
        interviews,
        avgMatchRate: avgScore
      }
    };
  }
}
