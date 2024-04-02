import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [AuthModule, OpenaiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
