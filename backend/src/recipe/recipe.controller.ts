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
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { UpdateRecipeDTO } from './dtos/UpdateRecipe.dto';
import { IRecipe } from './interfaces/IRecipe';
import { RecipeService } from './recipe.service';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async getAll(): Promise<IRecipe[]> {
    return this.recipeService.getAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('mine')
  async getByAuthor(@FHUser() user: IUser): Promise<IRecipe[]> {
    return this.recipeService.getByAuthor(user._id);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<IRecipe> {
    return this.recipeService.getById(id);
  }

  @Get('category/:category')
  async getByCategory(
    @Param('recipeCategory') category: string,
  ): Promise<IRecipe[]> {
    return this.recipeService.getByCategory(category);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async addRecipe(
    @FHUser() user: IUser,
    @Body() createRecipe: CreateRecipeDTO,
  ): Promise<void> {
    this.recipeService.addRecipe(user, createRecipe);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('update/:id')
  async updateRecipe(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: UpdateRecipeDTO,
  ): Promise<void> {
    return this.recipeService.updateRecipe(id, user._id, update);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteRecipe(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.recipeService.deleteRecipe(user._id, id);
  }
}
