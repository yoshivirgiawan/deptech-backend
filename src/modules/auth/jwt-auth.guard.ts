import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      let message = 'Unauthorized';
      let code = 'UNAUTHORIZED';

      if (info?.name === 'TokenExpiredError') {
        message = 'Token has expired';
        code = 'TOKEN_EXPIRED';
      } else if (info?.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        code = 'INVALID_TOKEN';
      } else if (err) {
        message = err.message || 'Unauthorized';
      }

      throw new UnauthorizedException({
        success: false,
        error: {
          code,
          details: message,
        },
      });
    }

    // Ambil token dari request header
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: 'TOKEN_MISSING',
          details: 'Authorization token is missing',
        },
      });
    }

    if (this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: 'TOKEN_BLACKLISTED',
          details: 'Token has been blacklisted',
        },
      });
    }

    return user;
  }
}
