import { Worker } from './worker';
import { WorkerManager } from './worker-manager';
import { config } from './config';


export async function Setup(wallaby, config: config) {

  wallaby.delayStart();

  if (!global['_wallabyWorkerManager']) {

    global['_wallabyWorkerManager'] = new WorkerManager();

  }

  global['_wallabyWorker'] = await global['_wallabyWorkerManager'].handleWorker(wallaby.workerId, wallaby.localProjectDir, config);

  wallaby.start();

}