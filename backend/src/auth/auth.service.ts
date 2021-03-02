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
    if (jwt.suspended) {
      /**
       * redirect to suspension view
       */
      res.render(
        'suspended',
        { timestamp: new Date(jwt.suspended).toLocaleDateString() },
        (_err, html) => {
          res.send(html);
        },
      );
    } else if (jwt.token) {
      /**
       * redirect to fitnesshub with token
       */
      res.send(
        `<script>window.opener.postMessage('fht=${jwt.token}', '*');window.close();self.close();</script>`,
      );
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
