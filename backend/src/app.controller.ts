import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiResponse({ description: 'Returns Hi' })
  @Get()
  hi(): string {
    return `Hi`;
  }
}
