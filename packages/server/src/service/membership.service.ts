import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService) {}

  async createMembership(data: {
    userId: string;
    teamId: string;
    role: string;
  }) {
    return this.prisma.membership.create({
      data: {
        userId: data.userId,
        teamId: data.teamId,
        role: data.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Check if user is a team member
  async isMember(teamId: string, userId: string): Promise<boolean> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        teamId,
        userId,
      },
    });
    return !!membership;
  }

  // Check if user is a team owner
  async isOwner(teamId: string, userId: string): Promise<boolean> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        teamId,
        userId,
        role: 'owner',
      },
    });
    return !!membership;
  }

  // Check if user is a team manager or owner
  async isManagerOrOwner(teamId: string, userId: string): Promise<boolean> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        teamId,
        userId,
        role: { in: ['manager', 'owner'] },
      },
    });
    return !!membership;
  }

  // Get user's role in team
  async getUserRole(teamId: string, userId: string): Promise<string | null> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        teamId,
        userId,
      },
      select: {
        role: true,
      },
    });
    return membership ? membership.role : null;
  }

  // Get all members of a team
  async getTeamMembers(teamId: string) {
    return this.prisma.membership.findMany({
      where: {
        teamId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Get all team memberships for a user
  async getUserMemberships(userId: string) {
    return this.prisma.membership.findMany({
      where: {
        userId,
      },
      include: {
        team: true,
      },
    });
  }

  // Update member role
  async updateMemberRole(teamId: string, userId: string, newRole: string) {
    return this.prisma.membership.updateMany({
      where: {
        teamId,
        userId,
      },
      data: {
        role: newRole,
      },
    });
  }

  // Remove membership
  async removeMember(teamId: string, userId: string) {
    return this.prisma.membership.deleteMany({
      where: {
        teamId,
        userId,
      },
    });
  }

  // Find specific membership
  async findMembership(teamId: string, userId: string) {
    return this.prisma.membership.findFirst({
      where: {
        teamId,
        userId,
      },
    });
  }

}
