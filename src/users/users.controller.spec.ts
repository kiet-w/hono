import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = {
    updateProfile: jest.fn(),
  };

  beforeEach(async () => {
    usersService.updateProfile.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get(UsersController);
  });

  it('updates profile using req.user.userId', async () => {
    usersService.updateProfile.mockResolvedValue({ id: 'profile-1' });

    await controller.updateProfile(
      { user: { userId: 'user-1' } },
      { firstName: 'Ari' },
    );

    expect(usersService.updateProfile).toHaveBeenCalledWith('user-1', {
      firstName: 'Ari',
    });
  });
});
