import { Controller, Post } from '@nestjs/common';
import { TgbotService } from 'src/tgbot/tgbot.service';

@Controller('netlify')
export class NetlifyController {
  constructor(private readonly tgbotService: TgbotService) {}

  @Post('success')
  public buildSuccess(): void {
    this.tgbotService.sendURLMessage(
      'Frontend erfolgreich gebaut und veröffentlicht!',
      'FitnessHub.app',
      'https://fitnesshub.app',
    );
  }
  @Post('failed')
  public buildFailed(): void {
    this.tgbotService.sendMessage(
      'Beim Bau des Frontends ist ein Fehler aufgetreten...',
    );
  }
}
