import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import { IUserInfo } from './interfaces/IUserInfo';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('verify')
  validateUser(): boolean {
    return true;
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

  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('suspended')
  async getSuspendedUsers(): Promise<IUserInfo[]> {
    return this.userService.getSuspendedUser();
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('suspend/:id/:time')
  async suspendUser(
    @Param('id') userId: string,
    @Param('time') time: number,
  ): Promise<void> {
    await this.userService.suspendUser(userId, time);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('suspend/:id')
  async pardonUser(@Param('id') userId: string): Promise<void> {
    await this.userService.pardonUser(userId);
  }

  @Get(':id')
  async getUserDetails(@Param('id') id: string): Promise<IUserInfo> {
    return this.userService.getUserInfoById(id);
  }
}
