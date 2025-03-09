
import { Injectable } from '@nestjs/common';
import { AuthGuard as JwtAuthGuard } from '@nestjs/passport';

/**
 * Usage: add this decorator to a route to protect it with JWT authentication
 * @UseGuards(AuthGuard)
 */
@Injectable()
export class AuthGuard extends JwtAuthGuard('jwt') {}
