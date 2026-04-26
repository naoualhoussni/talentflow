import { Router } from 'express';
import { RecruitmentController } from './recruitment.controller';
import { authenticate, tenantIsolation } from '../../middleware/auth';

const router = Router();

router.get('/candidates', authenticate, tenantIsolation, RecruitmentController.getCandidates);
router.get('/me/dashboard', authenticate, RecruitmentController.getCandidateDashboard);
router.post('/apply', RecruitmentController.apply);

export default router;
