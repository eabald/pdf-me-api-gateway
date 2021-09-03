import {
  Controller,
  Inject,
  UseFilters,
  Post,
  Headers,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RpcExceptionFilter } from '../utils/rpcException.filter';
import { RequestWithRawBody } from '../utils/interfaces/requestWithRawBody.interface';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    @Inject('PAYMENTS_SERVICE') private paymentsService: ClientProxy,
  ) {}

  @UseFilters(RpcExceptionFilter)
  @Post('payment')
  async paymentWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    return await this.paymentsService.send(
      { cmd: 'payments-update-status' },
      { signature, payload: request.rawBody },
    );
  }
}
