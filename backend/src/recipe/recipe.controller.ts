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
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { CreateRecipeDTO } from './dtos/CreateRecipe.dto';
import { IRecipe } from './interfaces/IRecipe';
import { RecipeService } from './recipe.service';

@ApiTags('Recipe')
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  /**
   * Returns the latest 50 recipes
   */
  @Get()
  async getAll(): Promise<IRecipe[]> {
    return this.recipeService.getAll();
  }

  /**
   * Returns submitted recipes by a specific user
   * @param user FHUser
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('mine')
  async getByAuthor(@FHUser() user: IUser): Promise<IRecipe[]> {
    return this.recipeService.getByAuthor(user._id);
  }

  /**
   * Returns liked recipes by a specific user
   * @param user FHUser
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('liked')
  async getLiked(@FHUser() user: IUser): Promise<IRecipe[]> {
    return this.recipeService.getLiked(user._id);
  }

  /**
   * Returns the latest 10 recipes
   */
  @Get('latest')
  async getLatest(): Promise<IRecipe[]> {
    return this.recipeService.getLatest();
  }

  /**
   * Returns top 10 liked recipes
   */
  @Get('beloved')
  async getBeloved(): Promise<IRecipe[]> {
    return this.recipeService.getBeloved();
  }

  /**
   * Returns all recipes matching the given query (limit 50)
   * @param query Query
   */
  @Get('find/:query')
  async findRecipe(@Param('query') query: string): Promise<IRecipe[]> {
    return this.recipeService.find(query);
  }

  /**
   * Returns recipe with given ID
   * @param id string
   */
  @Get(':id')
  async getById(@Param('id') id: string): Promise<IRecipe | null> {
    return this.recipeService.getById(id);
  }

  /**
   * Removes like on recipe by a specific user
   * @param user FHUser
   * @param id string
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('like/:id')
  async removeLike(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    this.recipeService.removeLike(user._id, id);
  }

  /**
   * Adds like on recipe
   * @param user FHUser
   * @param id string
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('like/:id')
  async addLike(@FHUser() user: IUser, @Param('id') id: string): Promise<void> {
    this.recipeService.addLike(user._id, id);
  }

  /**
   * Returns recipes with given category (limit 50)
   * @param category string
   */
  @Get('category/:category')
  async getByCategory(@Param('category') category: string): Promise<IRecipe[]> {
    return this.recipeService.getByCategory(category);
  }

  /**
   * Submits a new recipe
   * @param user FHUser
   * @param createRecipe CreateRecipeDTO
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async addRecipe(
    @FHUser() user: IUser,
    @Body() createRecipe: CreateRecipeDTO,
  ): Promise<IRecipe> {
    return this.recipeService.addRecipe(user, createRecipe);
  }

  /**
   * Updates an existing recipe
   * @param user FHUser
   * @param id string
   * @param update UpdateRecipeDTO
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  async updateRecipe(
    @FHUser() user: IUser,
    @Param('id') id: string,
    @Body() update: CreateRecipeDTO,
  ): Promise<IRecipe | null> {
    return this.recipeService.updateRecipe(id, user._id, update);
  }

  /**
   * Deletes recipe with given ID
   * @param user FHUser
   * @param id string
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteRecipe(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    this.recipeService.deleteRecipe(user._id, id);
  }
}
