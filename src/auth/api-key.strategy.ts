import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(
    @Inject('AUTH_SERVICE') private authenticationService: ClientProxy,
  ) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      const checkKey = await authenticationService
        .send({ cmd: 'auth-validate-api-key' }, apiKey)
        .toPromise();
      if (!checkKey) {
        return done(false);
      }
      return done(true);
    });
  }
}
