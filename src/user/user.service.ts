import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {UserModel} from './models/user.model';
import {IUserEmail} from '../common/interfaces/user-email';
import {UserCreateDto} from '../auth/dto/user-create-dto';
import {TransactionOrKnex} from 'objection';
import {encodeHtmlTags} from '../common/decorators/strip-tags.decorator';
import {InjectMapper} from '@automapper/nestjs';
import {Mapper} from '@automapper/core';
import { UserLoginDto } from '../auth/dto/user-login-dto';
import { compare } from '../auth/utilities/password';
import { USER_REPOSITORY, UserRepository } from './repositories/user.repository';


@Injectable()
export class UserService {

    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    ) {
    }

    public async getUserByEmail(email: string): Promise<UserModel | null> {
        return UserModel.query().findOne({email: email})
    }

    async create(
        dto: UserCreateDto,
        trx?: TransactionOrKnex
    ): Promise<UserModel> {
        encodeHtmlTags(dto);


        return UserModel.query(trx).insert({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password: dto.password,
        });
    }

    async get(id: number): Promise<UserModel> {
        const user = await UserModel.query().findOne({
            id: id,
            dateDeleted: null
        });

        if (!user) {
            throw new NotFoundException('user.not_found');
        }

        return user;
    }

    public async validateUser(userLoginDto: UserLoginDto): Promise<UserModel> {
        const user = await this.getUserByEmail(userLoginDto.email);

        if (!user) {
            throw new NotFoundException('user.not_found')
        }


        const passwordEquals = await compare(userLoginDto.password, user.password);

        if (!passwordEquals) {
            throw new UnauthorizedException('Incorrect email or password');
        }

        return user;
    }

    public async delete(id: number): Promise<void> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new NotFoundException('user.not_found')
        }

        return this.userRepository.markDeleted(user);
    }
}