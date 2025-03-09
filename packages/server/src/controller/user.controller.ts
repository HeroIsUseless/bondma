import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthGuard } from '../jwt/guard';
import { CurrentUser } from '../jwt/current-user.decorator';

interface UserPayload {
  userId: string;
  email: string;
  name: string;
}

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get specific user information
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);
    if (!user) {
      return { status: 404, message: 'User does not exist' };
    }
    
    // Don't return sensitive information like password
    const { password, ...userInfo } = user;
    return userInfo;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    // Verify if current user is operating on their own account
    if (id !== user.userId) {
      return { status: 403, message: 'You can only delete your own account' };
    }
    return this.userService.deleteUser(id);
  }

  // Current user information
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser() user: UserPayload) {
    return this.userService.findUserById(user.userId);
  }
  
  // Search users
  @Get('search')
  @UseGuards(AuthGuard)
  async searchUsers(@Query('keyword') keyword: string) {
    return this.userService.searchUsers(keyword);
  }
}