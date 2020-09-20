import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AvailableSetting, SettingService } from './setting.service';

export const FHSetting = (setting: AvailableSetting) =>
  SetMetadata('setting', setting);

@Injectable()
export class SettingGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly settingService: SettingService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const setting = this.reflector.get<AvailableSetting>(
      'setting',
      context.getHandler(),
    );

    if (!setting) return false;

    const ctx = context.switchToHttp();
    const req = ctx.getRequest() as Request;
    const target = req.params['userId'];
    if (!target) return false;
    return this.settingService.isAllowing(target, setting);
  }
}
