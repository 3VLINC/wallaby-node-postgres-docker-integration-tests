import { Model } from 'objection';
import { join } from 'path';

interface Event {
  readonly id?: number;
  name: string;
}

export default class EventModel extends Model implements Event {

  static tableName = 'events';

  static jsonSchema = {
    type: 'object',
    required: [ 'name' ],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' }
    }
  };

  static relationMappings = {
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'user.model'),
      join: {
        from: 'events.id',
        through: {
          from: 'eventUsers.eventId',
          to: 'eventUsers.userId',
          extra: ['role']
        },
        to: 'users.id'
      }
    }
  };

  readonly id?: number;
  name: string;

}
