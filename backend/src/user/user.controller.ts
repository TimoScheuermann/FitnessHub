import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { ITrainingplan } from 'src/trainingplan/interfaces/ITrainingplan';
import { TrainingplanService } from 'src/trainingplan/trainingplan.service';
import { IUserInfo } from './interfaces/IUserInfo';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly trainingplanService: TrainingplanService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('verify')
  validateUser(): boolean {
    return true;
  }

  @Get(':id')
  async getUserDetails(@Param('id') id: string): Promise<IUserInfo> {
    const user = await this.userService.getUserById(id);
    return {
      username: [user.givenName, user.familyName].filter(x => !!x).join(' '),
      avatar: user.avatar,
    };
  }

  @Get(':id/plans')
  async getUsersPlan(@Param('id') id: string): Promise<ITrainingplan[]> {
    return this.trainingplanService.getPlansOfUser(id);
  }
}
