import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TgbotService {
  private CHAT_ID = -473869455;
  private bot = process.env.IGNORE_BOT
    ? undefined
    : new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true });

  public sendMessage(message: string): void {
    if (this.bot)
      this.bot.sendMessage(this.CHAT_ID, message, { parse_mode: 'HTML' });
  }

  public sendURLMessage(message: string, label: string, url: string): void {
    if (this.bot)
      this.bot.sendMessage(this.CHAT_ID, message, {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
          inline_keyboard: [[{ text: label, url: url }]],
        }),
      });
  }
}
