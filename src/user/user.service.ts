import {Injectable, NotFoundException} from '@nestjs/common';
import {UserModel} from './models/user.model';
import {IUserEmail} from '../common/interfaces/user-email';
import {UserCreateDto} from '../auth/dto/user-create-dto';
import {TransactionOrKnex} from 'objection';
import {encodeHtmlTags} from '../common/decorators/strip-tags.decorator';
import {InjectMapper} from '@automapper/nestjs';
import {Mapper} from '@automapper/core';


@Injectable()
export class UserService {

    constructor(
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {
    }

    public async getUserByEmail(email: string): Promise<UserModel | null> {
        return UserModel.query().findOne({email: email, dateDeleted: null});
    }

    public async getUserByUsername(dto: IUserEmail): Promise<UserModel | null> {
        return UserModel.query().findOne({
            username: dto.username,
            dateDeleted: null
        });
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
}