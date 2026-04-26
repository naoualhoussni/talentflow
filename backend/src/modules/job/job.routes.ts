import { Router } from 'express';
import { listJobs, createJob, getJob, updateJob, deleteJob } from './job.controller';
import { authenticate, authorize, tenantIsolation } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, tenantIsolation, listJobs);
router.post('/', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, createJob);
router.get('/:id', authenticate, tenantIsolation, getJob);
router.put('/:id', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, updateJob);
router.delete('/:id', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, deleteJob);

export default router;
