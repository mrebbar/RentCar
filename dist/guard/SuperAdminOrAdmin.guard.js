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
var AdminOrSuperAdminGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrSuperAdminGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AdminOrSuperAdminGuard = AdminOrSuperAdminGuard_1 = class AdminOrSuperAdminGuard {
    jwtService;
    logger = new common_1.Logger(AdminOrSuperAdminGuard_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
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
                this.logger.warn(`Guard failed: Insufficient role. Required: Admin/SuperAdmin, Got: ${decode.role}`);
                return false;
            }
            this.logger.log(`Guard successful: User ${decode.email} with role ${decode.role} authorized`);
            req.user = decode;
            return true;
        }
        catch (error) {
            this.logger.error('Guard failed with error:', error.stack);
            if (error.name === 'JsonWebTokenError') {
                this.logger.error('JWT token verification failed: Invalid token');
            }
            else if (error.name === 'TokenExpiredError') {
                this.logger.error('JWT token verification failed: Token expired');
            }
            else if (error.name === 'NotBeforeError') {
                this.logger.error('JWT token verification failed: Token not active yet');
            }
            return false;
        }
    }
};
exports.AdminOrSuperAdminGuard = AdminOrSuperAdminGuard;
exports.AdminOrSuperAdminGuard = AdminOrSuperAdminGuard = AdminOrSuperAdminGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AdminOrSuperAdminGuard);
//# sourceMappingURL=SuperAdminOrAdmin.guard.js.map