import { AuthService } from './auth.service';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    private readonly REFRESH_TOKEN_COOKIE;
    private readonly COOKIE_MAX_AGE;
    constructor(authService: AuthService);
    register(data: RegisterDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    login(loginDto: LoginDto, response: ExpressResponse): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    refresh(request: ExpressRequest, response: ExpressResponse): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    logout(request: ExpressRequest, response: ExpressResponse): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
