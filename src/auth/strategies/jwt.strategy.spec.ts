import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('returns both id and userId from token subject', async () => {
    const strategy = new JwtStrategy({
      get: jest.fn().mockReturnValue('test-secret'),
    } as any);

    const result = await strategy.validate({
      sub: 'user-1',
      email: 'customer@example.com',
      role: 'CUSTOMER',
    });

    expect(result).toEqual({
      id: 'user-1',
      userId: 'user-1',
      email: 'customer@example.com',
      role: 'CUSTOMER',
    });
  });
});
