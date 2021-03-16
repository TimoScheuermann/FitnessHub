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
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import { CreateVariableDTO } from './dtos/CreateVariable.dto';
import { IVariable } from './interfaces/IVariable';
import { VariablesService } from './variables.service';

@ApiTags('Variables')
@Controller('variables')
export class VariablesController {
  constructor(private readonly variablesService: VariablesService) {}

  /**
   * returns all variables
   */
  @Get('')
  async getAll(): Promise<IVariable[]> {
    return this.variablesService.getAll();
  }

  /**
   * returns all muscle categories
   */
  @Get('muscles')
  async getMuscles(): Promise<IVariable[]> {
    return this.variablesService.getMuscles();
  }

  /**
   * returns all recipe categories
   */
  @Get('categories')
  async getCategories(): Promise<IVariable[]> {
    return this.variablesService.getCategories();
  }

  /**
   * adds a new muscle type
   * @param dto
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('muscle')
  async addMuscle(@Body() dto: CreateVariableDTO): Promise<IVariable> {
    return this.variablesService.addMuscle(dto);
  }

  /**
   * adds a new recipe category
   * @param dto
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('category')
  async addCategory(@Body() dto: CreateVariableDTO): Promise<IVariable> {
    return this.variablesService.addCategory(dto);
  }

  /**
   * deletes a muscle type
   * @param id
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('muscle/:id')
  async removeMuscle(@Param('id') id: string): Promise<void> {
    this.variablesService.removeMuscle(id);
  }

  /**
   * deletes a recipe category
   * @param id
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('category/:id')
  async removeCategory(@Param('id') id: string): Promise<void> {
    this.variablesService.removeCategory(id);
  }
}
