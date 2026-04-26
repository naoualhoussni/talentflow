import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import companyRoutes from '../modules/company/company.routes';
import jobRoutes from '../modules/job/job.routes';
import recruitmentRoutes from '../modules/recruitment/recruitment.routes';
import evaluationRoutes from '../modules/evaluation/evaluation.routes';
import employeeRoutes from '../modules/employee/employee.routes';
import documentRoutes from '../modules/document/document.routes';
import requestsRoutes from '../modules/requests/requests.routes';
import adminRoutes from '../modules/admin/admin.routes';
import aiRoutes from '../modules/ai/ai.routes';
import notificationRoutes from '../modules/notification/notification.routes';
import workflowRoutes from '../modules/workflow/workflow.routes';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/recruitment', recruitmentRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/employees', employeeRoutes);
router.use('/documents', documentRoutes);
router.use('/requests', requestsRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);
router.use('/workflows', workflowRoutes);
