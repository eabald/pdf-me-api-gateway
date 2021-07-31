import { Request } from 'express';
import { User } from '../../users/interfaces/user.interface';

export interface RequestWithUser extends Request {
  user: User;
}
