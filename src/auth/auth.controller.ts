import { Controller, Next, Post, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {
    return request.user;
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {}

  @Post('register')
  async register(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {}

  @Post('forgot-password')
  async forgotPassword(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {}

  @Post('reset-password')
  async resetPassword(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {}
}
