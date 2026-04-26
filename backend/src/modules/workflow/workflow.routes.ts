import { Router } from 'express';
import { getCandidateWorkflow, getPipeline } from './workflow.controller';
import { authenticate, tenantIsolation } from '../../middleware/auth';

const router = Router();

router.get('/pipeline', authenticate, tenantIsolation, getPipeline);
router.get('/candidates/:candidateId', authenticate, tenantIsolation, getCandidateWorkflow);

export default router;
