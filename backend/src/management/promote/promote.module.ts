import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PromoteController } from './promote.controller';

@Module({
  controllers: [PromoteController],
  imports: [UserModule],
})
export class PromoteModule {}
