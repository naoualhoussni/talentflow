import { Response } from 'express';
import prisma from '../../utils/prisma';
import { AuthRequest } from '../../middleware/auth';

// GET /workflows/candidates/:candidateId
export const getCandidateWorkflow = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId as string;
    const workflow = await prisma.workflowState.findFirst({
      where: { candidateId: req.params.candidateId as string, companyId: companyId as string },
      include: { candidate: { select: { id: true, name: true, status: true } } },
    });
    if (!workflow) return res.status(404).json({ message: 'Workflow not found' });

    return res.json({
      ...workflow,
      history: JSON.parse(workflow.history),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /workflows/pipeline - full recruitment pipeline overview
export const getPipeline = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId as string;

    const stages = ['APPLIED', 'CHATBOT_DONE', 'EVALUATED', 'APPROVED', 'REJECTED', 'EMPLOYEE'];
    const pipeline = await Promise.all(
      stages.map(async (stage) => {
        const count = await prisma.candidate.count({ where: { companyId, status: stage } });
        const candidates = await prisma.candidate.findMany({
          where: { companyId, status: stage },
          select: { id: true, name: true, email: true, score: true, createdAt: true, job: { select: { title: true } } },
          take: 10,
          orderBy: { updatedAt: 'desc' },
        });
        return { stage, count, candidates };
      })
    );

    return res.json(pipeline);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
