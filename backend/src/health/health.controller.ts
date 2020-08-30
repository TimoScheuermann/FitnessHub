import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import FPUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { HealthService, HealthType } from './health.service';
import { IHealth } from './interfaces/IHealth';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async getAllHealthData(@FPUser() user: IUser): Promise<IHealth[]> {
    return this.healthService.getAllHealthData(user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':type')
  async addHealthDataFor(
    @FPUser() user: IUser,
    @Param('type') type: HealthType,
    @Body() body,
  ): Promise<void> {
    this.healthService.addHealthData(user._id, type, body.value);
  }
}
