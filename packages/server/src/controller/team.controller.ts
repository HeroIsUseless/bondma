import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ForbiddenException, Logger } from '@nestjs/common';
import { TeamService } from '../service/team.service';
import { MembershipService } from '../service/membership.service';
import { AuthGuard } from '../jwt/guard';
import { CurrentUser } from '../jwt/current-user.decorator';

interface UserPayload {
  userId: string;
  email: string;
  name: string;
}

@Controller('api/team')
export class TeamController {
  constructor(
    private teamService: TeamService,
    private membershipService: MembershipService
  ) { }

  @Post('create')
  @UseGuards(AuthGuard)
  async createTeam(
    @Body() data: { name: string, url: string },
    @CurrentUser() user: UserPayload
  ) {
    return this.teamService.createTeam({
      ...data,
      userId: user.userId,
    });
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async findAllTeams(@CurrentUser() user: UserPayload) {
    const memberships = await this.membershipService.getUserMemberships(user.userId);
    return memberships.map(membership => membership.team);
  }

  @Get('find/:id')
  @UseGuards(AuthGuard)
  async findTeamById(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const isMember = await this.membershipService.isMember(id, user.userId);
    if (!isMember) {
      throw new ForbiddenException('No permission to access this team');
    }
    return this.teamService.findTeamById(id);
  }

  @Put('update/:id')
  @UseGuards(AuthGuard)
  async updateTeam(
    @Param('id') id: string,
    @Body() data: { name?: string; url?: string },
    @CurrentUser() user: UserPayload
  ) {
    const isManagerOrOwner = await this.membershipService.isManagerOrOwner(id, user.userId);
    if (!isManagerOrOwner) {
      throw new ForbiddenException('No permission to modify this team');
    }
    return this.teamService.updateTeam(id, data);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  async deleteTeam(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    const isOwner = await this.membershipService.isOwner(id, user.userId);
    if (!isOwner) {
      throw new ForbiddenException('No permission to delete this team');
    }
    return this.teamService.deleteTeam(id);
  }

  @Get('list')
  @UseGuards(AuthGuard)
  async findMyTeams(@CurrentUser() user: UserPayload) {
    return this.teamService.findTeamsByUserId(user.userId);
  }

  @Post('addmember/:id')
  @UseGuards(AuthGuard)
  async addMember(
    @Param('id') teamId: string,
    @Body() data: { userId: string; role: string },
    @CurrentUser() user: UserPayload
  ) {
    // Ensure only team owners or managers can add members
    const isManagerOrOwner = await this.membershipService.isManagerOrOwner(teamId, user.userId);
    if (!isManagerOrOwner) {
      throw new ForbiddenException('No permission to add members to this team');
    }

    // Don't allow setting anyone as owner unless the operator is the owner
    if (data.role === 'owner') {
      const isOwner = await this.membershipService.isOwner(teamId, user.userId);
      if (!isOwner) {
        throw new ForbiddenException('Only team owners can set other owners');
      }
    }

    return this.membershipService.createMembership({
      teamId,
      userId: data.userId,
      role: data.role
    });
  }

  // Update member role
  @Put('updatemember/:id/:userId')
  @UseGuards(AuthGuard)
  async updateMemberRole(
    @Param('id') teamId: string,
    @Param('userId') memberId: string,
    @Body() data: { role: string },
    @CurrentUser() user: UserPayload
  ) {
    // Ensure only team owners can update roles
    const isOwner = await this.membershipService.isOwner(teamId, user.userId);
    if (!isOwner) {
      throw new ForbiddenException('Only team owners can update member roles');
    }

    return this.membershipService.updateMemberRole(teamId, memberId, data.role);
  }

  // Remove team member
  @Delete('removemembers/:id/:userId')
  @UseGuards(AuthGuard)
  async removeMember(
    @Param('id') teamId: string,
    @Param('userId') memberId: string,
    @CurrentUser() user: UserPayload
  ) {
    // Ensure only team owners or managers can remove members
    const isManagerOrOwner = await this.membershipService.isManagerOrOwner(teamId, user.userId);
    if (!isManagerOrOwner) {
      throw new ForbiddenException('No permission to remove members from this team');
    }

    // Cannot remove team owners
    const memberRole = await this.membershipService.getUserRole(teamId, memberId);
    if (memberRole === 'owner') {
      throw new ForbiddenException('Cannot remove team owners');
    }

    return this.membershipService.removeMember(teamId, memberId);
  }

  // Get team member list
  @Get('members/:id')
  @UseGuards(AuthGuard)
  async getTeamMembers(
    @Param('id') teamId: string,
    @CurrentUser() user: UserPayload
  ) {
    // Verify if user is a team member
    const isMember = await this.membershipService.isMember(teamId, user.userId);
    if (!isMember) {
      throw new ForbiddenException('No permission to access this team member list');
    }

    return this.teamService.getTeamMembers(teamId);
  }

  // Check if user has permission for this team
  @Get('check/:id')
  @UseGuards(AuthGuard)
  async checkUserHasPermission(
    @Param('id') teamId: string,
    @CurrentUser() user: UserPayload
  ) {
    return await this.membershipService.isMember(teamId, user.userId);
  }

}
