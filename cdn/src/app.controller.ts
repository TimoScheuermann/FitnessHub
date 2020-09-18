import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  cdn(): string {
    return 'CDN';
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':asset')
  getAsset(@Param('asset') asset: string, @Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', asset));
  }
}
