import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-outlook';
import { AuthService, Provider } from 'src/auth/auth.service';
import { IUser } from 'src/user/interfaces/IUser';

@Injectable()
export class OutlookStrategy extends PassportStrategy(Strategy, 'outlook') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('OUTLOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('OUTLOOK_SECRET'),
      callbackURL: `${configService.get<string>('CALLBACK')}outlook/callback`,
      scope: ['user.readBasic.all'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      const user: IUser = {
        avatar: '',
        familyName: '',
        givenName: profile.DisplayName,
        thirdPartyId: profile.id,
        provider: Provider.OUTLOOK,
      };
      console.log('at', accessToken);
      console.log('rt', refreshToken);
      console.log('Profile', profile);

      //   const jwt = await this.authService.validateOAuthLogin(user);
      done(null, { user });
    } catch (error) {
      done(error, false);
    }
  }
}
