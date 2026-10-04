import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, SignOptions } from 'jsonwebtoken';
import { JwtConfig } from '../../domain/settings';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  createAccessToken(userId: string, email: string): { accessToken: string; expiresIn: string } {
    const jwt = this.configService.get<JwtConfig>(JwtConfig.KEY);
    const accessToken = sign({ sub: userId, email }, jwt.secret, {
      expiresIn: jwt.expiresIn as SignOptions['expiresIn'],
    });
    return { accessToken, expiresIn: jwt.expiresIn };
  }
}
