import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './controller/index.controller';
import { AppService } from './service/index.service';
import { UserService } from './service/user.service';
import { TeamService } from './service/team.service';
import { PrismaService } from './service/prisma.service';
import { UserController } from './controller/user.controller';
import { AuthController } from './controller/auth.controller';
import { TeamController } from './controller/team.controller';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { JwtStrategy } from './jwt/strategy';
import { PassportModule } from '@nestjs/passport';
import { MembershipService } from './service/membership.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    TeamController,
    ProjectController,
    UserController
  ],
  providers: [
    AppService,
    UserService,
    TeamService,
    PrismaService,
    ProjectService,
    JwtStrategy,
    MembershipService,
  ],
})

export class AppModule { }
