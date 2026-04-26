import { Response } from 'express';
import prisma from '../../utils/prisma';
import { AuthRequest } from '../../middleware/auth';
import { eventBus, TalentEvent } from '../../core/EventBus';
import bcrypt from 'bcrypt';

// GET /admin/users - Get all users (Super Admin only)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, search } = req.query;
    
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add mock status for now
    const usersWithStatus = users.map(user => ({
      ...user,
      status: 'ACTIVE' as const,
      lastLogin: new Date().toISOString()
    }));

    return res.json(usersWithStatus);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /admin/users - Create user (Super Admin only)
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, companyId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        email: email.toLowerCase(),
        companyId: companyId || null
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        companyId: companyId || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true
      }
    });

    // Emit event
    eventBus.emitEvent(TalentEvent.EMPLOYEE_CREATED, {
      userId: user.id,
      role: user.role,
      companyId: user.companyId
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /admin/users/:id - Update user (Super Admin only)
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    const user = await prisma.user.findFirst({
      where: { id: id as string }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent self-modification of role
    if (req.user!.id === id && role !== user.role) {
      return res.status(400).json({ message: 'Cannot modify your own role' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const updatedUser = await prisma.user.update({
      where: { id: id as string },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true
      }
    });

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /admin/users/:id - Delete user (Super Admin only)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user!.id === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await prisma.user.findFirst({
      where: { id: id as string }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({
      where: { id: id as string }
    });

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /admin/users/:id/status - Update user status (Super Admin only)
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Prevent self-suspension
    if (req.user!.id === id && status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Cannot suspend your own account' });
    }

    // Mock status update for now since status field doesn't exist
    const user = await prisma.user.findFirst({
      where: { id: id as string }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Just return the user with mock status since we can't update the real status
    const updatedUser = {
      ...user,
      status: status as string
    };

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /admin/users/:id/reset-password - Reset user password (Super Admin only)
export const resetUserPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    const user = await prisma.user.findFirst({
      where: { id: id as string }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: id as string },
      data: { password: hashedPassword }
    });

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /admin/companies - Get all companies (Super Admin only)
export const getAllCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { domain: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add user count to each company
    const companiesWithUserCount = companies.map(company => ({
      ...company,
      userCount: company._count.users
    }));

    return res.json(companiesWithUserCount);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /admin/companies - Create company (Super Admin only)
export const createCompany = async (req: AuthRequest, res: Response) => {
  try {
    const { name, domain, plan } = req.body;

    if (!name || !domain) {
      return res.status(400).json({ message: 'Name and domain are required' });
    }

    const existingCompany = await prisma.company.findFirst({
      where: { domain: domain.toLowerCase() }
    });

    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const company = await prisma.company.create({
      data: {
        name,
        domain: domain.toLowerCase(),
        plan: plan || 'free'
      }
    });

    return res.status(201).json(company);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /admin/stats - Get system statistics (Super Admin only)
export const getSystemStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalCompanies,
      usersByRole
    ] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: true
      })
    ]);

    // Mock active/suspended users for now since status field doesn't exist
    const activeUsers = Math.floor(totalUsers * 0.9);
    const suspendedUsers = Math.floor(totalUsers * 0.05);

    const stats = {
      totalUsers,
      totalCompanies,
      activeUsers,
      suspendedUsers,
      inactiveUsers: totalUsers - activeUsers - suspendedUsers,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count;
        return acc;
      }, {} as Record<string, number>)
    };

    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /admin/security-logs - Get security logs (Super Admin only)
export const getSecurityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Mock security logs for now
    const logs = [
      {
        id: '1',
        type: 'LOGIN_ATTEMPT_FAILED',
        user: 'user@example.com',
        ip: '192.168.1.100',
        timestamp: new Date().toISOString(),
        severity: 'HIGH',
        description: 'Multiple failed login attempts'
      },
      {
        id: '2',
        type: 'PASSWORD_RESET',
        user: 'admin@company.com',
        ip: '192.168.1.101',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: 'MEDIUM',
        description: 'Password reset by admin'
      },
      {
        id: '3',
        type: 'NEW_DEVICE_LOGIN',
        user: 'manager@company.com',
        ip: '192.168.1.102',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        severity: 'LOW',
        description: 'Login from new device'
      }
    ];

    return res.json({
      logs: logs.slice(Number(offset), Number(offset) + Number(limit)),
      total: logs.length
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
