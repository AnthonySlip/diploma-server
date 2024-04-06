import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';
import {IUserEmail} from '../../common/interfaces/user-email';
export class UserCreateDto implements IUserEmail {
    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(6)
    password: string
}