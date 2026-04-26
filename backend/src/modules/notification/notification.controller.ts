import { Request, Response } from 'express';

// Simple in-memory notification store (can be moved to DB later)
const notifications: any[] = [];
let nextId = 1;

export const listNotifications = (_req: Request, res: Response) => {
  return res.json(notifications.slice(-50).reverse());
};

export const createNotification = (req: Request, res: Response) => {
  const { title, message, type, companyId } = req.body;
  const notification = {
    id: String(nextId++),
    title,
    message,
    type: type || 'INFO',
    companyId,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.push(notification);
  return res.status(201).json(notification);
};

export const markRead = (req: Request, res: Response) => {
  const notif = notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  return res.json({ message: 'Marked as read' });
};
