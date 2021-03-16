import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

type LoginRequest = Request & { user: { jwt: string } };

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(): void {
    // initiates the google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: LoginRequest, @Res() res: Response): void {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin(): void {
    // initiates the github OAuth2 login flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubLoginCallback(@Req() req: LoginRequest, @Res() res: Response): void {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }

  @Get('adobe')
  @UseGuards(AuthGuard('adobe'))
  adobeLogin(): void {
    // initiates the adobe OAuth2 login flow
  }

  @Get('adobe/callback')
  @UseGuards(AuthGuard('adobe'))
  adobeLoginCallback(@Req() req: LoginRequest, @Res() res: Response): void {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }

  @Get('amazon')
  @UseGuards(AuthGuard('amazon'))
  amazonLogin(): void {
    // initiates the amazon OAuth2 login flow
  }

  @Get('amazon/callback')
  @UseGuards(AuthGuard('amazon'))
  amazonLoginCallback(@Req() req: LoginRequest, @Res() res: Response): void {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }

  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  steamLogin(): void {
    // initiates the steam OAuth2 login flow
  }

  @Get('steam/callback')
  @UseGuards(AuthGuard('steam'))
  steamLoginCallback(@Req() req: LoginRequest, @Res() res: Response): void {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }

  @Get('fitbit')
  @UseGuards(AuthGuard('fitbit'))
  fitbitLogin(): void {
    // initiates the fitbit OAuth2 login flow
  }

  @Get('fitbit/callback')
  @UseGuards(AuthGuard('fitbit'))
  fitbitLoginCallback(@Req() req: LoginRequest, @Res() res: Response): void {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }
}
