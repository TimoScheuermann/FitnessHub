import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider } from 'src/auth/auth.service';
import { IUser } from './interfaces/IUser';
import { User } from './schemas/User.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async userExists(provider: Provider, thirdPartyId: number): Promise<boolean> {
    const users = await this.userModel.findOne({
      provider: provider,
      thirdPartyId: thirdPartyId,
    });

    return !!users.id;
  }

  async signIn(iuser: IUser): Promise<User> {
    const user: User = await this.getUserByOAuth(
      iuser.provider,
      iuser.thirdPartyId,
    );

    if (user) {
      await this.updateUser(user);
      return user;
    } else {
      const user = await this.userModel.create({
        ...iuser,
        date: new Date().getTime(),
        group: 'User',
      });
      return user;
    }
  }

  async updateUser(u: IUser) {
    const user = new this.userModel(u).toObject();
    delete user._id;
    this.userModel.findByIdAndUpdate(u._id, user);
  }

  async getUserByOAuth(
    provider: Provider,
    thirdPartyId: number | string,
  ): Promise<User> {
    return this.userModel.findOne({
      provider: provider,
      thirdPartyId: thirdPartyId,
    });
  }

  async getUserById(id: string): Promise<User> {
    return this.userModel.findOne({
      _id: id,
    });
  }
}
