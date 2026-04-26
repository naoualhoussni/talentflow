import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { RecruitmentService } from './recruitment.service';

export class RecruitmentController {
  static async getCandidates(req: AuthRequest, res: Response) {
    try {
      const candidates = await RecruitmentService.getCandidates(req.user!.companyId!);
      res.json(candidates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async apply(req: AuthRequest, res: Response) {
    try {
      const candidate = await RecruitmentService.createCandidate(req.body);
      res.status(201).json(candidate);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getCandidateDashboard(req: AuthRequest, res: Response) {
    console.log(`[RecruitmentController] Fetching dashboard for: ${req.user?.email}`);
    try {
      const email = req.user!.email;
      const data = await RecruitmentService.getCandidateDashboard(email);
      res.json(data);
    } catch (error: any) {
      console.error(`[RecruitmentController] Error:`, error);
      res.status(500).json({ message: error.message });
    }
  }
}
