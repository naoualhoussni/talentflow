import { Router } from 'express';
import { listNotifications, createNotification, markRead } from './notification.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, listNotifications);
router.post('/', authenticate, createNotification);
router.put('/:id/read', authenticate, markRead);

export default router;
