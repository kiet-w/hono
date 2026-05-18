import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        passwordHash: string;
        firstName?: string;
        lastName?: string;
    }): Promise<{
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
    findOneByEmail(email: string): Promise<({
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
    }) | null>;
    findById(id: string): Promise<({
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
    }) | null>;
    findRefreshToken(token: string): Promise<({
        user: {
            id: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        expiresAt: Date;
        isRevoked: boolean;
    }) | null>;
    updateProfile(userId: string, data: UpdateProfileDto): Promise<{
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<import("@prisma/client").Prisma.BatchPayload | {
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        expiresAt: Date;
        isRevoked: boolean;
    }>;
}
