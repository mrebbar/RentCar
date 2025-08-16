import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminOrSuperAdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminOrSuperAdminGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        this.logger.warn('Guard failed: No authorization token provided');
        return false;
      }

      this.logger.log('Verifying JWT token in guard');

      const decode = this.jwtService.verify(token);

      if (decode.role !== 'Admin' && decode.role !== 'SuperAdmin') {
        this.logger.warn(
          `Guard failed: Insufficient role. Required: Admin/SuperAdmin, Got: ${decode.role}`,
        );
        return false;
      }

      this.logger.log(
        `Guard successful: User ${decode.email} with role ${decode.role} authorized`,
      );
      req.user = decode;
      return true;
    } catch (error) {
      this.logger.error('Guard failed with error:', error.stack);

      if (error.name === 'JsonWebTokenError') {
        this.logger.error('JWT token verification failed: Invalid token');
      } else if (error.name === 'TokenExpiredError') {
        this.logger.error('JWT token verification failed: Token expired');
      } else if (error.name === 'NotBeforeError') {
        this.logger.error(
          'JWT token verification failed: Token not active yet',
        );
      }

      return false;
    }
  }
}
