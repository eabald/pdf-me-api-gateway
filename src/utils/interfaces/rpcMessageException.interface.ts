import { RpcException } from '@nestjs/microservices';

export interface RpcMessageException extends RpcException {
  getError: () => {
    message: string;
    statusCode: number;
  };
}
