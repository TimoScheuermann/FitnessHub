import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import { IGeneralStatistics } from './interfaces/IGeneralStatistics';
import { ILoginProviderStatistic } from './interfaces/ILoginProviderStatistic';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/general')
  async getGeneralStatistics(): Promise<IGeneralStatistics> {
    return this.statisticsService.getGeneralStatistics();
  }

  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/loginProvider')
  async getLoginProvider(): Promise<ILoginProviderStatistic[]> {
    return this.statisticsService.getLoginProvider();
  }
}
