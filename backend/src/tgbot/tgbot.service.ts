import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TgbotService {
  private bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true });

  public sendMessage(message: string): void {
    this.bot.sendMessage(-473869455, message);
  }
}
