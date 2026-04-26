import prisma from '../../utils/prisma';

export class RequestsService {
  static async getUserRequests(userId: string, companyId: string) {
    return prisma.documentRequest.findMany({
      where: { 
        userId,
        companyId
      },
      orderBy: { requestedAt: 'desc' }
    });
  }

  static async createRequest(data: {
    type: string;
    title: string;
    description?: string;
    urgency?: string;
    userId: string;
    companyId: string;
  }) {
    return prisma.documentRequest.create({
      data: {
        ...data,
        status: 'PENDING'
      }
    });
  }

  static async updateRequestStatus(
    id: string, 
    companyId: string, 
    data: {
      status: string;
      documentUrl?: string;
      rejectionReason?: string;
    }
  ) {
    return prisma.documentRequest.updateMany({
      where: { 
        id,
        companyId
      },
      data: {
        ...data,
        processedAt: new Date()
      }
    });
  }

  static async getAllRequests(companyId: string, filters?: {
    status?: string;
    type?: string;
  }) {
    const where: any = { companyId };
    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;

    return prisma.documentRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { requestedAt: 'desc' }
    });
  }

  static async cancelRequest(id: string, userId: string, companyId: string) {
    return prisma.documentRequest.deleteMany({
      where: { 
        id,
        userId,
        companyId,
        status: 'PENDING'
      }
    });
  }
}
