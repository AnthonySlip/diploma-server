import {Body, Controller, Post, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UserLoginDto} from './dto/user-login-dto';
import {Response} from 'express';
import {UserCreateDto} from './dto/user-create-dto';
import {ITokenPair} from './interfaces/token-pair.interface';
import dayjs from 'dayjs';
import {getCurrentDate} from '../common/helpers/date';
import {ILoginResponse} from './interfaces/login-response.interface';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Post('signup')
    async signup (
        @Body() userDto: UserCreateDto,
        @Res({passthrough: true}) res: Response
    ): Promise<ILoginResponse> {
        const response = await this.authService.signup(userDto)

        this.addCookies(res, {
            refreshToken: response.refreshToken,
            accessToken: response.loginResponse.accessToken
        })

        return response.loginResponse
    }

    @Post('signin')
    async signin (
        @Body() userDto: UserLoginDto,
        @Res({passthrough: true}) res: Response
    ): Promise<void> {
        const response = await this.authService.signin(userDto)

        return response
    }

    @Post('logout')
    async logout (
        @Body() userDto: UserLoginDto,
        @Res({passthrough: true}) res: Response
    ): Promise<void> {
        await this.authService.logout()
        res.clearCookie('refreshToken')
    }

    private addCookies(res: Response, tokens: ITokenPair) {
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            expires: dayjs(getCurrentDate()).add(1, 'month').toDate(),
        })
        res.cookie('accessToken', tokens.accessToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: dayjs(tokens.accessToken.expiresIn).toDate(),
        })
    }
}