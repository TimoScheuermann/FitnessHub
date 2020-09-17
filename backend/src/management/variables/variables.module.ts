import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Variable, VariableSchema } from './schemas/Variable.schema';
import { VariablesController } from './variables.controller';
import { VariablesService } from './variables.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variable.name, schema: VariableSchema },
    ]),
  ],
  controllers: [VariablesController],
  providers: [VariablesService],
})
export class VariablesModule {}
