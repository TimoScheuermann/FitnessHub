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
  async getAllRecipes(): Promise<IRecipe[]> {
    return this.recipeService.getAllRecipes();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('user')
  async getAllRecipesOf(@FHUser() user: IUser): Promise<IRecipe[]> {
    return this.recipeService.getAllRecipesOf(user._id);
  }

  @Get(':recipeId')
  async getRecipeById(@Param('recipeId') recipeId: string): Promise<IRecipe> {
    return this.recipeService.getRecipeById(recipeId);
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
    @Param('id') id: string,
    @Body() update: UpdateRecipeDTO,
  ): Promise<void> {
    return this.recipeService.updateRecipe(id, update);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':recipeId')
  async deleteRecipe(
    @FHUser() user: IUser,
    @Param('recipeId') recipeId: string,
  ): Promise<void> {
    return this.recipeService.deleteRecipe(user._id, recipeId);
  }
}
