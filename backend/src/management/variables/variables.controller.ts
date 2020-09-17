import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import { CreateVariableDTO } from './dtos/CreateVariable.dto';
import { IVariable } from './interfaces/IVariable';
import { VariablesService } from './variables.service';

@Controller('variables')
export class VariablesController {
  constructor(private readonly variablesService: VariablesService) {}

  @Get('')
  async getAll(): Promise<IVariable[]> {
    return this.variablesService.getAll();
  }

  @Get('muscles')
  async getMuscles(): Promise<IVariable[]> {
    return this.variablesService.getMuscles();
  }

  @Get('categories')
  async getCategories(): Promise<IVariable[]> {
    return this.variablesService.getCategories();
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('muscle')
  async addMuscle(
    @Body() createVariableDTO: CreateVariableDTO,
  ): Promise<IVariable[]> {
    return this.variablesService.addMuscle(createVariableDTO);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('category')
  async addCategory(
    @Body() createVariableDTO: CreateVariableDTO,
  ): Promise<IVariable[]> {
    return this.variablesService.addCategory(createVariableDTO);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('muscle/:id')
  async removeMuscle(@Param('id') id: string): Promise<void> {
    this.variablesService.removeMuscle(id);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('category/:id')
  async removeCategory(@Param('id') id: string): Promise<void> {
    this.variablesService.removeCategory(id);
  }
}
