import { IsEmail, IsNotEmpty } from 'class-validator'
import { AutoMap } from '@automapper/classes'

export class UserDto {
    @AutoMap()
    id: number

    @AutoMap()
    @IsNotEmpty()
    firstName: string

    @AutoMap()
    @IsNotEmpty()
    lastName: string

    @AutoMap()
    @IsNotEmpty()
    username: string

    @AutoMap()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @AutoMap()
    role: string

    @AutoMap()
    isActivated: boolean

    @AutoMap()
    iconBg: string

    @AutoMap()
    iconFg: string

    @IsNotEmpty()
    password: string
}
