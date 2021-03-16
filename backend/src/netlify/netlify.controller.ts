import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TgbotService } from 'src/tgbot/tgbot.service';

@ApiTags('Netlify')
@Controller('netlify')
export class NetlifyController {
  constructor(private readonly tgbotService: TgbotService) {}

  /**
   * gets triggered by netlify if the frontend build succeeds
   */
  @Post('success')
  public buildSuccess(): void {
    this.tgbotService.sendURLMessage(
      'Frontend erfolgreich gebaut und veröffentlicht!',
      'FitnessHub.app',
      'https://fitnesshub.app',
    );
  }

  /**
   * gets triggered by netlify if the frontend build fails
   */
  @Post('failed')
  public buildFailed(): void {
    this.tgbotService.sendMessage(
      'Beim Bau des Frontends ist ein Fehler aufgetreten...',
    );
  }
}
