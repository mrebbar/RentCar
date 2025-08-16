import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AllGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        return false;
      }

      const decode = this.jwtService.verify(token);

      // Admin, Lessor yoki SuperAdmin bo'lsa ruxsat beramiz
      if (
        decode.role === 'Admin' ||
        decode.role === 'Lessor' ||
        decode.role === 'SuperAdmin' ||
        decode.role === 'User'
      ) {
        req.user = decode;
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}
