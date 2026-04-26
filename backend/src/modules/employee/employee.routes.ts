import { Router } from 'express';
import { listEmployees, createEmployee, getEmployee, updateEmployee, assessRisk, getMeDashboard } from './employee.controller';
import { authenticate, authorize, tenantIsolation } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, tenantIsolation, listEmployees);
router.get('/me/dashboard', authenticate, getMeDashboard);
router.post('/', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, createEmployee);
router.get('/:id', authenticate, tenantIsolation, getEmployee);
router.put('/:id', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, updateEmployee);
router.post('/:id/risk-assessment', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, assessRisk);

export default router;
