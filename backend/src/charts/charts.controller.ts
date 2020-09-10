import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { ChartsService } from './charts.service';

@Controller('charts')
export class ChartsController {
  constructor(private readonly chatService: ChartsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('')
  async getCharts(@FHUser() user: IUser): Promise<any> {
    return this.chatService.getCharts(user._id);
  }

  @Get('test')
  async getChartsTest(): Promise<any> {
    return this.chatService.getCharts('5f4668c0e00c280e3a68c95c');
  }
}
