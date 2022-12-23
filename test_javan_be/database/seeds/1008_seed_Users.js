import {
  Users,
} from '@averoa/models';
import bcrypt from 'bcrypt';
import { CommonHelper } from '@averoa/helpers';

// export const seed = Users.seeder.bind(Users, 50);

export const seed = Users.seederCustom.bind(Users, 1, async () => {
  const salt = await bcrypt.genSalt(10);
  const username = CommonHelper.alphaNumeric();
  const hashedPassword = await bcrypt.hash('12345', salt);
  const password = hashedPassword;
  return {
    salt, password, username, email: 'test@mail.com',
  };
});
