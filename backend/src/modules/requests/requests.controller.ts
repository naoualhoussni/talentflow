import { Response } from 'express';
import prisma from '../../utils/prisma';
import { AuthRequest } from '../../middleware/auth';
import { eventBus, TalentEvent } from '../../core/EventBus';

// Temporary in-memory storage for document requests
// In production, this would be stored in database
const documentRequests: any[] = [];

// GET /requests - Get user's document requests
export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userRequests = documentRequests.filter(request => 
      request.userId === req.user!.id && 
      request.companyId === req.user!.companyId
    );

    return res.json(userRequests);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /requests - Create a new document request
export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, description, urgency } = req.body;

    if (!type || !title) {
      return res.status(400).json({ message: 'Type and title are required' });
    }

    const request = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      description: description || '',
      urgency: urgency || 'normal',
      status: 'PENDING',
      userId: req.user!.id,
      companyId: req.user!.companyId as string,
      requestedAt: new Date().toISOString(),
      processedAt: null,
      documentUrl: null,
      rejectionReason: null
    };

    documentRequests.push(request);

    // Emit event for notification
    eventBus.emitEvent(TalentEvent.DOCUMENT_REQUESTED, {
      requestId: request.id,
      type,
      userId: req.user!.id,
      companyId: req.user!.companyId
    });

    return res.status(201).json(request);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /requests/:id/status - Update request status (for HR/Admin)
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, documentUrl, rejectionReason } = req.body;

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'GENERATED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const requestIndex = documentRequests.findIndex(req => req.id === id);
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const updatedRequest = {
      ...documentRequests[requestIndex],
      status,
      processedAt: new Date().toISOString(),
      documentUrl: documentUrl || null,
      rejectionReason: rejectionReason || null
    };

    documentRequests[requestIndex] = updatedRequest;

    // Emit event for notification
    if (status === 'GENERATED') {
      eventBus.emitEvent(TalentEvent.DOCUMENT_GENERATED, {
        requestId: id,
        documentUrl,
        companyId: req.user!.companyId
      });
    }

    return res.json(updatedRequest);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /requests/all - Get all requests (for HR/Admin)
export const getAllRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { status, type } = req.query;
    const companyId = req.user!.companyId as string;

    let filteredRequests = documentRequests.filter(request => request.companyId === companyId);
    
    if (status) {
      filteredRequests = filteredRequests.filter(request => request.status === status);
    }
    if (type) {
      filteredRequests = filteredRequests.filter(request => request.type === type);
    }

    // Add user info (mock for now)
    const requestsWithUsers = filteredRequests.map(request => ({
      ...request,
      user: {
        id: request.userId,
        name: 'User Name', // Mock - would come from database
        email: 'user@example.com' // Mock - would come from database
      }
    }));

    return res.json(requestsWithUsers);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /requests/:id - Cancel a request (only if pending)
export const cancelRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = req.user!.companyId as string;

    const requestIndex = documentRequests.findIndex(request => 
      request.id === id && 
      request.userId === req.user!.id &&
      request.companyId === companyId &&
      request.status === 'PENDING'
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Request not found or cannot be cancelled' });
    }

    documentRequests.splice(requestIndex, 1);

    return res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
