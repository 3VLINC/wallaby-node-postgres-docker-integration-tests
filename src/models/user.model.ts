import { Model } from 'objection';
import { join } from 'path';

interface User {
  readonly id?: number;
  username: string;
  password: string;
};

export default class UserModel extends Model implements User {

  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: [ 'username', 'password' ],
    properties: {
      id: { type: 'integer' },
      username: { type: 'string' },
      password: { type: 'string' }

    }
  };

  static relationMappings = {
    events: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'event.model'),
      join: {
        from: 'users.id',
        through: {
          from: 'eventUsers.userId',
          to: 'eventUsers.eventId',
          extra: ['role']
        },
        to: 'events.id'
      }
    }
  };

  readonly id?: number;
  username: string;
  password: string;

}
