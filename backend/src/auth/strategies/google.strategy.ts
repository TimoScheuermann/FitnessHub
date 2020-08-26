import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService, Provider } from 'src/auth/auth.service';
import { IUser } from 'src/user/interfaces/IUser';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    configServive: ConfigService,
  ) {
    super({
      clientID: configServive.get('GOOGLE_CLIENT_ID'),
      clientSecret: configServive.get('GOOGLE_SECRET'),
      callbackURL: `${configServive.get('CALLBACK')}google/callback`,
      passReqToCallback: true,
      scope: ['profile'],
    });
  }

  async validate(
    _request: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, photos } = profile;
      const user: IUser = {
        avatar: photos[0].value,
        familyName: name.familyName,
        givenName: name.givenName,
        thirdPartyId: `${profile.id}`,
        provider: Provider.GOOGLE,
      };

      const jwt = await this.authService.validateOAuthLogin(user);
      done(null, { jwt });
    } catch (error) {
      done(error, false);
    }
  }
}
