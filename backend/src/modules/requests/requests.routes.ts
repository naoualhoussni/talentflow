import { Router } from 'express';
import { 
  getRequests, 
  createRequest, 
  updateRequestStatus, 
  getAllRequests, 
  cancelRequest 
} from './requests.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Employee routes
router.get('/', authenticate, getRequests);
router.post('/', authenticate, createRequest);
router.delete('/:id', authenticate, cancelRequest);

// HR/Admin routes
router.get('/all', authenticate, authorize(['RH', 'ADMIN']), getAllRequests);
router.put('/:id/status', authenticate, authorize(['RH', 'ADMIN']), updateRequestStatus);

export default router;
