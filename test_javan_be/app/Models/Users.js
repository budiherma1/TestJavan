import { Model } from '@averoa/utilities';

class Users extends Model {
  static tableName = 'users';

  static timestamp = true;

  static column = {
    id: {
      migration: (m) => m.table.increments(m.column).primary(),
      flag: { required: false },
    },
    fullname: {
      migration: (m) => m.table.string('fullname', 255).nullable(),
      seed: (f) => f.name.firstName(),
      flag: { required: false },
    },
    username: {
      migration: (m) => m.table.string('username', 255).notNullable(),
      seed: (f) => f.internet.userName(this.column.fullname.value),
      flag: { unique: true, required: false },
      validation: [{ run: (v) => v.validator.isAlphanumeric(v.value), msg: 'isAlphanumeric format required' }],
    },
    email: {
      migration: (m) => m.table.string('email', 255).notNullable(),
      seed: (f) => f.internet.email(this.column.fullname.value),
      flag: { unique: true },
      validation: [{ run: (v) => v.validator.isEmail(v.value), msg: 'email format required' }],
    },
    password: {
      migration: (m) => m.table.string('password', 255).notNullable(),
      seed: (f) => this.column.fullname.value,
      // validation: [{ run: (v) => v.validator.isEmail(v.value), msg: 'email format required' }],
    },
    salt: {
      flag: { required: false },
      migration: (m) => m.table.string('salt', 255).notNullable(),
      seed: (f) => this.column.fullname.value,
      // validation: [{ run: (v) => v.validator.isEmail(v.value), msg: 'email format required' }],
    },
    refresh_token: {
      flag: { required: false },
      migration: (m) => m.table.string('refresh_token', 255).nullable(),
      seed: (f) => f.name.firstName(),
      // validation: [{ run: (v) => v.validator.isEmail(v.value), msg: 'email format required' }],
    },
    reset_password_token: {
      flag: { required: false },
      migration: (m) => m.table.string('reset_password_token', 255).nullable(),
      seed: (f) => f.name.firstName(),
      // validation: [{ run: (v) => v.validator.isEmail(v.value), msg: 'email format required' }],
    },
    is_verified: {
      flag: { required: false },
      migration: (m) => m.table.integer('is_verified', 11).defaultTo('0').notNullable(),
      seed: (f) => f.datatype.boolean(),
      validation: [{ run: (v) => v.validator.isNumeric(v.value), msg: 'isNumeric format required' }],
    },
    status: {
      flag: { required: false },
      migration: (m) => m.table.tinyint('status', 4).defaultTo('0').nullable().comment('0: non active, 1: active, 2: banned'),
      seed: (f) => f.datatype.number({ min: 0, max: 2 }),
      validation: [{ run: (v) => v.validator.isNumeric(v.value), msg: 'isNumeric format required' }],
    },
  };
}

export default Users;
