import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  hi(): string {
    return 'hi';
  }
}
