import { UsersService } from './users.service';

describe('UsersService', () => {
  const prisma = {
    refreshToken: {
      updateMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(() => {
    prisma.refreshToken.updateMany.mockReset();
    prisma.refreshToken.create.mockReset();
  });

  it('revokes active refresh tokens before creating a new one', async () => {
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    prisma.refreshToken.create.mockResolvedValue({ id: 'token-1' });

    const service = new UsersService(prisma as any);
    await service.updateRefreshToken('user-1', 'refresh-token');

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', isRevoked: false },
      data: { isRevoked: true },
    });
    expect(prisma.refreshToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        token: 'refresh-token',
        userId: 'user-1',
      }),
    });
  });
});
