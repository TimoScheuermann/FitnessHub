import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateNutritionplanDTO } from './dtos/CreateNutritionplan.dto';
import { UpdateNutritionplanDTO } from './dtos/UpdateNutritionplan.dto';
import { INutritionplan } from './interfaces/INutritionplan';
import { NutritionplanService } from './nutritionplan.service';

@Controller('nutritionplan')
export class NutritionplanController {
  constructor(private readonly nutritionplanService: NutritionplanService) {}

  @Get()
  async getAll(): Promise<INutritionplan[]> {
    return this.nutritionplanService.getAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('mine')
  async getByAuthor(@FHUser() user: IUser): Promise<INutritionplan[]> {
    return this.nutritionplanService.getByAuthor(user._id);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<INutritionplan> {
    return this.nutritionplanService.getById(id);
  }

  @Get('category/:category')
  async getByCategory(
    @Param('category') category: string,
  ): Promise<INutritionplan[]> {
    return this.nutritionplanService.getByCategory(category);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async addNutritionplan(
    @FHUser() user: IUser,
    @Body() createNutritionplan: CreateNutritionplanDTO,
  ): Promise<void> {
    this.nutritionplanService.addNutritionplan(user, createNutritionplan);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('update/:id')
  async updateNutritionplan(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: UpdateNutritionplanDTO,
  ): Promise<void> {
    return this.nutritionplanService.updateNutritionplan(id, user._id, update);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteNutritionplan(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.nutritionplanService.deleteNutritionplan(user._id, id);
  }
}
