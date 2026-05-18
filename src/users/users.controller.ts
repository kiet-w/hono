import { Body, Controller, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    // In a real scenario, req.user is populated by a Passport strategy (e.g., JwtStrategy).
    // For now, we'll assume it's there or handle the logic.
    // If req.user is undefined (no guard yet), this will need to be fixed in the next task.
    const userId = req.user?.id;
    return this.usersService.updateProfile(userId, updateProfileDto);
  }
}
