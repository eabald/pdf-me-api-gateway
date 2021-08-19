import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateTemplateDto,
  RequestWithUser,
  UpdateTemplateDto,
} from '@pdf-me/shared';
import { CookieAuthenticationGuard } from 'src/auth/cookieAuthentication.guard';
import { RpcExceptionFilter } from 'src/utils/rpcException.filter';

@Controller('templates')
export class TemplatesController {
  constructor(
    @Inject('TEMPLATES_SERVICE') private templatesService: ClientProxy,
  ) {}

  @UseGuards(CookieAuthenticationGuard)
  @UseFilters(RpcExceptionFilter)
  @Get()
  async getTemplatesList(@Req() request: RequestWithUser) {
    return await this.templatesService
      .send({ cmd: 'templates-get-by-user-id' }, request.user.id)
      .toPromise();
  }

  @UseGuards(CookieAuthenticationGuard)
  @UseFilters(RpcExceptionFilter)
  @Get('details/:id')
  async getTemplateDetails(@Param('id', ParseIntPipe) id: number) {
    return await this.templatesService
      .send({ cmd: 'templates-get-by-id' }, id)
      .toPromise();
  }

  @UseGuards(CookieAuthenticationGuard)
  @UseFilters(RpcExceptionFilter)
  @Post()
  async createTemplate(@Body() template: CreateTemplateDto) {
    return await this.templatesService
      .send({ cmd: 'templates-create' }, template)
      .toPromise();
  }

  @UseGuards(CookieAuthenticationGuard)
  @UseFilters(RpcExceptionFilter)
  @Put('update')
  async updateTemplate(@Body() updatedTemplate: UpdateTemplateDto) {
    return await this.templatesService
      .send({ cmd: 'templates-update' }, updatedTemplate)
      .toPromise();
  }

  @UseGuards(CookieAuthenticationGuard)
  @UseFilters(RpcExceptionFilter)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return await this.templatesService
      .send({ cmd: 'templates-delete' }, id)
      .toPromise();
  }
}
