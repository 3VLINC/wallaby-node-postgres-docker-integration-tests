import { db } from '../../db';

export class PostComponent {

  static async create(name, body) {

    return await db('posts').returning(['id', 'name','body']).insert({name, body});

  }

}