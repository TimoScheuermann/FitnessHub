import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-amazon';
import { AuthService, Provider } from 'src/auth/auth.service';
import { IUser } from 'src/user/interfaces/IUser';

@Injectable()
export class AmazonStrategy extends PassportStrategy(Strategy, 'amazon') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('AMAZON_CLIENT_ID'),
      clientSecret: configService.get<string>('AMAZON_SECRET'),
      callbackURL: `${configService.get<string>('CALLBACK')}amazon/callback`,
      scope: ['profile:name'],
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
        familyName: '',
        givenName: profile.displayName,
        thirdPartyId: `${profile.id}`,
        provider: Provider.AMAZON,
      };
      const jwt = await this.authService.validateOAuthLogin(user);
      done(null, { jwt });
    } catch (error) {
      done(error, false);
    }
  }
}
