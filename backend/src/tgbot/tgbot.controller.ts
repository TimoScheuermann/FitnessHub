import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { TgbotService } from './tgbot.service';

@Controller('tgbot')
export class TgbotController {
  constructor(private readonly tgbotService: TgbotService) {}

  /**
   * validates the 2FA code sent by telegram
   * @param user request sender
   * @param body {code: string} code received in telegram
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('code')
  public validateConnection(
    @FHUser() user: IUser,
    @Body() body: { code: string },
  ): void {
    this.tgbotService.validateConnection(user, body.code);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public getCode(@FHUser() user: IUser): Promise<number> {
    return this.tgbotService.getCode(user);
  }
}
