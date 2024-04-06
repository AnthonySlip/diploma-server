import {forwardRef, Logger, Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtModule} from '@nestjs/jwt';
import {UserModule} from '../user/user.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'
import {RefreshProfile} from './profiles/refresh.profile';
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, Logger, RefreshProfile],
    imports: [
        forwardRef(() => UserModule),
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                secret: config.get('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: config.get('JWT_EXPIRES_IN')
                }
            }),
            inject: [ConfigService]
        }),
    ],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}
