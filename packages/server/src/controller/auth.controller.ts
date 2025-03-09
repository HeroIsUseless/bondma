import { Controller, Post, Body, HttpException, HttpStatus, UnauthorizedException, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { UserService } from '../service/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../jwt/guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @Get('status')
  @UseGuards(AuthGuard)
  getStatus(@Request() req) {
    return {
      status: 'authenticated',
      user: req.user,
    };
  }

  @Post('register')
  async register(@Body() data: { name: string; email: string; password: string }) {
    try {
      // Check if email is already registered
      const existingUser = await this.userService.findUserByEmail(data.email);
      if (existingUser) {
        throw new HttpException('Email is already registered', HttpStatus.BAD_REQUEST);
      }

      // Password encryption
      const hashedPassword = await bcrypt.hash(data.password, process.env.SALT_ROUNDS ?? 10);

      // Create new user
      const newUser = await this.userService.createUser({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      });

      // Return user information without password
      const { password, ...result } = newUser;
      return {
        success: true,
        message: 'Registration successful',
        user: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    try {
      // Find user
      const user = await this.userService.findUserByEmail(data.email);
      if (!user) {
        throw new UnauthorizedException('Email or password incorrect');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      Logger.log('zws login', user, data, isPasswordValid);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Email or password incorrect');
      }

      // Create JWT
      const payload = { 
        sub: user.id, 
        email: user.email,
        name: user.name
      };
      
      const token = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
