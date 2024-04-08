import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import {AuthService} from './auth.service';
import {UserLoginDto} from './dto/user-login-dto';
import {Response, Request} from 'express';
import {UserCreateDto} from './dto/user-create-dto';
import { IAccessToken, ITokenPair } from './interfaces/token-pair.interface';
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
    ): Promise<ILoginResponse> {
        const response = await this.authService.signin(userDto)

        this.addCookies(res, {
            refreshToken: response.refreshToken,
            accessToken: response.loginResponse.accessToken
        })

        return response.loginResponse
    }

    @Post('logout')
    async logout (
        @Body() user,
        @Res({passthrough: true}) res: Response
    ): Promise<void> {
        await this.authService.logout(user)
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
    }

    @Post('refresh')
    public async refreshToken(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response
    ): Promise<IAccessToken> {
        const { refreshToken } = req.cookies
        const refreshResponse = await this.authService.refreshToken(refreshToken)
        if (refreshResponse) {
            this.addCookies(res, refreshResponse)
        }

        return refreshResponse.accessToken
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