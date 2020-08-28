import { Module } from '@nestjs/common';
import { PromoteController } from './promote.controller';
import { PromoteService } from './promote.service';

@Module({
  controllers: [PromoteController],
  providers: [PromoteService]
})
export class PromoteModule {}
