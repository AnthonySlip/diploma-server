import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login-dto';
import { UserCreateDto } from './dto/user-create-dto';
import { ILoginResponse } from './interfaces/login-response.interface';
import { UserModel } from '../user/models/user.model';
import { IAccessToken, ITokenPair } from './interfaces/token-pair.interface';
import { UserDto } from '../user/dto/user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as crypto from 'crypto';
import { encodeHtmlTags } from '../common/decorators/strip-tags.decorator';
import { UserService } from '../user/user.service';
import { BaseModel } from '@squareboat/nestjs-objection';
import { TransactionOrKnex } from 'objection';
import dayjs from 'dayjs';
import { getExpiryDate } from './utilities/token';
import { IJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { RefreshModel } from './models/refresh.model';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

export interface ILoginResponseWithRefreshToken {
  refreshToken: string;
  loginResponse: ILoginResponse;
}

@Injectable()
export class AuthService {

  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
  }

  async signup(userCreateDto: UserCreateDto): Promise<ILoginResponseWithRefreshToken> {
    encodeHtmlTags(UserDto);

    let candidate = await this.userService.getUserByEmail(userCreateDto.email);

    if (candidate) {
      throw new BadRequestException('auth.register.email_exists');
    }

    if (candidate) {
      throw new BadRequestException('auth.register.username_exists');
    }

    const trx = await BaseModel.startTransaction();
    try {
      const user = await this.userService.create(
        {
          email: userCreateDto.email,
          password: userCreateDto.password,
          lastName: userCreateDto.lastName,
          firstName: userCreateDto.firstName,
        },
        trx,
      );


      const tokens = await this.generateTokens(user, trx);

      await trx.commit();

      return { loginResponse: this.getLoginResponse(tokens, user), refreshToken: tokens.refreshToken };
    } catch (e) {
      await trx.rollback();
      console.error(e);
      throw e;
    }
  }

  async signin(userLoginDto: UserLoginDto): Promise<ILoginResponseWithRefreshToken> {
    const user = await this.userService.validateUser(userLoginDto)

    const tokens = await this.generateTokens(user)

    return {refreshToken: tokens.refreshToken, loginResponse: this.getLoginResponse(tokens, user)}
  }

  public async logout(user: UserModel) {
    return (async () => {
      await RefreshModel.query().delete().where('userId', user.id)
    })()
  }

  public async refreshToken(refreshToken: string): Promise<ITokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    const token = await this.findRefreshToken(refreshToken)

    if (!token) {
      throw new UnauthorizedException('auth.security.refresh_token_not_found')
    }

    const user = await token.$relatedQuery('user')

    return await this.generateTokens(user)
  }

  private async findRefreshToken(token: string): Promise<RefreshModel | null> {
    return RefreshModel.query().findOne({token: token})
  }

  private getLoginResponse(tokens: ITokenPair, user: UserModel): ILoginResponse {
    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  private async generateTokens(user: UserModel, trx?: TransactionOrKnex): Promise<ITokenPair> {
    const accessToken = this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user, trx);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
    };
  }

  private createAccessToken(dto: UserModel): IAccessToken {
    const createdAt = dayjs();
    const expiresIn = getExpiryDate(createdAt).toISOString();

    const payload: IJwtPayload = {
      id: dto.id,
      email: dto.email,
      createdAt: createdAt.toISOString(),
    };
    const token = this.jwtService.sign(payload);

    return {
      expiresIn,
      token,
    };
  }

  private async createRefreshToken(
    userDto: UserModel,
    trx?: TransactionOrKnex,
  ): Promise<RefreshTokenDto> {
    const refreshToken = await this.generateToken();

    const em = await BaseModel.startTransaction(trx);
    try {
      await RefreshModel.query(em).delete().where('userId', userDto.id);

      const refresh = await RefreshModel.query(em).insert({
        userId: userDto.id,
        token: refreshToken,
      });

      await em.commit();

      return this.mapper.map(refresh, RefreshModel, RefreshTokenDto);
    } catch (e) {
      await em.rollback();
      throw e;
    }
  }

  private async generateToken(
    byteLength = 32,
    stringBase: BufferEncoding = 'hex',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(byteLength, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString(stringBase));
        }
      });
    });
  }

  public async getUserFromJwtPayload(payload: IJwtPayload): Promise<UserModel> {
    return await this.userService.get(payload.id);
  }
}