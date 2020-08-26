import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-adobe-oauth2';
import { AuthService, Provider } from 'src/auth/auth.service';
import { IUser } from 'src/user/interfaces/IUser';

@Injectable()
export class AdobeStrategy extends PassportStrategy(Strategy, 'adobe') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('ADOBE_CLIENT_ID'),
      clientSecret: configService.get<string>('ADOBE_SECRET'),
      callbackURL: `${configService.get<string>('CALLBACK')}adobe/callback`,
      scope: ['openid', 'creative_sdk'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      const user: IUser = {
        avatar: '',
        familyName: profile._json.last_name,
        givenName: profile._json.first_name,
        thirdPartyId: `${profile.id}`,
        provider: Provider.ADOBE,
      };
      const jwt = await this.authService.validateOAuthLogin(user);
      done(null, { jwt });
    } catch (error) {
      done(error, false);
    }
  }
}
