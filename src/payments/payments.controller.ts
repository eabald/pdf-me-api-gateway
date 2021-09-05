import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
  UseFilters,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CookieAuthenticationGuard } from '../auth/cookieAuthentication.guard';
import { CreatePaymentApiDto, RequestWithUser } from '@pdf-me/shared';
import { RpcExceptionFilter } from '../utils/rpcException.filter';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject('PAYMENTS_SERVICE') private paymentsService: ClientProxy,
  ) {}

  @Post('create-charge')
  @UseFilters(RpcExceptionFilter)
  @UseGuards(CookieAuthenticationGuard)
  async createCharge(
    @Body() charge: CreatePaymentApiDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.paymentsService
      .send(
        { cmd: 'payments-create-payment' },
        {
          ...charge,
          userId: request.user.id,
          customerId: request.user.stripeCustomerId,
        },
      )
      .toPromise();
  }

  @Post('add-credit-card')
  @UseFilters(RpcExceptionFilter)
  @UseGuards(CookieAuthenticationGuard)
  async addCreditCard(
    @Body('paymentMethodId') paymentMethodId: string,
    @Req() request: RequestWithUser,
  ) {
    return await this.paymentsService
      .send(
        { cmd: 'payments-add-credit-card' },
        { paymentMethodId, customerId: request.user.stripeCustomerId },
      )
      .toPromise();
  }

  @Get('credit-card')
  @UseFilters(RpcExceptionFilter)
  @UseGuards(CookieAuthenticationGuard)
  async getCreditCards(@Req() request: RequestWithUser) {
    return await this.paymentsService
      .send(
        { cmd: 'payments-list-credit-cards' },
        request.user.stripeCustomerId,
      )
      .toPromise();
  }

  @Post('default')
  @UseFilters(RpcExceptionFilter)
  @UseGuards(CookieAuthenticationGuard)
  async setDefaultCard(
    @Body('paymentMethodId') paymentMethodId: string,
    @Req() request: RequestWithUser,
  ) {
    return await this.paymentsService.send(
      { cmd: 'payments-set-default-credit-card' },
      {
        paymentMethodId,
        customerId: request.user.stripeCustomerId,
      },
    );
  }
}
