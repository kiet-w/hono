import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    if (!refreshToken) {
      return;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });
  }
}
