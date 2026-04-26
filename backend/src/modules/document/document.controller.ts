import { Response } from 'express';
import prisma from '../../utils/prisma';
import { AuthRequest } from '../../middleware/auth';
import { eventBus, TalentEvent } from '../../core/EventBus';

// GET /documents
export const listDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId!;
    const { type, candidateId } = req.query;

    const documents = await prisma.document.findMany({
      where: {
        companyId,
        ...(type ? { type: String(type) } : {}),
        ...(candidateId ? { candidateId: String(candidateId) } : {}),
      },
      include: { candidate: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(documents);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /documents/generate - Generate a document
export const generateDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { type, candidateId, title, content } = req.body;
    const companyId = req.user?.companyId!;

    const validTypes = ['INTERVIEW_REPORT', 'APPROVAL_REQUEST', 'CONTRACT'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: `Invalid type. Valid: ${validTypes.join(', ')}` });
    }

    let documentContent = content;

    // Auto-generate content if not provided
    if (!documentContent && candidateId) {
      const candidate = await prisma.candidate.findFirst({
        where: { id: candidateId, companyId },
        include: { evaluations: true, job: { select: { title: true } } },
      });

      if (candidate) {
        const avgScore = candidate.evaluations.length > 0
          ? (candidate.evaluations.reduce((a, e) => a + e.globalScore, 0) / candidate.evaluations.length).toFixed(1)
          : 'N/A';

        documentContent = JSON.stringify({
          candidate: candidate.name,
          email: candidate.email,
          job: candidate.job?.title,
          score: candidate.score,
          status: candidate.status,
          evaluationScore: avgScore,
          aiSummary: candidate.aiSummary,
          generatedAt: new Date().toISOString(),
          type,
        });
      }
    }

    const doc = await prisma.document.create({
      data: {
        type,
        title: title || `${type} - ${new Date().toLocaleDateString()}`,
        content: documentContent || '{}',
        candidateId: candidateId || null,
        companyId,
        status: 'GENERATED',
      },
    });

    eventBus.emitEvent(TalentEvent.DOCUMENT_GENERATED, { documentId: doc.id, type, companyId });
    return res.status(201).json(doc);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /documents/:id
export const getDocument = async (req: AuthRequest, res: Response) => {
  try {
    const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const companyId = req.user?.companyId as string;
    
    const doc = await prisma.document.findFirst({
      where: { id: documentId, companyId },
      include: { candidate: true },
    });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    return res.json(doc);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /documents/:id/status
export const updateDocumentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const valid = ['GENERATED', 'SIGNED', 'ARCHIVED'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const companyId = req.user?.companyId as string;
    
    const doc = await prisma.document.updateMany({
      where: { id: documentId, companyId },
      data: { status },
    });
    if (doc.count === 0) return res.status(404).json({ message: 'Document not found' });

    return res.json({ message: 'Status updated', status });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
