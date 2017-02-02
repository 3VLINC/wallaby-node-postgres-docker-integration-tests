import { Worker } from './worker';
import { WorkerManager } from './worker-manager';

export async function Setup(wallaby) {

  wallaby.delayStart();

  if (!global['_wallabyWorkerManager']) {

    global['_wallabyWorkerManager'] = new WorkerManager();

  }

  global['_wallabyWorker'] = await global['_wallabyWorkerManager'].handleWorker(wallaby.workerId, wallaby.localProjectDir);

  wallaby.start();

}