import * as objection from 'objection';
import { db } from './db';
import UserModel from './models/user.model';

export class UsernameTakenError extends Error {
  constructor(name: string) {
    super(`The username ${name} is already taken.`);
  }
}

export class SampleComponent {

  static async createUser(user: any) {

    const trx = await objection.transaction.start(UserModel.knex());

    try {

      const foundUser = await UserModel.query(trx).where({ username: user.username }).first();

      if (foundUser) { throw new UsernameTakenError(user.username); }

      const createdUser = await UserModel.query(trx).insert(user);

      await createdUser.$relatedQuery('events').insert({name: 'My Event', role: 'eventDirector'});

      trx.commit();

      return createdUser;

    } catch (e) {

      trx.rollback();

      throw e;

    }
    
  }

}