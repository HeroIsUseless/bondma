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
      let url = (data.url ?? '').trim();
      
      // Ensure URL is not longer than 72 characters
      if (url.length > 72) {
        url = url.substring(0, 72);
      }
      
      // If URL is empty, generate a random one
      if (!url) {
        url = Math.random().toString(36).slice(2, 10);
      }
      
      // Check if the URL already exists and append random characters if needed
      const existingTeam = await tx.team.findFirst({
        where: { url }
      });
      
      if (existingTeam) {
        const randomSuffix = Math.random().toString(36).slice(2, 8);
        // Ensure total length is still under 72 characters
        url = url.substring(0, 64) + '-' + randomSuffix;
      }

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
    const updatedData: { name?: string; url?: string } = {};
    
    if (data.name !== undefined) {
      updatedData.name = data.name.trim();
    }
    
    if (data.url !== undefined) {
      let url = data.url.trim();
      
      // Ensure URL is not longer than 72 characters
      if (url.length > 72) {
        url = url.substring(0, 72);
      }
      
      // Check if the URL already exists and doesn't belong to the current team
      const existingTeam = await this.prisma.team.findFirst({
        where: { 
          url,
          id: { not: id }
        }
      });
      
      if (existingTeam) {
        const randomSuffix = Math.random().toString(36).slice(2, 8);
        // Ensure total length is still under 72 characters
        url = url.substring(0, 64) + '-' + randomSuffix;
      }
      
      updatedData.url = url;
    }
    
    return this.prisma.team.update({
      where: { id },
      data: updatedData,
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