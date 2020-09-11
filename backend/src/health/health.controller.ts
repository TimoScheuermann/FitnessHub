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
import { RolesGuard } from 'src/auth/roles.guard';
import FHUser from 'src/auth/user.decorator';
import { IUser } from 'src/user/interfaces/IUser';
import { HealthService } from './health.service';
import { IHealth } from './interfaces/IHealth';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('weight')
  async getWeight(@FHUser() user: IUser): Promise<IHealth[]> {
    return this.healthService.getWeightData(user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('water')
  async getWater(@FHUser() user: IUser): Promise<IHealth[]> {
    return this.healthService.getWaterData(user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('weight')
  async addWeight(
    @FHUser() user: IUser,
    @Body() body: { amount: number },
  ): Promise<IHealth> {
    return this.healthService.addWeight(user._id, body.amount);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('water')
  async addWater(
    @FHUser() user: IUser,
    @Body() body: { amount: number },
  ): Promise<IHealth> {
    return this.healthService.addWater(user._id, body.amount);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteHealthDataFor(
    @FHUser() user: IUser,
    @Param('id') id: string,
  ): Promise<void> {
    this.healthService.deleteHealthData(user._id, id);
  }
}
