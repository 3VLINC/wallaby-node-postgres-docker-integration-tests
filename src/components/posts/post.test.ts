import { db } from '../../db';
import { PostComponent } from './post';
import { expect } from 'chai';

describe('Post', () => {
  
  it('should insert a post', async () => {

    const result = await PostComponent.create('post5', 'post1 content');

    console.log(result);

    expect(result[0]).to.contain({name:'post3'});

  });

});