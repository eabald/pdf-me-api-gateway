import {
  Controller,
  Inject,
  Post,
  Body,
  Req,
  Param,
  Get,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DocumentDataDto, RequestWithUser } from '@pdf-me/shared';
import { Response } from 'express';
import { RpcExceptionFilter } from 'src/utils/rpcException.filter';
import { ApiKeyGuard } from '../auth/api-key.guard';
@Controller('files')
export class FilesController {
  constructor(
    @Inject('FILES_SERVICE') private filsesService: ClientProxy,
    @Inject('DOCUMENTS_SERVICE') private documentsService: ClientProxy,
  ) {}

  @Post('generate')
  @UseGuards(ApiKeyGuard)
  @UseFilters(RpcExceptionFilter)
  async generateFile(
    @Body() fileData: DocumentDataDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.documentsService
      .send(
        { cmd: 'document-generation-generate' },
        { ...fileData, userId: request.user.id },
      )
      .toPromise();
  }

  @Get('/:filename')
  @UseGuards(ApiKeyGuard)
  @UseFilters(RpcExceptionFilter)
  async getFile(@Param() params, @Res() res: Response) {
    console.log(params);
    const file = await this.filsesService
      .send({ cmd: 'files-get-file' }, params.filename)
      .toPromise();
    file.pipe(res);
  }
}
