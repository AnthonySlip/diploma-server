import { Module } from '@nestjs/common';
import { TransformerController } from './transformer.controller';
import { TransformerService } from './transformer.service';

@Module({
  controllers: [TransformerController],
  providers: [TransformerService],
  exports: [TransformerService]
})
export class TransformerModule {
}
