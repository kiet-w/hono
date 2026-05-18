import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { JwtTokenConfigDto } from './dto/jwt-token-config.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.usersService.create(
      this.buildCreateUserDto(registerDto, hashedPassword),
    );
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async refresh(refreshToken: string) {
    const tokenData = await this.usersService.findRefreshToken(refreshToken);
    if (!tokenData || tokenData.isRevoked || tokenData.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return this.generateTokens(tokenData.userId, tokenData.user.email, tokenData.user.role);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = this.buildJwtPayloadDto(userId, email, role);
    const accessConfig = this.buildJwtTokenConfigDto('JWT_SECRET', '1h');
    const refreshConfig = this.buildJwtTokenConfigDto('JWT_REFRESH_SECRET', '7d');

    const accessToken = await this.jwtService.signAsync(
      { ...payload },
      {
        secret: accessConfig.secret,
        expiresIn: accessConfig.expiresIn as any,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { ...payload },
      {
        secret: refreshConfig.secret,
        expiresIn: refreshConfig.expiresIn as any,
      },
    );

    await this.usersService.updateRefreshToken(userId, refreshToken);

    return this.buildAuthTokensDto(accessToken, refreshToken);
  }

  private buildCreateUserDto(
    registerDto: RegisterDto,
    hashedPassword: string,
  ): CreateUserDto {
    const createUserDto = new CreateUserDto();
    createUserDto.email = registerDto.email;
    createUserDto.passwordHash = hashedPassword;
    createUserDto.firstName = registerDto.firstName;
    createUserDto.lastName = registerDto.lastName;
    return createUserDto;
  }

  private buildJwtPayloadDto(
    userId: string,
    email: string,
    role: string,
  ): JwtPayloadDto {
    const jwtPayloadDto = new JwtPayloadDto();
    jwtPayloadDto.sub = userId;
    jwtPayloadDto.email = email;
    jwtPayloadDto.role = role;
    return jwtPayloadDto;
  }

  private buildJwtTokenConfigDto(
    secretKey: string,
    expiresIn: string,
  ): JwtTokenConfigDto {
    const jwtTokenConfigDto = new JwtTokenConfigDto();
    jwtTokenConfigDto.secret = this.configService.get<string>(secretKey);
    jwtTokenConfigDto.expiresIn = expiresIn;
    return jwtTokenConfigDto;
  }

  private buildAuthTokensDto(
    accessToken: string,
    refreshToken: string,
  ): AuthTokensDto {
    const authTokensDto = new AuthTokensDto();
    authTokensDto.access_token = accessToken;
    authTokensDto.refresh_token = refreshToken;
    return authTokensDto;
  }
}
