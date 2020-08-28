import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import FPUser from 'src/auth/user.decorator';
import { ITrainingplan } from 'src/trainingplan/interfaces/ITrainingplan';
import { TrainingplanService } from 'src/trainingplan/trainingplan.service';
import { IUser } from './interfaces/IUser';
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('plans')
  async getUsersPlan(@FPUser() user: IUser): Promise<ITrainingplan[]> {
    return this.trainingplanService.getPlansOfUser(user._id);
  }

  @Post('search')
  async findUser(@Body() body: any): Promise<IUserInfo[]> {
    return this.userService.find(body.query);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('moderators')
  async getModerators(): Promise<IUserInfo[]> {
    return this.userService.getModerators();
  }

  @Get(':id')
  async getUserDetails(@Param('id') id: string): Promise<IUserInfo> {
    return this.userService.getUserInfoById(id);
  }
}
