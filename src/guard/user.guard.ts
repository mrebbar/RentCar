import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Authorization header required');
      }

      const decode = this.jwtService.verify(token);

      if (
        decode.role === 'User' ||
        decode.role === 'Admin' ||
        decode.role === 'SuperAdmin'
      ) {
        req.user = decode;
        return true;
      }

      return false;
    } catch (error) {
      throw new ForbiddenException(
        'Forbidden resource or your role is not User or Admin or SuperAdmin',
      );
    }
  }
}
