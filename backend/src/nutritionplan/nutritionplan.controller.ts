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
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateNutritionplanDTO } from './dtos/CreateNutritionplan.dto';
import { INutritionplanFull } from './interfaces/INutritionplanFull';
import { NutritionplanService } from './nutritionplan.service';

@ApiTags('Nutritionplan')
@Controller('nutritionplan')
export class NutritionplanController {
  constructor(private readonly nutritionplanService: NutritionplanService) {}

  /**
   * returns nutrition plans (limit 50)
   */
  @Get()
  async getAll(): Promise<INutritionplanFull[]> {
    return this.nutritionplanService.getAll();
  }

  /**
   * returns a nutrition plan by ID
   * @param id
   */
  @Get(':id')
  async getById(@Param('id') id: string): Promise<INutritionplanFull> {
    return this.nutritionplanService.getById(id);
  }

  /**
   * returns nutritionplans with a specific category
   * @param category
   */
  @Get('category/:category')
  async getByCategory(
    @Param('category') category: string,
  ): Promise<INutritionplanFull[]> {
    return this.nutritionplanService.getByCategory(category);
  }

  /**
   * creates a new nutrition plan
   * @param user sender
   * @param createNutritionplan nutritionplan
   */
  @Roles(['moderator', 'admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async addNutritionplan(
    @FHUser() user: IUser,
    @Body() createNutritionplan: CreateNutritionplanDTO,
  ): Promise<INutritionplanFull> {
    return this.nutritionplanService.addNutritionplan(
      user,
      createNutritionplan,
    );
  }

  /**
   * updates a nutrition plan
   * @param user sender
   * @param id nutritionplan id
   * @param update new nutrition plan
   */
  @Roles(['moderator', 'admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  async updateNutritionplan(
    // @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: CreateNutritionplanDTO,
  ): Promise<INutritionplanFull> {
    return this.nutritionplanService.updateNutritionplan(id, update);
  }

  /**
   * deletes a specific nutrition plan of the sender
   * @param user sender
   * @param id nutrtition plan
   */
  @Roles(['moderator', 'admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteNutritionplan(
    // @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.nutritionplanService.deleteNutritionplan(id);
  }
}
