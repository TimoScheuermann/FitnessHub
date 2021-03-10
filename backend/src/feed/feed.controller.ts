import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { FeedService } from './feed.service';
import { IFeed } from './interfaces/IFeed.interface';
import { Feed } from './schemas/Feed.schema';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(@Query('oldest') oldest?: number): Promise<IFeed[]> {
    return this.feedService.getFeed(oldest);
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
}
