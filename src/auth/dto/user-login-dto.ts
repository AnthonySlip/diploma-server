import { IUserEmail } from '../../common/interfaces/user-email';
import { IsEmail, IsNotEmpty } from 'class-validator'

export class UserLoginDto implements IUserEmail {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly password: string
}