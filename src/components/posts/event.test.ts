import { db } from '../../db';
import { EventComponent } from './event';
import { expect } from 'chai';

describe('Event', () => {
  
  it('should insert a post', async () => {

    const result = await EventComponent.create('post4');

    expect(result[0]).to.contain({name:'post4'});
    expect(result.length).to.eql(1);

  });
 
  it('should insert a seatingPlan', async () => {

    const result = await EventComponent.createSeatingPlan('My Plan');
    console.log(result);
    expect(result[0]).to.contain({name:'My Plan'});
    expect(result.length).to.eql(1);

  });

});