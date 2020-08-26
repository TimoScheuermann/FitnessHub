import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { IUser } from 'src/user/interfaces/IUser';
import { UserService } from 'src/user/user.service';

export enum Provider {
  GOOGLE = 'google',
  GITHUB = 'github',
  AMAZON = 'amazon',
  ADOBE = 'adobe',
  STEAM = 'steam',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public redirect(jwt: any, res: Response): void {
    res.redirect(`${this.configService.get('REDIRECT')}?fpToken=${jwt}`);
  }

  async validateOAuthLogin(u: IUser): Promise<string> {
    try {
      const user: IUser = await (await this.userService.signIn(u)).toObject();
      return this.jwtService.sign(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'validateOAuthLogin',
        error.message,
      );
    }
  }
}
