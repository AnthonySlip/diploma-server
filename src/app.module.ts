import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TransformerModule } from './transformer/transformer.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from './database';
import { ObjectionModule } from '@squareboat/nestjs-objection';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
      load: [database],
    }),
    ObjectionModule.registerAsync({
      imports: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get('database');
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    AuthModule,
    TransformerModule,
    UserModule],
  controllers: []
})
export class AppModule {
}
