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

  /**
   * returns all nutrition plans
   */
  @Get()
  async getAll(): Promise<INutritionplan[]> {
    return this.nutritionplanService.getAll();
  }

  /**
   * returns nutrition plans, created by the request sender
   * @param user sender
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('mine')
  async getByAuthor(@FHUser() user: IUser): Promise<INutritionplan[]> {
    return this.nutritionplanService.getByAuthor(user._id);
  }

  /**
   * returns a nutrition plan by ID
   * @param id
   */
  @Get(':id')
  async getById(@Param('id') id: string): Promise<INutritionplan> {
    return this.nutritionplanService.getById(id);
  }

  /**
   * returns nutritionplans with a specific category
   * @param category
   */
  @Get('category/:category')
  async getByCategory(
    @Param('category') category: string,
  ): Promise<INutritionplan[]> {
    return this.nutritionplanService.getByCategory(category);
  }

  /**
   * creates a new nutition plan
   * @param user sender
   * @param createNutritionplan nutritionplan
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async addNutritionplan(
    @FHUser() user: IUser,
    @Body() createNutritionplan: CreateNutritionplanDTO,
  ): Promise<void> {
    this.nutritionplanService.addNutritionplan(user, createNutritionplan);
  }

  /**
   * updates a nutrition plan
   * @param user sender
   * @param id nutritionplan id
   * @param update new nutrition plan
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('update/:id')
  async updateNutritionplan(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: UpdateNutritionplanDTO,
  ): Promise<void> {
    return this.nutritionplanService.updateNutritionplan(id, user._id, update);
  }

  /**
   * deletes a specific nutrition plan of the sender
   * @param user sender
   * @param id nutrtition plan
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteNutritionplan(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.nutritionplanService.deleteNutritionplan(user._id, id);
  }
}
