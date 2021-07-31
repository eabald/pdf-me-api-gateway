import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private authenticationService: ClientProxy,
  ) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string) {
    return this.authenticationService
      .send({ cmd: 'auth-get-authenticated-user' }, { email, password })
      .toPromise();
  }
}
