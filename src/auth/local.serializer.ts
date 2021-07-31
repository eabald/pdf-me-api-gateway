import { User } from '../users/interfaces/user.interface';
import { PassportSerializer } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(@Inject('USERS_SERVICE') private usersService: ClientProxy) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    const user = await this.usersService
      .send({ cmd: 'users-get-by-id' }, userId)
      .toPromise();
    done(null, user);
  }
}
