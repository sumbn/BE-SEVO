"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const client_1 = require("@prisma/client");
const token_repository_interface_1 = require("./interfaces/token-repository.interface");
let AuthService = class AuthService {
    prisma;
    jwtService;
    tokenRepo;
    constructor(prisma, jwtService, tokenRepo) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.tokenRepo = tokenRepo;
    }
    async register(data) {
        const existing = await this.prisma.admin.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.admin.create({
            data: {
                ...data,
                password: hashedPassword,
                role: data.role || client_1.Role.USER,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
    }
    async validateUser(email, pass) {
        const user = await this.prisma.admin.findUnique({
            where: { email },
        });
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const accessToken = this.jwtService.sign({
            email: user.email,
            sub: user.id,
            role: user.role
        });
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.tokenRepo.create({
            token: refreshToken,
            adminId: user.id,
            expiresAt,
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async refreshTokens(oldRefreshToken) {
        const savedToken = await this.tokenRepo.findUnique(oldRefreshToken);
        if (!savedToken || savedToken.isRevoked || savedToken.expiresAt < new Date()) {
            if (savedToken) {
                await this.tokenRepo.revokeAllForUser(savedToken.adminId);
            }
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        await this.tokenRepo.update(savedToken.id, { isRevoked: true });
        return this.login(savedToken.admin);
    }
    async logout(refreshToken) {
        const savedToken = await this.tokenRepo.findUnique(refreshToken);
        if (savedToken) {
            await this.tokenRepo.update(savedToken.id, { isRevoked: true });
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(token_repository_interface_1.TOKEN_REPOSITORY)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map