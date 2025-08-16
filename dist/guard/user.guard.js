"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let UserGuard = class UserGuard {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        try {
            const req = context.switchToHttp().getRequest();
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                throw new common_1.UnauthorizedException('Authorization header required');
            }
            const decode = this.jwtService.verify(token);
            if (decode.role === 'User' ||
                decode.role === 'Admin' ||
                decode.role === 'SuperAdmin') {
                req.user = decode;
                return true;
            }
            return false;
        }
        catch (error) {
            throw new common_1.ForbiddenException('Forbidden resource or your role is not User or Admin or SuperAdmin');
        }
    }
};
exports.UserGuard = UserGuard;
exports.UserGuard = UserGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], UserGuard);
//# sourceMappingURL=user.guard.js.map