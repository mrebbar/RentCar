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
exports.AllGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AllGuard = class AllGuard {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        try {
            const req = context.switchToHttp().getRequest();
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return false;
            }
            const decode = this.jwtService.verify(token);
            if (decode.role === 'Admin' ||
                decode.role === 'Lessor' ||
                decode.role === 'SuperAdmin' ||
                decode.role === 'User') {
                req.user = decode;
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
};
exports.AllGuard = AllGuard;
exports.AllGuard = AllGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AllGuard);
//# sourceMappingURL=All.guard.js.map