import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { FeedService } from './feed.service';
import { IFeed } from './interfaces/IFeed.interface';
import { Feed } from './schemas/Feed.schema';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(
    @Query('oldest') oldest?: number,
    @Query('limit') limit?: number,
  ): Promise<IFeed[]> {
    return this.feedService.getFeed(oldest, limit);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('personal')
  async getFeedPersonal(
    @FHUser() user: IUser,
    @Query('oldest') oldest?: number,
    @Query('limit') limit?: number,
  ): Promise<IFeed[]> {
    return this.feedService.getFeed(oldest, limit, user._id);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<Feed> {
    return this.feedService.getPost(id);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createPost(@Body() dto: CreatePostDto): Promise<boolean> {
    return this.feedService.createPost(dto);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  async patchPost(
    @Param('id') id: string,
    @Body() dto: CreatePostDto,
  ): Promise<boolean> {
    return this.feedService.patchPost(id, dto);
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<boolean> {
    return this.feedService.deletePost(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/reaction/:type')
  async removeReaction(
    @Param('id') id: string,
    @Param('type') type: string,
    @FHUser() user: IUser,
  ): Promise<void> {
    this.feedService.removeReaction(id, type, user._id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/reaction/:type')
  async addReaction(
    @Param('id') id: string,
    @Param('type') type: string,
    @FHUser() user: IUser,
  ): Promise<void> {
    this.feedService.addReaction(id, type, user._id);
  }
}
