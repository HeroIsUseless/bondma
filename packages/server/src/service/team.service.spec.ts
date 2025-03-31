import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { PrismaService } from './prisma.service';

describe('TeamService', () => {
  let service: TeamService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    $transaction: jest.fn(callback => callback(mockPrismaService)),
    team: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    membership: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('createTeam', () => {
    it('should create a team with the provided data', async () => {
      const teamData = {
        name: 'Test Team',
        url: 'test-team',
        userId: 'user-id',
      };

      const createdTeam = {
        id: 'team-id',
        name: 'Test Team',
        url: 'test-team',
      };

      const createdMembership = {
        id: 'membership-id',
        userId: 'user-id',
        teamId: 'team-id',
        role: 'owner',
      };

      const teamWithMemberships = {
        ...createdTeam,
        memberships: [
          {
            ...createdMembership,
            user: {
              id: 'user-id',
              name: 'Test User',
              email: 'test@example.com',
            },
          },
        ],
      };

      mockPrismaService.team.create.mockResolvedValue(createdTeam);
      mockPrismaService.membership.create.mockResolvedValue(createdMembership);
      mockPrismaService.team.findUnique.mockResolvedValue(teamWithMemberships);

      const result = await service.createTeam(teamData);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.team.create).toHaveBeenCalledWith({
        data: {
          name: teamData.name,
          url: teamData.url,
        },
      });
      expect(mockPrismaService.membership.create).toHaveBeenCalledWith({
        data: {
          userId: teamData.userId,
          teamId: createdTeam.id,
          role: 'owner',
        },
      });
      expect(result).toEqual(teamWithMemberships);
    });

    it('should generate a random URL if none is provided', async () => {
      const teamData = {
        name: 'Test Team',
        url: '',
        userId: 'user-id',
      };

      const createdTeam = {
        id: 'team-id',
        name: 'Test Team',
        url: 'random-url',
      };

      mockPrismaService.team.create.mockResolvedValue(createdTeam);
      mockPrismaService.team.findUnique.mockResolvedValue({
        ...createdTeam,
        memberships: [],
      });

      await service.createTeam(teamData);

      expect(mockPrismaService.team.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: teamData.name,
            url: expect.any(String),
          }),
        }),
      );
    });
  });

  describe('findAllTeams', () => {
    it('should return all teams', async () => {
      const expectedTeams = [
        { id: 'team1', name: 'Team 1', url: 'team-1' },
        { id: 'team2', name: 'Team 2', url: 'team-2' },
      ];

      mockPrismaService.team.findMany.mockResolvedValue(expectedTeams);

      const result = await service.findAllTeams();

      expect(mockPrismaService.team.findMany).toHaveBeenCalled();
      expect(result).toEqual(expectedTeams);
    });
  });

  describe('findTeamsByUserId', () => {
    it('should return teams for a specific user', async () => {
      const userId = 'user-id';
      const expectedTeams = [
        {
          id: 'team1',
          name: 'Team 1',
          url: 'team-1',
          memberships: [
            {
              user: { id: userId, name: 'Test User', email: 'user@test.com' },
              role: 'owner',
            },
          ],
        },
      ];

      mockPrismaService.team.findMany.mockResolvedValue(expectedTeams);

      const result = await service.findTeamsByUserId(userId);

      expect(mockPrismaService.team.findMany).toHaveBeenCalledWith({
        where: { memberships: { some: { userId } } },
        include: {
          memberships: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(expectedTeams);
    });
  });

  describe('findTeamById', () => {
    it('should return a team by id', async () => {
      const teamId = 'team-id';
      const expectedTeam = {
        id: teamId,
        name: 'Team 1',
        url: 'team-1',
        memberships: [],
      };

      mockPrismaService.team.findUnique.mockResolvedValue(expectedTeam);

      const result = await service.findTeamById(teamId);

      expect(mockPrismaService.team.findUnique).toHaveBeenCalledWith({
        where: { id: teamId },
        include: {
          memberships: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(expectedTeam);
    });
  });

  describe('updateTeam', () => {
    it('should update a team', async () => {
      const teamId = 'team-id';
      const updateData = { name: 'Updated Team' };
      const updatedTeam = {
        id: teamId,
        name: 'Updated Team',
        url: 'team-url',
      };

      mockPrismaService.team.update.mockResolvedValue(updatedTeam);

      const result = await service.updateTeam(teamId, updateData);

      expect(mockPrismaService.team.update).toHaveBeenCalledWith({
        where: { id: teamId },
        data: updateData,
      });
      expect(result).toEqual(updatedTeam);
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team and its memberships', async () => {
      const teamId = 'team-id';
      const deletedTeam = {
        id: teamId,
        name: 'Team to Delete',
        url: 'team-url',
      };

      mockPrismaService.membership.deleteMany.mockResolvedValue({ count: 2 });
      mockPrismaService.team.delete.mockResolvedValue(deletedTeam);

      const result = await service.deleteTeam(teamId);

      expect(mockPrismaService.membership.deleteMany).toHaveBeenCalledWith({
        where: { teamId },
      });
      expect(mockPrismaService.team.delete).toHaveBeenCalledWith({
        where: { id: teamId },
      });
      expect(result).toEqual(deletedTeam);
    });
  });

  describe('getTeamMembers', () => {
    it('should return all members of a team', async () => {
      const teamId = 'team-id';
      const mockTeam = {
        id: teamId,
        name: 'Test Team',
        url: 'test-team',
        memberships: [
          {
            role: 'owner',
            user: {
              id: 'user1',
              name: 'User One',
              email: 'user1@example.com',
            },
          },
          {
            role: 'member',
            user: {
              id: 'user2',
              name: 'User Two',
              email: 'user2@example.com',
            },
          },
        ],
      };

      const expectedMembers = [
        {
          id: 'user1',
          name: 'User One',
          email: 'user1@example.com',
          role: 'owner',
        },
        {
          id: 'user2',
          name: 'User Two',
          email: 'user2@example.com',
          role: 'member',
        },
      ];

      mockPrismaService.team.findUnique.mockResolvedValue(mockTeam);

      const result = await service.getTeamMembers(teamId);

      expect(mockPrismaService.team.findUnique).toHaveBeenCalledWith({
        where: { id: teamId },
        include: {
          memberships: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(expectedMembers);
    });

    it('should return undefined if team does not exist', async () => {
      const teamId = 'nonexistent-id';
      mockPrismaService.team.findUnique.mockResolvedValue(null);

      const result = await service.getTeamMembers(teamId);

      expect(result).toBeUndefined();
    });
  });
});
