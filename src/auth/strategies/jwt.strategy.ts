import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserDto } from '../../user/dto/user.dto'
import { getExpiryDate } from '../utilities/token'
import dayjs from 'dayjs'
import { Request } from 'express'
import {AuthService} from '../auth.service';
import {IJwtPayload} from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    let token = null
                    if (req && req.cookies) {
                        token = req.cookies['accessToken']
                    }
                    return token
                }
            ]),
            secretOrKey: process.env.JWT_SECRET_KEY,
            passReqToCallback: true
        })
    }

    // async validate(req: Request, payload: IJwtPayload): Promise<UserDto> {
    //     const expiryDate = getExpiryDate(dayjs(payload.createdAt))
    //
    //     if (expiryDate.isBefore(dayjs())) {
    //         throw new UnauthorizedException('auth.security.token_expired')
    //     }
    //
    //     return await this.authService.getUserFromJwtPayload(payload)
    // }
}
