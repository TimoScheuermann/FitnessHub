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
  FITBIT = 'fitbit',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public redirect(jwt: any, res: Response): void {
    /**
     * redirect to suspension view
     */
    if (jwt.suspended) {
      res.redirect(
        `${this.configService.get('REDIRECT')}profile/suspended?t=${
          jwt.suspended
        }`,
      );
      /**
       * redirect to fitnesshub with token
       */
    } else if (jwt.token) {
      res.send(
        `<script>window.opener.postMessage('tlt=${jwt}', '*');window.close();self.close();</script>`,
      );
      // res.redirect(
      //   `${this.configService.get('REDIRECT')}?fhToken=${jwt.token}`,
      // );
    }
  }

  async validateOAuthLogin(u: IUser): Promise<any> {
    try {
      const user: IUser = await (await this.userService.signIn(u)).toObject();
      // check if user is stil suspended
      if (user.suspended && user.suspended > new Date().getTime()) {
        return { suspended: user.suspended };
        // suspension time is over => pardon
      } else {
        await this.userService.pardonUser(user._id);
      }
      // return token
      return { token: this.jwtService.sign(user) };
    } catch (error) {
      throw new InternalServerErrorException(
        'validateOAuthLogin',
        error.message,
      );
    }
  }
}
