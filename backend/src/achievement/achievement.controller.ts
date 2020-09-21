import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { AchievementService } from './achievement.service';
import { IAchievment } from './interfaces/IAchievement';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getAchievements(@FHUser() user: IUser): Promise<IAchievment[]> {
    return this.achievementService.getAchievements(user._id);
  }
}
