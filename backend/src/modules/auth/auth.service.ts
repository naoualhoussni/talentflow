import prisma from '../../utils/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export class AuthService {
  static async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  static async login(email: string, password: string, companyId?: string) {
    // Look for user by email first to be flexible in demo
    let user = await prisma.user.findFirst({
      where: { 
        email: { equals: email }
      },
    });

    // If multiple users with same email (different companies), try filtering by companyId
    if (!user && companyId) {
      user = await prisma.user.findFirst({
        where: { email, companyId }
      });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { user, token };
  }
}
