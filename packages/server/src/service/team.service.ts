import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async createTeam(data: {
    name: string;
    url: string;
    userId: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const name = (data.name ?? '').trim();
      const url = (data.url ?? '').trim() || Math.random().toString(36).slice(2, 10);
      const team = await tx.team.create({
        data: {
          name: name,
          url: url,
        }
      });

      await tx.membership.create({
        data: {
          userId: data.userId,
          teamId: team.id,
          role: 'owner',
        }
      });

      return tx.team.findUnique({
        where: { id: team.id },
        include: {
          memberships: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
    });
  }

  async findAllTeams() {
    return this.prisma.team.findMany();
  }
  
  async findTeamsByUserId(userId: string) {
    return this.prisma.team.findMany({
      where: {
        memberships: {
          some: { userId }
        }
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  async findTeamById(id: string) {
    return this.prisma.team.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  // Update team information
  async updateTeam(id: string, data: { name?: string; url?: string }) {
    return this.prisma.team.update({
      where: { id },
      data
    });
  }

  // Delete team
  async deleteTeam(id: string) {
    // First delete all related membership records
    await this.prisma.membership.deleteMany({
      where: { teamId: id }
    });
    
    // Then delete the team
    return this.prisma.team.delete({
      where: { id }
    });
  }
  
  // Get all member information for a specific team
  async getTeamMembers(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    return team?.memberships.map(membership => ({
      ...membership.user,
      role: membership.role
    }));
  }
}