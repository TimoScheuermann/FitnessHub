import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
import { FHSocket } from 'src/FHSocket';
import { IUser } from 'src/user/interfaces/IUser';
import { User } from 'src/user/schemas/User.schema';
import { v4 } from 'uuid';

@Injectable()
export class TgbotService {
  // Admin Chat
  private CHAT_ID = -473869455;

  private bot = process.env.IGNORE_BOT
    ? undefined
    : new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true });

  private clientBot = process.env.IGNORE_BOT
    ? undefined
    : new TelegramBot(process.env.TG_BOT_CLIENT_TOKEN, {
        polling: true,
      });

  // UserId, ChatId
  private connectedChats: Record<string, number> = {};

  // ChatId, Token
  private tokens: Record<number, string> = {};

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly fhSocket: FHSocket,
  ) {
    this.userModel
      .find({ telegramChat: { $exists: true } })
      .then((res: IUser[]) => {
        res.forEach((x) => {
          this.connectedChats[x._id] = x.telegramChat;
        });
      });

    if (this.clientBot) {
      this.clientBot.on('message', (details) => {
        if (!Object.values(this.connectedChats).includes(details.chat.id)) {
          if (!Object.keys(this.tokens).includes(details.chat.id + '')) {
            let token = v4();
            while (Object.values(this.tokens).includes(token)) {
              token = v4();
            }
            this.tokens[details.chat.id] = token;
          }
          this.clientBot.sendMessage(
            details.chat.id,
            `Dein Code lautet:\n${this.tokens[details.chat.id]}`,
          );
        }
      });

      this.clientBot.on('callback_query', async (details) => {
        const canceled = details.data === 'cancel';
        const chatId = details.message.chat.id;
        const userId = details.data;

        delete this.tokens[chatId + ''];

        if (!canceled) {
          await this.userModel.updateOne(
            { _id: userId },
            { $set: { telegramChat: chatId } },
            { upsert: true },
          );
          this.fhSocket.server.to(userId).emit('telegram.chat', chatId);
          this.clientBot.answerCallbackQuery(details.id, {
            show_alert: true,
            text: 'Accounts erfolgreich verknüpft!',
          });
          this.connectedChats[userId] = chatId;
        }

        this.clientBot.deleteMessage(
          details.message.chat.id,
          details.message.message_id,
        );
      });
    }
  }

  public validateConnection(user: IUser, code: string): void {
    if (!this.clientBot) return;
    if (!Object.values(this.tokens).includes(code)) {
      this.fhSocket.server
        .to(user._id)
        .emit('telegram.errorMessage', 'Code existiert nicht.');
      return;
    }
    for (const key in this.tokens) {
      if (this.tokens[key] === code) {
        const name = [user.givenName, user.familyName]
          .filter((x) => !!x)
          .join(' ');
        const message = `<a href="${user.avatar}">&#8205;</a>\nDieser Account versucht sich mit deinem Telegram Account zu verknüpfen:\n<b>${name}</b>`;
        const opts = {
          parse_mode: 'HTML',
          disable_web_page_preview: false,
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Abbrechen', callback_data: 'cancel' },
                { text: 'Verknüpfen', callback_data: user._id },
              ],
            ],
          },
        };
        this.clientBot.sendMessage(key, message, opts);
      }
    }
  }

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

  public sendMessageToUser(userId: string, message: string): void {
    if (this.clientBot && this.connectedChats[userId]) {
      this.clientBot.sendMessage(this.connectedChats[userId], message, {
        parse_mode: 'HTML',
      });
    }
  }
}
