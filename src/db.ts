import * as knex from 'knex';
import * as path from 'path';

let db;

if (global['_wallabyWorker']) {

  db = global['_wallabyWorker'].db;

} else {

  const knexConfig = {
      host: process.env.APP_DB_HOST,
      user: process.env.APP_DB_USER,
      password: process.env.APP_DB_PASSWORD,
      database: process.env.APP_DB_NAME,
      port: process.env.APP_DB_PORT
  };

   db = knex({
    client: 'pg',
    connection: knexConfig,
    searchPath: 'public',
    migrations: {
      tableName: 'migrations',
      directory: path.resolve(__dirname, './migrations'),
    }
  });
}

export { db };
