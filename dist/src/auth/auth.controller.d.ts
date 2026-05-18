import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        profile: {
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
            phone: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: any): Promise<void>;
    refresh(refreshDto: RefreshDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    getMe(req: any): Promise<any>;
}
