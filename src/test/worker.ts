import * as proc from 'child_process';
import * as path from 'path';
import * as readline from 'readline';
import * as knex from 'knex';
import { find, map } from 'lodash';
import * as knexCleaner from 'knex-cleaner';

const config = {
  test_runner: 'wallaby',
  node_env: 'test',
  app_db_host: 'localhost',
  app_db_name: 'app',
  app_db_user: 'appuser',
  app_db_password: 'apppass'
};

const spawn = proc.spawn;
const exec = proc.exec;

export class Worker {

  private _db: knex;

  constructor(private _workerId: number) {

  }

  get dockerContainer() {

    return 'db-test-'+this._workerId;

  }

  get dockerPort() {

    return 5433 + this._workerId;

  }

  get workerId() {

    return this._workerId;

  }

  get db() {

    return this._db;

  }

  private async stp() {

    return new Promise(async (resolve, reject) => {

      const stopProcess = await exec(`docker stop ${this.dockerContainer}`);

      readline.createInterface({
        input     : stopProcess.stdout
      }).on('line', (line) => {
        
        console.log(`stopped ${this.dockerContainer}`);

        if (line.toString() === this.dockerContainer) {
          
          resolve(true);

        }

        reject(line);

      });

      readline.createInterface({
        input     : stopProcess.stderr
      }).on('line', (line) => {
        
        console.log(`already stopped ${this.dockerContainer}`);

        if (line.toString() === `Error response from daemon: No such container: ${this.dockerContainer}`) {

          resolve(true);

        }

        reject(line);

      });

    });

  }

  private async rm() {

    return new Promise(async (resolve, reject) => {

      const removeProcess = await exec(`docker container rm ${this.dockerContainer} -v`);

      readline.createInterface({
        input     : removeProcess.stdout
      }).on('line', (line) => {
          
        console.log(`removed ${this.dockerContainer}`);

        if (line.toString() === this.dockerContainer) {
          
          resolve(true);

        }

        reject(line);

      });

      readline.createInterface({
        input     : removeProcess.stderr
      }).on('line', (line) => {
          
        console.log(`already removed ${this.dockerContainer}`);

        if (
          line.toString() === `Error response from daemon: No such container: ${this.dockerContainer}` ||
          line.toString() === `Error response from daemon: removal of container ${this.dockerContainer} is already in progress`
        ) {

          resolve(true);

        }

        reject(line);

      });

    });

  }

  private async create() {

    return new Promise(
      async(resolve, reject) => {

        const dockerProcess = exec(
          `docker create --name ${this.dockerContainer} -p ${this.dockerPort}:5432 -e POSTGRES_DB=${config.app_db_name} -e POSTGRES_USER=${config.app_db_user} -e POSTGRES_PASSWORD=${config.app_db_password} postgres:9.6.1`
        );

        readline.createInterface({
          input     : dockerProcess.stdout
        }).on('line', (line) => {
          
          console.log(`created ${this.dockerContainer}`);
          resolve(true);

        });

        readline.createInterface({
          input     : dockerProcess.stderr
        }).on('line', (line) => {
          
          reject(line);

        });
        
    });

  }

  private async start() {

    return new Promise(
      (resolve, reject) => {

        const args = ['start', '-ia', this.dockerContainer];

        const dockerProcess = spawn(`docker`, args);

        const ref = readline.createInterface({
          input     : dockerProcess.stdout
        }).on('line', async (line) => {

          console.log(line);

          if(-1 !== line.indexOf('LOG:  database system is ready to accept connections')) {

            ref.close();
            
            resolve(true);

          }

        });

      });

  }

  private getDbConn() {

    const knexConfig = {
        host: 'localhost',
        user: config.app_db_user,
        password: config.app_db_password,
        database: config.app_db_name,
        port: this.dockerPort
    };

    return knex({
      client: 'pg',
      connection: knexConfig,
      searchPath: 'public',
      migrations: {
        tableName: 'migrations',
        directory: path.resolve(__dirname, './../migrations'),
      },
      pool: { min: 0, max: 10 }
    });

  }

  private async initDb() {

    function destroy(db: knex) {

      return new Promise((resolve, reject) => {

        try {

          db.destroy(() => {
          
            resolve();

          });
          
        } catch(e) {

          reject();

        }        

      });

    }

    const utilConn = this.getDbConn();

    if (this._db) {

      await utilConn.raw(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname='${config.app_db_name}' AND pid <> pg_backend_pid();`);

    }

    this._db = utilConn;
    
  }

  private waitForConnection() {

    async function retry(db, resolve, reject, retries = 0) {

      try {

        const result = await db.raw('select pg_backend_pid();');

        console.log('postgres pid is', result.rows[0].pg_backend_pid);

        resolve();

      } catch(e) {

        console.log(e);

        if (retries < 10) {

          setTimeout(
            () => {
              return retry(db, resolve, reject, (retries + 1))
            },
            1000
          );

        } else {
          
          reject('Connection couldnt be made after 10 retries');

        }
        
      }

    }

    return new Promise(async (resolve, reject) => {

      retry(this.db, resolve, reject);

    });

  }

  private async clean() {
    
    // Do reset()

    const result = await this.db.raw(`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';`);

    if (result.rows.length > 0) {

      const tables = map(result.rows, (row: any) => {
        
        return row.tablename;

      });

      await this.db.raw('DROP TABLE IF EXISTS ' + tables.join(",") + ' CASCADE');

    }  

  }

  private async migrate() {
    
      try {
      
        return this.db.migrate.latest();

      } catch (e) {

        console.log(e);

      }

  }

  public async setup() {

    try {

      await this.stp();

      await this.rm();

      await this.create();

      await this.start();

    } catch (e) {
      
      console.log(e);
      return Promise.reject(e);

    } 

  }

  public async initialize() {

    try {
      
      await this.initDb();

      await this.waitForConnection();

      await this.clean();

      await this.migrate();

    } catch (e) {

      console.log(e);
      return Promise.reject(e);

    }

  }

}