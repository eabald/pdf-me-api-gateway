// import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import Strategy from 'passport-headerapikey';
@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(
    @Inject('AUTH_SERVICE') private authenticationService: ClientProxy,
  ) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      const user = await authenticationService
        .send({ cmd: 'auth-validate-api-key' }, apiKey)
        .toPromise();
      console.log(user);
      if (!user) {
        return done(new UnauthorizedException(), null);
      }
      return done(null, user);
    });
  }
}
