import { Response } from 'express';
import prisma from '../../utils/prisma';
import { AuthRequest } from '../../middleware/auth';
import { eventBus, TalentEvent } from '../../core/EventBus';

// GET /evaluations
export const listEvaluations = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId as string;
    const { candidateId } = req.query;

    const evaluations = await prisma.evaluation.findMany({
      where: { companyId: companyId as string, ...(candidateId ? { candidateId: String(candidateId) } : {}) },
      include: {
        candidate: { select: { id: true, name: true, email: true } },
        evaluator: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(evaluations);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /evaluations
export const createEvaluation = async (req: AuthRequest, res: Response) => {
  try {
    const { candidateId, technicalScore, softSkillScore, motivationScore, notes, feedback } = req.body;
    const companyId = req.user?.companyId as string;
    const evaluatorId = req.user?.id as string;

    if (!candidateId) return res.status(400).json({ message: 'candidateId required' });

    const globalScore = ((technicalScore || 0) + (softSkillScore || 0) + (motivationScore || 0)) / 3;

    const evaluation = await prisma.evaluation.create({
      data: {
        candidateId,
        evaluatorId,
        companyId,
        technicalScore: technicalScore || 0,
        softSkillScore: softSkillScore || 0,
        motivationScore: motivationScore || 0,
        globalScore: Math.round(globalScore * 100) / 100,
        notes,
        feedback,
        decision: 'PENDING',
      },
    });

    // Update candidate score
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { score: Math.round(globalScore * 100) / 100, status: 'EVALUATED' },
    });

    eventBus.emitEvent(TalentEvent.EVALUATION_SUBMITTED, { evaluationId: evaluation.id, candidateId, companyId });
    return res.status(201).json(evaluation);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /evaluations/:id/decision
export const updateEvaluationDecision = async (req: AuthRequest, res: Response) => {
  try {
    const { decision } = req.body;
    const companyId = req.user?.companyId!;
    const valid = ['PENDING', 'APPROVED', 'REJECTED'];

    if (!valid.includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision' });
    }

    const evaluation = await prisma.evaluation.update({
      where: { id: req.params.id as string },
      data: { decision },
      include: { candidate: true },
    });

    // Update candidate status based on decision
    if (decision === 'APPROVED') {
      await prisma.candidate.updateMany({
        where: { id: evaluation.candidateId, companyId: companyId as string },
        data: { status: 'APPROVED' },
      });
      eventBus.emitEvent(TalentEvent.APPROVAL_REQUESTED, { candidateId: evaluation.candidateId, companyId });
    } else if (decision === 'REJECTED') {
      await prisma.candidate.updateMany({
        where: { id: evaluation.candidateId, companyId },
        data: { status: 'REJECTED' },
      });
    }

    return res.json(evaluation);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /evaluations/:id
export const getEvaluation = async (req: AuthRequest, res: Response) => {
  try {
    const evaluation = await prisma.evaluation.findFirst({
      where: { id: req.params.id as string, companyId: req.user?.companyId as string },
      include: {
        candidate: true,
        evaluator: { select: { id: true, name: true, email: true } },
      },
    });
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    return res.json(evaluation);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
