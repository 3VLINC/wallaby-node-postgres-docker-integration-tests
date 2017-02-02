import { db } from './db';
import { SampleComponent } from './sample';
import { expect } from 'chai';
import EventModel from './models/event.model';
import UserModel from './models/user.model';
import * as KnexCleaner from 'knex-cleaner';
import { Model } from 'objection';

describe('Sample', () => {
  
  async function numUsers() {

    const users = await UserModel.query();

    return users.length;

  }
  
  async function numEvents() {

    return await EventModel.query();

  }

  async function wait(numSec:number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), numSec);
    });
  }

  beforeEach(async () => {

    // console.log(await numUsers());
    // await KnexCleaner.clean(global['_wallabyWorker'].db, { ignoreTables: ['migrations', 'migrations_lock']});
    await global['_wallabyWorker'].db.raw(`BEGIN;DROP SCHEMA public CASCADE;CREATE SCHEMA public;COMMIT;`);

    await global['_wallabyWorker'].db.migrate.latest();
    // await wait(1000);
    // console.log(await numUsers());

    // done();

  });

  it('should create a user and an event', async () => {

    console.log(await numUsers());
    const result = await SampleComponent.createUser({ username: 'Dan', password: 'Password' });
    console.log(await numUsers());
    const user = await UserModel.query().where({username: result.username }).eager('events');
    console.log(user);
    // console.log(user);
    expect(result).to.contain({username:'Dan'});

    expect(user[0].events[0]).to.contain({name: 'My Event'});

  });

  it('should create a user and an event', async () => {

    const result = await SampleComponent.createUser({ username: 'Dan', password: 'Password' });
    
    const user = await UserModel.query().where({username: result.username }).eager('events');
    
    expect(result).to.contain({username:'Dan'});
    expect(user[0].events[0]).to.contain({name: 'My Event'});

  });

  it('should create a user and an event', async () => {

    const result = await SampleComponent.createUser({ username: 'Dann', password: 'Password' });
    console.log(result);
    const user = await UserModel.query().where({username: result.username }).eager('events');
    console.log(user);
    expect(result).to.contain({username:'Dann'});
    expect(user[0].events[0]).to.contain({name: 'My Event'});

  });

  // it('should create a user and an event', async () => {

  //   const result = await SampleComponent.createUser({ username: 'Dan', password: 'Password' });

  //   const user = await UserModel.query().where({username: result.username }).eager('events').first();
    
  //   expect(result).to.contain({username:'Dan'});
  //   expect(user.events[0]).to.contain({name: 'My Event'});

  // });

  // it('should create a user and an event', async () => {

  //   const result = await SampleComponent.createUser({ username: 'Dan', password: 'Password' });

  //   const user = await UserModel.query().where({username: result.username }).eager('events').first();
    
  //   expect(result).to.contain({username:'Dan'});
  //   expect(user.events[0]).to.contain({name: 'My Event'});

  // });
  
});