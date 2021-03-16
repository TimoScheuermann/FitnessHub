import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import FHUser from 'src/auth/user.decorator';
import { FriendIDParam } from 'src/friends/friends.guard';
import { IUser } from 'src/user/interfaces/IUser';
import { AchievementService } from './achievement.service';
import { Achievement } from './schemas/Achievement.schema';

@ApiTags('Achievement')
@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  /**
   * returns achievements of user
   * @param user IUSer
   */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAchievements(@FHUser() user: IUser): Promise<Achievement[]> {
    return this.achievementService.getAchievements(user._id, user._id);
  }

  @FriendIDParam('userId')
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  async getAchievementsOf(
    @FHUser() user: IUser,
    @Param('userId') userId: string,
  ): Promise<Achievement[]> {
    return this.achievementService.getAchievements(user._id, userId);
  }
}
