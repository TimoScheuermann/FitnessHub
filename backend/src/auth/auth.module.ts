import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GitHubStrategy } from 'src/auth/strategies/github.strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdobeStrategy } from './strategies/adobe.strategy';
import { AmazonStrategy } from './strategies/amazon.strategy';
import { FitBitStrategy } from './strategies/fitbit.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { SteamStrategy } from './strategies/steam.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GitHubStrategy,
    AdobeStrategy,
    AmazonStrategy,
    SteamStrategy,
    FitBitStrategy,
  ],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configServive: ConfigService) => {
        return {
          secret: configServive.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '5h',
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
