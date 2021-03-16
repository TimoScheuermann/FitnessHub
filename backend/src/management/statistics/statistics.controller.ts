import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from 'src/auth/roles.guard';
import { IGeneralStatistics } from './interfaces/IGeneralStatistics';
import { ILoginProviderStatistic } from './interfaces/ILoginProviderStatistic';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  /**
   * returns general statistics of fitnesshub
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/general')
  async getGeneralStatistics(): Promise<IGeneralStatistics[]> {
    return this.statisticsService.getGeneralStatistics();
  }

  /**
   * returns login provider statistics of fitnesshub
   */
  @Roles(['admin', 'moderator'])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/loginProvider')
  async getLoginProvider(): Promise<ILoginProviderStatistic[]> {
    return this.statisticsService.getLoginProvider();
  }
}
