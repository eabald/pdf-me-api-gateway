import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';
import { RpcMessageException } from '../utils/interfaces/rpcMessageException.interface';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcMessageException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const content = exception.getError();

    response.status(content.statusCode).json({
      statusCode: content.statusCode,
      message: content.message,
    });
  }
}
