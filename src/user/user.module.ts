import { forwardRef, Logger, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './user.service';
import { UserProfile } from './profile/user.profile';
import { UserController } from './user.controller';

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    Logger,
    UserProfile,
  ],
  exports: [UserService],
})

export class UserModule {
}
