import {
  Controller,
  Inject,
  UseGuards,
  Req,
  Get,
  UseFilters,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequestWithUser } from '@eabald/pdf-me-shared';
import { RpcExceptionFilter } from '../utils/rpcException.filter';
import { CookieAuthenticationGuard } from '../auth/cookieAuthentication.guard';

@Controller('users')
export class UsersController {
  constructor(@Inject('LIMITS_SERVICE') private limitsService: ClientProxy) {}

  @Get('/limit')
  @UseFilters(RpcExceptionFilter)
  @UseGuards(CookieAuthenticationGuard)
  async getUserLimits(@Req() request: RequestWithUser) {
    return await this.limitsService
      .send({ cmd: 'limits-get-by-user' }, request.user.id)
      .toPromise();
  }
}
