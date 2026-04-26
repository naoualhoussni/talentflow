import { Router } from 'express';
import { listDocuments, generateDocument, getDocument, updateDocumentStatus } from './document.controller';
import { authenticate, authorize, tenantIsolation } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, tenantIsolation, listDocuments);
router.post('/generate', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, generateDocument);
router.get('/:id', authenticate, tenantIsolation, getDocument);
router.put('/:id/status', authenticate, authorize(['RH', 'SUPER_ADMIN']), tenantIsolation, updateDocumentStatus);

export default router;
