import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import FPUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { InboxService } from './inbox.service';
import { IInbox } from './interfaces/IInbox';
import { ITotalMessages } from './interfaces/ITotalMessages';

@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getInbox(@FPUser() user: IUser): Promise<IInbox[]> {
    return this.inboxService.getInbox(user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(
    @FPUser() user: IUser,
    @Param('id') inboxId: string,
  ): Promise<void> {
    this.inboxService.remove(user._id, inboxId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('total')
  async getTotalMessages(@FPUser() user: IUser): Promise<ITotalMessages> {
    return this.inboxService.getTotalMessages(user._id);
  }
}
