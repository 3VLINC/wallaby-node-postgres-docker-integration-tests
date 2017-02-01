import { db } from './db';
import { SampleComponent } from './sample';
import { expect } from 'chai';

describe('Sample', () => {
  
  it('should create a user and an event', async () => {

    const result = await SampleComponent.createUser({ username: 'Dan', password: 'Password' });
    const event = await result.$relatedQuery('events').first();
    expect(result).to.contain({username:'Dan'});
    expect(event).to.contain({name: 'My Event'});



  });

});