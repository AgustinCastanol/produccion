/* eslint-disable prettier/prettier */
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req: any) => {
        if (!req || !req.cookies) {
          return null;
        }
        return req.cookies['jwt'];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.email, payload.password, payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}