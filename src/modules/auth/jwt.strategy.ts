import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface SupabaseJwtPayload {
  sub: string;
  email: string;
  app_metadata?: { role?: string };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secretOrKey = configService.get<string>('supabase.jwtSecret');
    if (!secretOrKey) {
      throw new Error('Supabase JWT secret is not configured in the environment');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: SupabaseJwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.app_metadata?.role || 'user',
    };
  }
}
