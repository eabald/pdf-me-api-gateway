import {
  Controller,
  HttpCode,
  UseGuards,
  Post,
  Req,
  UseFilters,
  Inject,
  Body,
  Get,
} from '@nestjs/common';
import { LogInWithCredentialsGuard } from './logInWithCredentials.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { RpcExceptionFilter } from '../utils/rpcException.filter';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { CookieAuthenticationGuard } from './cookieAuthentication.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private authenticationService: ClientProxy,
  ) {}

  @Post('register')
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
  @UseGuards(CookieAuthenticationGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
