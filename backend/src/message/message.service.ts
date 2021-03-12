import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { Model } from 'mongoose';
import { FHSocket } from 'src/FHSocket';
import { TgbotService } from 'src/tgbot/tgbot.service';
import { IUser } from 'src/user/interfaces/IUser';
import { promisify } from 'util';
import { IMessage } from './interfaces/IMessage';
import { Message } from './schemas/Message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly fhSocket: FHSocket,
    private readonly tgbotService: TgbotService,
  ) {}

  private async encrypt(message: string, messageId: string): Promise<Buffer> {
    const iv = Buffer.alloc(16, messageId, 'utf8');
    const password = process.env.CHAT_SECRET;

    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    return Buffer.concat([cipher.update(message), cipher.final()]);
  }

  private async decrypt(message: Buffer, messageId: string): Promise<string> {
    const iv = Buffer.alloc(16, messageId, 'utf8');
    const password = process.env.CHAT_SECRET;

    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    return Buffer.concat([decipher.update(message), decipher.final()]).toString(
      'utf8',
    );
  }

  /**
   * returns message send or received by a specific user
   * @param userID string
   */
  public async getMessages(userID: string): Promise<IMessage[]> {
    const messages = await this.messageModel.find({
      $or: [{ from: userID }, { to: userID }],
    });

    return await Promise.all(
      messages.map(async (m) => {
        const { content, _id } = m;
        const buffer = Buffer.from(Uint8Array.from(content));
        const decrypted = await this.decrypt(buffer, _id);
        return { ...m.toJSON(), content: decrypted };
      }),
    );
  }

  /**
   * marks a message send by friendId to userId as read
   * @param userId string
   * @param friendId string
   */
  public async markAsRead(userId: string, friendId: string): Promise<void> {
    await this.messageModel.updateMany(
      { from: friendId, to: userId },
      { $set: { read: true } },
    );
  }

  /**
   * sends a message from a specific user to a specific user
   * @param from sender
   * @param to receiver
   * @param message message
   */
  public async sendMessage(
    from: IUser,
    to: string,
    message: string,
    type = 'message',
  ): Promise<void> {
    const createdMessage = await this.messageModel.create({
      date: new Date().getTime(),
      content: [],
      from: from._id,
      to: to,
      type: type,
      read: false,
    });

    this.fhSocket.server
      .to(from._id)
      .to(to)
      .emit('message', { ...createdMessage.toJSON(), content: message });

    if (!this.fhSocket.server.sockets.adapter.rooms[to]) {
      const name = [from.givenName, from.familyName]
        .filter((x) => !!x)
        .join(' ');
      this.tgbotService.sendMessageToUser(
        to,
        '<b>' + name + ' schreibt:</b>\n' + message,
      );
    }

    const { _id } = createdMessage;
    const encrypted = Array.from(
      (await this.encrypt(message, _id)).map((x) => x),
    );

    await this.messageModel.updateOne(
      { _id: _id },
      { $set: { content: encrypted } },
    );
  }
}
