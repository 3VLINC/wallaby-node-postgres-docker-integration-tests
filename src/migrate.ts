import { db } from './db';

export async function migrate(tries = 0) {
  
  try {
  
    await db.migrate.latest();

  } catch (e) {

    console.log(e);
    if (e.error === 'the database system is starting up') {
      
      console.log('retry');

    }
    console.log(e);

  }

}