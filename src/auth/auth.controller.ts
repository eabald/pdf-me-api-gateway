import {
  Controller,
  HttpCode,
  UseGuards,
  Post,
  Req,
  UseFilters,
  Inject,
  Body,
} from '@nestjs/common';
import { LogInWithCredentialsGuard } from './logInWithCredentials.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { RpcExceptionFilter } from '../utils/rpcException.filter';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { CookieAuthenticationGuard } from './cookieAuthentication.guard';
import { ConfirmEmailDto } from './dto/confirmEmail.dto';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private authenticationService: ClientProxy,
  ) {}

  @Post('register')
  @UseFilters(RpcExceptionFilter)
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService
      .send({ cmd: 'auth-register' }, registrationData)
      .toPromise();
  }

  @HttpCode(200)
  @UseGuards(LogInWithCredentialsGuard)
  @UseFilters(RpcExceptionFilter)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(200)
  @UseFilters(RpcExceptionFilter)
  @UseGuards(CookieAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser) {
    request.logOut();
    request.session.cookie.maxAge = 0;
  }

  @Post('forget-password')
  @UseFilters(RpcExceptionFilter)
  async forgetPassword(@Body() email: ForgetPasswordDto) {
    return this.authenticationService
      .send({ cmd: 'auth-forget-password' }, email)
      .toPromise();
  }

  @Post('reset-password')
  @UseFilters(RpcExceptionFilter)
  async resetPassword(@Body() email: ResetPasswordDto) {
    return this.authenticationService
      .send({ cmd: 'auth-reset-password' }, email)
      .toPromise();
  }

  @Post('confirm-email')
  @UseFilters(RpcExceptionFilter)
  @UseGuards(JwtAuthenticationGuard)
  async confirmEmail(@Body() email: ConfirmEmailDto) {
    return this.authenticationService
      .send({ cmd: 'auth-confirm-email' }, email)
      .toPromise();
  }

  @Post('resend-email-confirm')
  @UseFilters(RpcExceptionFilter)
  @UseGuards(JwtAuthenticationGuard)
  async resendEmailConfirm(@Body() email: ConfirmEmailDto) {
    return this.authenticationService
      .send({ cmd: 'auth-resend-email-confirm' }, email)
      .toPromise();
  }
}
