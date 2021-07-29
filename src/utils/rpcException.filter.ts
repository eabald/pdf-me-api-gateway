import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';
import { RpcMessageException } from '../utils/interfaces/rpcMessageException.interface';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcMessageException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { statusCode, message } = exception.getError();

    response.status(statusCode).json({ statusCode, message });
  }
}
