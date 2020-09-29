import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { FitbitOAuth2Strategy } from 'passport-fitbit-oauth2';
import { AuthService, Provider } from 'src/auth/auth.service';
import { IUser } from 'src/user/interfaces/IUser';

@Injectable()
export class FitBitStrategy extends PassportStrategy(
  FitbitOAuth2Strategy,
  'fitbit',
) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FITBIT_CLIENT_ID'),
      clientSecret: configService.get<string>('FITBIT_SECRET'),
      callbackURL: `${configService.get<string>('CALLBACK')}fitbit/callback`,
      scope: ['profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      const data = profile._json.user;
      const user: IUser = {
        avatar: data.avatar640 || data.avatar150 || data.avatar,
        givenName: data.firstName,
        familyName: data.lastName,
        thirdPartyId: `${profile.id}`,
        provider: Provider.FITBIT,
      };
      const jwt = await this.authService.validateOAuthLogin(user);
      done(null, { jwt });
    } catch (error) {
      done(error, false);
    }
  }
}
