import { Router } from 'express';
import { listEvaluations, createEvaluation, updateEvaluationDecision, getEvaluation } from './evaluation.controller';
import { authenticate, authorize, tenantIsolation } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, tenantIsolation, listEvaluations);
router.post('/', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, createEvaluation);
router.get('/:id', authenticate, tenantIsolation, getEvaluation);
router.put('/:id/decision', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, updateEvaluationDecision);

export default router;
