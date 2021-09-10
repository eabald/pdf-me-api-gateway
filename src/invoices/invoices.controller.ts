import {
  Controller,
  Get,
  Inject,
  Req,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CookieAuthenticationGuard } from 'src/auth/cookieAuthentication.guard';
import { RpcExceptionFilter } from 'src/utils/rpcException.filter';
import { RequestWithUser } from '@pdf-me/shared';

@Controller('invoices')
export class InvoicesController {
  constructor(
    @Inject('INVOICES_SERVICE') private invoicesService: ClientProxy,
  ) {}

  @UseGuards(CookieAuthenticationGuard)
  @UseFilters(RpcExceptionFilter)
  @Get()
  async getTemplatesList(@Req() request: RequestWithUser) {
    return await this.invoicesService
      .send({ cmd: 'payments-invoice-by-user' }, request.user.id)
      .toPromise();
  }
}
