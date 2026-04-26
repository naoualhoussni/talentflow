import { Response } from 'express';
import prisma from '../../utils/prisma';
import { AuthRequest } from '../../middleware/auth';

// GET /jobs
export const listJobs = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId as string;
    const { status, department } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        ...(companyId ? { companyId } : {}),
        ...(status ? { status: String(status) } : {}),
        ...(department ? { department: String(department) } : {}),
      },
      include: { _count: { select: { candidates: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(jobs);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /jobs
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, requirements, department, salary } = req.body;
    const companyId = req.user?.companyId as string;

    if (!title || !description || !requirements) {
      return res.status(400).json({ message: 'title, description, requirements required' });
    }
    if (!companyId) return res.status(400).json({ message: 'Company context required' });

    const job = await prisma.job.create({
      data: { title, description, requirements, department, salary, companyId },
    });
    return res.status(201).json(job);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /jobs/:id
export const getJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await prisma.job.findFirst({
      where: { id: req.params.id as string, companyId: req.user?.companyId as string },
      include: {
        candidates: { select: { id: true, name: true, status: true, score: true, createdAt: true } },
        _count: { select: { candidates: true } },
      },
    });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    return res.json(job);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /jobs/:id
export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, requirements, department, salary, status } = req.body;
    const job = await prisma.job.updateMany({
      where: { id: req.params.id as string, companyId: req.user?.companyId as string },
      data: { title, description, requirements, department, salary, status },
    });
    if (job.count === 0) return res.status(404).json({ message: 'Job not found' });
    const updated = await prisma.job.findUnique({ where: { id: req.params.id as string } });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /jobs/:id
export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.job.deleteMany({
      where: { id: req.params.id as string, companyId: req.user?.companyId as string },
    });
    return res.json({ message: 'Job deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
