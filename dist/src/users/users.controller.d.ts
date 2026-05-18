import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
