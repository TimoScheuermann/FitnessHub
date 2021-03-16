import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import { UserService } from 'src/user/user.service';

@ApiTags('Promote')
@Controller('promote')
export class PromoteController {
  constructor(private readonly userService: UserService) {}

  /**
   * Promotes a user to moderator
   * @param promoter user
   * @param id new moderator (user id)
   */
  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('moderator/:id')
  async toModerator(@Param('id') id: string): Promise<void> {
    this.userService.promoteTo(id, 'Moderator');
  }

  /**
   * Promotes a user back to user
   * @param promoter user
   * @param id old moderator (user id)
   */
  @Roles(['admin'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('user/:id')
  async toUser(@Param('id') id: string): Promise<void> {
    this.userService.promoteTo(id, 'User');
  }
}
