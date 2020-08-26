import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-adobe-oauth2';
import { AuthService } from 'src/auth/auth.service';

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
      scope: ['openid'],
    });
  }

  async validate(
    _request: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      //   const { username, photos, id } = profile;
      //   const user: IUser = {
      //     avatar: photos[0].value,
      //     familyName: '',
      //     givenName: username,
      //     thirdPartyId: id,
      //     provider: Provider.GITHUB,
      //   };

      console.log(profile);
      //   const jwt = await this.authService.validateOAuthLogin(user);
      done(null, { profile });
    } catch (error) {
      done(error, false);
    }
  }
}
