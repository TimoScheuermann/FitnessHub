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
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from './interfaces/IUser';
import { IUserInfo } from './interfaces/IUserInfo';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * verfifys a users authenticaton
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('verify')
  validateUser(): boolean {
    return true;
  }

  /**
   * returns a list of users matching the query
   * @param body {query: string} search query
   */
  @Post('search')
  async findUser(@Body() body: any): Promise<IUserInfo[]> {
    return this.userService.find(body.query);
  }

  /**
   * returns a list of users in group moderator
   */
  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('moderators')
  async getModerators(): Promise<IUserInfo[]> {
    return this.userService.getModerators();
  }

  /**
   * returns a list of users suspended from logging into their account
   */
  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('suspended')
  async getSuspendedUsers(): Promise<IUserInfo[]> {
    return this.userService.getSuspendedUser();
  }

  /**
   * suspends a user until a specific date
   * @param userId suspender user
   * @param time date untill pardon
   * @param suspender suspender
   */
  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('suspend/:id/:time')
  async suspendUser(
    @Param('id') userId: string,
    @Param('time') time: number,
    @FHUser() suspender: IUser,
  ): Promise<void> {
    await this.userService.suspendUser(suspender, userId, time);
  }

  /**
   * pardons a user and reenables its account
   * @param userId string
   */
  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('suspend/:id')
  async pardonUser(@Param('id') userId: string): Promise<void> {
    await this.userService.pardonUser(userId);
  }

  /**
   * returns further information about a specific user ID
   * @param id
   */
  @Get(':id')
  async getUserDetails(@Param('id') id: string): Promise<IUserInfo> {
    return this.userService.getUserInfoById(id);
  }
}
