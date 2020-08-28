import { Injectable } from '@nestjs/common';
import { Provider } from 'src/auth/auth.service';
import { FriendsService } from 'src/friends/friends.service';
import { UserService } from 'src/user/user.service';
import { IGeneralStatistics } from './interfaces/IGeneralStatistics';
import { ILoginProviderStatistic } from './interfaces/ILoginProviderStatistic';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly userSerice: UserService,
    private readonly friendsService: FriendsService,
  ) {}

  async getGeneralStatistics(): Promise<IGeneralStatistics> {
    return {
      exercises: 0,
      friendships: await this.friendsService.getTotalFriendships(),
      users: await this.userSerice.getTotalUsers(),
      workouts: 0,
    };
  }

  async getLoginProvider(): Promise<ILoginProviderStatistic[]> {
    return Promise.all(
      Object.keys(Provider).map(async x => {
        return {
          provider: x,
          amount: await this.userSerice.getAmountByOAuth(Provider[x]),
        } as ILoginProviderStatistic;
      }),
    );
  }
}
