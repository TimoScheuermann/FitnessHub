import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
import { FHSocket } from 'src/FHSocket';
import { IUser } from 'src/user/interfaces/IUser';
import { TgChat } from './schemas/TgChat.schema';

// Admin Chat
const CHAT_ID = -473869455;

interface MessageDetails {
  message_id: string;
  chat: {
    id: number;
  };
}
interface MessageCallback {
  id: number;
  data: string;
  message: MessageDetails;
}

@Injectable()
export class TgbotService {
  private bot = null;
  private clientBot = null;

  constructor(
    @InjectModel(TgChat.name) private tgChatModel: Model<TgChat>,
    private readonly fhSocket: FHSocket,
  ) {
    // declare bots if enabled via env vars.
    if (!process.env.IGNORE_BOT || true) {
      this.clientBot = new TelegramBot(process.env.TG_BOT_CLIENT_TOKEN, {
        polling: true,
      });
      this.bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true });

      this.clientBot.on('message', (details: MessageDetails) =>
        this.onMessage(details, tgChatModel, this.clientBot),
      );
      this.clientBot.on('callback_query', (callback: MessageCallback) =>
        this.onCallback(callback, tgChatModel, fhSocket, this.clientBot),
      );
    }
  }

  // bot has received a message from a non connected user
  private async onMessage(
    details: MessageDetails,
    model: Model<TgChat>,
    // eslint-disable-next-line
    bot: any,
  ): Promise<void> {
    const { id } = details.chat;
    let token = '';

    const chat = await model.findOne({ telegramChat: id });
    if (chat) token = chat.token;
    else {
      token = Math.round(Math.random() * (999999 - 100000) + 100000) + '';
      await model.create({ telegramChat: id, token: token });
    }

    if (chat && chat.userId) {
      bot.sendMessage(
        id,
        'Dieser Account ist bereits mit einem FitnessHub Konto verknüpft!',
      );
      return;
    }
    // send token to user
    bot.sendMessage(id, 'Dein Code lautet:');
    bot.sendMessage(id, token);
  }

  private async onCallback(
    callback: MessageCallback,
    model: Model<TgChat>,
    socket: FHSocket,
    // eslint-disable-next-line
    bot: any,
  ): Promise<void> {
    const userId = callback.data;
    const canceled = userId === 'cancel';
    const chatId = callback.message.chat.id;

    // user hasnt clicked cancel
    if (!canceled) {
      // store user to relevant chat
      await model.updateOne(
        { telegramChat: chatId },
        { $set: { userId: userId } },
        { upsert: true },
      );

      // send update to frontend
      socket.server.to(userId).emit('telegram', chatId);

      // send update to telegram
      bot.answerCallbackQuery(callback.id, {
        show_alert: true,
        text: 'Accounts erfolgreich verknüpft!',
      });
    }

    // delete callback message
    bot.deleteMessage(chatId, callback.message.message_id);
  }

  public async validateConnection(
    user: IUser,
    token: string,
  ): Promise<boolean> {
    if (!this.clientBot) {
      throw new UnprocessableEntityException(
        'Diese Funktion ist zurzeit abgeschaltet.',
      );
    }

    // validate token sent via frontend
    if (!(await this.doesTokenExist(token))) {
      throw new UnprocessableEntityException('Token existiert nicht.');
    }

    const name = [user.givenName, user.familyName].filter((x) => !!x).join(' ');

    // create message with callback for accept or deny
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

    const chats = await this.getChats(token);
    // ask via telegram if connection is allowed
    chats.forEach((chatId) => {
      this.clientBot.sendMessage(chatId, message, opts);
    });

    return true;
  }

  /**
   * sends a message to the admin group
   * @param message message
   */
  public sendMessage(message: string): void {
    if (this.bot)
      this.bot.sendMessage(CHAT_ID, message, { parse_mode: 'HTML' });
  }

  /**
   * sends a url message to the admin group
   * @param message message
   * @param label button label underneath the message
   * @param url url inserted into the button
   */
  public sendURLMessage(message: string, label: string, url: string): void {
    if (this.bot)
      this.bot.sendMessage(CHAT_ID, message, {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
          inline_keyboard: [[{ text: label, url: url }]],
        }),
      });
  }

  /**
   * send a message via telegram to a specific user
   * @param userId string
   * @param message message
   */
  public async sendMessageToUser(
    userId: string,
    message: string,
  ): Promise<void> {
    if (this.clientBot) {
      const chat = await this.tgChatModel.findOne({ userId: userId });
      if (chat && chat.telegramChat) {
        this.clientBot.sendMessage(chat.telegramChat, message, {
          parse_mode: 'html',
        });
      }
    }
  }

  public async publishUpdate(
    text: string,
    label: string,
    url: string,
    thumbnail?: string,
  ): Promise<void> {
    if (!this.clientBot) return;

    const message = `${text}<a href="${thumbnail}">&#8205;</a>`;
    const options = {
      disable_web_page_preview: false,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: 'Alle Beiträge', url: 'https://fitnesshub.app/community/' },
            { text: label, url: url },
          ],
        ],
      }),
    };

    this.clientBot.sendMessage('@FHUpdates', message, options);
  }

  public async getChatNumber(userId: string): Promise<number | null> {
    if (!userId || !isValidObjectId(userId)) return null;
    const chat = await this.tgChatModel.findOne({ userId: userId });
    if (chat) return chat.telegramChat || null;
    return null;
  }

  public async removeCode(user: IUser): Promise<void> {
    if (user && isValidObjectId(user._id)) {
      await this.tgChatModel.deleteOne({ userId: user._id });
    }
  }

  private async doesTokenExist(token: string): Promise<boolean> {
    return !!(await this.tgChatModel.findOne({ token: token }));
  }

  private async getChats(token: string): Promise<number[]> {
    const chats = await this.tgChatModel.find({ token: token });
    return chats.map((x) => x.telegramChat);
  }
}
