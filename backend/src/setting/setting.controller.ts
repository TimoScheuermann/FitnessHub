import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { AvailableSetting, SettingService } from './setting.service';

@ApiTags('Setting')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  /**
   * Returns settings of specific user
   * @param user FHUser
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getSettings(@FHUser() user: IUser): Promise<string[]> {
    return this.settingService.getSettings(user._id);
  }

  /**
   * Disables settings for specific user
   * @param user FHUser
   * @param name AvailableSetting
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':name')
  async disableSetting(
    @FHUser() user: IUser,
    @Param('name') name: AvailableSetting,
  ): Promise<void> {
    this.settingService.disableSetting(user, name);
  }

  /**
   * Enables settings for specific user
   * @param user FHUser
   * @param name AvailableSetting
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':name')
  async enableSetting(
    @FHUser() user: IUser,
    @Param('name') name: AvailableSetting,
  ): Promise<void> {
    this.settingService.enableSetting(user, name);
  }
}
