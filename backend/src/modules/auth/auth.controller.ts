import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import prisma from '../../utils/prisma';
import { AuthRequest } from '../../middleware/auth';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password, companyId } = req.body;
      const result = await AuthService.login(email, password, companyId);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const { name, phone, department, skills } = req.body;
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name },
      });

      // If it's a candidate, update candidate profile as well if it exists
      if (req.user?.role === 'CANDIDATE') {
        const candidate = await prisma.candidate.findFirst({ where: { email: updatedUser.email } });
        if (candidate) {
          await prisma.candidate.update({
            where: { id: candidate.id },
            data: {
              name,
              phone: phone || candidate.phone,
              skills: skills ? JSON.stringify(skills) : candidate.skills
            }
          });
        }
      }

      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
