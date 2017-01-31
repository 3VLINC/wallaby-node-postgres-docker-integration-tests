import * as proc from 'child_process';
import * as path from 'path';
import * as readline from 'readline';
import { find } from 'lodash';
import * as knex from 'knex';

const spawn = proc.spawn;
const exec = proc.exec;

class Worker {

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

  get isSetup() {

    
    const result = find(global['_wallabyWorkers'], (worker: Worker) => {
      
      return worker.workerId === this.workerId;

    });

    if (result) {
      
      return true;

    }

    return false;

  }

  get db() {

    return this._db;

  }

  async stp() {

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

  async rm() {

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

  async create() {

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

  async start() {

    return new Promise(
      (resolve, reject) => {

        const args = ['start', '-ia', this.dockerContainer];

        const dockerProcess = spawn(`docker`, args);

      const ref = readline.createInterface({
        input     : dockerProcess.stdout
      }).on('line', (line) => {

        console.log(line);

        if(-1 !== line.indexOf('LOG:  database system is ready to accept connections')) {
          
          if (!global['_wallabyWorkers']) {
          
            global['_wallabyWorkers'] = [];

          }

          global['_wallabyWorkers'].push(this);
          
          ref.close();
          
          const knexConfig = {
              host: 'localhost',
              user: config.app_db_user,
              password: config.app_db_password,
              database: config.app_db_name,
              port: this.dockerPort
          };

          this._db = knex({
            client: 'pg',
            connection: knexConfig,
            searchPath: 'public',
            migrations: {
              tableName: 'migrations',
              directory: path.resolve(__dirname, './../migrations'),
            }
          });
          
          resolve(true);

        }

      });

    });

  }

  async reset() {

    // Do reset()
    console.log('reset');
    return Promise.resolve(true);

  }

  async migrateAttempt(db: knex, resolve: any, reject: any, retries = 0) {
    
    console.log(`Trying to connect: attempt ${retries}`);

    try {
    
      const attempt = await db.migrate.latest();

      return resolve(true);

    } catch (e) {

      console.log(e);

      if (retries < 5) {

        setTimeout(
          async () => {
            return this.migrateAttempt(db, resolve, reject, (retries + 1))
          },
          1000
        );

      }

    }

  }

  async migrate() {
    
    return new Promise(async (resolve, reject) => {
      
      this.migrateAttempt(this._db, resolve, reject);

    });

  }

  async setup() {
    
    try {
      
      await this.stp();

      await this.rm();

      await this.create();

      await this.start();

      await this.migrate();

      // if (!this.isSetup) {

        

      // } else {

      //     await this.stp();

      //     await this.start();

      //     await this.migrate();

      // }
  
      return Promise.resolve(true);

    } catch(e) {
      
      console.log(e);
      return Promise.reject(e);

    }    

  }

}





const config = {
  test_runner: 'wallaby',
  node_env: 'test',
  app_db_host: 'localhost',
  app_db_name: 'app',
  app_db_user: 'appuser',
  app_db_password: 'apppass'
};

export async function Setup(wallaby) {

  console.log(wallaby.projectCacheDir);

  wallaby.delayStart();

  const worker = new Worker(wallaby.workerId);

  await worker.setup();

  global['_wallabyConfig'] = worker;

  wallaby.start();

}