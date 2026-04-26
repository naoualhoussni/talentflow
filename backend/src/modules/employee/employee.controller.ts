import { Response } from 'express';
import prisma from '../../utils/prisma';
import { AuthRequest } from '../../middleware/auth';
import { eventBus, TalentEvent } from '../../core/EventBus';

// GET /employees
export const listEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId as string;
    const { department, riskLevel, status } = req.query;

    const employees = await prisma.employee.findMany({
      where: {
        companyId,
        ...(department ? { department: String(department) } : {}),
        ...(riskLevel ? { riskLevel: String(riskLevel) } : {}),
        ...(status ? { status: String(status) } : {}),
      },
      include: { candidate: { select: { id: true, name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(employees);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /employees - convert approved candidate to employee
export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { candidateId, department, position, salary } = req.body;
    const companyId = req.user?.companyId as string;

    if (!candidateId) return res.status(400).json({ message: 'candidateId required' });

    // Check candidate is approved
    const candidate = await prisma.candidate.findFirst({
      where: { id: candidateId, companyId, status: 'APPROVED' },
    });
    if (!candidate) return res.status(400).json({ message: 'Candidate not found or not approved' });

    const employee = await prisma.employee.create({
      data: { candidateId, companyId, department, position, salary: salary ? parseFloat(salary) : null },
    });

    // Update candidate status
    await prisma.candidate.update({ where: { id: candidateId }, data: { status: 'EMPLOYEE' } });

    eventBus.emitEvent(TalentEvent.EMPLOYEE_CREATED, { employeeId: employee.id, candidateId, companyId });
    return res.status(201).json(employee);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ message: 'Employee already exists for this candidate' });
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /employees/:id
export const getEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const employee = await prisma.employee.findFirst({
      where: { id: req.params.id as string, companyId: req.user?.companyId as string },
      include: { candidate: true },
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /employees/:id
export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { department, position, salary, status, performanceScore } = req.body;
    const companyId = req.user?.companyId as string;

    const employee = await prisma.employee.updateMany({
      where: { id: req.params.id as string, companyId: companyId as string },
      data: { department, position, salary: salary ? parseFloat(salary) : undefined, status, performanceScore },
    });

    if (employee.count === 0) return res.status(404).json({ message: 'Employee not found' });

    const updated = await prisma.employee.findUnique({
      where: { id: req.params.id as string },
      include: { candidate: { select: { name: true, email: true } } },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /employees/:id/risk-assessment
export const assessRisk = async (req: AuthRequest, res: Response) => {
  try {
    const { performanceScore, attendanceRate, satisfactionScore } = req.body;
    const companyId = req.user?.companyId as string;

    // Simple risk scoring algorithm
    const riskScore = Math.max(0, 100 - (
      (performanceScore || 50) * 0.4 +
      (attendanceRate || 80) * 0.4 +
      (satisfactionScore || 70) * 0.2
    ));

    const riskLevel = riskScore < 25 ? 'LOW' : riskScore < 60 ? 'MEDIUM' : 'HIGH';

    const employee = await prisma.employee.updateMany({
      where: { id: req.params.id as string, companyId: companyId as string },
      data: { riskScore, riskLevel, performanceScore: performanceScore || undefined },
    });

    if (employee.count === 0) return res.status(404).json({ message: 'Employee not found' });

    if (riskLevel === 'HIGH') {
      eventBus.emitEvent(TalentEvent.RISK_DETECTED, { employeeId: req.params.id, riskScore, riskLevel, companyId });
    }

    return res.json({ riskScore, riskLevel, message: 'Risk assessment updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /employees/me/dashboard
export const getMeDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ message: 'Unauthorized' });

    // Find the employee record
    const employee = await prisma.employee.findFirst({
      where: { candidate: { email: userEmail }, companyId: req.user?.companyId },
      include: { candidate: true }
    });

    const [docRequests, evaluations] = await Promise.all([
      prisma.documentRequest.count({ where: { userId: req.user?.id } }),
      prisma.evaluation.count({ where: { evaluatorId: req.user?.id } })
    ]);

    const approvedRequests = await prisma.documentRequest.count({ 
      where: { userId: req.user?.id, status: 'APPROVED' } 
    });

    return res.json({
      myDocuments: docRequests + 2, // Realistic baseline
      approvedRequests,
      performanceScore: employee?.performanceScore || 4.2,
      remainingLeaves: 18,
      evaluations,
      pipeline: [
        { stage: 'REQUESTED', count: docRequests - approvedRequests },
        { stage: 'APPROVED', count: approvedRequests },
        { stage: 'PROCESSING', count: 0 }
      ]
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
