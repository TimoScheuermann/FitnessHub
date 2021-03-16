import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { FriendIDParam, FriendsGuard } from 'src/friends/friends.guard';
import { FHSetting, SettingGuard } from 'src/setting/setting.guard';
import { AvailableSetting } from 'src/setting/setting.service';
import { IUser } from 'src/user/interfaces/IUser';
import { HealthService } from './health.service';
import { IHealth } from './interfaces/IHealth';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * returns weight data of sender
   * @param user
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('weight')
  async getWeight(@FHUser() user: IUser): Promise<IHealth[]> {
    return this.healthService.getWeightData(user._id);
  }

  /**
   * returns weight data of friend
   * @param userId friendId
   */
  @FriendIDParam('userId')
  @FHSetting(AvailableSetting.FRIENDS_SHARE_WEIGHT)
  @UseGuards(AuthGuard('jwt'), RolesGuard, FriendsGuard, SettingGuard)
  @Get('weight/:userId')
  async getWeightOf(@Param('userId') userId: string): Promise<number> {
    return this.healthService.getCurrentWeight(userId);
  }

  /**
   * returns the current weight of the sender
   * @param user sender
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('currentWeight')
  async getCurrentWeight(@FHUser() user: IUser): Promise<number> {
    return this.healthService.getCurrentWeight(user._id);
  }

  /**
   * returns the water data of the sender
   * @param user
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('water')
  async getWater(@FHUser() user: IUser): Promise<IHealth[]> {
    return this.healthService.getWaterData(user._id);
  }

  /**
   * returns the water data of a friend
   * @param userId friendId
   */
  @FriendIDParam('userId')
  @FHSetting(AvailableSetting.FRIENDS_SHARE_WATER)
  @UseGuards(AuthGuard('jwt'), RolesGuard, FriendsGuard, SettingGuard)
  @Get('water/:userId')
  async getTodaysWaterOf(@Param('userId') userId: string): Promise<number> {
    return this.healthService.getTodaysWater(userId);
  }

  /**
   * returns the height data of the sender
   * @param user sender
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('height')
  async getHeight(@FHUser() user: IUser): Promise<IHealth> {
    return this.healthService.getHeightData(user._id);
  }

  /**
   * returns the height data of a friend
   * @param userId friendId
   */
  @FriendIDParam('userId')
  @FHSetting(AvailableSetting.FRIENDS_SHARE_HEIGHT)
  @UseGuards(AuthGuard('jwt'), RolesGuard, FriendsGuard, SettingGuard)
  @Get('height/:userId')
  async getCurrentHeightOf(@Param('userId') userId: string): Promise<number> {
    return this.healthService.getCurrentHeight(userId);
  }

  /**
   * adds weight data
   * @param user sender
   * @param body {amount: number} current weight
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('weight')
  async addWeight(
    @FHUser() user: IUser,
    @Body() body: { amount: number },
  ): Promise<IHealth> {
    return this.healthService.addWeight(user._id, body.amount);
  }

  /**
   * adds water data
   * @param user sender
   * @param body {amount: number} new water intake
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('water')
  async addWater(
    @FHUser() user: IUser,
    @Body() body: { amount: number },
  ): Promise<IHealth> {
    return this.healthService.addWater(user._id, body.amount);
  }

  /**
   * adds height data
   * @param user sender
   * @param body {amount: number} current height
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('height')
  async setHeight(
    @FHUser() user: IUser,
    @Body() body: { amount: number },
  ): Promise<void> {
    this.healthService.setHeight(user._id, body.amount);
  }

  /**
   * deletes a specific health data of any type
   * @param user sender
   * @param id healthId
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteHealthDataFor(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    this.healthService.deleteHealthData(user._id, id);
  }
}
