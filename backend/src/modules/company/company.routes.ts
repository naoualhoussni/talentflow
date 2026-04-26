import { Router } from 'express';
import { listCompanies, createCompany, getCompany, updateCompany, getCompanyStats } from './company.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['SUPER_ADMIN']), listCompanies);
router.post('/', authenticate, authorize(['SUPER_ADMIN']), createCompany);
router.get('/:id', authenticate, getCompany);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN', 'RH']), updateCompany);
router.get('/:id/stats', authenticate, getCompanyStats);

export default router;
