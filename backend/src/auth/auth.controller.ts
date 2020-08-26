import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: any, @Res() res) {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // initiates the github OAuth2 login flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubLoginCallback(@Req() req: any, @Res() res) {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }

  @Get('adobe')
  @UseGuards(AuthGuard('adobe'))
  adobeLogin() {
    // initiates the adobe OAuth2 login flow
  }

  @Get('adobe/callback')
  @UseGuards(AuthGuard('adobe'))
  adobeLoginCallback(@Req() req: any, @Res() res) {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }

  @Get('amazon')
  @UseGuards(AuthGuard('amazon'))
  amazonLogin() {
    // initiates the amazon OAuth2 login flow
  }

  @Get('amazon/callback')
  @UseGuards(AuthGuard('amazon'))
  amazonLoginCallback(@Req() req: any, @Res() res) {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }

  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  steamLogin() {
    // initiates the steam OAuth2 login flow
  }

  @Get('steam/callback')
  @UseGuards(AuthGuard('steam'))
  steamLoginCallback(@Req() req: any, @Res() res) {
    const jwt: string = req.user.jwt;
    this.authService.redirect(jwt, res);
  }
}
