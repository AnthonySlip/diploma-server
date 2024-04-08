import { forwardRef, Logger, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './user.service';
import { UserProfile } from './profile/user.profile';
import { UserController } from './user.controller';
import { USER_REPOSITORY, UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    Logger,
    UserProfile,
    { provide: USER_REPOSITORY, useClass: UserRepository }
  ],
  exports: [UserService],
})

export class UserModule {
}
