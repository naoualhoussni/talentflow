import { Router } from 'express';
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  updateUserStatus, 
  resetUserPassword,
  getAllCompanies,
  createCompany,
  getSystemStats,
  getSecurityLogs
} from './admin.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// User Management (Super Admin only)
router.get('/users', authenticate, authorize(['SUPER_ADMIN']), getAllUsers);
router.post('/users', authenticate, authorize(['SUPER_ADMIN']), createUser);
router.put('/users/:id', authenticate, authorize(['SUPER_ADMIN']), updateUser);
router.delete('/users/:id', authenticate, authorize(['SUPER_ADMIN']), deleteUser);
router.put('/users/:id/status', authenticate, authorize(['SUPER_ADMIN']), updateUserStatus);
router.post('/users/:id/reset-password', authenticate, authorize(['SUPER_ADMIN']), resetUserPassword);

// Company Management (Super Admin only)
router.get('/companies', authenticate, authorize(['SUPER_ADMIN']), getAllCompanies);
router.post('/companies', authenticate, authorize(['SUPER_ADMIN']), createCompany);

// System Management (Super Admin only)
router.get('/stats', authenticate, authorize(['SUPER_ADMIN']), getSystemStats);
router.get('/security-logs', authenticate, authorize(['SUPER_ADMIN']), getSecurityLogs);

export default router;
