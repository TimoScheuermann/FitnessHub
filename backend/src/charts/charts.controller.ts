import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { FriendIDParam, FriendsGuard } from 'src/friends/friends.guard';
import { FHSetting, SettingGuard } from 'src/setting/setting.guard';
import { AvailableSetting } from 'src/setting/setting.service';
import { IUser } from 'src/user/interfaces/IUser';
import { ChartsService } from './charts.service';

@ApiTags('Charts')
@Controller('charts')
export class ChartsController {
  constructor(private readonly chartService: ChartsService) {}

  /**
   * returns health and workout charts of requester
   * @param user request sender
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('')
  async getCharts(@FHUser() user: IUser): Promise<number[][]> {
    return this.chartService.getCharts(user._id);
  }

  /**
   * returns charts of friend
   * @param userId friendId
   */
  @FriendIDParam('userId')
  @FHSetting(AvailableSetting.FRIENDS_SHARE_STATS)
  @UseGuards(AuthGuard('jwt'), RolesGuard, FriendsGuard, SettingGuard)
  @Get(':userId')
  async getChartsOf(@Param('userId') userId: string): Promise<number[][]> {
    return this.chartService.getCharts(userId);
  }
}
