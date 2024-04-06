import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';


@Controller('users')
export class UserController {

  constructor(
    private userService: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
  }

}